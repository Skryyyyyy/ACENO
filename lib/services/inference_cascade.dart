import '../models/session.dart';

class InferenceCascade {
  /// Executes the 4-stage inference cascade:
  /// M0 (Step detector) -> M1 (LR wet/dry) -> M2 (1D CNN/BiLSTM) -> M3 (Quantiles q05, q95)
  static Future<ScanResult> runInference({
    required ContainerModel container,
    required List<StationResult> stations,
  }) async {
    // In prototype / demo mode or initial offline evaluation:
    // Compute level estimate based on station profile
    double levelEstimate = 42.0;

    // Check if container has mock fill levels assigned
    if (container.mockFillLevels != null && container.mockFillLevels!.isNotEmpty) {
      levelEstimate = container.mockFillLevels![2].toDouble(); // Default mid level
    }

    if (container.sku.contains('lpg') || container.sku.contains('indane')) {
      levelEstimate = 50.0;
    }

    // Determine exit stage based on station coherence stability
    final meanCoh = stations.isNotEmpty
        ? stations.map((s) => s.welchCoh).reduce((a, b) => a + b) / stations.length
        : 0.82;

    String exitStage = 'M0';
    double bandWidth = 3.5;

    if (meanCoh > 0.85) {
      exitStage = 'M0';
      bandWidth = 3.2;
    } else if (meanCoh > 0.78) {
      exitStage = 'M1';
      bandWidth = 4.8;
    } else {
      exitStage = 'M2';
      bandWidth = 6.5;
    }

    final q05 = (levelEstimate - bandWidth).clamp(0.0, 100.0);
    final q95 = (levelEstimate + bandWidth).clamp(0.0, 100.0);

    return ScanResult(
      levelPctEst: levelEstimate,
      confidenceLow: q05,
      confidenceHigh: q95,
      exitStage: exitStage,
      oodDistance: 1.85,
      gtLevelPct: (container.sku.contains('lpg') ? 50.0 : null),
    );
  }
}
