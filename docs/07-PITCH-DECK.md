# THUMP: Pitch Deck & Presentation Script (Dual-Tier Strategy)

This pitch script is engineered for maximum points, leveraging the "Zero-Hardware vs. Pro Hardware" dynamic.

## Slide 1: The Hook (30 sec)
**Visual:** A single LPG cylinder.
**Speaker:** "Right now, in 200 million Indian households, there is an opaque steel cylinder in the kitchen. When it runs out mid-cooking, it's a crisis. You can't see inside it. So, how do we solve this? We built THUMP—the complete smart gas ecosystem."

## Slide 2: The Freemium Ecosystem (45 sec)
**Visual:** Split screen. Left: A phone tapping a cylinder (Free). Right: A glowing smart scale pad (Pro).
**Speaker:** "We realized one size doesn't fit all. 
For 200 million households, we built **THUMP Basic**: a 100% free, zero-hardware solution. You just tap your phone against the tank, and our acoustic AI calculates the gas level using the phone's IMU and microphone.
But for commercial kitchens and premium smart homes, we built **THUMP Pro**: a low-cost IoT smart pad using an ESP32 and load cells that provides continuous 24/7 monitoring via Bluetooth."

## Slide 3: The "Ground Truth" Live Demo (90 sec - THE KILLER MOVE)
**Action:** Connect phone to screen mirroring. Have the cylinder sitting on the ESP32 hardware scale on the judges' table.
**Speaker:** "Let me show you. We have a test cylinder here. Anyone can say their software AI works, but we are going to *prove* it."
*(Tap the side of the cylinder with the phone)*
**Speaker:** "Our acoustic DSP pipeline just analyzed the physical resonance of the steel. The app calculates that it is exactly **45.2% full**."
*(Switch app tab to the BLE Hardware Scale view)*
**Speaker:** "Now, let's look at the live Bluetooth data streaming from our THUMP Pro hardware scale sitting underneath it. The hardware scale reads **45.0%**. We achieved hardware-level precision using just a microphone and a software algorithm."

## Slide 4: Office Kit & Fleet Management (30 sec)
**Visual:** Laptop showing the web dashboard.
**Speaker:** "For the Office Kit rubric, the app syncs this data—whether from a tap or the smart scale—to a local WebSocket dashboard. Restaurant managers can see all their cylinders at once and auto-print PDF reorder sheets."

## Slide 5: Business Impact (15 sec)
**Visual:** Market size stats.
**Speaker:** "THUMP Basic gets us into millions of homes with zero customer acquisition cost. THUMP Pro monetizes the commercial sector. A perfect software-to-hardware pipeline."

## Judge Q&A Defense

**Q: "Why would I buy the hardware if the software is free?"**
A: "Convenience. The software is free, but requires you to walk up and tap the tank. The hardware is for users who want push-notifications when gas is low without ever thinking about it. It's the ultimate upsell."

**Q: "What if the Bluetooth disconnects?"**
A: "The ESP32 also has Wi-Fi enabled. If BLE drops, it routes the payload through the local MQTT broker to the Office Kit directly. We have built-in redundancy."
