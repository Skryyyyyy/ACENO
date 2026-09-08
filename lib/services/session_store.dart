import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import '../models/session.dart';
import 'session_exporter.dart' as exporter;

class SessionStore {
  static final SessionStore instance = SessionStore._internal();
  SessionStore._internal();

  final List<SessionModel> _history = [];
  List<ContainerModel> _containers = [];
  bool _initialized = false;

  Future<void> init() async {
    if (_initialized) return;

    // 1. Load container database
    try {
      final jsonStr = await rootBundle.loadString('assets/container_db.json');
      final list = jsonDecode(jsonStr) as List<dynamic>;
      _containers = list.map((e) => ContainerModel.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      // Fallback in-memory container list if asset loader deferred
      _containers = [
        const ContainerModel(
          sku: 'indane_14kg',
          label: 'Indane Blue 14.2kg LPG Cylinder',
          type: 'cylinder_lpg',
          heightCm: 58.0,
          radiusCm: 16.0,
          volumeMl: 14200,
          stationCount: 5,
          heightSource: 'camera_scan',
          mockFillLevels: [10, 30, 50, 70, 90],
        ),
        const ContainerModel(
          sku: 'pet_500ml',
          label: 'Standard 500ml PET Bottle',
          type: 'pet',
          heightCm: 21.5,
          radiusCm: 3.6,
          volumeMl: 500,
          stationCount: 5,
          heightSource: 'db_lookup',
          mockFillLevels: [0, 25, 42, 68, 91],
        ),
        const ContainerModel(
          sku: 'can_330ml',
          label: '330ml Aluminium Can',
          type: 'can',
          heightCm: 11.5,
          radiusCm: 3.3,
          volumeMl: 330,
          stationCount: 3,
          heightSource: 'db_lookup',
        ),
        const ContainerModel(
          sku: 'steel_1l',
          label: '1L Steel Bottle',
          type: 'steel',
          heightCm: 29.0,
          radiusCm: 4.5,
          volumeMl: 1000,
          stationCount: 5,
          heightSource: 'db_lookup',
        ),
      ];
    }

    // 2. Load pre-baked demo history items
    try {
      final petDemo = await rootBundle.loadString('assets/demo/demo-pet-42pct-001.json');
      _history.add(SessionModel.fromJson(jsonDecode(petDemo) as Map<String, dynamic>));

      final lpgDemo = await rootBundle.loadString('assets/demo/demo-lpg-50pct-cam-001.json');
      _history.add(SessionModel.fromJson(jsonDecode(lpgDemo) as Map<String, dynamic>));
    } catch (_) {
      // Skip if assets are being built
    }

    _initialized = true;
  }

  List<ContainerModel> get containers => List.unmodifiable(_containers);
  List<SessionModel> get history => List.unmodifiable(_history);

  void addSession(SessionModel session) {
    _history.insert(0, session);
    exportSessionToDisk(session);
  }

  /// Exports 48kHz float WAV, accel CSV, and JSON manifest to SAF storage folder (TK-10 / LF-3)
  Future<String> exportSessionToDisk(SessionModel session) =>
      exporter.exportSessionToDisk(session);
}
