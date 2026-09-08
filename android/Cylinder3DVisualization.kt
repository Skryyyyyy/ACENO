package com.thump.app.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.clipRect
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.sin

/**
 * 3D-styled LPG Gas Cylinder with animated liquid wave and bubble particles.
 * Designed specifically for the iQOO Smart Living Dark Theme UI.
 */
@Composable
fun Cylinder3DVisualization(
    fillPercentage: Float, // 0.0f to 1.0f (e.g. 0.45f for 45%)
    modifier: Modifier = Modifier,
    cylinderWeightKg: Float = 14.2f
) {
    // Smooth transition when percentage updates from Acoustic DSP or BLE Scale
    val animatedFill by animateFloatAsState(
        targetValue = fillPercentage.coerceIn(0f, 1f),
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow
        ),
        label = "LiquidFillAnimation"
    )

    // Infinite wave oscillator
    val infiniteTransition = rememberInfiniteTransition(label = "WaveTransition")
    val wavePhase by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 2 * Math.PI.toFloat(),
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 2800, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "WavePhase"
    )

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = modifier
    ) {
        // The 3D Tank Cylinder
        Box(
            modifier = Modifier
                .width(210.dp)
                .height(340.dp),
            contentAlignment = Alignment.Center
        ) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                val w = size.width
                val h = size.height
                val cornerRadius = 46f

                // 1. Cylinder Outer Shell (Metallic Dark Gradient)
                val shellGradient = Brush.horizontalGradient(
                    colors = listOf(
                        Color(0xFF1E293B),
                        Color(0xFF334155),
                        Color(0xFF1E293B)
                    )
                )
                drawRoundRect(
                    brush = shellGradient,
                    size = Size(w, h),
                    cornerRadius = CornerRadius(cornerRadius, cornerRadius)
                )

                // 2. Valve & Handle Top Rim
                val valveWidth = w * 0.45f
                val valveHeight = 24f
                drawRoundRect(
                    color = Color(0xFF475569),
                    topLeft = Offset((w - valveWidth) / 2, 0f),
                    size = Size(valveWidth, valveHeight),
                    cornerRadius = CornerRadius(8f, 8f)
                )

                // 3. Vapor / Gas Upper Section Subtle Shimmer
                drawCircle(
                    color = Color.White.copy(alpha = 0.03f),
                    radius = w * 0.4f,
                    center = Offset(w * 0.5f, h * 0.3f)
                )

                // 4. Liquid Gas Layer (Blue Oceanic Gradient with Wave)
                val liquidTop = h * (1f - animatedFill)
                val waveAmplitude = 12f

                val liquidPath = Path().apply {
                    moveTo(0f, liquidTop)
                    // Construct Sine wave top boundary
                    val step = 10f
                    var x = 0f
                    while (x <= w) {
                        val y = liquidTop + sin((x / w * 2 * Math.PI.toFloat()) + wavePhase) * waveAmplitude
                        lineTo(x, y)
                        x += step
                    }
                    lineTo(w, h)
                    lineTo(0f, h)
                    close()
                }

                // Clip and draw liquid layer
                clipRect(top = 0f, bottom = h, left = 0f, right = w) {
                    val liquidBrush = Brush.verticalGradient(
                        colors = listOf(
                            Color(0xFF38BDF8), // Glowing sky cyan top
                            Color(0xFF0284C7), // Deep vibrant blue
                            Color(0xFF075985)  // Dense bottom blue
                        ),
                        startY = liquidTop,
                        endY = h
                    )
                    drawPath(path = liquidPath, brush = liquidBrush)
                }

                // 5. Metallic Inner Border Reflection
                drawRoundRect(
                    color = Color.White.copy(alpha = 0.12f),
                    size = Size(w, h),
                    cornerRadius = CornerRadius(cornerRadius, cornerRadius),
                    style = androidx.compose.ui.graphics.drawscope.Stroke(width = 3f)
                )
            }

            // Central Percentage Overlay & Status
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    text = "${(animatedFill * 100).toInt()}%",
                    fontSize = 42.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color.White,
                    letterSpacing = (-1).sp
                )
                Text(
                    text = "remaining",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFFBAE6FD).copy(alpha = 0.9f)
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "${String.format("%.2f", animatedFill * cylinderWeightKg)} kg net",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White.copy(alpha = 0.7f),
                    modifier = Modifier
                        .background(
                            color = Color.Black.copy(alpha = 0.35f),
                            shape = RoundedCornerShape(12.dp)
                        )
                        .padding(horizontal = 8.dp, vertical = 2.dp)
                )
            }
        }
    }
}
