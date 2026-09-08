import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'app/theme.dart';
import 'features/home/home_screen.dart';
import 'features/scan/bloc/scan_bloc.dart';
import 'services/proto_guard.dart';
import 'services/session_store.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Lock orientation to portrait for accurate IMU and placement scanning
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
  ]);

  // Initialize SessionStore & seed catalog
  await SessionStore.instance.init();

  final sensorSource = ProtoGuard.createSensorSource();

  runApp(SdapApp(sensorSource: sensorSource));
}

class SdapApp extends StatelessWidget {
  final dynamic sensorSource;

  const SdapApp({super.key, required this.sensorSource});

  @override
  Widget build(BuildContext context) {
    return BlocProvider<ScanBloc>(
      create: (_) => ScanBloc(sensorSource: sensorSource),
      child: MaterialApp(
        title: 'SDAP Liquid Profiler',
        debugShowCheckedModeBanner: false,
        theme: SdapTheme.lightTheme,
        home: const HomeScreen(),
      ),
    );
  }
}
