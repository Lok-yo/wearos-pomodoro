#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

export JAVA_HOME="$HOME/Android/jdk-21"
export ANDROID_HOME="$HOME/Android/Sdk"
export ANDROID_SDK_ROOT="$HOME/Android/Sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"

node ./scripts/configure-wearos.mjs
echo "sdk.dir=$ANDROID_HOME" > android/local.properties

echo "==> Compilando APK standalone de ChronoWear Pomodoro..."
cd android
./gradlew assembleDebug -PreactNativeArchitectures=x86_64 --no-daemon --console=plain
cd "$PROJECT_DIR"

APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"
echo "==> Esperando a que el Smartwatch Wear OS termine de encender..."
adb wait-for-device
until [ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ]; do
  sleep 2
done

echo "==> Instalando $APK_PATH en el Smartwatch Wear OS..."
adb install -r "$APK_PATH"

echo "==> Abriendo ChronoWear Pomodoro en el reloj..."
adb shell input keyevent KEYCODE_WAKEUP
adb shell wm dismiss-keyguard || true
adb shell am force-stop com.lokiyo.wearospomodoro
adb shell am start -n com.lokiyo.wearospomodoro/.MainActivity
echo "✓ Aplicación ejecutándose en el emulador Wear OS."
