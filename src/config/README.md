# Carpeta `config`

Contiene configuración leída desde variables públicas de Expo.

- `env.ts`: normaliza `EXPO_PUBLIC_USE_MOCKS`, URLs de API/socket y fallback a mocks.

La app usa esta carpeta para decidir si consume datos mock o backend real sin cambiar código.
