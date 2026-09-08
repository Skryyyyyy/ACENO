class ContainerModel {
  final String sku;
  final String label;
  final String type; // 'pet' | 'can' | 'steel' | 'cylinder_lpg'
  final double heightCm;
  final double radiusCm;
  final int volumeMl;
  final int stationCount;
  final String heightSource; // 'db_lookup' | 'camera_scan' | 'manual_override'
  final List<int>? mockFillLevels;

  const ContainerModel({
    required this.sku,
    required this.label,
    required this.type,
    required this.heightCm,
    required this.radiusCm,
    required this.volumeMl,
    required this.stationCount,
    this.heightSource = 'db_lookup',
    this.mockFillLevels,
  });

  factory ContainerModel.fromJson(Map<String, dynamic> json) {
    return ContainerModel(
      sku: json['sku'] as String,
      label: json['label'] as String,
      type: json['type'] as String,
      heightCm: (json['height_cm'] as num).toDouble(),
      radiusCm: (json['radius_cm'] as num).toDouble(),
      volumeMl: json['volume_ml'] as int,
      stationCount: json['station_count'] as int? ?? (json['height_cm'] < 15.0 ? 3 : 5),
      heightSource: json['height_source'] as String? ?? 'db_lookup',
      mockFillLevels: (json['mock_fill_levels'] as List<dynamic>?)?.map((e) => e as int).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'sku': sku,
    'label': label,
    'type': type,
    'height_cm': heightCm,
    'radius_cm': radiusCm,
    'volume_ml': volumeMl,
    'station_count': stationCount,
    'height_source': heightSource,
  };

  ContainerModel copyWith({
    String? sku,
    String? label,
    String? type,
    double? heightCm,
    double? radiusCm,
    int? volumeMl,
    int? stationCount,
    String? heightSource,
  }) {
    return ContainerModel(
      sku: sku ?? this.sku,
      label: label ?? this.label,
      type: type ?? this.type,
      heightCm: heightCm ?? this.heightCm,
      radiusCm: radiusCm ?? this.radiusCm,
      volumeMl: volumeMl ?? this.volumeMl,
      stationCount: stationCount ?? this.stationCount,
      heightSource: heightSource ?? this.heightSource,
      mockFillLevels: mockFillLevels,
    );
  }
}

class StationResult {
  final int idx;
  final double heightPct;
  final double welchCoh;
  final double cosineDist;
  final int repeatCount;
  final double ambientRmsDbfs;

  const StationResult({
    required this.idx,
    required this.heightPct,
    required this.welchCoh,
    required this.cosineDist,
    required this.repeatCount,
    required this.ambientRmsDbfs,
  });

  factory StationResult.fromJson(Map<String, dynamic> json) => StationResult(
    idx: json['idx'] as int,
    heightPct: (json['height_pct'] as num).toDouble(),
    welchCoh: (json['welch_coh'] as num).toDouble(),
    cosineDist: (json['cosine_dist'] as num).toDouble(),
    repeatCount: json['repeat_count'] as int,
    ambientRmsDbfs: (json['ambient_rms_dbfs'] as num).toDouble(),
  );

  Map<String, dynamic> toJson() => {
    'idx': idx,
    'height_pct': heightPct,
    'welch_coh': welchCoh,
    'cosine_dist': cosineDist,
    'repeat_count': repeatCount,
    'ambient_rms_dbfs': ambientRmsDbfs,
  };
}

class ScanResult {
  final double levelPctEst;
  final double confidenceLow;
  final double confidenceHigh;
  final String exitStage; // 'M0' | 'M1' | 'M2'
  final double oodDistance;
  final double? gtLevelPct;

  const ScanResult({
    required this.levelPctEst,
    required this.confidenceLow,
    required this.confidenceHigh,
    required this.exitStage,
    required this.oodDistance,
    this.gtLevelPct,
  });

  factory ScanResult.fromJson(Map<String, dynamic> json) => ScanResult(
    levelPctEst: (json['level_pct_est'] as num).toDouble(),
    confidenceLow: (json['confidence_low'] as num).toDouble(),
    confidenceHigh: (json['confidence_high'] as num).toDouble(),
    exitStage: json['exit_stage'] as String,
    oodDistance: (json['ood_distance'] as num).toDouble(),
    gtLevelPct: (json['gt_level_pct'] as num?)?.toDouble(),
  );

  Map<String, dynamic> toJson() => {
    'level_pct_est': levelPctEst,
    'confidence_low': confidenceLow,
    'confidence_high': confidenceHigh,
    'exit_stage': exitStage,
    'ood_distance': oodDistance,
    'gt_level_pct': gtLevelPct,
  };
}

class SessionModel {
  final String sessionId;
  final String schemaVersion;
  final bool protoMode;
  final ContainerModel container;
  final String motorTier;
  final String arTier;
  final String syncMethod;
  final bool agcStubborn;
  final bool chassisDamped;
  final List<StationResult> stations;
  final ScanResult? result;
  final String deviceModel;
  final int tsUtc;

  const SessionModel({
    required this.sessionId,
    this.schemaVersion = '1.0',
    required this.protoMode,
    required this.container,
    this.motorTier = 'B',
    this.arTier = 'GYRO_PARALLAX',
    this.syncMethod = 'anchor_xcorr',
    this.agcStubborn = false,
    this.chassisDamped = false,
    required this.stations,
    this.result,
    this.deviceModel = 'Android Device',
    required this.tsUtc,
  });

  factory SessionModel.fromJson(Map<String, dynamic> json) {
    final containerJson = json['container'] as Map<String, dynamic>;
    final scanJson = json['scan'] as Map<String, dynamic>? ?? {};
    final stationsList = (json['stations'] as List<dynamic>?)
            ?.map((e) => StationResult.fromJson(e as Map<String, dynamic>))
            .toList() ??
        [];
    final resultJson = json['result'] as Map<String, dynamic>?;
    final deviceJson = json['device'] as Map<String, dynamic>? ?? {};

    return SessionModel(
      sessionId: json['session_id'] as String,
      schemaVersion: json['schema_version'] as String? ?? '1.0',
      protoMode: json['proto_mode'] as bool? ?? false,
      container: ContainerModel.fromJson(containerJson),
      motorTier: scanJson['motor_tier'] as String? ?? 'B',
      arTier: scanJson['ar_tier'] as String? ?? 'GYRO_PARALLAX',
      syncMethod: scanJson['sync_method'] as String? ?? 'anchor_xcorr',
      agcStubborn: scanJson['agc_stubborn'] as bool? ?? false,
      chassisDamped: scanJson['chassis_damped'] as bool? ?? false,
      stations: stationsList,
      result: resultJson != null ? ScanResult.fromJson(resultJson) : null,
      deviceModel: deviceJson['model'] as String? ?? 'Pixel 7a',
      tsUtc: json['ts_utc'] as int? ?? DateTime.now().millisecondsSinceEpoch,
    );
  }

  Map<String, dynamic> toJson() => {
    'session_id': sessionId,
    'schema_version': schemaVersion,
    'proto_mode': protoMode,
    'container': container.toJson(),
    'scan': {
      'station_count': container.stationCount,
      'motor_tier': motorTier,
      'ar_tier': arTier,
      'sync_method': syncMethod,
      'agc_stubborn': agcStubborn,
      'chassis_damped': chassisDamped,
    },
    'stations': stations.map((s) => s.toJson()).toList(),
    'result': result?.toJson(),
    'device': {
      'model': deviceModel,
    },
    'ts_utc': tsUtc,
  };
}
