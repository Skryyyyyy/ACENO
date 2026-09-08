package com.sdap.sdap

import android.content.Context
import android.media.*
import android.media.audiofx.AcousticEchoCanceler
import android.media.audiofx.AutomaticGainControl
import android.media.audiofx.NoiseSuppressor
import android.os.Build
import java.io.File
import java.io.FileOutputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder

class AudioCaptureHost(
    private val context: Context,
    private val onFocusLost: () -> Unit
) {
    private var audioRecord: AudioRecord? = null
    private var audioManager: AudioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
    private var focusRequest: AudioFocusRequest? = null
    private var isRecording = false
    private var recordingThread: Thread? = null
    private var currentWavFile: File? = null

    companion object {
        const val SAMPLE_RATE = 48000
        const val CHANNEL_CONFIG = AudioFormat.CHANNEL_IN_MONO
        const val AUDIO_FORMAT = AudioFormat.ENCODING_PCM_FLOAT
    }

    private val focusChangeListener = AudioManager.OnAudioFocusChangeListener { focusChange ->
        if (focusChange == AudioManager.AUDIOFOCUS_LOSS ||
            focusChange == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT) {
            onFocusLost()
        }
    }

    fun requestScanFocus(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val req = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_EXCLUSIVE)
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .build()
                )
                .setOnAudioFocusChangeListener(focusChangeListener)
                .setWillPauseWhenDucked(true)
                .build()
            focusRequest = req
            audioManager.requestAudioFocus(req) == AudioManager.AUDIOFOCUS_REQUEST_GRANTED
        } else {
            @Suppress("DEPRECATION")
            audioManager.requestAudioFocus(
                focusChangeListener,
                AudioManager.STREAM_MUSIC,
                AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_EXCLUSIVE
            ) == AudioManager.AUDIOFOCUS_REQUEST_GRANTED
        }
    }

    private var originalVolume: Int = -1

    fun setMaxVolume() {
        originalVolume = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC)
        val maxVol = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC)
        audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, maxVol, 0)
    }

    fun abandonFocus() {
        if (originalVolume != -1) {
            audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, originalVolume, 0)
            originalVolume = -1
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            focusRequest?.let { audioManager.abandonAudioFocusRequest(it) }
        } else {
            @Suppress("DEPRECATION")
            audioManager.abandonAudioFocus(focusChangeListener)
        }
    }

    fun startCapture(outputWav: File): Boolean {
        if (!requestScanFocus()) {
            return false
        }
        setMaxVolume()

        val minBufSize = AudioRecord.getMinBufferSize(SAMPLE_RATE, CHANNEL_CONFIG, AUDIO_FORMAT)
        val bufferSize = (minBufSize * 4).coerceAtLeast(SAMPLE_RATE * 4) // At least 1s of 32-bit float

        // Try UNPROCESSED first, fallback to MIC
        val audioSource = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            MediaRecorder.AudioSource.UNPROCESSED
        } else {
            MediaRecorder.AudioSource.MIC
        }

        try {
            audioRecord = AudioRecord(
                audioSource,
                SAMPLE_RATE,
                CHANNEL_CONFIG,
                AUDIO_FORMAT,
                bufferSize
            )
        } catch (e: Exception) {
            audioRecord = AudioRecord(
                MediaRecorder.AudioSource.MIC,
                SAMPLE_RATE,
                CHANNEL_CONFIG,
                AUDIO_FORMAT,
                bufferSize
            )
        }

        val session = audioRecord?.audioSessionId ?: return false

        // Explicitly disable software DSP effects
        try {
            if (AcousticEchoCanceler.isAvailable()) {
                AcousticEchoCanceler.create(session)?.enabled = false
            }
            if (AutomaticGainControl.isAvailable()) {
                AutomaticGainControl.create(session)?.enabled = false
            }
            if (NoiseSuppressor.isAvailable()) {
                NoiseSuppressor.create(session)?.enabled = false
            }
        } catch (_: Exception) { }

        currentWavFile = outputWav
        audioRecord?.startRecording()
        isRecording = true

        recordingThread = Thread {
            writePcmFloatDataToWav(outputWav, bufferSize)
        }
        recordingThread?.start()
        return true
    }

    fun stopCapture(): String? {
        isRecording = false
        try {
            audioRecord?.stop()
            audioRecord?.release()
            audioRecord = null
            recordingThread?.join(2000)
        } catch (_: Exception) { }
        finally {
            abandonFocus()
        }
        return currentWavFile?.absolutePath
    }

    private fun writePcmFloatDataToWav(file: File, bufferSize: Int) {
        val floatBuffer = FloatArray(bufferSize / 4)
        val fos = FileOutputStream(file)

        // Reserve 44-byte WAV header placeholder
        fos.write(ByteArray(44))
        var totalBytes = 0

        val byteBuf = ByteBuffer.allocate(floatBuffer.size * 4).order(ByteOrder.LITTLE_ENDIAN)

        while (isRecording && audioRecord?.recordingState == AudioRecord.RECORDSTATE_RECORDING) {
            val readCount = audioRecord?.read(floatBuffer, 0, floatBuffer.size, AudioRecord.READ_BLOCKING) ?: 0
            if (readCount > 0) {
                byteBuf.clear()
                for (i in 0 until readCount) {
                    byteBuf.putFloat(floatBuffer[i])
                }
                fos.write(byteBuf.array(), 0, readCount * 4)
                totalBytes += readCount * 4
            }
        }
        fos.flush()

        // Seek back and rewrite standard IEEE float WAV header (format code 3)
        val raf = java.io.RandomAccessFile(file, "rw")
        raf.seek(0)
        raf.write(createWavHeader(totalBytes, SAMPLE_RATE, 1, 32, true))
        raf.close()
        fos.close()
    }

    private fun createWavHeader(dataBytes: Int, sampleRate: Int, channels: Int, bitsPerSample: Int, isFloat: Boolean): ByteArray {
        val totalDataLen = dataBytes + 36
        val byteRate = sampleRate * channels * bitsPerSample / 8
        val blockAlign = channels * bitsPerSample / 8
        val formatCode = if (isFloat) 3.toShort() else 1.toShort()

        val header = ByteBuffer.allocate(44).order(ByteOrder.LITTLE_ENDIAN)
        header.put("RIFF".toByteArray())
        header.putInt(totalDataLen)
        header.put("WAVE".toByteArray())
        header.put("fmt ".toByteArray())
        header.putInt(16) // Subchunk1Size
        header.putShort(formatCode) // 3 = IEEE Float
        header.putShort(channels.toShort())
        header.putInt(sampleRate)
        header.putInt(byteRate)
        header.putShort(blockAlign.toShort())
        header.putShort(bitsPerSample.toShort())
        header.put("data".toByteArray())
        header.putInt(dataBytes)
        return header.array()
    }
}
