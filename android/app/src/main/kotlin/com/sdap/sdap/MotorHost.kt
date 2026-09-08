package com.sdap.sdap

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager

enum class MotorTier {
    A, // API 34+ frequency control
    B, // API 30+ composition primitives / knock train
    C  // Legacy / fallback sync anchor + acoustic tap
}

data class TimingLog(
    val tier: MotorTier,
    val knockTimestampsNs: List<Long>,
    val syncAnchorNs: Long
)

class MotorHost(context: Context) {
    private val vibrator: Vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
        vibratorManager.defaultVibrator
    } else {
        @Suppress("DEPRECATION")
        context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
    }

    private val detectedTier: MotorTier = probeTier()

    private fun probeTier(): MotorTier {
        if (!vibrator.hasVibrator()) return MotorTier.C

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            try {
                val method = vibrator.javaClass.getMethod("areFrequencyControlsSupported")
                val isSupported = method.invoke(vibrator) as? Boolean ?: false
                if (isSupported) return MotorTier.A
            } catch (_: Exception) { }
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            // Check primitive support
            val supported = vibrator.areAllPrimitivesSupported(
                VibrationEffect.Composition.PRIMITIVE_QUICK_RISE,
                VibrationEffect.Composition.PRIMITIVE_CLICK
            )
            if (supported) return MotorTier.B
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (vibrator.hasAmplitudeControl()) return MotorTier.B
        }
        return MotorTier.C
    }

    fun getCapability(): MotorTier = detectedTier

    /**
     * Emits a 10ms sync anchor pulse at t=0 (C28=10ms) across all tiers.
     */
    fun emitSyncAnchor(): Long {
        val ts = System.nanoTime()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(10, VibrationEffect.DEFAULT_AMPLITUDE))
        } else {
            @Suppress("DEPRECATION")
            vibrator.vibrate(10)
        }
        return ts
    }

    /**
     * Executes the mechanical knock train (6 knocks @ 400ms interval = C21 & C22).
     */
    fun playKnockTrain(): TimingLog {
        val syncAnchor = emitSyncAnchor()
        val knockTimes = mutableListOf<Long>()

        Thread {
            Thread.sleep(50) // Guard after anchor
            for (i in 0 until 6) {
                knockTimes.add(System.nanoTime())
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && detectedTier != MotorTier.C) {
                    val comp = VibrationEffect.startComposition()
                        .addPrimitive(VibrationEffect.Composition.PRIMITIVE_QUICK_RISE, 1.0f)
                        .compose()
                    vibrator.vibrate(comp)
                } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator.vibrate(VibrationEffect.createOneShot(25, 255))
                } else {
                    @Suppress("DEPRECATION")
                    vibrator.vibrate(25)
                }
                Thread.sleep(400) // C22 = 400ms
            }
        }.start()

        return TimingLog(detectedTier, knockTimes, syncAnchor)
    }
}
