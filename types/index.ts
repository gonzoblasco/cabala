export interface Entry {
  id: string;
  photoPath: string;
  title?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  audioPath?: string;
  isIncognito: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface NotificationConfig {
  dailyCount: number;
  timeWindows: string[];
  enabled: boolean;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  durationDays: number;
  promptTemplate?: string;
  isActive: boolean;
  startedAt?: string;
}

export interface AppSettings {
  photoQuality: number;
  photoMaxWidth: number;
  theme: 'light' | 'dark' | 'system';
  language: string;
  backupEnabled: boolean;
  backupProvider?: 'icloud' | 'googledrive';
}
