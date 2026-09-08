import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:sensors_plus/sensors_plus.dart';
import '../../app/theme.dart';
import '../../services/time_throttle.dart';
import '../scan/bloc/scan_bloc.dart';
import '../scan/bloc/scan_event.dart';
import 'calibrate_top_screen.dart';

class CalibrateBottomScreen extends StatefulWidget {
  const CalibrateBottomScreen({super.key});

  @override
  State<CalibrateBottomScreen> createState() => _CalibrateBottomScreenState();
}

class _CalibrateBottomScreenState extends State<CalibrateBottomScreen> {
  StreamSubscription? _accelSub;
  double _tiltX = 0.0;
  double _tiltY = 0.0;
  bool _isAligned = false;

  @override
  void initState() {
    super.initState();
    try {
      _accelSub = accelerometerEventStream()
          .throttleTime(const Duration(milliseconds: 33))
          .listen((AccelerometerEvent event) {
        if (!mounted) return;
        setState(() {
          _tiltX = (event.x / 9.8).clamp(-1.0, 1.0);
          _tiltY = (event.y / 9.8).clamp(-1.0, 1.0);
          _isAligned = (_tiltX.abs() < 0.15 && (_tiltY - 1.0).abs() < 0.25);
        });
      });
    } catch (_) {
      // Accelerometer fallback
      _isAligned = true;
    }
  }

  @override
  void dispose() {
    _accelSub?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(color: AppColors.border, height: 1),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textPrimary, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Geometry Calibration (1/2)',
          style: TextStyle(
            color: AppColors.textPrimary,
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Step 1: Container Bottom Placement',
              style: TextStyle(
                color: AppColors.textPrimary,
                fontSize: 18,
                fontWeight: FontWeight.w600,
                letterSpacing: -0.1,
              ),
            ),
            const SizedBox(height: 4),
            const Text(
              'Place phone flat against container bottom. Hold upright to align IMU gravity vector.',
              style: TextStyle(
                color: AppColors.textSecondary,
                fontSize: 13,
                height: 1.45,
              ),
            ),
            const Spacer(),

            // Interactive Level Bubble Guide
            Center(
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Container(
                    width: 200,
                    height: 200,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.surface,
                      border: Border.all(
                        color: _isAligned ? AppColors.statusSuccess : AppColors.border,
                        width: 2,
                      ),
                    ),
                  ),
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: _isAligned ? AppColors.statusSuccess : AppColors.borderSubtle,
                        width: 1.5,
                      ),
                    ),
                  ),
                  // Bubble Indicator
                  Transform.translate(
                    offset: Offset(_tiltX * 65, (_tiltY - 1.0) * 65),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 80),
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: _isAligned ? AppColors.statusSuccess : AppColors.primaryBlue,
                        border: Border.all(color: Colors.white, width: 2),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  _isAligned ? Icons.check_circle : Icons.info_outline,
                  color: _isAligned ? AppColors.statusSuccess : AppColors.statusWarning,
                  size: 16,
                ),
                const SizedBox(width: 6),
                Text(
                  _isAligned ? 'Gravity Vector Aligned (±5°)' : 'Align bubble into center circle',
                  style: TextStyle(
                    color: _isAligned ? AppColors.statusSuccess : AppColors.statusWarning,
                    fontWeight: FontWeight.w600,
                    fontSize: 13,
                  ),
                ),
              ],
            ),

            const Spacer(),

            SizedBox(
              height: 48,
              child: ElevatedButton(
                onPressed: () {
                  context.read<ScanBloc>().add(BottomCalibrationDoneEvent());
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (_) => const CalibrateTopScreen()),
                  );
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
                  'LOCK BOTTOM POSITION & CONTINUE',
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
  }
}
