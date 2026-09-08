package com.thump.app.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thump.app.ui.components.Cylinder3DVisualization

/**
 * Main Mobile Screen for iQOO devices matching the design preview.
 * Supports both Method 1 (Acoustic Tap) and Method 2 (BLE Smart Scale).
 */
@Composable
fun CylinderDetailScreen(
    onNavigateToSettings: () -> Unit = {},
    onTriggerAcousticTap: () -> Unit = {}
) {
    var gasPercentage by remember { mutableStateOf(0.45f) }
    var isCalibrated by remember { mutableStateOf(true) }
    var selectedMethod by remember { mutableStateOf("ACOUSTIC") } // "ACOUSTIC" or "BLE_SCALE"

    Scaffold(
        containerColor = Color(0xFF0F172A) // Deep iQOO dark slate
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 24.dp, vertical = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Top App Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Kitchen cylinder",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = "Indane 14.2kg • ID: #9042",
                        fontSize = 12.sp,
                        color = Color.Slate400
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Calibrated Status Tag
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color(0xFF064E3B).copy(alpha = 0.8f))
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = if (isCalibrated) "Calibrated" else "Needs Calibration",
                            color = Color(0xFF34D399),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    Spacer(modifier = Modifier.width(8.dp))

                    IconButton(onClick = onNavigateToSettings) {
                        Icon(
                            imageVector = Icons.Default.MoreVert,
                            contentDescription = "Options",
                            tint = Color.White
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Dual Mode Toggle (Method 1 vs Method 2)
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(16.dp))
                    .background(Color(0xFF1E293B))
                    .padding(4.dp)
            ) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (selectedMethod == "ACOUSTIC") Color(0xFF0284C7) else Color.Transparent)
                        .clickable { selectedMethod = "ACOUSTIC" }
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = "📱 Acoustic Tap",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (selectedMethod == "ACOUSTIC") Color.White else Color(0xFF94A3B8)
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (selectedMethod == "BLE_SCALE") Color(0xFF059669) else Color.Transparent)
                        .clickable { selectedMethod = "BLE_SCALE" }
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = "⚖️ IoT Scale",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (selectedMethod == "BLE_SCALE") Color.White else Color(0xFF94A3B8)
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Center: 3D Animated Cylinder Composable
            Cylinder3DVisualization(
                fillPercentage = gasPercentage,
                modifier = Modifier.weight(1f)
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Bottom Metric Cards
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Days Left Card
                Card(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B))
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "Est. days left",
                            fontSize = 12.sp,
                            color = Color(0xFF94A3B8)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "6 days",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }

                // Error Margin Card
                Card(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B))
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "Error margin",
                            fontSize = 12.sp,
                            color = Color(0xFF94A3B8)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (selectedMethod == "ACOUSTIC") "±8%" else "±0.5%",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (selectedMethod == "ACOUSTIC") Color(0xFF38BDF8) else Color(0xFF34D399)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Tap Shell CTA Button (Matching design mockup)
            Button(
                onClick = {
                    onTriggerAcousticTap()
                    // Simulate acoustic tap reading
                    gasPercentage = (0.42f..0.48f).random()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF1E293B)
                ),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF334155))
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = "👆",
                        fontSize = 18.sp
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (selectedMethod == "ACOUSTIC") "Tap shell to recheck" else "Sync with BLE Scale",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color.White
                    )
                }
            }
        }
    }
}

val Color.Companion.Slate400: Color get() = Color(0xFF94A3B8)

private fun ClosedFloatingPointRange<Float>.random(): Float =
    (start + Math.random() * (endInclusive - start)).toFloat()
