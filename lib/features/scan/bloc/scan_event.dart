import 'package:equatable/equatable.dart';
import '../../../models/session.dart';

abstract class ScanEvent extends Equatable {
  const ScanEvent();

  @override
  List<Object?> get props => [];
}

class SelectContainerEvent extends ScanEvent {
  final ContainerModel container;
  const SelectContainerEvent(this.container);

  @override
  List<Object?> get props => [container];
}

class StartSelfTestEvent extends ScanEvent {}

class BottomCalibrationDoneEvent extends ScanEvent {}

class TopCalibrationDoneEvent extends ScanEvent {
  final double? customHeightCm;
  const TopCalibrationDoneEvent({this.customHeightCm});

  @override
  List<Object?> get props => [customHeightCm];
}

class StartCylinderScanEvent extends ScanEvent {}

class CylinderScanCompletedEvent extends ScanEvent {
  final double heightCm;
  final double radiusCm;
  const CylinderScanCompletedEvent({required this.heightCm, required this.radiusCm});

  @override
  List<Object?> get props => [heightCm, radiusCm];
}

class EnterStationMoveEvent extends ScanEvent {
  final int stationIdx;
  const EnterStationMoveEvent(this.stationIdx);

  @override
  List<Object?> get props => [stationIdx];
}

class GateUpdateEvent extends ScanEvent {
  final String gate;
  final bool passed;
  final double value;
  const GateUpdateEvent({required this.gate, required this.passed, required this.value});

  @override
  List<Object?> get props => [gate, passed, value];
}

class AudioFocusGrantedEvent extends ScanEvent {}
class AudioFocusLostEvent extends ScanEvent {}

class ExcitationKnockTickEvent extends ScanEvent {
  final int knockIdx;
  const ExcitationKnockTickEvent(this.knockIdx);

  @override
  List<Object?> get props => [knockIdx];
}

class ExcitationFinishedEvent extends ScanEvent {}

class StationPassedEvent extends ScanEvent {
  final StationResult stationResult;
  const StationPassedEvent(this.stationResult);

  @override
  List<Object?> get props => [stationResult];
}

class FinishSessionEvent extends ScanEvent {}
class ResetSessionEvent extends ScanEvent {}
