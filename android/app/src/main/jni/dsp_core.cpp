#include <jni.h>
#include <cmath>
#include <vector>
#include <complex>
#include <algorithm>
#include <numeric>

extern "C" {

/**
 * Computes cross-correlation between received signal and reference template
 * Returns peak normalized cross-correlation index and peak coefficient.
 */
JNIEXPORT jfloat JNICALL
Java_com_sdap_sdap_DspCore_crossCorrelate(
    JNIEnv* env,
    jclass clazz,
    jfloatArray signalArr,
    jfloatArray templateArr
) {
    jsize sigLen = env->GetArrayLength(signalArr);
    jsize tmplLen = env->GetArrayLength(templateArr);

    std::vector<float> sig(sigLen);
    std::vector<float> tmpl(tmplLen);
    env->GetFloatArrayRegion(signalArr, 0, sigLen, sig.data());
    env->GetFloatArrayRegion(templateArr, 0, tmplLen, tmpl.data());

    float maxCorr = 0.0f;
    float tmplEnergy = 0.0f;
    for (float v : tmpl) tmplEnergy += v * v;
    if (tmplEnergy < 1e-9f) return 0.0f;

    for (int i = 0; i <= sigLen - tmplLen; ++i) {
        float sum = 0.0f;
        float sigWindowEnergy = 0.0f;
        for (int j = 0; j < tmplLen; ++j) {
            float s = sig[i + j];
            sum += s * tmpl[j];
            sigWindowEnergy += s * s;
        }
        if (sigWindowEnergy > 1e-9f) {
            float normCorr = sum / std::sqrt(tmplEnergy * sigWindowEnergy);
            if (normCorr > maxCorr) {
                maxCorr = normCorr;
            }
        }
    }
    return maxCorr;
}

/**
 * Computes cosine distance between two frequency response vectors.
 * Metric = 1.0 - (u . v) / (||u|| * ||v||)
 */
JNIEXPORT jfloat JNICALL
Java_com_sdap_sdap_DspCore_cosineDistance(
    JNIEnv* env,
    jclass clazz,
    jfloatArray vecAArr,
    jfloatArray vecBArr
) {
    jsize len = env->GetArrayLength(vecAArr);
    std::vector<float> a(len);
    std::vector<float> b(len);
    env->GetFloatArrayRegion(vecAArr, 0, len, a.data());
    env->GetFloatArrayRegion(vecBArr, 0, len, b.data());

    float dot = 0.0f;
    float normA = 0.0f;
    float normB = 0.0f;

    for (int i = 0; i < len; ++i) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    if (normA < 1e-9f || normB < 1e-9f) return 1.0f;
    float cosSim = dot / (std::sqrt(normA) * std::sqrt(normB));
    return 1.0f - std::clamp(cosSim, -1.0f, 1.0f);
}

/**
 * Computes mean coherence across Welch estimation windows.
 */
JNIEXPORT jfloat JNICALL
Java_com_sdap_sdap_DspCore_computeWelchCoherence(
    JNIEnv* env,
    jclass clazz,
    jfloatArray sigAArr,
    jfloatArray sigBArr,
    jint windowSize
) {
    jsize len = env->GetArrayLength(sigAArr);
    std::vector<float> a(len);
    std::vector<float> b(len);
    env->GetFloatArrayRegion(sigAArr, 0, len, a.data());
    env->GetFloatArrayRegion(sigBArr, 0, len, b.data());

    int numWindows = len / windowSize;
    if (numWindows == 0) return 0.0f;

    float totalCoh = 0.0f;
    for (int w = 0; w < numWindows; ++w) {
        int offset = w * windowSize;
        float dot = 0.0f, eA = 0.0f, eB = 0.0f;
        for (int i = 0; i < windowSize; ++i) {
            float va = a[offset + i];
            float vb = b[offset + i];
            dot += va * vb;
            eA += va * va;
            eB += vb * vb;
        }
        if (eA > 1e-9f && eB > 1e-9f) {
            float coh = (dot * dot) / (eA * eB);
            totalCoh += std::clamp(coh, 0.0f, 1.0f);
        }
    }
    return totalCoh / static_cast<float>(numWindows);
}

/**
 * 3-Tier Sync-Anchor Fallback Chain (LF-4):
 * Tier 1: Anchor xcorr (peak >= C33 = 0.3)
 * Tier 2: First knock xcorr (peak >= C33 = 0.3)
 * Tier 3: Timestamp math fallback (delta = t_audio_ns - t_accel_ns)
 * Returns float array: [offsetNs, peakXcorr, syncTier (1, 2, or 3), isChassisDamped (1.0 or 0.0)]
 */
JNIEXPORT jfloatArray JNICALL
Java_com_sdap_sdap_DspCore_computeSyncOffsetFallbackChain(
    JNIEnv* env,
    jclass clazz,
    jfloatArray audioRecordArr,
    jfloatArray syncAnchorTemplateArr,
    jfloatArray firstKnockTemplateArr,
    jlong audioStartTimestampNs,
    jlong accelStartTimestampNs
) {
    jsize audioLen = env->GetArrayLength(audioRecordArr);
    jsize anchorLen = env->GetArrayLength(syncAnchorTemplateArr);
    jsize knockLen = env->GetArrayLength(firstKnockTemplateArr);

    std::vector<float> audio(audioLen);
    std::vector<float> anchor(anchorLen);
    std::vector<float> knock(knockLen);
    env->GetFloatArrayRegion(audioRecordArr, 0, audioLen, audio.data());
    env->GetFloatArrayRegion(syncAnchorTemplateArr, 0, anchorLen, anchor.data());
    env->GetFloatArrayRegion(firstKnockTemplateArr, 0, knockLen, knock.data());

    const float MIN_PEAK_THRESH = 0.30f; // C33
    const float SAMPLE_RATE = 48000.0f;

    auto findPeak = [&](const std::vector<float>& tmpl) -> std::pair<float, int> {
        float maxCorr = 0.0f;
        int peakIdx = 0;
        float tmplEnergy = 0.0f;
        for (float v : tmpl) tmplEnergy += v * v;
        if (tmplEnergy < 1e-9f) return {0.0f, 0};

        int searchWindow = std::min((int)audioLen - (int)tmpl.size(), (int)(SAMPLE_RATE * 0.2f));
        for (int i = 0; i <= searchWindow; ++i) {
            float sum = 0.0f;
            float sigEnergy = 0.0f;
            for (size_t j = 0; j < tmpl.size(); ++j) {
                float s = audio[i + j];
                sum += s * tmpl[j];
                sigEnergy += s * s;
            }
            if (sigEnergy > 1e-9f) {
                float normCorr = sum / std::sqrt(tmplEnergy * sigEnergy);
                if (normCorr > maxCorr) {
                    maxCorr = normCorr;
                    peakIdx = i;
                }
            }
        }
        return {maxCorr, peakIdx};
    };

    auto anchorRes = findPeak(anchor);
    if (anchorRes.first >= MIN_PEAK_THRESH) {
        float offsetNs = (anchorRes.second / SAMPLE_RATE) * 1e9f;
        std::vector<float> res = {offsetNs, anchorRes.first, 1.0f, 0.0f};
        jfloatArray out = env->NewFloatArray(4);
        env->SetFloatArrayRegion(out, 0, 4, res.data());
        return out;
    }

    auto knockRes = findPeak(knock);
    if (knockRes.first >= MIN_PEAK_THRESH) {
        float offsetNs = (knockRes.second / SAMPLE_RATE) * 1e9f;
        std::vector<float> res = {offsetNs, knockRes.first, 2.0f, 0.0f};
        jfloatArray out = env->NewFloatArray(4);
        env->SetFloatArrayRegion(out, 0, 4, res.data());
        return out;
    }

    float mathOffsetNs = static_cast<float>(audioStartTimestampNs - accelStartTimestampNs);
    std::vector<float> res = {mathOffsetNs, 0.0f, 3.0f, 1.0f};
    jfloatArray out = env->NewFloatArray(4);
    env->SetFloatArrayRegion(out, 0, 4, res.data());
    return out;
}

} // extern "C"
