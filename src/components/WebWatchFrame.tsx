import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

interface WebWatchFrameProps {
  watchSize: number;
  children: React.ReactNode;
}

export const WebWatchFrame: React.FC<WebWatchFrameProps> = ({ watchSize, children }) => {
  // En Android / Emulador de Smartwatch ocupamos toda la pantalla nativa sin recortes
  if (Platform.OS !== 'web') {
    return <View style={styles.nativeContainer}>{children}</View>;
  }

  // En Web mostramos la caja rectangular redondeada tipo Apple Watch con corona lateral
  const width = watchSize;
  const height = Math.round(watchSize * 1.18);

  return (
    <View style={styles.webStage}>
      <Text style={styles.webTitle}>Smartwatch Timer • Vista Previa</Text>
      <View style={styles.strapTop} />
      <View style={styles.casingRow}>
        <View
          style={[
            styles.bezel,
            {
              width: width + 24,
              height: height + 24,
              borderRadius: 54,
            },
          ]}
        >
          <View
            style={[
              styles.screenClip,
              {
                width,
                height,
                borderRadius: 44,
              },
            ]}
          >
            {children}
          </View>
        </View>
        <View style={styles.crownColumn}>
          <View style={styles.crownButton} />
          <View style={styles.sidePusher} />
        </View>
      </View>
      <View style={styles.strapBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  nativeContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  webStage: {
    flex: 1,
    backgroundColor: '#0B0F17',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  webTitle: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 14,
  },
  strapTop: {
    width: 120,
    height: 42,
    backgroundColor: '#1E262B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  strapBottom: {
    width: 120,
    height: 42,
    backgroundColor: '#1E262B',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  casingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bezel: {
    backgroundColor: '#22272E',
    borderWidth: 3,
    borderColor: '#3A424D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 14,
  },
  screenClip: {
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  crownColumn: {
    marginLeft: -2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
    marginTop: -28,
  },
  crownButton: {
    width: 11,
    height: 40,
    backgroundColor: '#404954',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  sidePusher: {
    width: 6,
    height: 26,
    backgroundColor: '#303740',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
});
