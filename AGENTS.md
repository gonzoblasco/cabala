# Cábala — Bitácora Visual

App mobile de 3 fotos por día, organizadas por ubicación y tiempo.

## Stack

- Expo SDK 57 + TypeScript
- expo-router (file-based routing)
- expo-sqlite (SQLite local)
- expo-camera + expo-image-manipulator
- expo-location + react-native-maps
- expo-av (notas de voz)
- expo-notifications

## Estructura

```
app/              # expo-router pages
components/       # UI components
db/               # Database layer (schema + queries)
hooks/            # Custom hooks
services/         # Business logic
types/            # TypeScript types
constants/        # Constants
utils/            # Utilities
```

## Estado

MVP en construcción. Ver `.knowledge/STATUS.md` para detalle.
