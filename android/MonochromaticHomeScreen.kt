package com.thump.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thump.app.ui.components.MonochromaticCylinder3D

/**
 * Ultra-Clean Monochromatic Mobile Screen for iQOO Devices
 * Implements high-contrast black/white/slate visual hierarchy inspired by Dribbble CRM designs.
 */
@Composable
fun MonochromaticHomeScreen(
    onTriggerAcousticTap: () -> Unit = {},
    onNavigateToSettings: () -> Unit = {}
) {
    var gasPercentage by remember { mutableStateOf(0.45f) }
    var activeMethod by remember { mutableStateOf("ACOUSTIC") } // "ACOUSTIC" or "SCALE"

    Scaffold(
        containerColor = Color(0xFF090A0C) // Obsidian Black Base
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 24.dp, vertical = 18.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // 1. Top Header Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "KITCHEN UNIT #01",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF64748B),
                        letterSpacing = 1.2.sp
                    )
                    Text(
                        text = "Main Cylinder",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                }

                // Calibrated Monochromatic Badge
                Box(
                    modifier = Modifier
                        .clip(CircleShape)
                        .background(Color(0xFF181B20))
                        .border(1.dp, Color.White.copy(alpha = 0.15f), CircleShape)
                        .padding(horizontal = 14.dp, vertical = 6.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(6.dp)
                                .clip(CircleShape)
                                .background(Color.White)
                        )
                        Text(
                            text = "CALIBRATED",
                            color = Color.White,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.ExtraBold,
                            letterSpacing = 0.8.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // 2. Monochromatic Segmented Control (Acoustic vs IoT Scale)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(9999.dp))
                    .background(Color(0xFF181B20))
                    .border(1.dp, Color.White.copy(alpha = 0.08f), RoundedCornerShape(9999.dp))
                    .padding(4.dp)
            ) {
                // Method 1: Acoustic Tap Button
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(9999.dp))
                        .background(if (activeMethod == "ACOUSTIC") Color.White else Color.Transparent)
                        .clickable { activeMethod = "ACOUSTIC" }
                        .padding(vertical = 10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Acoustic Tap",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (activeMethod == "ACOUSTIC") Color.Black else Color(0xFF94A3B8)
                    )
                }

                // Method 2: IoT Scale Button
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(9999.dp))
                        .background(if (activeMethod == "SCALE") Color.White else Color.Transparent)
                        .clickable { activeMethod = "SCALE" }
                        .padding(vertical = 10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "IoT Scale Pad",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (activeMethod == "SCALE") Color.Black else Color(0xFF94A3B8)
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // 3. Central Monochromatic 3D Cylinder
            MonochromaticCylinder3D(
                fillPercentage = gasPercentage,
                modifier = Modifier.weight(1f)
            )

            Spacer(modifier = Modifier.height(20.dp))

            // 4. Clean Monochromatic Metric Cards
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Days Left Card
                Card(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(26.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF181B20)),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.08f))
                ) {
                    Column(
                        modifier = Modifier.padding(18.dp)
                    ) {
                        Text(
                            text = "EST. DAYS LEFT",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF64748B),
                            letterSpacing = 1.sp
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "06 Days",
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Black,
                            fontFamily = FontFamily.Monospace,
                            color = Color.White
                        )
                    }
                }

                // Error Margin Card
                Card(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(26.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF181B20)),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.08f))
                ) {
                    Column(
                        modifier = Modifier.padding(18.dp)
                    ) {
                        Text(
                            text = "ACCURACY MARGIN",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF64748B),
                            letterSpacing = 1.sp
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = if (activeMethod == "ACOUSTIC") "±8.0%" else "±0.5%",
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Black,
                            fontFamily = FontFamily.Monospace,
                            color = Color.White
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 5. High-Contrast Bottom CTA Button
            Button(
                onClick = {
                    onTriggerAcousticTap()
                    gasPercentage = (0.42f..0.48f).random()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(60.dp),
                shape = RoundedCornerShape(20.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.White,
                    contentColor = Color.Black
                )
            ) {
                Text(
                    text = if (activeMethod == "ACOUSTIC") "Tap Shell to Recheck" else "Sync With ESP32 Scale",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color.Black
                )
            }
        }
    }
}

private fun ClosedFloatingPointRange<Float>.random(): Float =
    (start + Math.random() * (endInclusive - start)).toFloat()
