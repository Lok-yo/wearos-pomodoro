#!/usr/bin/env bash
set -euo pipefail

export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$ANDROID_HOME/platform-tools:$PATH"

OUT_DIR="/home/lokiyo/.gemini/antigravity-cli/brain/0ab68c9f-2bcf-4bf7-b985-26d94e53c093"

adb shell input keyevent KEYCODE_WAKEUP
adb shell wm dismiss-keyguard || true
sleep 2

# 1. Captura en modo Rest (5:00 en pausa con botones 5m | 10m | 25m)
adb exec-out screencap -p > "$OUT_DIR/watch_rest.png"
echo "Capturada: watch_rest.png"

# 2. Tocar botón Skip (▶|) arriba a la derecha (x=305, y=118) -> Cambia a Focus 25:00 SIN dar play
adb shell input tap 305 118
sleep 1
adb exec-out screencap -p > "$OUT_DIR/watch_focus.png"
echo "Capturada: watch_focus.png"

# 3. Dejar pulsado el botón central (10m en x=192, y=292 durante 650ms) para abrir el Wheel/Drum Picker (1m..59m)
adb shell input swipe 192 292 192 292 650
sleep 1
# Girar un poco el tambor hacia abajo (swipe vertical en el centro del rodillo)
adb shell input swipe 192 210 192 140 250
sleep 1
adb exec-out screencap -p > "$OUT_DIR/watch_wheel_picker.png"
echo "Capturada: watch_wheel_picker.png"

# 4. Cerrar el picker tocando Cancel (x=115, y=288) y volver a Rest (x=305, y=118)
adb shell input tap 115 288
sleep 1
adb shell input tap 305 118
echo "✓ Capturas completadas."
