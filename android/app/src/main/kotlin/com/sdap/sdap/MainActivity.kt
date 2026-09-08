package com.sdap.sdap

import android.os.Build
import android.os.PowerManager
import androidx.annotation.NonNull
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.EventChannel
import io.flutter.plugin.common.MethodChannel
import java.io.File

class MainActivity : FlutterActivity() {
    private val CAPTURE_CHANNEL = "sdap/capture"
    private val EVENTS_CHANNEL = "sdap/events"

    private var audioCaptureHost: AudioCaptureHost? = null
    private var sensorHost: SensorHost? = null
    private var motorHost: MotorHost? = null
    private var eventSink: EventChannel.EventSink? = null

    override fun configureFlutterEngine(@NonNull flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        motorHost = MotorHost(this)
        sensorHost = SensorHost(this).apply {
            onGateUpdate = { gate, passed, value ->
                runOnUiThread {
                    eventSink?.success(
                        mapOf(
                            "type" to "gateStatus",
                            "gate" to gate,
                            "passed" to passed,
                            "value" to value
                        )
                    )
                }
            }
        }

        audioCaptureHost = AudioCaptureHost(this) {
            runOnUiThread {
                eventSink?.success(
                    mapOf(
                        "type" to "audioFocusLost"
                    )
                )
            }
        }

        // Setup thermal listener if API 29+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val powerManager = getSystemService(POWER_SERVICE) as PowerManager
            powerManager.addThermalStatusListener { status ->
                runOnUiThread {
                    eventSink?.success(
                        mapOf(
                            "type" to "thermalAlert",
                            "status" to status
                        )
                    )
                }
            }
        }

        EventChannel(flutterEngine.dartExecutor.binaryMessenger, EVENTS_CHANNEL).setStreamHandler(
            object : EventChannel.StreamHandler {
                override fun onListen(arguments: Any?, events: EventChannel.EventSink?) {
                    eventSink = events
                }
                override fun onCancel(arguments: Any?) {
                    eventSink = null
                }
            }
        )

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CAPTURE_CHANNEL).setMethodCallHandler { call, result ->
            when (call.method) {
                "startSession" -> {
                    val sessionId = call.argument<String>("sessionId") ?: "session_default"
                    val stationIdx = call.argument<Int>("stationIdx") ?: 0

                    CaptureService.startService(this)

                    val outputDir = File(cacheDir, "sdap_sessions/$sessionId").apply { mkdirs() }
                    val wavFile = File(outputDir, "${sessionId}_station_${stationIdx}.wav")
                    val accelFile = File(outputDir, "${sessionId}_station_${stationIdx}_accel.csv")

                    sensorHost?.startSampling(accelFile)
                    val captureStarted = audioCaptureHost?.startCapture(wavFile) ?: false

                    if (captureStarted) {
                        // Trigger knock train
                        motorHost?.playKnockTrain()
                        result.success(true)
                    } else {
                        result.error("CAPTURE_FAILED", "Failed to acquire audio focus or initialize AudioRecord", null)
                    }
                }
                "stopStation" -> {
                    val wavPath = audioCaptureHost?.stopCapture()
                    sensorHost?.stopSampling()
                    CaptureService.stopService(this)

                    result.success(
                        mapOf(
                            "wavPath" to (wavPath ?: ""),
                            "accelPath" to "",
                            "offsetNs" to 0L
                        )
                    )
                }
                "setVolume" -> {
                    audioCaptureHost?.setMaxVolume()
                    result.success(true)
                }
                "loopbackTest" -> {
                    Thread {
                        val test = LoopbackTest(this)
                        val res = test.runTest()
                        runOnUiThread {
                            result.success(
                                mapOf(
                                    "snrDb" to res.snrDb,
                                    "passed" to res.passed,
                                    "isAgcStubborn" to res.isAgcStubborn
                                )
                            )
                        }
                    }.start()
                }
                "getMotorTier" -> {
                    val tier = motorHost?.getCapability()?.name ?: "C"
                    result.success(tier)
                }
                else -> result.notImplemented()
            }
        }
    }
}
