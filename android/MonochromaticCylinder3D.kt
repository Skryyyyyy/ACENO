package com.thump.app.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.clipRect
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.sin

/**
 * Ultra-Clean Monochromatic 3D LPG Cylinder Composable
 * Inspired by modern minimal FinTech & CRM UI aesthetics.
 * Uses high-contrast grayscale, sleek wave oscillations, and typography hierarchy.
 */
@Composable
fun MonochromaticCylinder3D(
    fillPercentage: Float, // 0.0f to 1.0f (e.g. 0.45f)
    modifier: Modifier = Modifier,
    cylinderTareKg: Float = 15.5f,
    gasCapacityKg: Float = 14.2f
) {
    // Spring physics level transitions
    val animatedFill by animateFloatAsState(
        targetValue = fillPercentage.coerceIn(0f, 1f),
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioLowBouncy,
            stiffness = Spring.StiffnessLow
        ),
        label = "MonochromaticLevelAnimation"
    )

    // Wave oscillator phase
    val infiniteTransition = rememberInfiniteTransition(label = "WavePhaseTransition")
    val wavePhase by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = (2 * Math.PI).toFloat(),
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 3200, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "WavePhase"
    )

    val currentGasKg = animatedFill * gasCapacityKg

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(380.dp),
        contentAlignment = Alignment.Center
    ) {
        // Main Tank Canvas
        Canvas(
            modifier = Modifier
                .width(200.dp)
                .height(320.dp)
        ) {
            val w = size.width
            val h = size.height
            val cornerRadius = 44f

            // 1. Tank Background Shell (Deep Slate / Obsidian)
            val shellBrush = Brush.verticalGradient(
                colors = listOf(
                    Color(0xFF1E2229),
                    Color(0xFF12151A),
                    Color(0xFF0D0F12)
                )
            )
            drawRoundRect(
                brush = shellBrush,
                size = Size(w, h),
                cornerRadius = CornerRadius(cornerRadius, cornerRadius)
            )

            // 2. Minimalist Collar / Handle at top
            val handleWidth = w * 0.42f
            val handleHeight = 22f
            drawRoundRect(
                color = Color(0xFF2B313A),
                topLeft = Offset((w - handleWidth) / 2f, 0f),
                size = Size(handleWidth, handleHeight),
                cornerRadius = CornerRadius(8f, 8f)
            )

            // 3. Monochromatic Liquid Fill Layer
            val liquidTop = h * (1f - animatedFill)
            val waveAmplitude = 10f

            val wavePath = Path().apply {
                moveTo(0f, liquidTop)
                var x = 0f
                val step = 8f
                while (x <= w) {
                    val y = liquidTop + sin((x / w * 2 * Math.PI.toFloat()) + wavePhase) * waveAmplitude
                    lineTo(x, y)
                    x += step
                }
                lineTo(w, h)
                lineTo(0f, h)
                close()
            }

            // Draw Liquid Layer with Monochromatic Slate-to-Silver Gradient
            clipRect(top = 0f, bottom = h, left = 0f, right = w) {
                val liquidBrush = Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFFF1F5F9), // Bright silver-white crest
                        Color(0xFF94A3B8), // Mid slate
                        Color(0xFF334155)  // Deep shadow base
                    ),
                    startY = liquidTop,
                    endY = h
                )
                drawPath(path = wavePath, brush = liquidBrush)
            }

            // 4. Subtle Inner Rim Highlight (High-end Glass look)
            drawRoundRect(
                color = Color.White.copy(alpha = 0.12f),
                size = Size(w, h),
                cornerRadius = CornerRadius(cornerRadius, cornerRadius),
                style = Stroke(width = 2f)
            )
        }

        // Floating Precision Percentage Card
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .offset(y = (-16).dp)
                .clip(RoundedCornerShape(20.dp))
                .background(Color(0xFF181B20).copy(alpha = 0.92f))
                .border(1.dp, Color.White.copy(alpha = 0.15f), RoundedCornerShape(20.dp))
                .padding(horizontal = 20.dp, vertical = 10.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text(
                    text = "${(animatedFill * 1000).toInt() / 10f}%",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Black,
                    fontFamily = FontFamily.Monospace,
                    color = Color.White
                )
                Box(
                    modifier = Modifier
                        .width(1.dp)
                        .height(28.dp)
                        .background(Color.White.copy(alpha = 0.12f))
                )
                Column {
                    Text(
                        text = "CAPACITY",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF94A3B8),
                        letterSpacing = 1.2.sp
                    )
                    Text(
                        text = "${String.format("%.2f", currentGasKg)} KG NET",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.ExtraBold,
                        fontFamily = FontFamily.Monospace,
                        color = Color.White
                    )
                }
            }
        }
    }
}
