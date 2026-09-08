# THUMP: Kotlin Code Guide & Architecture

This guide provides the critical path Kotlin implementation for THUMP.

## 1. Tap Detection (IMU Sensor)

```kotlin
class TapDetector @Inject constructor(
    context: Context
) : SensorEventListener {
    private val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private val accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION)
    
    private val _tapEvents = MutableSharedFlow<Long>()
    val tapEvents = _tapEvents.asSharedFlow()
    
    private var lastTapTime = 0L
    private val TAP_THRESHOLD = 3.5f // g-force
    private val DEBOUNCE_MS = 250L

    fun startListening() {
        sensorManager.registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_FASTEST)
    }

    override fun onSensorChanged(event: SensorEvent) {
        val x = event.values[0]
        val y = event.values[1]
        val z = event.values[2]
        
        val magnitude = sqrt(x*x + y*y + z*z)
        
        if (magnitude > TAP_THRESHOLD) {
            val now = System.currentTimeMillis()
            if (now - lastTapTime > DEBOUNCE_MS) {
                lastTapTime = now
                // Launch coroutine to emit event
                CoroutineScope(Dispatchers.Default).launch {
                    _tapEvents.emit(now)
                }
            }
        }
    }
    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
}
```

## 2. DSP Engine (Feature Extraction)

```kotlin
object DSPEngine {
    fun extractFeatures(pcmData: ShortArray, sampleRate: Int): FeatureVector {
        val floatData = pcmData.map { it.toFloat() / Short.MAX_VALUE }.toFloatArray()
        
        // 1. RMS Energy
        val rms = sqrt(floatData.map { it * it }.average()).toFloat()
        
        // 2. Decay Rate (Simplified envelope extraction)
        // Find max amplitude in first 50ms, compare to amplitude at 200ms
        val peakInitial = floatData.take(sampleRate / 20).maxOrNull() ?: 0.01f
        val peakLate = floatData.drop(sampleRate / 5).take(sampleRate / 20).maxOrNull() ?: 0.001f
        val decayRate = ln(peakInitial / peakLate)

        // 3. Spectral Centroid (Requires FFT)
        val spectrum = computeFFT(floatData) // Assuming external FFT util
        val centroid = calculateCentroid(spectrum, sampleRate)

        return FeatureVector(
            spectralCentroid = centroid,
            rmsEnergy = rms,
            decayRate = decayRate
        )
    }
    
    private fun calculateCentroid(spectrum: FloatArray, sampleRate: Int): Float {
        var weightedSum = 0f
        var sum = 0f
        val binWidth = (sampleRate / 2f) / spectrum.size
        for (i in spectrum.indices) {
            weightedSum += (i * binWidth) * spectrum[i]
            sum += spectrum[i]
        }
        return if (sum > 0) weightedSum / sum else 0f
    }
}
```

## 3. Jetpack Compose UI (3D Cylinder)

```kotlin
@Composable
fun CylinderVisualization(fillPercentage: Float) {
    val animatedFill by animateFloatAsState(
        targetValue = fillPercentage,
        animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy)
    )
    
    Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
        Canvas(modifier = Modifier.size(200.dp, 350.dp)) {
            val width = size.width
            val height = size.height
            val fillHeight = height * (1f - animatedFill)
            
            // Draw Cylinder Body (Metal)
            drawRoundRect(
                color = Color(0xFF2C3E50),
                size = size,
                cornerRadius = CornerRadius(40f, 40f)
            )
            
            // Draw Liquid Fill
            clipRect(top = fillHeight, bottom = height) {
                drawRoundRect(
                    color = Color(0xFF2E86AB),
                    size = size,
                    cornerRadius = CornerRadius(40f, 40f)
                )
            }
        }
        
        Text(
            text = "${(animatedFill * 100).toInt()}%",
            color = Color.White,
            style = MaterialTheme.typography.displayLarge
        )
    }
}
```
