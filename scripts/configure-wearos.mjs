import fs from 'node:fs';
import path from 'node:path';

const manifestPath = path.resolve('android/app/src/main/AndroidManifest.xml');

if (!fs.existsSync(manifestPath)) {
  console.log('AndroidManifest.xml no encontrado aún. Ejecuta primero npx expo prebuild --platform android.');
  process.exit(0);
}

let xml = fs.readFileSync(manifestPath, 'utf8');

// 1. Declarar soporte de hardware de smartwatch Wear OS (required="false" permite correr tanto en reloj como en teléfono)
if (!xml.includes('android.hardware.type.watch')) {
  xml = xml.replace(
    '<application',
    '  <uses-feature android:name="android.hardware.type.watch" android:required="false"/>\n  <uses-permission android:name="android.permission.WAKE_LOCK"/>\n  <application'
  );
}

// 2. Declarar meta-data de app standalone de Wear OS (no requiere teléfono emparejado)
if (!xml.includes('com.google.android.wearable.standalone')) {
  xml = xml.replace(
    '<application',
    '<application'
  );
  xml = xml.replace(
    '</application>',
    '    <meta-data android:name="com.google.android.wearable.standalone" android:value="true"/>\n  </application>'
  );
}

fs.writeFileSync(manifestPath, xml, 'utf8');
console.log('✓ AndroidManifest.xml configurado para Smartwatch (Wear OS standalone).');
