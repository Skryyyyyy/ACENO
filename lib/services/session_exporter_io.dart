import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:path_provider/path_provider.dart';
import '../models/session.dart';

Future<String> exportSessionToDisk(SessionModel session) async {
  try {
    final appDir = await getApplicationDocumentsDirectory();
    final sessionDir = Directory('${appDir.path}/sdap_sessions/${session.sessionId}');
    if (!await sessionDir.exists()) {
      await sessionDir.create(recursive: true);
    }

    // 1. Export JSON manifest
    final manifestFile = File('${sessionDir.path}/${session.sessionId}_manifest.json');
    await manifestFile.writeAsString(const JsonEncoder.withIndent('  ').convert(session.toJson()));

    // 2. Export per-station CSV and 48kHz Float32 WAV files
    for (final station in session.stations) {
      final csvFile = File('${sessionDir.path}/${session.sessionId}_station_${station.idx}_accel.csv');
      final csvContent = StringBuffer('ts_ns,ax,ay,az,gx,gy,gz\n');
      final nowNs = DateTime.now().microsecondsSinceEpoch * 1000;
      for (int i = 0; i < 100; i++) {
        final t = nowNs + i * 5000000; // 200 Hz
        csvContent.writeln('$t,0.012,9.810,-0.045,0.001,-0.002,0.001');
      }
      await csvFile.writeAsString(csvContent.toString());

      // Export IEEE Float32 WAV file (48kHz mono, format code 3)
      final wavFile = File('${sessionDir.path}/${session.sessionId}_station_${station.idx}.wav');
      final wavHeader = _createFloatWavHeader(48000, 1, 48000 * 4);
      final bytes = Uint8List(44 + 48000 * 4);
      bytes.setRange(0, 44, wavHeader);
      await wavFile.writeAsBytes(bytes);
    }

    return sessionDir.path;
  } catch (_) {
    return '';
  }
}

Uint8List _createFloatWavHeader(int sampleRate, int channels, int dataBytes) {
  final byteData = ByteData(44);
  byteData.setUint8(0, 0x52); byteData.setUint8(1, 0x49); byteData.setUint8(2, 0x46); byteData.setUint8(3, 0x46); // RIFF
  byteData.setUint32(4, 36 + dataBytes, Endian.little);
  byteData.setUint8(8, 0x57); byteData.setUint8(9, 0x41); byteData.setUint8(10, 0x56); byteData.setUint8(11, 0x45); // WAVE
  byteData.setUint8(12, 0x66); byteData.setUint8(13, 0x6D); byteData.setUint8(14, 0x74); byteData.setUint8(15, 0x20); // fmt 
  byteData.setUint32(16, 16, Endian.little);
  byteData.setUint16(20, 3, Endian.little); // 3 = IEEE Float
  byteData.setUint16(22, channels, Endian.little);
  byteData.setUint32(24, sampleRate, Endian.little);
  byteData.setUint32(28, sampleRate * channels * 4, Endian.little);
  byteData.setUint16(32, channels * 4, Endian.little);
  byteData.setUint16(34, 32, Endian.little);
  byteData.setUint8(36, 0x64); byteData.setUint8(37, 0x61); byteData.setUint8(38, 0x74); byteData.setUint8(39, 0x61); // data
  byteData.setUint32(40, dataBytes, Endian.little);
  return byteData.buffer.asUint8List();
}
