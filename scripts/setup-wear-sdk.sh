#!/usr/bin/env bash
set -eu

ANDROID_BASE="$HOME/Android"
JDK_DIR="$ANDROID_BASE/jdk-21"
SDK_DIR="$ANDROID_BASE/Sdk"

mkdir -p "$ANDROID_BASE" "$SDK_DIR/cmdline-tools"

echo "==> [1/4] Verificando JDK 21 portable en $JDK_DIR..."
if [ ! -x "$JDK_DIR/bin/java" ]; then
  mkdir -p "$JDK_DIR"
  JDK_URL="https://api.adoptium.net/v3/binary/latest/21/ga/linux/x64/jdk/hotspot/normal/eclipse"
  curl -L --fail "$JDK_URL" -o "$ANDROID_BASE/jdk21.tar.gz"
  tar -xzf "$ANDROID_BASE/jdk21.tar.gz" -C "$JDK_DIR" --strip-components=1
  rm -f "$ANDROID_BASE/jdk21.tar.gz"
fi

export JAVA_HOME="$JDK_DIR"
export ANDROID_HOME="$SDK_DIR"
export ANDROID_SDK_ROOT="$SDK_DIR"
export PATH="$JAVA_HOME/bin:$SDK_DIR/cmdline-tools/latest/bin:$SDK_DIR/platform-tools:$SDK_DIR/emulator:$PATH"

java -version

echo "==> [2/4] Verificando Android Command-Line Tools en $SDK_DIR..."
if [ ! -x "$SDK_DIR/cmdline-tools/latest/bin/sdkmanager" ]; then
  CMDLINE_URL="https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"
  curl -L --fail "$CMDLINE_URL" -o "$ANDROID_BASE/cmdline-tools.zip"
  rm -rf "$SDK_DIR/cmdline-tools/latest" "$SDK_DIR/cmdline-tools/cmdline-tools"
  unzip -q "$ANDROID_BASE/cmdline-tools.zip" -d "$SDK_DIR/cmdline-tools"
  mv "$SDK_DIR/cmdline-tools/cmdline-tools" "$SDK_DIR/cmdline-tools/latest"
  rm -f "$ANDROID_BASE/cmdline-tools.zip"
fi

echo "==> [3/4] Aceptando licencias e instalando paquetes de Android SDK + Wear OS..."
yes 2>/dev/null | sdkmanager --licenses >/dev/null || true

install_pkg() {
  local pkg="$1"
  local attempt=1
  while [ $attempt -le 4 ]; do
    echo "-> Instalando $pkg (intento $attempt)..."
    if sdkmanager "$pkg"; then
      echo "   [OK] $pkg instalado."
      return 0
    fi
    attempt=$((attempt + 1))
    sleep 3
  done
  return 1
}

WEAR_IMAGE="system-images;android-34;android-wear;x86_64"

install_pkg "platform-tools"
install_pkg "emulator"
install_pkg "platforms;android-36"
install_pkg "build-tools;36.0.0"
install_pkg "$WEAR_IMAGE"

echo "==> [4/4] Creando AVD de Smartwatch circular (WearOS_Round)..."
DEVICE_PROFILE="wearos_small_round"
if ! avdmanager list device | grep -q "$DEVICE_PROFILE"; then
  DEVICE_PROFILE="wear_round"
fi

echo "no" | avdmanager create avd \
  --force \
  --name "WearOS_Round" \
  --package "$WEAR_IMAGE" \
  --device "$DEVICE_PROFILE"

AVD_CONFIG="$HOME/.android/avd/WearOS_Round.avd/config.ini"
if [ -f "$AVD_CONFIG" ]; then
  sed -i 's/hw.keyboard=no/hw.keyboard=yes/g' "$AVD_CONFIG" || true
  if ! grep -q "hw.keyboard=" "$AVD_CONFIG"; then
    echo "hw.keyboard=yes" >> "$AVD_CONFIG"
  fi
fi

echo "✓ Entorno Wear OS y AVD 'WearOS_Round' listos en $SDK_DIR"
