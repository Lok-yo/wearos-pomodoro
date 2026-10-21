import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { MoonIcon } from './Icons';

interface AmbientModeViewProps {
  size: number;
  clockTime: string;
  formattedTimer: string;
  phaseLabel: string;
  isRunning: boolean;
  activeTaskTitle: string;
  onExitAmbient: () => void;
}

export const AmbientModeView: React.FC<AmbientModeViewProps> = ({
  size,
  clockTime,
  formattedTimer,
  phaseLabel,
  isRunning,
  activeTaskTitle,
  onExitAmbient,
}) => {
  const scale = size / 220;

  return (
    <Pressable
      onPress={onExitAmbient}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <View
        style={[
          styles.thinRing,
          {
            width: size - 12,
            height: size - 12,
            borderRadius: (size - 12) / 2,
          },
        ]}
      >
        <View style={styles.topRow}>
          <MoonIcon size={Math.round(10 * scale)} color="#626873" />
          <Text style={[styles.clockText, { fontSize: Math.round(11 * scale) }]}>
            {clockTime}
          </Text>
        </View>

        <Text style={[styles.timerText, { fontSize: Math.round(40 * scale) }]}>
          {formattedTimer}
        </Text>

        <Text style={[styles.modeText, { fontSize: Math.round(9.5 * scale) }]}>
          {phaseLabel.toUpperCase()} • {isRunning ? 'ACTIVO' : 'PAUSA'}
        </Text>

        <Text
          numberOfLines={1}
          style={[styles.taskText, { fontSize: Math.round(8.5 * scale), maxWidth: size * 0.64 }]}
        >
          {activeTaskTitle}
        </Text>

        <Text style={[styles.wakeHint, { fontSize: Math.round(7.5 * scale) }]}>
          Toca para despertar
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thinRing: {
    borderWidth: 1,
    borderColor: '#232730',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  clockText: {
    color: '#8A919E',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  timerText: {
    color: '#D8DCE3',
    fontWeight: '200',
    letterSpacing: 1.5,
    fontVariant: ['tabular-nums'],
    marginVertical: 2,
  },
  modeText: {
    color: '#6E7582',
    fontWeight: '700',
    letterSpacing: 1,
  },
  taskText: {
    color: '#525866',
    marginTop: 3,
  },
  wakeHint: {
    color: '#383D47',
    marginTop: 7,
  },
});
