# Carpeta `config`

Contiene configuración leída desde variables públicas de Expo.

- `env.ts`: normaliza variables, exige URLs backend en producción y limita fallback demo a desarrollo explícito. `EXPO_PUBLIC_SOCKET_URL` debe incluir el namespace Socket.IO `/realtime`.

Backend es el modo por defecto. Demo requiere `EXPO_PUBLIC_USE_MOCKS=true`; el fallback requiere opt-in y queda bloqueado en producción.
