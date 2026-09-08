import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:sensors_plus/sensors_plus.dart';
import '../../app/theme.dart';
import '../../services/time_throttle.dart';

class LiquidRevealWidget extends StatefulWidget {
  final double levelPct;
  final double confidenceLow;
  final double confidenceHigh;
  final String containerType;

  const LiquidRevealWidget({
    super.key,
    required this.levelPct,
    required this.confidenceLow,
    required this.confidenceHigh,
    this.containerType = 'cylinder_lpg',
  });

  /// Pre-warms the Impeller canvas path pipeline to prevent first-frame jank (TK-08)
  static void prewarm() {
    try {
      final recorder = PictureRecorder();
      final canvas = Canvas(recorder);
      final painter = _CylinderRevealPainter(
        scanlineProgress: 0.5,
        glassOpacity: 0.5,
        fillFraction: 0.5,
        sloshOffset: 0.0,
        confidenceLow: 0.3,
        confidenceHigh: 0.7,
      );
      painter.paint(canvas, const Size(200, 320));
      final picture = recorder.endRecording();
      picture.dispose();
    } catch (_) {}
  }

  @override
  State<LiquidRevealWidget> createState() => _LiquidRevealWidgetState();
}

class _LiquidRevealWidgetState extends State<LiquidRevealWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _revealController;
  late Animation<double> _scanlineAnim;
  late Animation<double> _glassFadeAnim;
  late Animation<double> _liquidFillAnim;

  StreamSubscription? _gyroSub;
  double _sloshOffset = 0.0;
  double _sloshVelocity = 0.0;

  @override
  void initState() {
    super.initState();

    // 1200 ms total reveal sequence (C34)
    _revealController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );

    // Phase 1: 0 - 400ms (Scanline sweep)
    _scanlineAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _revealController,
        curve: const Interval(0.0, 0.33, curve: Curves.easeInOut),
      ),
    );

    // Phase 2: 400 - 800ms (Glass crossfade)
    _glassFadeAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _revealController,
        curve: const Interval(0.33, 0.66, curve: Curves.easeIn),
      ),
    );

    // Phase 3: 800 - 1200ms (Liquid column rise)
    _liquidFillAnim = Tween<double>(begin: 0.0, end: widget.levelPct / 100.0).animate(
      CurvedAnimation(
        parent: _revealController,
        curve: const Interval(0.66, 1.0, curve: Curves.easeOutCubic),
      ),
    );

    _revealController.forward();

    // Listen to physical gyroscope for slosh simulation throttled to 30 Hz (33ms window)
    try {
      _gyroSub = gyroscopeEventStream()
          .throttleTime(const Duration(milliseconds: 33))
          .listen((GyroscopeEvent event) {
        if (!mounted) return;
        setState(() {
          // gyroRMS x C35=2.5 gain
          final gyroY = event.y;
          _sloshVelocity += (gyroY * 2.5 - _sloshOffset) * 0.1;
          _sloshOffset += _sloshVelocity;
          _sloshOffset = _sloshOffset.clamp(-0.25, 0.25);
          _sloshVelocity *= 0.85; // Damping
        });
      });
    } catch (_) {}
  }

  @override
  void dispose() {
    _gyroSub?.cancel();
    _revealController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _revealController,
      builder: (context, child) {
        return Container(
          width: double.infinity,
          height: 340,
          margin: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: AppColors.surfaceVariant.withValues(alpha: 0.6),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.borderSubtle, width: 1),
          ),
          child: Stack(
            alignment: Alignment.center,
            children: [
              // 3D Glass Cylinder Projection isolated in RepaintBoundary (TK-05)
              RepaintBoundary(
                child: CustomPaint(
                  size: const Size(190, 300),
                  painter: _CylinderRevealPainter(
                    scanlineProgress: _scanlineAnim.value,
                    glassOpacity: _glassFadeAnim.value,
                    fillFraction: _liquidFillAnim.value,
                    sloshOffset: _sloshOffset,
                    confidenceLow: widget.confidenceLow / 100.0,
                    confidenceHigh: widget.confidenceHigh / 100.0,
                  ),
                ),
              ),

              // Reveal Stage Tag
              Positioned(
                top: 12,
                right: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: AppColors.border, width: 1),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 6,
                        height: 6,
                        decoration: const BoxDecoration(
                          color: AppColors.primaryBlue,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        _revealController.value < 0.33
                            ? 'SILHOUETTE SCAN'
                            : _revealController.value < 0.66
                                ? 'GLASS SHELL'
                                : 'LIQUID REVEAL',
                        style: const TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _CylinderRevealPainter extends CustomPainter {
  final double scanlineProgress;
  final double glassOpacity;
  final double fillFraction;
  final double sloshOffset;
  final double confidenceLow;
  final double confidenceHigh;

  _CylinderRevealPainter({
    required this.scanlineProgress,
    required this.glassOpacity,
    required this.fillFraction,
    required this.sloshOffset,
    required this.confidenceLow,
    required this.confidenceHigh,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final radius = w * 0.42;
    final centerX = w / 2;
    final topY = h * 0.12;
    final bottomY = h * 0.88;
    final cylinderHeight = bottomY - topY;

    // 1. Draw PBR Glass Shell Outline
    if (glassOpacity > 0.0) {
      final glassPaint = Paint()
        ..color = AppColors.surface.withValues(alpha: 0.6 * glassOpacity)
        ..style = PaintingStyle.fill;

      final glassBorder = Paint()
        ..color = AppColors.border.withValues(alpha: 0.85 * glassOpacity)
        ..strokeWidth = 1.5
        ..style = PaintingStyle.stroke;

      final cylinderPath = Path()
        ..moveTo(centerX - radius, topY)
        ..lineTo(centerX - radius, bottomY)
        ..arcToPoint(
          Offset(centerX + radius, bottomY),
          radius: Radius.elliptical(radius, radius * 0.28),
          clockwise: false,
        )
        ..lineTo(centerX + radius, topY)
        ..arcToPoint(
          Offset(centerX - radius, topY),
          radius: Radius.elliptical(radius, radius * 0.28),
          clockwise: false,
        );

      canvas.drawPath(cylinderPath, glassPaint);
      canvas.drawPath(cylinderPath, glassBorder);

      // Top ellipse lid
      final topEllipseRect = Rect.fromCenter(
        center: Offset(centerX, topY),
        width: radius * 2,
        height: radius * 0.56,
      );
      canvas.drawOval(topEllipseRect, glassBorder);

      // Translucent Conformal Confidence Band (q05 -> q95)
      final bandTopY = bottomY - (cylinderHeight * confidenceHigh);
      final bandBottomY = bottomY - (cylinderHeight * confidenceLow);
      final bandRect = Rect.fromLTRB(
        centerX - radius + 2,
        bandTopY,
        centerX + radius - 2,
        bandBottomY,
      );
      final bandPaint = Paint()
        ..color = AppColors.primaryContainer.withValues(alpha: 0.6 * glassOpacity)
        ..style = PaintingStyle.fill;
      canvas.drawRect(bandRect, bandPaint);

      final bandBorder = Paint()
        ..color = AppColors.primaryContainerBorder.withValues(alpha: 0.5 * glassOpacity)
        ..strokeWidth = 1.0
        ..style = PaintingStyle.stroke;
      canvas.drawRect(bandRect, bandBorder);
    }

    // 2. Draw Liquid Body Column
    if (fillFraction > 0.0) {
      final liquidTopY = bottomY - (cylinderHeight * fillFraction);

      final liquidGradient = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          AppColors.primaryBlue.withValues(alpha: 0.82),
          const Color(0xFF174EA6).withValues(alpha: 0.92),
        ],
      );

      final liquidRect = Rect.fromLTRB(
        centerX - radius + 2,
        liquidTopY,
        centerX + radius - 2,
        bottomY,
      );

      final liquidPaint = Paint()
        ..shader = liquidGradient.createShader(liquidRect)
        ..style = PaintingStyle.fill;

      final liquidPath = Path()
        ..moveTo(centerX - radius + 2, liquidTopY)
        ..lineTo(centerX - radius + 2, bottomY)
        ..arcToPoint(
          Offset(centerX + radius - 2, bottomY),
          radius: Radius.elliptical(radius - 2, (radius - 2) * 0.28),
          clockwise: false,
        )
        ..lineTo(centerX + radius - 2, liquidTopY)
        ..arcToPoint(
          Offset(centerX - radius + 2, liquidTopY),
          radius: Radius.elliptical(radius - 2, (radius - 2) * 0.28),
          clockwise: false,
        );

      canvas.drawPath(liquidPath, liquidPaint);

      // Liquid Surface meniscus with IMU slosh offset
      final surfacePaint = Paint()
        ..color = const Color(0xFF8AB4F8)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.8;

      final surfaceRect = Rect.fromCenter(
        center: Offset(centerX + sloshOffset * 50.0, liquidTopY),
        width: (radius - 2) * 2,
        height: (radius - 2) * 0.56,
      );
      canvas.drawOval(surfaceRect, surfacePaint);
    }

    // 3. Scanline sweep overlay (0 - 400 ms)
    if (scanlineProgress < 1.0) {
      final scanY = topY + (cylinderHeight * scanlineProgress);
      final scanPaint = Paint()
        ..color = AppColors.primaryBlue.withValues(alpha: 0.75)
        ..strokeWidth = 2.0;

      canvas.drawLine(
        Offset(centerX - radius - 10, scanY),
        Offset(centerX + radius + 10, scanY),
        scanPaint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _CylinderRevealPainter oldDelegate) {
    return oldDelegate.scanlineProgress != scanlineProgress ||
        oldDelegate.glassOpacity != glassOpacity ||
        oldDelegate.fillFraction != fillFraction ||
        oldDelegate.sloshOffset != sloshOffset;
  }
}
