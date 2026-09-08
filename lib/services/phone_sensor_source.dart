import 'dart:async';
import 'package:flutter/services.dart';
import 'sensor_source.dart';

class PhoneSensorSource implements SensorSource {
  static const MethodChannel _captureChannel = MethodChannel('sdap/capture');
  static const EventChannel _eventsChannel = EventChannel('sdap/events');

  StreamSubscription? _eventSubscription;
  final _eventController = StreamController<Map<String, dynamic>>.broadcast();

  PhoneSensorSource() {
    _eventSubscription = _eventsChannel.receiveBroadcastStream().listen(
      (dynamic data) {
        if (data is Map) {
          _eventController.add(Map<String, dynamic>.from(data));
        }
      },
      onError: (dynamic error) {
        _eventController.add({
          'type': 'transducerError',
          'errorCode': error.toString(),
        });
      },
    );
  }

  @override
  Stream<Map<String, dynamic>> get eventStream => _eventController.stream;

  @override
  Future<bool> startStation({
    required String sessionId,
    required int stationIdx,
    required double heightCm,
  }) async {
    try {
      final res = await _captureChannel.invokeMethod<bool>('startSession', {
        'sessionId': sessionId,
        'stationIdx': stationIdx,
        'hCm': heightCm,
      });
      return res ?? false;
    } catch (e) {
      return false;
    }
  }

  @override
  Future<Map<String, dynamic>> stopStation() async {
    try {
      final res = await _captureChannel.invokeMapMethod<String, dynamic>('stopStation');
      return res ?? {};
    } catch (e) {
      return {};
    }
  }

  @override
  Future<Map<String, dynamic>> runLoopback() async {
    try {
      final res = await _captureChannel.invokeMapMethod<String, dynamic>('loopbackTest');
      return res ?? {'snrDb': 0.0, 'passed': false, 'isAgcStubborn': false};
    } catch (e) {
      return {'snrDb': 0.0, 'passed': false, 'isAgcStubborn': false};
    }
  }

  @override
  Future<String> getMotorTier() async {
    try {
      final res = await _captureChannel.invokeMethod<String>('getMotorTier');
      return res ?? 'C';
    } catch (e) {
      return 'C';
    }
  }

  @override
  void dispose() {
    _eventSubscription?.cancel();
    _eventController.close();
  }
}
