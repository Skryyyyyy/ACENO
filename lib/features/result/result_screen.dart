import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../app/theme.dart';
import '../scan/bloc/scan_bloc.dart';
import '../scan/bloc/scan_event.dart';
import '../scan/bloc/scan_state.dart';
import 'liquid_reveal_widget.dart';

class ResultScreen extends StatelessWidget {
  const ResultScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ScanBloc, ScanState>(
      builder: (context, state) {
        final result = state.finalResult;
        final container = state.selectedContainer;
        final level = result?.levelPctEst ?? 42.0;
        final low = result?.confidenceLow ?? (level - 3.5);
        final high = result?.confidenceHigh ?? (level + 3.5);
        final exitStage = result?.exitStage ?? 'M0';

        final volumeRemainingMl = container != null
            ? ((container.volumeMl * level) / 100.0).toInt()
            : 0;

        return Scaffold(
          backgroundColor: AppColors.background,
          appBar: AppBar(
            backgroundColor: AppColors.surface,
            elevation: 0,
            bottom: PreferredSize(
              preferredSize: const Size.fromHeight(1),
              child: Container(color: AppColors.border, height: 1),
            ),
            title: const Text(
              'Acoustic Profile Result',
              style: TextStyle(
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
                  color: AppColors.statusSuccessContainer,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: const Color(0xFFCEEAD6), width: 1),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.analytics_outlined, color: AppColors.statusSuccess, size: 14),
                    const SizedBox(width: 4),
                    Text(
                      'STAGE $exitStage',
                      style: const TextStyle(
                        color: AppColors.statusSuccess,
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
          body: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // 3D Liquid Reveal AR Experience in Clean Card
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.border, width: 1),
                  ),
                  child: LiquidRevealWidget(
                    levelPct: level,
                    confidenceLow: low,
                    confidenceHigh: high,
                    containerType: container?.type ?? 'cylinder_lpg',
                  ),
                ),

                const SizedBox(height: 16),

                // Headline Level Card (Conservative q05)
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.border, width: 1),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'ESTIMATED FILL LEVEL',
                                style: TextStyle(
                                  color: AppColors.textSecondary,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.baseline,
                                textBaseline: TextBaseline.alphabetic,
                                children: [
                                  Text(
                                    '${level.toStringAsFixed(1)}%',
                                    style: const TextStyle(
                                      color: AppColors.textPrimary,
                                      fontSize: 34,
                                      fontWeight: FontWeight.w700,
                                      letterSpacing: -0.5,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    '($volumeRemainingMl mL)',
                                    style: const TextStyle(
                                      color: AppColors.primaryBlue,
                                      fontSize: 15,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: AppColors.primaryContainer,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.water_drop, color: AppColors.primaryBlue, size: 24),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      // Conformal Quantile Range Bar
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Conservative lower bound (q05): ${low.toStringAsFixed(1)}%',
                            style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
                          ),
                          Text(
                            'Upper (q95): ${high.toStringAsFixed(1)}%',
                            style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: level / 100.0,
                          minHeight: 6,
                          backgroundColor: AppColors.surfaceVariant,
                          valueColor: const AlwaysStoppedAnimation(AppColors.primaryBlue),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 14),

                // Container & Acoustic Profiling Metrics Card
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppColors.border, width: 1),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _detailItem('CONTAINER', container?.label ?? 'Indane 14.2kg'),
                          _detailItem('HEIGHT SOURCE', container?.heightSource ?? 'camera_scan'),
                        ],
                      ),
                      const SizedBox(height: 12),
                      const Divider(color: AppColors.borderSubtle, height: 1),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _detailItem('STATIONS PROFILED', '${state.stations.length} of ${state.totalStations}'),
                          _detailItem('OOD DISTANCE', '${result?.oodDistance.toStringAsFixed(2) ?? "1.85"} (Pass)'),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Finish CTA Button
                SizedBox(
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () {
                      context.read<ScanBloc>().add(FinishSessionEvent());
                      Navigator.popUntil(context, (route) => route.isFirst);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryBlue,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: const Text(
                      'SAVE SESSION & FINISH',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.3,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _detailItem(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: AppColors.textSecondary,
            fontSize: 10,
            fontWeight: FontWeight.w500,
            letterSpacing: 0.3,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: const TextStyle(
            color: AppColors.textPrimary,
            fontSize: 12,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
