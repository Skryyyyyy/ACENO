abstract class SensorSource {
  Future<bool> startStation({
    required String sessionId,
    required int stationIdx,
    required double heightCm,
  });

  Future<Map<String, dynamic>> stopStation();

  Future<Map<String, dynamic>> runLoopback();

  Future<String> getMotorTier();

  Stream<Map<String, dynamic>> get eventStream;

  void dispose();
}
