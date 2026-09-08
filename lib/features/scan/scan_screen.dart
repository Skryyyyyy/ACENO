import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../app/theme.dart';
import 'bloc/scan_bloc.dart';
import 'bloc/scan_event.dart';
import 'bloc/scan_state.dart';
import 'mock_waveform_painter.dart';
import '../result/result_screen.dart';

class ScanScreen extends StatefulWidget {
  const ScanScreen({super.key});

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _waveAnimController;

  @override
  void initState() {
    super.initState();
    _waveAnimController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat();
  }

  @override
  void dispose() {
    _waveAnimController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<ScanBloc, ScanState>(
      listener: (context, state) {
        if (state.step == ScanStep.result) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => const ResultScreen()),
          );
        }
      },
      builder: (context, state) {
        final currentIdx = state.currentStationIdx;
        final total = state.totalStations;
        final pct = (total == 3)
            ? [20.0, 50.0, 80.0][currentIdx.clamp(0, 2)]
            : [10.0, 30.0, 50.0, 70.0, 90.0][currentIdx.clamp(0, 4)];

        Future<void> handleAbort() async {
          final shouldAbort = await showDialog<bool>(
            context: context,
            builder: (ctx) => AlertDialog(
              backgroundColor: AppColors.surface,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: const BorderSide(color: AppColors.border),
              ),
              title: const Text(
                'Abort Acoustic Scan?',
                style: TextStyle(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.w600,
                  fontSize: 17,
                ),
              ),
              content: const Text(
                'Exiting will cancel the current station profiling and safely release all hardware transducers.',
                style: TextStyle(color: AppColors.textSecondary, fontSize: 13, height: 1.45),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(ctx, false),
                  child: const Text('Resume Scan', style: TextStyle(color: AppColors.primaryBlue)),
                ),
                FilledButton(
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.statusError,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  onPressed: () => Navigator.pop(ctx, true),
                  child: const Text('Abort & Exit'),
                ),
              ],
            ),
          );
          if (shouldAbort == true && context.mounted) {
            context.read<ScanBloc>().add(ResetSessionEvent());
            Navigator.pop(context);
          }
        }

        return PopScope(
          canPop: false,
          onPopInvokedWithResult: (didPop, result) {
            if (!didPop) handleAbort();
          },
          child: Scaffold(
            backgroundColor: AppColors.background,
            appBar: AppBar(
              backgroundColor: AppColors.surface,
              elevation: 0,
              bottom: PreferredSize(
                preferredSize: const Size.fromHeight(1),
                child: Container(color: AppColors.border, height: 1),
              ),
              leading: IconButton(
                icon: const Icon(Icons.close, color: AppColors.textPrimary, size: 20),
                onPressed: handleAbort,
              ),
              title: Text(
                'Station ${currentIdx + 1} of $total (${pct.toInt()}% Height)',
                style: const TextStyle(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.w600,
                  fontSize: 16,
                ),
              ),
              actions: [
                Container(
                  margin: const EdgeInsets.only(right: 16),
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceVariant,
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: AppColors.border, width: 1),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.vibration, color: AppColors.primaryBlue, size: 14),
                      const SizedBox(width: 4),
                      Text(
                        'TIER ${state.motorTier}',
                        style: const TextStyle(
                          color: AppColors.textPrimary,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.4,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            body: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Station Progress Segmented Bar
                  _buildStationRuler(currentIdx, total),

                  const SizedBox(height: 20),

                  // Main Stage Card: Waveform / Bubble / Settle
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.border, width: 1),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          if (state.step == ScanStep.excitation) ...[
                            // Oscilloscope Waveform Display
                            RepaintBoundary(
                              child: Container(
                                height: 130,
                                width: double.infinity,
                                decoration: BoxDecoration(
                                  color: AppColors.surfaceVariant.withValues(alpha: 0.5),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: AppColors.borderSubtle),
                                ),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(8),
                                  child: AnimatedBuilder(
                                    animation: _waveAnimController,
                                    builder: (context, child) {
                                      return CustomPaint(
                                        painter: MockWaveformPainter(
                                          progress: _waveAnimController.value,
                                          knockIdx: state.currentKnockCount,
                                        ),
                                      );
                                    },
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 20),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: List.generate(6, (idx) {
                                final active = idx < state.currentKnockCount;
                                return Container(
                                  margin: const EdgeInsets.symmetric(horizontal: 4),
                                  width: 10,
                                  height: 10,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: active ? AppColors.primaryBlue : AppColors.border,
                                  ),
                                );
                              }),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Knock Train: ${state.currentKnockCount} / 6 (400ms interval)',
                              style: const TextStyle(
                                color: AppColors.textSecondary,
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ] else ...[
                            // Bubble Level & Stability Monitor
                            RepaintBoundary(
                              child: Stack(
                                alignment: Alignment.center,
                                children: [
                                  Container(
                                    width: 120,
                                    height: 120,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: AppColors.surfaceVariant,
                                      border: Border.all(
                                        color: state.bubblePassed
                                            ? AppColors.statusSuccess
                                            : AppColors.border,
                                        width: 1.5,
                                      ),
                                    ),
                                  ),
                                  Container(
                                    width: 44,
                                    height: 44,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(color: AppColors.border, width: 1),
                                    ),
                                  ),
                                  Container(
                                    width: 22,
                                    height: 22,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: state.bubblePassed
                                          ? AppColors.statusSuccess
                                          : AppColors.primaryBlue,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 20),
                            Text(
                              state.bubblePassed ? 'Orientation Stable (±5°)' : 'Align Phone Flat Against Container',
                              style: TextStyle(
                                color: state.bubblePassed ? AppColors.statusSuccess : AppColors.textPrimary,
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Gate Status Matrix Card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppColors.border, width: 1),
                    ),
                    child: Column(
                      children: [
                        _gateRow('Bubble Tilt Gate (≤5°)', state.bubblePassed ? 'Pass (0.8°)' : 'Aligning...', state.bubblePassed),
                        const SizedBox(height: 10),
                        const Divider(color: AppColors.borderSubtle, height: 1),
                        const SizedBox(height: 10),
                        _gateRow('Tremor RMS Gate (≤0.05 rad/s)', state.tremorPassed ? 'Pass (0.02 rad/s)' : 'Stabilizing...', state.tremorPassed),
                        const SizedBox(height: 10),
                        const Divider(color: AppColors.borderSubtle, height: 1),
                        const SizedBox(height: 10),
                        _gateRow('Ambient Noise Floor', '${state.noiseFloorDbfs.toStringAsFixed(1)} dBFS', true),
                      ],
                    ),
                  ),

                  const SizedBox(height: 14),

                  // Status text
                  Text(
                    state.statusMessage,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildStationRuler(int currentIdx, int total) {
    return Row(
      children: List.generate(total, (idx) {
        final isDone = idx < currentIdx;
        final isCurrent = idx == currentIdx;

        return Expanded(
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 3),
            padding: const EdgeInsets.symmetric(vertical: 8),
            decoration: BoxDecoration(
              color: isCurrent
                  ? AppColors.primaryContainer
                  : isDone
                      ? AppColors.statusSuccessContainer
                      : AppColors.surface,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: isCurrent
                    ? AppColors.primaryBlue
                    : isDone
                        ? const Color(0xFFCEEAD6)
                        : AppColors.border,
                width: isCurrent ? 1.5 : 1.0,
              ),
            ),
            child: Center(
              child: Text(
                'S${idx + 1}',
                style: TextStyle(
                  color: isCurrent
                      ? AppColors.primaryBlue
                      : isDone
                          ? AppColors.statusSuccess
                          : AppColors.textTertiary,
                  fontWeight: FontWeight.w600,
                  fontSize: 12,
                ),
              ),
            ),
          ),
        );
      }),
    );
  }

  Widget _gateRow(String label, String value, bool passed) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
        Row(
          children: [
            Icon(
              passed ? Icons.check_circle : Icons.schedule,
              size: 14,
              color: passed ? AppColors.statusSuccess : AppColors.statusWarning,
            ),
            const SizedBox(width: 6),
            Text(
              value,
              style: TextStyle(
                color: passed ? AppColors.statusSuccess : AppColors.statusWarning,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
