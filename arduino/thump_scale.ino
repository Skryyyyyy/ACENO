/*
 * THUMP Scale - ESP32 Firmware for THUMP Pro (Method 2)
 * Hardware: ESP32 + HX711 Load Cell Amplifier (4x 50kg Wheatstone bridge)
 * Protocol: Bluetooth Low Energy (BLE) + WiFi MQTT Fallback
 */

#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include "HX711.h"

// Pins
const int LOADCELL_DOUT_PIN = 16;
const int LOADCELL_SCK_PIN = 4;

// BLE UUIDs
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

HX711 scale;
BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool deviceConnected = false;

// Calibration factor (adjusted based on load cells)
float calibration_factor = 2280.0; 
const float CYLINDER_TARE_WEIGHT = 15.5; // Empty Indane 14.2kg cylinder tare weight in kg
const float FULL_GAS_CAPACITY = 14.2;   // Gas net weight

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println("[BLE] iQOO Phone Connected!");
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println("[BLE] Device Disconnected, Advertising...");
      pServer->startAdvertising();
    }
};

void setup() {
  Serial.begin(115200);
  Serial.println("=========================================");
  Serial.println("    THUMP Pro Smart IoT Scale (ESP32)    ");
  Serial.println("=========================================");

  // Initialize HX711
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale(calibration_factor);
  scale.tare(); // Reset scale to 0

  // Create the BLE Device
  BLEDevice::init("THUMP_PRO_SCALE");

  // Create the BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create the BLE Service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create a BLE Characteristic
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ   |
                      BLECharacteristic::PROPERTY_NOTIFY
                    );

  pCharacteristic->addDescriptor(new BLE2902());

  // Start the service
  pService->start();

  // Start advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  
  Serial.println("[BLE] Ready & Advertising! Waiting for iQOO phone...");
}

void loop() {
  // Read weight from HX711
  float totalWeight = scale.get_units(5); // Average of 5 readings in kg
  if (totalWeight < 0) totalWeight = 0.0;

  // Calculate Net Gas Level %
  float gasWeight = totalWeight - CYLINDER_TARE_WEIGHT;
  if (gasWeight < 0) gasWeight = 0.0;
  
  float levelPercent = (gasWeight / FULL_GAS_CAPACITY) * 100.0;
  if (levelPercent > 100.0) levelPercent = 100.0;

  // Format JSON payload for BLE & Serial
  char payload[64];
  snprintf(payload, sizeof(payload), "{\"w\":%.2f,\"pct\":%.1f}", totalWeight, levelPercent);

  Serial.print("[SCALE READING] ");
  Serial.println(payload);

  if (deviceConnected) {
    pCharacteristic->setValue(payload);
    pCharacteristic->notify();
  }

  delay(2000); // 2-second broadcast interval
}
