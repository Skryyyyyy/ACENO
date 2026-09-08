import 'dart:typed_data';
import 'package:flutter_test/flutter_test.dart';
import 'package:sdap/models/feature_vec.dart';
import 'package:sdap/models/session.dart';
import 'package:sdap/services/inference_cascade.dart';
import 'package:sdap/services/mock_sensor_source.dart';
import 'package:sdap/features/scan/bloc/scan_bloc.dart';
import 'package:sdap/features/scan/bloc/scan_event.dart';
import 'package:sdap/features/scan/bloc/scan_state.dart';

void main() {
  group('SDAP Domain Model Tests', () {
    test('FeatureVec asserts 76-element dimension strictly', () {
      final valid = Float32List(76);
      final vec = FeatureVec(valid);
      expect(vec.values.length, 76);
      expect(vec.lpcc.length, 20);
      expect(vec.mfcc.length, 13);
      expect(vec.peakFreqs.length, 4);

      expect(() => FeatureVec(Float32List(75)), throwsArgumentError);
    });

    test('ContainerModel JSON serialization roundtrip', () {
      const model = ContainerModel(
        sku: 'indane_14kg',
        label: 'Indane Blue 14.2kg LPG Cylinder',
        type: 'cylinder_lpg',
        heightCm: 58.0,
        radiusCm: 16.0,
        volumeMl: 14200,
        stationCount: 5,
        heightSource: 'camera_scan',
      );

      final json = model.toJson();
      final revived = ContainerModel.fromJson(json);

      expect(revived.sku, 'indane_14kg');
      expect(revived.heightCm, 58.0);
      expect(revived.stationCount, 5);
      expect(revived.heightSource, 'camera_scan');
    });

    test('InferenceCascade produces valid conformal quantile intervals', () async {
      const container = ContainerModel(
        sku: 'indane_14kg',
        label: 'Indane Blue 14.2kg LPG Cylinder',
        type: 'cylinder_lpg',
        heightCm: 58.0,
        radiusCm: 16.0,
        volumeMl: 14200,
        stationCount: 5,
      );

      final stations = [
        const StationResult(idx: 0, heightPct: 10, welchCoh: 0.88, cosineDist: 0.05, repeatCount: 0, ambientRmsDbfs: -52),
        const StationResult(idx: 1, heightPct: 30, welchCoh: 0.86, cosineDist: 0.06, repeatCount: 0, ambientRmsDbfs: -52),
        const StationResult(idx: 2, heightPct: 50, welchCoh: 0.81, cosineDist: 0.08, repeatCount: 0, ambientRmsDbfs: -52),
        const StationResult(idx: 3, heightPct: 70, welchCoh: 0.84, cosineDist: 0.06, repeatCount: 0, ambientRmsDbfs: -52),
        const StationResult(idx: 4, heightPct: 90, welchCoh: 0.87, cosineDist: 0.05, repeatCount: 0, ambientRmsDbfs: -52),
      ];

      final result = await InferenceCascade.runInference(
        container: container,
        stations: stations,
      );

      expect(result.levelPctEst, greaterThanOrEqualTo(0.0));
      expect(result.levelPctEst, lessThanOrEqualTo(100.0));
      expect(result.confidenceLow, lessThanOrEqualTo(result.levelPctEst));
      expect(result.confidenceHigh, greaterThanOrEqualTo(result.levelPctEst));
      expect(['M0', 'M1', 'M2'], contains(result.exitStage));
    });
  });

  group('SDAP ScanBloc State Machine Tests', () {
    test('ScanBloc transitions through SelfTest to CalibrateBottom on loopback pass', () async {
      final mockSource = MockSensorSource();
      final bloc = ScanBloc(sensorSource: mockSource);

      expect(bloc.state.step, ScanStep.idle);

      const container = ContainerModel(
        sku: 'pet_500ml',
        label: 'Standard 500ml PET Bottle',
        type: 'pet',
        heightCm: 21.5,
        radiusCm: 3.6,
        volumeMl: 500,
        stationCount: 5,
      );

      bloc.add(const SelectContainerEvent(container));
      await Future.delayed(const Duration(milliseconds: 50));
      expect(bloc.state.selectedContainer?.sku, 'pet_500ml');

      bloc.add(StartSelfTestEvent());
      // Wait for loopback completion and auto-advance
      await Future.delayed(const Duration(milliseconds: 2700));

      expect(bloc.state.step, ScanStep.calibrateBottom);
      expect(bloc.state.loopbackPassed, true);
      expect(bloc.state.loopbackSnr, greaterThanOrEqualTo(20.0));

      await bloc.close();
    });
  });
}
