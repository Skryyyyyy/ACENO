import 'dart:async';
import 'sensor_source.dart';

class MockSensorSource implements SensorSource {
  final _eventController = StreamController<Map<String, dynamic>>.broadcast();
  Timer? _mockTimer;

  @override
  Stream<Map<String, dynamic>> get eventStream => _eventController.stream;

  @override
  Future<bool> startStation({
    required String sessionId,
    required int stationIdx,
    required double heightCm,
  }) async {
    // Schedule realistic progressive gate events matching the ~7.3s prototype timeline
    _mockTimer?.cancel();

    // 1. IMU Bubble alignment passes after 1.2s
    Timer(const Duration(milliseconds: 1200), () {
      if (!_eventController.isClosed) {
        _eventController.add({
          'type': 'gateStatus',
          'gate': 'bubble',
          'passed': true,
          'value': 0.8,
        });
      }
    });

    // 2. Tremor RMS passes shortly after
    Timer(const Duration(milliseconds: 1500), () {
      if (!_eventController.isClosed) {
        _eventController.add({
          'type': 'gateStatus',
          'gate': 'tremor',
          'passed': true,
          'value': 0.024,
        });
      }
    });

    return true;
  }

  @override
  Future<Map<String, dynamic>> stopStation() async {
    _mockTimer?.cancel();
    return {
      'wavPath': 'mock_path.wav',
      'accelPath': 'mock_accel.csv',
      'offsetNs': 0,
      'welch_coh': 0.84,
      'cosine_dist': 0.07,
      'ambient_rms_dbfs': -52.3,
    };
  }

  @override
  Future<Map<String, dynamic>> runLoopback() async {
    // Simulate ~1.5s chirp playback and SNR measurement
    await Future.delayed(const Duration(milliseconds: 1500));
    return {
      'snrDb': 28.4,
      'passed': true,
      'isAgcStubborn': false,
    };
  }

  @override
  Future<String> getMotorTier() async {
    return 'B';
  }

  @override
  void dispose() {
    _mockTimer?.cancel();
    _eventController.close();
  }
}
