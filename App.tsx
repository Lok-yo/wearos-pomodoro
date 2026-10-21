import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  Vibration,
  View,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path, Rect } from 'react-native-svg';
import { WebWatchFrame } from './src/components/WebWatchFrame';
import { WheelMinutePicker } from './src/components/WheelMinutePicker';

type WatchMode = 'Rest' | 'Focus';

const DEFAULT_PRESET_MINUTES: [number, number, number] = [5, 10, 25];
const STORAGE_STATE_KEY = '@watch_timer_state_v2';

function formatWatchTimer(totalSeconds: number): string {
  const clamped = Math.max(0, Math.ceil(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function formatWatchClock(d: Date = new Date()): string {
  const hrs = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${hrs}:${mins}`;
}

export default function App() {
  const { width, height } = useWindowDimensions();

  const watchSize = useMemo(() => {
    if (Platform.OS === 'web') {
      return 280;
    }
    return Math.min(width || 192, height || 192);
  }, [width, height]);

  const scale = watchSize / 192;

  const [mode, setMode] = useState<WatchMode>('Rest');
  const [presetMinutes, setPresetMinutes] = useState<[number, number, number]>(
    DEFAULT_PRESET_MINUTES
  );
  // Duración recordada independientemente para Rest y para Focus
  const [modeDurationsSec, setModeDurationsSec] = useState<{
    Rest: number;
    Focus: number;
  }>({
    Rest: DEFAULT_PRESET_MINUTES[0] * 60,
    Focus: DEFAULT_PRESET_MINUTES[2] * 60,
  });

  const [remainingSec, setRemainingSec] = useState<number>(
    DEFAULT_PRESET_MINUTES[0] * 60
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [clockTime, setClockTime] = useState<string>(formatWatchClock());

  const endTimeRef = useRef<number | null>(null);
  const currentModeDurationSec = modeDurationsSec[mode];

  // Cargar preajustes y duraciones por modo guardadas
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_STATE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.presets) && parsed.presets.length === 3) {
            setPresetMinutes([
              Math.max(1, Math.min(59, Number(parsed.presets[0]) || 5)),
              Math.max(1, Math.min(59, Number(parsed.presets[1]) || 10)),
              Math.max(1, Math.min(59, Number(parsed.presets[2]) || 25)),
            ]);
          }
          if (parsed.modeDurationsSec) {
            const restSec = Number(parsed.modeDurationsSec.Rest) || 5 * 60;
            const focusSec = Number(parsed.modeDurationsSec.Focus) || 25 * 60;
            setModeDurationsSec({ Rest: restSec, Focus: focusSec });
            setRemainingSec(restSec);
          }
        }
      } catch {
        // Ignorar error de lectura
      }
    })();
  }, []);

  const persistConfig = (
    nextPresets: [number, number, number],
    nextModeDurations: { Rest: number; Focus: number }
  ) => {
    AsyncStorage.setItem(
      STORAGE_STATE_KEY,
      JSON.stringify({
        presets: nextPresets,
        modeDurationsSec: nextModeDurations,
      })
    ).catch(() => {});
  };

  useEffect(() => {
    const id = setInterval(() => {
      setClockTime(formatWatchClock());
    }, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!isRunning) {
      endTimeRef.current = null;
      return;
    }

    endTimeRef.current = Date.now() + remainingSec * 1000;

    const timer = setInterval(() => {
      if (!endTimeRef.current) return;
      const leftSec = (endTimeRef.current - Date.now()) / 1000;
      if (leftSec <= 0) {
        if (Platform.OS !== 'web') {
          Vibration.vibrate([0, 200, 100, 250]);
        }
        // Al terminar el tiempo, cambia de modo usando la duración guardada de ese modo y queda en pausa
        const nextMode: WatchMode = mode === 'Rest' ? 'Focus' : 'Rest';
        const nextDur = modeDurationsSec[nextMode];
        setIsRunning(false);
        endTimeRef.current = null;
        setMode(nextMode);
        setRemainingSec(nextDur);
      } else {
        setRemainingSec(leftSec);
      }
    }, 200);

    return () => clearInterval(timer);
  }, [isRunning, mode, modeDurationsSec]);

  const vibrateTap = (ms = 30) => {
    if (Platform.OS !== 'web') {
      Vibration.vibrate(ms);
    }
  };

  // Stop: detiene y reinicia a la duración guardada del modo actual (sin dar play)
  const handleStop = () => {
    vibrateTap();
    setIsRunning(false);
    endTimeRef.current = null;
    setRemainingSec(currentModeDurationSec);
  };

  // Play / Pause: ÚNICA acción (junto con el botón grande central) que inicia o pausa el reloj
  const handleTogglePlay = () => {
    vibrateTap();
    setIsRunning((prev) => !prev);
  };

  // Skip (▶|): cambia entre Rest y Focus restaurando la duración elegida de cada modo (sin dar play)
  const handleSkip = () => {
    vibrateTap();
    setIsRunning(false);
    endTimeRef.current = null;
    const nextMode: WatchMode = mode === 'Rest' ? 'Focus' : 'Rest';
    setMode(nextMode);
    setRemainingSec(modeDurationsSec[nextMode]);
  };

  // Tocar un botón de minutos (5m, 10m, 25m): guarda esa duración para el modo actual (Rest o Focus) sin dar play
  const handleSelectPreset = (minutes: number) => {
    vibrateTap();
    setIsRunning(false);
    endTimeRef.current = null;
    const secs = minutes * 60;
    const nextModeDurations = {
      ...modeDurationsSec,
      [mode]: secs,
    };
    setModeDurationsSec(nextModeDurations);
    setRemainingSec(secs);
    persistConfig(presetMinutes, nextModeDurations);
  };

  // Dejar pulsado un botón de minutos: abre el Wheel / Drum Picker (1m a 59m)
  const handleOpenWheelPicker = (slotIdx: number) => {
    vibrateTap(55);
    setIsRunning(false);
    endTimeRef.current = null;
    setEditingSlot(slotIdx);
  };

  const handleConfirmWheelMinutes = (newMinutes: number) => {
    if (editingSlot === null) return;
    vibrateTap(40);
    const updatedPresets: [number, number, number] = [...presetMinutes] as [
      number,
      number,
      number,
    ];
    updatedPresets[editingSlot] = newMinutes;
    setPresetMinutes(updatedPresets);

    const secs = newMinutes * 60;
    const nextModeDurations = {
      ...modeDurationsSec,
      [mode]: secs,
    };
    setModeDurationsSec(nextModeDurations);
    setRemainingSec(secs);
    setIsRunning(false);
    endTimeRef.current = null;
    setEditingSlot(null);
    persistConfig(updatedPresets, nextModeDurations);
  };

  const heroColor = mode === 'Rest' ? '#00C800' : '#FF3B30';

  const gap = Math.round(6 * scale);
  const topBtnHeight = Math.round(31 * scale);
  const heroHeight = Math.round(46 * scale);
  const bottomBtnHeight = Math.round(30 * scale);

  return (
    <WebWatchFrame watchSize={watchSize}>
      <StatusBar hidden />
      <View style={styles.screen}>
        {editingSlot !== null ? (
          <WheelMinutePicker
            scale={scale}
            initialMinutes={presetMinutes[editingSlot]}
            slotIndex={editingSlot}
            accentColor={heroColor}
            onCancel={() => setEditingSlot(null)}
            onConfirm={handleConfirmWheelMinutes}
          />
        ) : (
          <View
            style={[
              styles.safeCluster,
              {
                width: Math.round(150 * scale),
                gap: Math.round(6 * scale),
              },
            ]}
          >
            {/* Hora arriba a la derecha */}
            <View
              style={[
                styles.clockRow,
                { paddingRight: Math.round(18 * scale), marginBottom: -2 },
              ]}
            >
              <Text style={[styles.clockText, { fontSize: Math.round(12 * scale) }]}>
                {clockTime}
              </Text>
            </View>

            {/* FILA 1: Stop | Play/Pause | Skip */}
            <View style={[styles.topRow, { gap, height: topBtnHeight }]}>
              <Pressable
                onPress={handleStop}
                style={({ pressed }) => [
                  styles.stopButton,
                  {
                    borderRadius: topBtnHeight / 2,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text style={[styles.stopText, { fontSize: Math.round(13 * scale) }]}>
                  Stop
                </Text>
              </Pressable>

              <Pressable
                onPress={handleTogglePlay}
                style={({ pressed }) => [
                  styles.iconSquircle,
                  {
                    borderRadius: Math.round(13 * scale),
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                {isRunning ? (
                  <Svg
                    width={Math.round(13 * scale)}
                    height={Math.round(13 * scale)}
                    viewBox="0 0 24 24"
                  >
                    <Rect x="5.5" y="4" width="4.5" height="16" rx="1.2" fill="#FFFFFF" />
                    <Rect x="14" y="4" width="4.5" height="16" rx="1.2" fill="#FFFFFF" />
                  </Svg>
                ) : (
                  <Svg
                    width={Math.round(13 * scale)}
                    height={Math.round(13 * scale)}
                    viewBox="0 0 24 24"
                  >
                    <Path d="M7 4.5v15l12-7.5L7 4.5z" fill="#FFFFFF" />
                  </Svg>
                )}
              </Pressable>

              <Pressable
                onPress={handleSkip}
                style={({ pressed }) => [
                  styles.iconSquircle,
                  {
                    borderRadius: Math.round(13 * scale),
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Svg
                  width={Math.round(15 * scale)}
                  height={Math.round(15 * scale)}
                  viewBox="0 0 24 24"
                >
                  <Path d="M4.5 5v14l11-7-11-7zm12.5 0v14h3V5h-3z" fill="#FFFFFF" />
                </Svg>
              </Pressable>
            </View>

            {/* FILA 2: Cápsula gigante central (Rest / Focus + Tiempo) -> Tocar inicia/pausa */}
            <Pressable
              onPress={handleTogglePlay}
              style={({ pressed }) => [
                styles.heroCapsule,
                {
                  width: Math.round(162 * scale),
                  height: heroHeight,
                  borderRadius: heroHeight / 2,
                  backgroundColor: heroColor,
                  opacity: pressed ? 0.92 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.heroLabel,
                  {
                    fontSize: Math.round(14 * scale),
                    lineHeight: Math.round(16.5 * scale),
                  },
                ]}
              >
                {mode}
              </Text>
              <Text
                style={[
                  styles.heroTimer,
                  {
                    fontSize: Math.round(16.5 * scale),
                    lineHeight: Math.round(19 * scale),
                  },
                ]}
              >
                {formatWatchTimer(remainingSec)}
              </Text>
            </Pressable>

            {/* FILA 3: Botones 5m | 10m | 25m */}
            <View
              style={[
                styles.bottomRow,
                {
                  width: Math.round(142 * scale),
                  gap,
                  height: bottomBtnHeight,
                },
              ]}
            >
              {presetMinutes.map((mins, idx) => {
                const isSelected =
                  !isRunning && Math.round(currentModeDurationSec / 60) === mins;
                return (
                  <Pressable
                    key={idx}
                    onPress={() => handleSelectPreset(mins)}
                    onLongPress={() => handleOpenWheelPicker(idx)}
                    delayLongPress={320}
                    style={({ pressed }) => [
                      styles.presetButton,
                      {
                        borderRadius: Math.round(13 * scale),
                        backgroundColor: isSelected ? '#536970' : SLATE_BG,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.presetText,
                        { fontSize: Math.round(12 * scale) },
                      ]}
                    >
                      {mins}m
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </WebWatchFrame>
  );
}

const SLATE_BG = '#43555B';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeCluster: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockRow: {
    width: '100%',
    alignItems: 'flex-end',
  },
  clockText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.4,
    fontVariant: ['tabular-nums'],
  },
  topRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  stopButton: {
    flex: 1.65,
    backgroundColor: SLATE_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopText: {
    color: '#FF5A4E',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  iconSquircle: {
    flex: 0.95,
    backgroundColor: SLATE_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCapsule: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  heroTimer: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.4,
    fontVariant: ['tabular-nums'],
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  presetButton: {
    flex: 1,
    backgroundColor: SLATE_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
