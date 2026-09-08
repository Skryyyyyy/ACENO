# THUMP: Hackathon Winning Strategy

This document aligns THUMP's execution directly against the iQOO Smart Living Hackathon rubric to guarantee maximum point extraction.

## 1. Rubric Optimization

### End Product Quality (30%)
*   **The Trap:** Building a messy UI because the backend DSP is hard.
*   **THUMP Strategy:** We use Jetpack Compose to build a stunning, dark-themed, 3D animated UI. The app will *feel* like a premium iQOO system app.
*   **Actionable:** Handle all edge cases. If a tap fails, gracefully say "Tap softer" rather than crashing or showing raw errors.

### Novelty & Impact (20%)
*   **The Trap:** Building another generic IoT dashboard for a smart lightbulb.
*   **THUMP Strategy:** "Zero-Hardware." This is our superpower. Every other team will use external Arduino/ESP32 sensors. We are proving the phone *is* the ultimate sensor. Addressable market: 200M households.

### Technical Depth (15%)
*   **The Trap:** Disguising simple `if(loud) -> empty` logic as AI.
*   **THUMP Strategy:** We use classical Acoustic DSP (Fast Fourier Transforms, Spectral Centroids, Decay Rate Exponential Fitting). We have the math to back it up.
*   **Actionable:** Show the live spectrogram in the Office Kit dashboard during the demo. Visualizing the FFT proves the technical depth to the judges instantly.

### Creative Phone Use (15%)
*   **THUMP Strategy:** We max this category automatically.
    *   **IMU:** For microsecond impact timing.
    *   **Mic:** For 48kHz acoustic capture.
    *   **CameraX:** For scanning cylinder barcodes.
    *   **NPU/CPU:** For edge DSP computation.

### Office Kit Usage (10%)
*   **THUMP Strategy:** Local WebSocket server. It shows we understand fleet management (restaurants, cloud kitchens) while maintaining data privacy.

### Demo & Presentation (10%)
*   **The Trap:** Presenting slides for 3 minutes and doing a 30-second rushed demo.
*   **THUMP Strategy:** 30 seconds of slides. 2.5 minutes of LIVE DEMO. We tap the cylinder live on stage, and the phone speaks the result, while the laptop shows the acoustic wave.

## 2. MVP Fallback Strategy
If time is running out (Hour 20):
1.  **Cut the ML Pipeline:** TFLite is nice, but the DSP heuristics work well enough for a demo.
2.  **Fudge the Calibration:** Hardcode a standard 14.2kg cylinder calibration profile if the wizard UI isn't finished.
3.  **Prioritize the UI:** A fake backend with a beautiful Compose UI scores higher than a perfect DSP pipeline with a crashy UI. (But we aim for both).

## 3. Judge Psychology
Judges at mobile hackathons love **"Hardware-less Innovation."** When you solve a physical problem (weighing heavy gas tanks) using only software and existing sensors, it looks like magic. Frame it exactly like that: *"We replaced a $100 industrial load cell with 50 lines of Kotlin and a microphone."*
