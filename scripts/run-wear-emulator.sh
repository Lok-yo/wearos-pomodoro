#!/usr/bin/env bash
set -euo pipefail

export JAVA_HOME="$HOME/Android/jdk-21"
export ANDROID_HOME="$HOME/Android/Sdk"
export ANDROID_SDK_ROOT="$HOME/Android/Sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"

AVD_CONFIG="$HOME/.android/avd/WearOS_Round.avd/config.ini"
if [ -f "$AVD_CONFIG" ]; then
  sed -i 's/hw.device.name = wearos_small_round/hw.device.name = wearos_square/g' "$AVD_CONFIG" || true
  sed -i 's/hw.lcd.circular = true/hw.lcd.circular = false/g' "$AVD_CONFIG" || true
fi

echo "Iniciando emulador de Smartwatch Wear OS (formato cuadrado)..."
exec emulator -avd WearOS_Round -gpu swiftshader_indirect -no-snapshot-save -no-boot-anim "$@"
