import 'dart:math';
import 'package:flutter/material.dart';
import '../../app/theme.dart';

class MockWaveformPainter extends CustomPainter {
  final double progress; // 0.0 -> 1.0
  final int knockIdx;
  final Color primaryColor;

  MockWaveformPainter({
    required this.progress,
    required this.knockIdx,
    this.primaryColor = AppColors.primaryBlue,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final midY = size.height / 2;
    final width = size.width;

    // Subtle background grid lines
    final gridPaint = Paint()
      ..color = AppColors.borderSubtle
      ..strokeWidth = 1.0;

    canvas.drawLine(Offset(0, midY), Offset(width, midY), gridPaint);
    canvas.drawLine(Offset(width * 0.25, 0), Offset(width * 0.25, size.height), gridPaint);
    canvas.drawLine(Offset(width * 0.5, 0), Offset(width * 0.5, size.height), gridPaint);
    canvas.drawLine(Offset(width * 0.75, 0), Offset(width * 0.75, size.height), gridPaint);

    // Clean acoustic waveform path
    final paint = Paint()
      ..color = primaryColor
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final path = Path();
    path.moveTo(0, midY);

    const points = 120;
    for (int i = 0; i <= points; i++) {
      final t = i / points;
      final x = t * width;

      // Chirp frequency gradient across time + knock damping envelope
      final freq = 6.0 + t * 20.0;
      final knockDamping = exp(-((t * 6.0) % 1.0) * 3.5);
      final envelope = sin(t * pi) * (0.55 + 0.45 * knockDamping);

      final y = midY + sin(t * freq * 2 * pi + progress * 18.0) * (size.height * 0.38) * envelope;
      path.lineTo(x, y);
    }

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant MockWaveformPainter oldDelegate) {
    return oldDelegate.progress != progress || oldDelegate.knockIdx != knockIdx;
  }
}
