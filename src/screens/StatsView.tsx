import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BoltIcon, FlameIcon, PlusIcon } from '../components/Icons';
import { colors, withAlpha } from '../theme';
import { Settings, Stats } from '../types/pomodoro';

interface StatsViewProps {
  size: number;
  stats: Stats;
  settings: Settings;
  accentColor: string;
  onAddQuickPomodoro: () => void;
  onToggleDemo: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  size,
  stats,
  settings,
  accentColor,
  onAddQuickPomodoro,
  onToggleDemo,
}) => {
  const scale = size / 220;
  const segments = Array.from(
    { length: settings.dailyGoal },
    (_, idx) => idx < stats.completedToday
  );

  return (
    <View style={[styles.container, { width: size * 0.78 }]}>
      <Text style={[styles.headerTitle, { fontSize: Math.round(9 * scale) }]}>
        PROGRESO HOY • {stats.completedToday}/{settings.dailyGoal}
      </Text>

      {/* Barra segmentada de meta diaria */}
      <View style={[styles.segmentsRow, { marginVertical: Math.round(5 * scale) }]}>
        {segments.map((filled, idx) => (
          <View
            key={idx}
            style={[
              styles.segmentBar,
              {
                height: Math.round(6 * scale),
                borderRadius: Math.round(3 * scale),
                backgroundColor: filled ? accentColor : colors.surfaceHigh,
              },
            ]}
          />
        ))}
      </View>

      {/* Tarjetas compactas de métricas */}
      <View style={[styles.metricsRow, { gap: Math.round(5 * scale) }]}>
        <View style={[styles.metricBox, { paddingVertical: Math.round(4.5 * scale) }]}>
          <Text
            style={[
              styles.metricValue,
              { fontSize: Math.round(14 * scale), color: accentColor },
            ]}
          >
            {stats.completedToday}
          </Text>
          <Text style={[styles.metricLabel, { fontSize: Math.round(7.5 * scale) }]}>
            CICLOS
          </Text>
        </View>

        <View style={[styles.metricBox, { paddingVertical: Math.round(4.5 * scale) }]}>
          <Text
            style={[
              styles.metricValue,
              { fontSize: Math.round(14 * scale), color: colors.mint },
            ]}
          >
            {stats.focusMinutes}m
          </Text>
          <Text style={[styles.metricLabel, { fontSize: Math.round(7.5 * scale) }]}>
            MINUTOS
          </Text>
        </View>

        <View style={[styles.metricBox, { paddingVertical: Math.round(4.5 * scale) }]}>
          <View style={styles.streakRow}>
            <FlameIcon size={Math.round(12 * scale)} color={colors.amber} />
            <Text
              style={[
                styles.metricValue,
                { fontSize: Math.round(14 * scale), color: colors.amber },
              ]}
            >
              {stats.streakDays}d
            </Text>
          </View>
          <Text style={[styles.metricLabel, { fontSize: Math.round(7.5 * scale) }]}>
            RACHA
          </Text>
        </View>
      </View>

      {/* Acciones rápidas inferiores */}
      <View
        style={[
          styles.actionsRow,
          { marginTop: Math.round(6 * scale), gap: Math.round(5 * scale) },
        ]}
      >
        <Pressable
          onPress={onAddQuickPomodoro}
          style={[
            styles.actionBtn,
            {
              paddingHorizontal: Math.round(8 * scale),
              paddingVertical: Math.round(4 * scale),
              backgroundColor: withAlpha(accentColor, 0.16),
              borderColor: withAlpha(accentColor, 0.45),
            },
          ]}
        >
          <PlusIcon size={Math.round(10 * scale)} color={accentColor} />
          <Text
            style={[
              styles.actionBtnText,
              { fontSize: Math.round(8 * scale), color: colors.text },
            ]}
          >
            +25m
          </Text>
        </Pressable>

        <Pressable
          onPress={onToggleDemo}
          style={[
            styles.actionBtn,
            {
              paddingHorizontal: Math.round(8 * scale),
              paddingVertical: Math.round(4 * scale),
              backgroundColor: settings.demoMode
                ? withAlpha(colors.amber, 0.2)
                : colors.surface,
              borderColor: settings.demoMode ? colors.amber : colors.border,
            },
          ]}
        >
          <BoltIcon
            size={Math.round(10 * scale)}
            color={settings.demoMode ? colors.amber : colors.textDim}
          />
          <Text
            style={[
              styles.actionBtnText,
              {
                fontSize: Math.round(8 * scale),
                color: settings.demoMode ? colors.amber : colors.textDim,
              },
            ]}
          >
            {settings.demoMode ? 'Demo 10s ON' : 'Demo 10s OFF'}
          </Text>
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
  headerTitle: {
    color: colors.textDim,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  segmentsRow: {
    flexDirection: 'row',
    width: '88%',
    gap: 5,
  },
  segmentBar: {
    flex: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  metricBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  metricValue: {
    fontWeight: '900',
  },
  metricLabel: {
    color: colors.textDim,
    fontWeight: '700',
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  actionBtnText: {
    fontWeight: '800',
  },
});
