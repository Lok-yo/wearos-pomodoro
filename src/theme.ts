// Paleta optimizada para pantallas OLED de smartwatch:
// fondo negro puro (píxeles apagados = ahorro de batería) y superficies muy oscuras.
export const colors = {
  bg: '#000000',
  surface: '#15171C',
  surfaceHigh: '#1F2228',
  border: '#2A2E36',
  text: '#F4F5F7',
  textDim: '#A0A6B0',
  textMute: '#626873',
  danger: '#FF5D5D',
  amber: '#FFC14D',
  mint: '#3DDC97',
};

export function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
