import { colors } from '../theme';

export type Phase = 'focus' | 'short_break' | 'long_break';

export type TimerStatus = 'idle' | 'running' | 'paused';

export interface PhaseMeta {
  id: Phase;
  label: string;
  color: string;
}

export const PHASES: Record<Phase, PhaseMeta> = {
  focus: { id: 'focus', label: 'Enfoque', color: '#FF6B57' },
  short_break: { id: 'short_break', label: 'Descanso', color: colors.mint },
  long_break: { id: 'long_break', label: 'Descanso largo', color: '#5AB8FF' },
};

export const PHASE_ORDER: Phase[] = ['focus', 'short_break', 'long_break'];

/** Pomodoros por serie antes del descanso largo. */
export const CYCLES_PER_SET = 4;

/** Minutos nominales que suma cada pomodoro completado a las estadísticas. */
export const MINUTES_PER_POMODORO = 25;

export type Durations = Record<Phase, number>;

/** Duraciones en segundos. El modo demo permite mostrar un ciclo completo en segundos. */
export function getDurations(demoMode: boolean): Durations {
  return demoMode
    ? { focus: 10, short_break: 5, long_break: 8 }
    : { focus: 25 * 60, short_break: 5 * 60, long_break: 15 * 60 };
}

export interface Task {
  id: string;
  title: string;
  sessions: number;
  done: boolean;
}

export interface Stats {
  date: string;
  completedToday: number;
  focusMinutes: number;
  streakDays: number;
  lastActiveDate: string | null;
}

export interface Settings {
  demoMode: boolean;
  dailyGoal: number;
  vibration: boolean;
  autoAmbient: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  demoMode: false,
  dailyGoal: 4,
  vibration: true,
  autoAmbient: true,
};

export const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Práctica Wear OS', sessions: 2, done: false },
  { id: 't2', title: 'Estudiar React Native', sessions: 1, done: false },
  { id: 't3', title: 'Repasar Arquitectura', sessions: 0, done: false },
  { id: 't4', title: 'Documentar Proyecto', sessions: 1, done: true },
];

const pad = (n: number) => String(n).padStart(2, '0');

export function dateKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateKey(d);
}

/** Datos de ejemplo para la primera ejecución (para que la demo no se vea vacía). */
export function seedStats(): Stats {
  return {
    date: dateKey(),
    completedToday: 2,
    focusMinutes: 50,
    streakDays: 5,
    lastActiveDate: dateKey(),
  };
}

export function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

export function formatDuration(seconds: number): string {
  return seconds >= 60 ? `${Math.round(seconds / 60)} min` : `${seconds} s`;
}

export function formatClock(d: Date = new Date()): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
