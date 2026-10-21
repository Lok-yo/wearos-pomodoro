import React from 'react';
import Svg, { Path } from 'react-native-svg';

export interface IconProps {
  size?: number;
  color?: string;
}

// Íconos vectoriales (viewBox 24x24) para que se vean nítidos en cualquier densidad de reloj.
function createIcon(d: string, name: string) {
  const Icon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={d} fill={color} />
    </Svg>
  );
  Icon.displayName = name;
  return Icon;
}

export const PlayIcon = createIcon(
  'M8 5.5v13a1 1 0 0 0 1.53.85l10.2-6.5a1 1 0 0 0 0-1.7L9.53 4.65A1 1 0 0 0 8 5.5z',
  'PlayIcon'
);

export const PauseIcon = createIcon(
  'M7 5h3.2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm6.8 0H17a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-3.2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  'PauseIcon'
);

export const ResetIcon = createIcon(
  'M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z',
  'ResetIcon'
);

export const SkipIcon = createIcon('M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z', 'SkipIcon');

export const CheckIcon = createIcon(
  'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  'CheckIcon'
);

export const ChevronIcon = createIcon(
  'M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
  'ChevronIcon'
);

export const FlameIcon = createIcon(
  'M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z',
  'FlameIcon'
);

export const MoonIcon = createIcon(
  'M12.34 2.02C6.59 1.82 2 6.42 2 12c0 5.52 4.48 10 10 10 3.71 0 6.93-2.02 8.66-5.02-7.51-.25-12.09-8.43-8.32-14.96z',
  'MoonIcon'
);

export const BoltIcon = createIcon('M7 2v11h3v9l7-12h-4l4-8z', 'BoltIcon');

export const PlusIcon = createIcon('M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z', 'PlusIcon');

export const MinusIcon = createIcon('M19 13H5v-2h14v2z', 'MinusIcon');
