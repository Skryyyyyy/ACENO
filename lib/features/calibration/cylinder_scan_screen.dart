import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../app/theme.dart';
import '../scan/bloc/scan_bloc.dart';
import '../scan/bloc/scan_event.dart';

class CylinderScanScreen extends StatefulWidget {
  const CylinderScanScreen({super.key});

  @override
  State<CylinderScanScreen> createState() => _CylinderScanScreenState();
}

class _CylinderScanScreenState extends State<CylinderScanScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  Timer? _scanProgressTimer;

  double _arcCoverage = 0.0;
  bool _baseLocked = false;
  bool _topLocked = false;
  bool _fitAccepted = false;
  final double _estimatedH = 58.2;
  final double _estimatedR = 16.1;

  // Manual fallback sliders
  bool _showManualFallback = false;
  double _manualH = 58.0;
  double _manualR = 16.0;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();

    _startSimulatedScanTracking();
  }

  void _startSimulatedScanTracking() {
    // 1. Base locked at 1.0s
    Timer(const Duration(milliseconds: 1000), () {
      if (mounted) setState(() => _baseLocked = true);
    });

    // 2. Arc coverage progresses around cylinder (0 -> 75%)
    _scanProgressTimer = Timer.periodic(const Duration(milliseconds: 100), (timer) {
      if (!mounted) return;
      setState(() {
        if (_arcCoverage < 0.76) {
          _arcCoverage += 0.025;
        } else {
          _topLocked = true;
          _fitAccepted = true;
          timer.cancel();
        }
      });
    });
  }

  @override
  void dispose() {
    _scanProgressTimer?.cancel();
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1E2124),
      body: SafeArea(
        child: Stack(
          children: [
            // Camera preview viewfinder canvas
            SizedBox(
              width: double.infinity,
              height: double.infinity,
              child: CustomPaint(
                painter: _ViewfinderGridPainter(
                  animValue: _animController.value,
                  baseLocked: _baseLocked,
                  topLocked: _topLocked,
                  arcCoverage: _arcCoverage,
                ),
              ),
            ),

            // Top Header Bar
            Positioned(
              top: 16,
              left: 16,
              right: 16,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.surface.withValues(alpha: 0.9),
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.border, width: 1),
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.arrow_back, color: AppColors.textPrimary, size: 20),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.surface.withValues(alpha: 0.92),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppColors.border, width: 1),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.view_in_ar, color: AppColors.primaryBlue, size: 15),
                        SizedBox(width: 6),
                        Text(
                          'CYLINDER RANSAC FIT',
                          style: TextStyle(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.w600,
                            fontSize: 12,
                            letterSpacing: 0.4,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.surface.withValues(alpha: 0.9),
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.border, width: 1),
                    ),
                    child: IconButton(
                      icon: Icon(
                        _showManualFallback ? Icons.close : Icons.tune,
                        color: AppColors.textPrimary,
                        size: 20,
                      ),
                      onPressed: () {
                        setState(() => _showManualFallback = !_showManualFallback);
                      },
                    ),
                  ),
                ],
              ),
            ),

            // Bottom Information and Controls
            Positioned(
              bottom: 24,
              left: 16,
              right: 16,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (_showManualFallback) _buildManualFallbackCard(),
                  if (!_showManualFallback) _buildScanStatusCard(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildScanStatusCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border, width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              SizedBox(
                width: 42,
                height: 42,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    CircularProgressIndicator(
                      value: _arcCoverage.clamp(0.0, 1.0),
                      strokeWidth: 3.5,
                      backgroundColor: AppColors.surfaceVariant,
                      valueColor: AlwaysStoppedAnimation(
                        _arcCoverage >= 0.7 ? AppColors.statusSuccess : AppColors.primaryBlue,
                      ),
                    ),
                    Text(
                      '${(_arcCoverage * 100).toInt()}%',
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _fitAccepted
                          ? 'Cylinder Contour Fitted'
                          : _baseLocked
                              ? 'Rotate around perimeter (arc ≥ 70%)'
                              : 'Align camera with cylinder base',
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      'Base: ${_baseLocked ? "Locked" : "Tracking..."} • Top: ${_topLocked ? "Locked" : "Tracking..."}',
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          if (_fitAccepted) ...[
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(
                color: AppColors.surfaceVariant,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.borderSubtle, width: 1),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _metricItem('HEIGHT', '${_estimatedH.toStringAsFixed(1)} cm'),
                  Container(width: 1, height: 22, color: AppColors.border),
                  _metricItem('RADIUS', '${_estimatedR.toStringAsFixed(1)} cm'),
                  Container(width: 1, height: 22, color: AppColors.border),
                  _metricItem('RESIDUAL', '0.8 cm (Good)'),
                ],
              ),
            ),
            const SizedBox(height: 14),
            SizedBox(
              height: 46,
              child: ElevatedButton(
                onPressed: () {
                  context.read<ScanBloc>().add(CylinderScanCompletedEvent(
                        heightCm: _estimatedH,
                        radiusCm: _estimatedR,
                      ));
                  Navigator.pop(context);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryBlue,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                child: const Text(
                  'APPLY FIT & PROCEED',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, letterSpacing: 0.3),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildManualFallbackCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border, width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'Manual Dimensions',
            style: TextStyle(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w600,
              fontSize: 15,
            ),
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Height', style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
              Text('${_manualH.toStringAsFixed(1)} cm',
                  style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w600, fontSize: 13)),
            ],
          ),
          Slider(
            value: _manualH,
            min: 15.0,
            max: 85.0,
            divisions: 70,
            activeColor: AppColors.primaryBlue,
            onChanged: (v) => setState(() => _manualH = v),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Radius', style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
              Text('${_manualR.toStringAsFixed(1)} cm',
                  style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w600, fontSize: 13)),
            ],
          ),
          Slider(
            value: _manualR,
            min: 5.0,
            max: 25.0,
            divisions: 40,
            activeColor: AppColors.primaryBlue,
            onChanged: (v) => setState(() => _manualR = v),
          ),
          const SizedBox(height: 8),
          SizedBox(
            height: 44,
            child: ElevatedButton(
              onPressed: () {
                context.read<ScanBloc>().add(CylinderScanCompletedEvent(
                      heightCm: _manualH,
                      radiusCm: _manualR,
                    ));
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryBlue,
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: const Text('CONFIRM DIMENSIONS', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _metricItem(String label, String value) {
    return Column(
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
            fontSize: 13,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}

class _ViewfinderGridPainter extends CustomPainter {
  final double animValue;
  final bool baseLocked;
  final bool topLocked;
  final double arcCoverage;

  _ViewfinderGridPainter({
    required this.animValue,
    required this.baseLocked,
    required this.topLocked,
    required this.arcCoverage,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final cy = size.height * 0.45;
    final radius = size.width * 0.35;

    // Viewfinder crosshairs
    final gridPaint = Paint()
      ..color = Colors.white.withValues(alpha: 0.25)
      ..strokeWidth = 1.0;

    canvas.drawLine(Offset(cx - 24, cy), Offset(cx + 24, cy), gridPaint);
    canvas.drawLine(Offset(cx, cy - 24), Offset(cx, cy + 24), gridPaint);

    // Cylinder Reticle Ring
    final ringPaint = Paint()
      ..color = (arcCoverage >= 0.7 ? AppColors.statusSuccess : AppColors.primaryBlue).withValues(alpha: 0.85)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;

    final baseRect = Rect.fromCenter(
      center: Offset(cx, cy + 120),
      width: radius * 2,
      height: radius * 0.5,
    );
    final topRect = Rect.fromCenter(
      center: Offset(cx, cy - 120),
      width: radius * 2,
      height: radius * 0.5,
    );

    // Draw base ellipse
    if (baseLocked) {
      final lockPaint = Paint()
        ..color = AppColors.statusSuccess
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.5;
      canvas.drawOval(baseRect, lockPaint);
    } else {
      canvas.drawOval(baseRect, ringPaint);
    }

    // Draw top ellipse
    if (topLocked) {
      final lockPaint = Paint()
        ..color = AppColors.statusSuccess
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.5;
      canvas.drawOval(topRect, lockPaint);
    } else {
      canvas.drawOval(topRect, ringPaint);
    }

    // Connecting side contour guidelines
    final contourPaint = Paint()
      ..color = Colors.white.withValues(alpha: 0.35)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    canvas.drawLine(Offset(cx - radius, cy - 120), Offset(cx - radius, cy + 120), contourPaint);
    canvas.drawLine(Offset(cx + radius, cy - 120), Offset(cx + radius, cy + 120), contourPaint);
  }

  @override
  bool shouldRepaint(covariant _ViewfinderGridPainter oldDelegate) => true;
}
