import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { withAlpha } from '../theme';

interface CircularWatchProgressProps {
  size: number;
  strokeWidth: number;
  progress: number; // 0 a 1
  color: string;
}

const TICK_COUNT = 24;

export const CircularWatchProgress: React.FC<CircularWatchProgressProps> = ({
  size,
  strokeWidth,
  progress,
  color,
}) => {
  const center = size / 2;
  const padding = strokeWidth / 2 + 3;
  const radius = Math.max(12, center - padding);
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress));
  const strokeDashoffset = circumference * (1 - clamped);

  // Coordenadas de la punta del arco para dibujar el indicador luminoso
  const angleRad = (clamped * 360 - 90) * (Math.PI / 180);
  const tipX = center + radius * Math.cos(angleRad);
  const tipY = center + radius * Math.sin(angleRad);

  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => {
    const a = (i * (360 / TICK_COUNT) - 90) * (Math.PI / 180);
    const isMajor = i % 6 === 0;
    const innerR = radius - strokeWidth * 0.9 - (isMajor ? 3 : 1.5);
    const outerR = radius - strokeWidth * 0.9 + 1;
    return {
      key: i,
      x1: center + innerR * Math.cos(a),
      y1: center + innerR * Math.sin(a),
      x2: center + outerR * Math.cos(a),
      y2: center + outerR * Math.sin(a),
      isMajor,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]} pointerEvents="none">
      <Svg width={size} height={size}>
        {/* Marcas sutiles de bisel interno estilo cronógrafo Wear OS */}
        {ticks.map((t) => (
          <Line
            key={t.key}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.isMajor ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.09)'}
            strokeWidth={t.isMajor ? 1.5 : 1}
            strokeLinecap="round"
          />
        ))}

        {/* Pista circular de fondo */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={withAlpha(color, 0.16)}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Arco de progreso activo desde las 12 en punto */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />

        {/* Punto indicador en la punta del progreso */}
        {clamped > 0.01 && clamped < 0.995 ? (
          <Circle
            cx={tipX}
            cy={tipY}
            r={strokeWidth * 0.62}
            fill="#FFFFFF"
            stroke={color}
            strokeWidth={1.5}
          />
        ) : null}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
