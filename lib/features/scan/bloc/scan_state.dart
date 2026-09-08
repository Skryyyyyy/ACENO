import 'package:equatable/equatable.dart';
import '../../../models/session.dart';

enum ScanStep {
  idle,
  selfTest,
  calibrateBottom,
  calibrateTop,
  cylinderScan,
  stationMove,
  imuGate,
  settle,
  noiseCapture,
  audioFocusReq,
  excitation,
  consistencyCheck,
  estimation,
  result,
  thermalPause,
}

class ScanState extends Equatable {
  final ScanStep step;
  final ContainerModel? selectedContainer;
  final String sessionId;
  final int currentStationIdx;
  final int totalStations;
  final List<StationResult> stations;
  final ScanResult? finalResult;

  // Gate / sensor monitoring
  final double loopbackSnr;
  final bool loopbackPassed;
  final bool bubblePassed;
  final double bubbleAngleErr;
  final bool tremorPassed;
  final double tremorRms;
  final double noiseFloorDbfs;
  final int currentKnockCount;
  final String motorTier;
  final String statusMessage;

  const ScanState({
    required this.step,
    this.selectedContainer,
    this.sessionId = '',
    this.currentStationIdx = 0,
    this.totalStations = 5,
    this.stations = const [],
    this.finalResult,
    this.loopbackSnr = 0.0,
    this.loopbackPassed = false,
    this.bubblePassed = false,
    this.bubbleAngleErr = 0.0,
    this.tremorPassed = false,
    this.tremorRms = 0.0,
    this.noiseFloorDbfs = -55.0,
    this.currentKnockCount = 0,
    this.motorTier = 'B',
    this.statusMessage = '',
  });

  factory ScanState.initial() => const ScanState(
        step: ScanStep.idle,
        statusMessage: 'Ready to scan',
      );

  ScanState copyWith({
    ScanStep? step,
    ContainerModel? selectedContainer,
    String? sessionId,
    int? currentStationIdx,
    int? totalStations,
    List<StationResult>? stations,
    ScanResult? finalResult,
    double? loopbackSnr,
    bool? loopbackPassed,
    bool? bubblePassed,
    double? bubbleAngleErr,
    bool? tremorPassed,
    double? tremorRms,
    double? noiseFloorDbfs,
    int? currentKnockCount,
    String? motorTier,
    String? statusMessage,
  }) {
    return ScanState(
      step: step ?? this.step,
      selectedContainer: selectedContainer ?? this.selectedContainer,
      sessionId: sessionId ?? this.sessionId,
      currentStationIdx: currentStationIdx ?? this.currentStationIdx,
      totalStations: totalStations ?? this.totalStations,
      stations: stations ?? this.stations,
      finalResult: finalResult ?? this.finalResult,
      loopbackSnr: loopbackSnr ?? this.loopbackSnr,
      loopbackPassed: loopbackPassed ?? this.loopbackPassed,
      bubblePassed: bubblePassed ?? this.bubblePassed,
      bubbleAngleErr: bubbleAngleErr ?? this.bubbleAngleErr,
      tremorPassed: tremorPassed ?? this.tremorPassed,
      tremorRms: tremorRms ?? this.tremorRms,
      noiseFloorDbfs: noiseFloorDbfs ?? this.noiseFloorDbfs,
      currentKnockCount: currentKnockCount ?? this.currentKnockCount,
      motorTier: motorTier ?? this.motorTier,
      statusMessage: statusMessage ?? this.statusMessage,
    );
  }

  @override
  List<Object?> get props => [
        step,
        selectedContainer,
        sessionId,
        currentStationIdx,
        totalStations,
        stations,
        finalResult,
        loopbackSnr,
        loopbackPassed,
        bubblePassed,
        bubbleAngleErr,
        tremorPassed,
        tremorRms,
        noiseFloorDbfs,
        currentKnockCount,
        motorTier,
        statusMessage,
      ];
}
