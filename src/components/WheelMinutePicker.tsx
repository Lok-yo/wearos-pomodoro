import React, { useEffect, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';

interface WheelMinutePickerProps {
  scale: number;
  initialMinutes: number;
  slotIndex: number;
  accentColor: string;
  onCancel: () => void;
  onConfirm: (minutes: number) => void;
}

const MINUTES = Array.from({ length: 59 }, (_, i) => i + 1);

export const WheelMinutePicker: React.FC<WheelMinutePickerProps> = ({
  scale,
  initialMinutes,
  slotIndex,
  accentColor,
  onCancel,
  onConfirm,
}) => {
  const itemHeight = Math.round(28 * scale);
  const wheelHeight = itemHeight * 3;
  const scrollRef = useRef<ScrollView>(null);

  const clampedInit = Math.max(1, Math.min(59, initialMinutes));
  const [selectedMin, setSelectedMin] = useState<number>(clampedInit);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: (clampedInit - 1) * itemHeight,
        animated: false,
      });
    }, 40);
    return () => clearTimeout(timer);
  }, [clampedInit, itemHeight]);

  const updateFromOffset = (offsetY: number) => {
    const idx = Math.round(offsetY / itemHeight);
    const nextMin = Math.max(1, Math.min(59, idx + 1));
    if (nextMin !== selectedMin) {
      setSelectedMin(nextMin);
      if (Platform.OS !== 'web') {
        Vibration.vibrate(10);
      }
    }
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    updateFromOffset(e.nativeEvent.contentOffset.y);
  };

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.max(
      0,
      Math.min(58, Math.round(e.nativeEvent.contentOffset.y / itemHeight))
    );
    const nextMin = idx + 1;
    setSelectedMin(nextMin);
    scrollRef.current?.scrollTo({ y: idx * itemHeight, animated: true });
  };

  const stepBy = (delta: number) => {
    const nextMin = Math.max(1, Math.min(59, selectedMin + delta));
    setSelectedMin(nextMin);
    scrollRef.current?.scrollTo({
      y: (nextMin - 1) * itemHeight,
      animated: true,
    });
    if (Platform.OS !== 'web') {
      Vibration.vibrate(15);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: Math.round(154 * scale),
          gap: Math.round(5 * scale),
        },
      ]}
    >
      <Text style={[styles.title, { fontSize: Math.round(10 * scale) }]}>
        BOTÓN #{slotIndex + 1} • MINUTOS
      </Text>

      {/* Tambor / Slot Machine central con botones de paso rápido a los lados */}
      <View style={[styles.drumRow, { gap: Math.round(6 * scale) }]}>
        <Pressable
          onPress={() => stepBy(-1)}
          onLongPress={() => stepBy(-5)}
          style={({ pressed }) => [
            styles.stepBtn,
            {
              width: Math.round(26 * scale),
              height: Math.round(26 * scale),
              borderRadius: Math.round(13 * scale),
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Text style={[styles.stepBtnText, { fontSize: Math.round(14 * scale) }]}>
            −
          </Text>
        </Pressable>

        <View
          style={[
            styles.drumWindow,
            {
              width: Math.round(82 * scale),
              height: wheelHeight,
              borderRadius: Math.round(14 * scale),
            },
          ]}
        >
          {/* Ventana central iluminada estilo Slot Machine / WatchOS Drum */}
          <View
            pointerEvents="none"
            style={[
              styles.selectionHighlight,
              {
                top: itemHeight,
                height: itemHeight,
                borderRadius: Math.round(9 * scale),
                borderColor: accentColor,
              },
            ]}
          />

          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={itemHeight}
            decelerationRate="fast"
            bounces={false}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleMomentumEnd}
            onScrollEndDrag={handleMomentumEnd}
            scrollEventThrottle={16}
            contentContainerStyle={{
              paddingVertical: itemHeight,
            }}
          >
            {MINUTES.map((m) => {
              const distance = Math.abs(m - selectedMin);
              const isCenter = distance === 0;
              return (
                <Pressable
                  key={m}
                  onPress={() => stepBy(m - selectedMin)}
                  style={[styles.wheelItem, { height: itemHeight }]}
                >
                  <Text
                    style={[
                      styles.wheelItemText,
                      {
                        fontSize: Math.round((isCenter ? 16 : 11.5) * scale),
                        color: isCenter ? '#FFFFFF' : '#7D8B91',
                        opacity: distance === 0 ? 1 : distance === 1 ? 0.55 : 0.25,
                        transform: [{ scale: isCenter ? 1 : 0.86 }],
                      },
                    ]}
                  >
                    {m}m
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <Pressable
          onPress={() => stepBy(1)}
          onLongPress={() => stepBy(5)}
          style={({ pressed }) => [
            styles.stepBtn,
            {
              width: Math.round(26 * scale),
              height: Math.round(26 * scale),
              borderRadius: Math.round(13 * scale),
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Text style={[styles.stepBtnText, { fontSize: Math.round(14 * scale) }]}>
            +
          </Text>
        </Pressable>
      </View>

      {/* Botones inferiores: Cancelar | Guardar */}
      <View
        style={[
          styles.actionsRow,
          {
            width: Math.round(140 * scale),
            height: Math.round(27 * scale),
            gap: Math.round(6 * scale),
          },
        ]}
      >
        <Pressable
          onPress={onCancel}
          style={({ pressed }) => [
            styles.cancelBtn,
            {
              borderRadius: Math.round(13.5 * scale),
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text style={[styles.cancelText, { fontSize: Math.round(11 * scale) }]}>
            Cancel
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onConfirm(selectedMin)}
          style={({ pressed }) => [
            styles.okBtn,
            {
              backgroundColor: accentColor,
              borderRadius: Math.round(13.5 * scale),
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[styles.okText, { fontSize: Math.round(11 * scale) }]}>
            OK ({selectedMin}m)
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
  title: {
    color: '#9BA8AE',
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  drumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtn: {
    backgroundColor: '#2D3A3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  drumWindow: {
    backgroundColor: '#1B2428',
    overflow: 'hidden',
    position: 'relative',
  },
  selectionHighlight: {
    position: 'absolute',
    left: 4,
    right: 4,
    backgroundColor: 'rgba(67, 85, 91, 0.55)',
    borderWidth: 1.5,
    zIndex: 2,
  },
  wheelItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelItemText: {
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#43555B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#FF5A4E',
    fontWeight: '700',
  },
  okBtn: {
    flex: 1.35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  okText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
