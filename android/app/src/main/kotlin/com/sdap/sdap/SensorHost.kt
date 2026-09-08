package com.sdap.sdap

import android.content.Context
import android.hardware.*
import java.io.File
import java.io.FileWriter
import kotlin.math.sqrt

class SensorHost(context: Context) : SensorEventListener {
    private val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private val accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
    private val gyroscope = sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE)
    private val gravitySensor = sensorManager.getDefaultSensor(Sensor.TYPE_GRAVITY)

    private var csvWriter: FileWriter? = null
    private var isSampling = false

    // Sliding window for gyro tremor RMS (500 ms @ ~200Hz = 100 samples)
    private val gyroWindow = ArrayDeque<Float>(120)
    private val gyroWindowLock = Any()

    var onGateUpdate: ((gate: String, passed: Boolean, value: Float) -> Unit)? = null

    companion object {
        const val GYRO_RMS_THRESH = 0.05f // rad/s (C11)
        const val IMU_PARALLEL_DEG = 5.0f // deg (C9)
    }

    fun startSampling(outputCsv: File) {
        csvWriter = FileWriter(outputCsv)
        csvWriter?.write("ts_ns,ax,ay,az,gx,gy,gz\n")
        isSampling = true

        accelerometer?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_FASTEST)
        }
        gyroscope?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_FASTEST)
        }
        gravitySensor?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_UI)
        }
    }

    fun stopSampling(): String? {
        isSampling = false
        sensorManager.unregisterListener(this)
        csvWriter?.flush()
        csvWriter?.close()
        csvWriter = null
        return null
    }

    private var lastAx = 0f
    private var lastAy = 0f
    private var lastAz = 0f

    override fun onSensorChanged(event: SensorEvent?) {
        if (event == null) return
        val ts = event.timestamp

        when (event.sensor.type) {
            Sensor.TYPE_ACCELEROMETER -> {
                lastAx = event.values[0]
                lastAy = event.values[1]
                lastAz = event.values[2]
            }
            Sensor.TYPE_GYROSCOPE -> {
                val gx = event.values[0]
                val gy = event.values[1]
                val gz = event.values[2]
                val norm = sqrt(gx * gx + gy * gy + gz * gz)

                synchronized(gyroWindowLock) {
                    if (gyroWindow.size >= 100) {
                        gyroWindow.removeFirst()
                    }
                    gyroWindow.addLast(norm)

                    // Compute RMS
                    var sumSq = 0f
                    for (v in gyroWindow) {
                        sumSq += v * v
                    }
                    val rms = sqrt(sumSq / gyroWindow.size.coerceAtLeast(1))
                    val passed = rms <= GYRO_RMS_THRESH
                    onGateUpdate?.invoke("tremor", passed, rms)
                }

                if (isSampling) {
                    csvWriter?.write("$ts,$lastAx,$lastAy,$lastAz,$gx,$gy,$gz\n")
                }
            }
            Sensor.TYPE_GRAVITY -> {
                // Check parallel tilt
                val gNorm = sqrt(event.values[0] * event.values[0] + event.values[1] * event.values[1] + event.values[2] * event.values[2])
                if (gNorm > 0.1f) {
                    val tiltDeg = Math.toDegrees(Math.acos((event.values[1] / gNorm).coerceIn(-1f, 1f).toDouble())).toFloat()
                    val parallelErr = kotlin.math.abs(tiltDeg - 90f) // 90° = vertical on side
                    val passed = parallelErr <= IMU_PARALLEL_DEG
                    onGateUpdate?.invoke("bubble", passed, parallelErr)
                }
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
}
