import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../app/theme.dart';
import '../../models/session.dart';
import '../../services/proto_guard.dart';
import '../../services/session_store.dart';
import '../scan/bloc/scan_bloc.dart';
import '../scan/bloc/scan_event.dart';
import '../selftest/self_test_screen.dart';
import '../history/history_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  ContainerModel? _selected;

  @override
  void initState() {
    super.initState();
    final containers = SessionStore.instance.containers;
    if (containers.isNotEmpty) {
      _selected = containers.firstWhere(
        (c) => c.sku == ProtoGuard.kDemoContainer,
        orElse: () => containers.first,
      );
      context.read<ScanBloc>().add(SelectContainerEvent(_selected!));
    }
  }

  @override
  Widget build(BuildContext context) {
    final containers = SessionStore.instance.containers;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        scrolledUnderElevation: 1,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(
            color: AppColors.border,
            height: 1,
          ),
        ),
        titleSpacing: 16,
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: AppColors.primaryContainer,
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: AppColors.primaryContainerBorder, width: 1),
              ),
              child: const Text(
                'SDAP',
                style: TextStyle(
                  color: AppColors.primaryBlue,
                  fontWeight: FontWeight.w700,
                  fontSize: 12,
                  letterSpacing: 0.8,
                ),
              ),
            ),
            const SizedBox(width: 10),
            const Text(
              'Acoustic Profiling',
              style: TextStyle(
                color: AppColors.textPrimary,
                fontSize: 16,
                fontWeight: FontWeight.w600,
                letterSpacing: 0.1,
              ),
            ),
          ],
        ),
        actions: [
          if (ProtoGuard.kProtoMode)
            Container(
              margin: const EdgeInsets.only(right: 8),
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.statusWarningContainer,
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: const Color(0xFFFEEFC3), width: 1),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.terminal, color: AppColors.statusWarning, size: 13),
                  SizedBox(width: 4),
                  Text(
                    'DEMO MODE',
                    style: TextStyle(
                      color: AppColors.statusWarning,
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.4,
                    ),
                  ),
                ],
              ),
            ),
          IconButton(
            tooltip: 'Scan History',
            icon: const Icon(Icons.history_outlined, color: AppColors.textSecondary, size: 22),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const HistoryScreen()),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Section Header
            const Text(
              'Target Container Profile',
              style: TextStyle(
                color: AppColors.textPrimary,
                fontSize: 18,
                fontWeight: FontWeight.w600,
                letterSpacing: -0.1,
              ),
            ),
            const SizedBox(height: 4),
            const Text(
              'Select an active container geometry to calibrate acoustic chirp matched filtering and knock excitation.',
              style: TextStyle(
                color: AppColors.textSecondary,
                fontSize: 13,
                height: 1.45,
              ),
            ),
            const SizedBox(height: 16),

            // Selectable Container Cards List
            ...containers.map((c) => _buildContainerCard(c)),

            const SizedBox(height: 20),

            // Hardware Transducer Pipeline Card
            _buildSensorStatusCard(),

            const SizedBox(height: 24),

            // Start Scan Button
            SizedBox(
              height: 48,
              child: ElevatedButton(
                onPressed: () {
                  if (_selected != null) {
                    context.read<ScanBloc>().add(StartSelfTestEvent());
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const SelfTestScreen()),
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryBlue,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.sensors, size: 18, color: Colors.white),
                    const SizedBox(width: 8),
                    Text(
                      'START PROFILE SCAN (${_selected?.stationCount ?? 5} STATIONS)',
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.3,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContainerCard(ContainerModel container) {
    final isSelected = _selected?.sku == container.sku;

    IconData iconData;
    if (container.type == 'cylinder_lpg') {
      iconData = Icons.propane_tank_outlined;
    } else if (container.type == 'steel') {
      iconData = Icons.sports_bar_outlined;
    } else if (container.type == 'can') {
      iconData = Icons.local_drink_outlined;
    } else {
      iconData = Icons.water_drop_outlined;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      child: Material(
        color: isSelected ? AppColors.primaryContainer : AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
          side: BorderSide(
            color: isSelected ? AppColors.primaryBlue : AppColors.border,
            width: isSelected ? 1.5 : 1.0,
          ),
        ),
        child: InkWell(
          onTap: () {
            setState(() => _selected = container);
            context.read<ScanBloc>().add(SelectContainerEvent(container));
          },
          borderRadius: BorderRadius.circular(10),
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              children: [
                // Subtle Icon Container
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: isSelected
                        ? Colors.white
                        : AppColors.surfaceVariant,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: isSelected ? AppColors.primaryContainerBorder : AppColors.borderSubtle,
                      width: 1,
                    ),
                  ),
                  child: Icon(
                    iconData,
                    color: isSelected ? AppColors.primaryBlue : AppColors.textSecondary,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 14),

                // Container Metadata
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        container.label,
                        style: TextStyle(
                          color: AppColors.textPrimary,
                          fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        '${container.heightCm} cm height • ${container.volumeMl} mL • ${container.stationCount} stations',
                        style: const TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),

                // Selected Radio Indicator
                Container(
                  width: 20,
                  height: 20,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isSelected ? AppColors.primaryBlue : AppColors.border,
                      width: isSelected ? 6.0 : 1.5,
                    ),
                    color: isSelected ? AppColors.primaryBlue : Colors.transparent,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSensorStatusCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppColors.border, width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 7,
                height: 7,
                decoration: const BoxDecoration(
                  color: AppColors.statusSuccess,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 8),
              const Text(
                'Hardware Transducer Pipeline',
                style: TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const Spacer(),
              const Text(
                'ONLINE',
                style: TextStyle(
                  color: AppColors.statusSuccess,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          const Divider(height: 1, color: AppColors.borderSubtle),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(child: _statusColumn('MIC', '48 kHz Float', isSuccess: true)),
              Container(height: 24, width: 1, color: AppColors.borderSubtle),
              Expanded(child: _statusColumn('IMU', '200 Hz Direct', isSuccess: true)),
              Container(height: 24, width: 1, color: AppColors.borderSubtle),
              Expanded(child: _statusColumn('MOTOR', 'Tier B Knock')),
              Container(height: 24, width: 1, color: AppColors.borderSubtle),
              Expanded(child: _statusColumn('AUDIO FOCUS', 'Exclusive', isSuccess: true)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _statusColumn(String label, String value, {bool isSuccess = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: AppColors.textSecondary,
              fontSize: 10,
              fontWeight: FontWeight.w500,
              letterSpacing: 0.2,
            ),
          ),
          const SizedBox(height: 3),
          Text(
            value,
            style: TextStyle(
              color: isSuccess ? AppColors.textPrimary : AppColors.textPrimary,
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
