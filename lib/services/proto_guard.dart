import 'sensor_source.dart';
import 'mock_sensor_source.dart';
import 'phone_sensor_source.dart';

class ProtoGuard {
  // Defaults to true for local testing & prototype demonstrations
  static const bool kProtoMode = bool.fromEnvironment('PROTO_MODE', defaultValue: true);
  static const bool kMockCylinderScan = bool.fromEnvironment('MOCK_CYLINDER_SCAN', defaultValue: false);
  static const String kDemoContainer = String.fromEnvironment('DEMO_CONTAINER', defaultValue: 'indane_14kg');
  static const double kMockLevelPct = 42.0;

  static SensorSource createSensorSource() {
    if (kProtoMode) {
      return MockSensorSource();
    }
    return PhoneSensorSource();
  }
}
