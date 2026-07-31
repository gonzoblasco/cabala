export const DEFAULT_PHOTO_QUALITY = 70;
export const DEFAULT_PHOTO_MAX_WIDTH = 1080;
export const DEFAULT_PHOTO_MAX_HEIGHT = 1920;
export const DEFAULT_DAILY_LIMIT = 3;
export const DEFAULT_TIME_WINDOWS = [
  '09:00-12:00',
  '13:00-16:00',
  '18:00-21:00',
];

export const COLORS = {
  background: '#0D0D0D',
  surface: '#1A1A1A',
  surfaceElevated: '#262626',
  textPrimary: '#F5F5F5',
  textSecondary: '#A3A3A3',
  accent: '#FF6B35',
  accentSecondary: '#4ECDC4',
  error: '#FF4757',
  success: '#2ED573',
} as const;

export const STORAGE_DIRS = {
  photos: 'photos',
  audio: 'audio',
} as const;
