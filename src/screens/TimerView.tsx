import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  BoltIcon,
  ChevronIcon,
  PauseIcon,
  PlayIcon,
  ResetIcon,
  SkipIcon,
} from '../components/Icons';
import { colors, withAlpha } from '../theme';
import { CYCLES_PER_SET, PhaseMeta } from '../types/pomodoro';

interface TimerViewProps {
  size: number;
  phaseMeta: PhaseMeta;
  formattedTimer: string;
  isRunning: boolean;
  demoMode: boolean;
  activeTaskTitle: string;
  completedInSet: number;
  onToggleStart: () => void;
  onReset: () => void;
  onSkipPhase: () => void;
  onCyclePhase: () => void;
  onToggleDemo: () => void;
  onOpenTasks: () => void;
}

export const TimerView: React.FC<TimerViewProps> = ({
  size,
  phaseMeta,
  formattedTimer,
  isRunning,
  demoMode,
  activeTaskTitle,
  completedInSet,
  onToggleStart,
  onReset,
  onSkipPhase,
  onCyclePhase,
  onToggleDemo,
  onOpenTasks,
}) => {
  const scale = size / 220;
  const setDots = Array.from({ length: CYCLES_PER_SET }, (_, i) => i < completedInSet);

  return (
    <View style={[styles.container, { width: size * 0.84 }]}>
      {/* Fila superior: Píldora de fase + switch rápido Modo Demo 10s */}
      <View style={[styles.phaseRow, { gap: Math.round(5 * scale) }]}>
        <Pressable
          onPress={onCyclePhase}
          style={[
            styles.phasePill,
            {
              paddingHorizontal: Math.round(9 * scale),
              paddingVertical: Math.round(3 * scale),
              backgroundColor: withAlpha(phaseMeta.color, 0.16),
              borderColor: withAlpha(phaseMeta.color, 0.55),
            },
          ]}
        >
          <View
            style={[
              styles.phaseDot,
              {
                width: Math.round(6 * scale),
                height: Math.round(6 * scale),
                borderRadius: Math.round(3 * scale),
                backgroundColor: phaseMeta.color,
              },
            ]}
          />
          <Text
            style={[
              styles.phaseText,
              { fontSize: Math.round(9 * scale), color: phaseMeta.color },
            ]}
          >
            {phaseMeta.label.toUpperCase()}
          </Text>
        </Pressable>

        <Pressable
          onPress={onToggleDemo}
          style={[
            styles.demoChip,
            {
              paddingHorizontal: Math.round(6 * scale),
              paddingVertical: Math.round(3 * scale),
              backgroundColor: demoMode ? withAlpha(colors.amber, 0.2) : colors.surface,
              borderColor: demoMode ? colors.amber : colors.border,
            },
          ]}
        >
          <BoltIcon
            size={Math.round(10 * scale)}
            color={demoMode ? colors.amber : colors.textDim}
          />
          <Text
            style={[
              styles.demoChipText,
              {
                fontSize: Math.round(8.5 * scale),
                color: demoMode ? colors.amber : colors.textDim,
              },
            ]}
          >
            {demoMode ? '10s' : '25m'}
          </Text>
        </Pressable>
      </View>

      {/* Dígitos centrales tipo cronógrafo Wear OS */}
      <Text
        style={[
          styles.timerDigits,
          {
            fontSize: Math.round(38 * scale),
            lineHeight: Math.round(42 * scale),
            marginVertical: Math.round(2 * scale),
          },
        ]}
      >
        {formattedTimer}
      </Text>

      {/* Indicador de serie Pomodoro (4 puntos) */}
      <View style={[styles.setDotsRow, { marginBottom: Math.round(4 * scale) }]}>
        {setDots.map((filled, idx) => (
          <View
            key={idx}
            style={[
              styles.setDot,
              {
                width: filled ? Math.round(12 * scale) : Math.round(5 * scale),
                height: Math.round(5 * scale),
                borderRadius: Math.round(3 * scale),
                backgroundColor: filled ? phaseMeta.color : '#2A2E38',
              },
            ]}
          />
        ))}
      </View>

      {/* Chip interactivo de tarea activa (tocar abre la lista de tareas) */}
      <Pressable
        onPress={onOpenTasks}
        style={[
          styles.taskChip,
          {
            paddingHorizontal: Math.round(9 * scale),
            paddingVertical: Math.round(3 * scale),
            marginBottom: Math.round(7 * scale),
            maxWidth: size * 0.72,
          },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[styles.taskChipText, { fontSize: Math.round(9 * scale) }]}
        >
          {activeTaskTitle}
        </Text>
        <ChevronIcon size={Math.round(11 * scale)} color={colors.textDim} />
      </Pressable>

      {/* Dock ergonómico de 3 controles con íconos vectoriales */}
      <View style={[styles.controlsRow, { gap: Math.round(8 * scale) }]}>
        <Pressable
          onPress={onReset}
          style={[
            styles.iconCircleBtn,
            {
              width: Math.round(30 * scale),
              height: Math.round(30 * scale),
              borderRadius: Math.round(15 * scale),
            },
          ]}
        >
          <ResetIcon size={Math.round(14 * scale)} color={colors.text} />
        </Pressable>

        <Pressable
          onPress={onToggleStart}
          style={[
            styles.playHeroBtn,
            {
              backgroundColor: phaseMeta.color,
              width: Math.round(54 * scale),
              height: Math.round(32 * scale),
              borderRadius: Math.round(16 * scale),
            },
          ]}
        >
          {isRunning ? (
            <PauseIcon size={Math.round(17 * scale)} color="#000000" />
          ) : (
            <PlayIcon size={Math.round(17 * scale)} color="#000000" />
          )}
        </Pressable>

        <Pressable
          onPress={onSkipPhase}
          style={[
            styles.iconCircleBtn,
            {
              width: Math.round(30 * scale),
              height: Math.round(30 * scale),
              borderRadius: Math.round(15 * scale),
            },
          ]}
        >
          <SkipIcon size={Math.round(14 * scale)} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phasePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  phaseDot: {},
  phaseText: {
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  demoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  demoChipText: {
    fontWeight: '800',
  },
  timerDigits: {
    color: colors.text,
    fontWeight: '800',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  setDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  setDot: {},
  taskChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  taskChipText: {
    color: colors.textDim,
    fontWeight: '600',
    flexShrink: 1,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleBtn: {
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playHeroBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
