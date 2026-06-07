# Quill Mobile

Aplicación Android de Quill construida con React Native, Expo Router y TypeScript. Replica las áreas principales del producto web con diseño móvil: registro con `username`, mercado con gráfico y watchlist, portafolio, órdenes con compra por monto, historial, usuario, amigos, temas y moneda CLP/USD.

## Stack

- Expo SDK 54
- React Native 0.81
- Expo Router
- TypeScript
- Jest Expo
- Socket.IO client preparado para realtime

## Estructura

- `app/`: rutas Expo Router y tabs inferiores.
- `src/api/`: cliente HTTP para backend real.
- `src/components/`: UI reutilizable.
- `src/config/`: lectura de variables `EXPO_PUBLIC_*`.
- `src/mocks/`: datos demo estables.
- `src/screens/`: pantallas principales.
- `src/services/`: repositorios mock/backend, validaciones y realtime.
- `src/state/`: sesión en memoria y moneda preferida.
- `src/theme/`: temas claro, oscuro y océano adaptados a React Native.
- `src/utils/`: formato de moneda, porcentaje y fechas.
- `docs/`: notas operativas adicionales.
- `__tests__/`: pruebas unitarias.

## Variables de entorno

Copia `.env.example` a `.env` si necesitas cambiar valores.

```env
EXPO_PUBLIC_USE_MOCKS=true
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000/realtime
EXPO_PUBLIC_FALLBACK_TO_MOCKS=true
```

## Modo mock

Es el modo por defecto. No requiere backend y usa datos locales de registro, perfil con `username`, mercado, watchlist, amigos, solicitudes, historial gráfico, portafolio, órdenes, operaciones y tasa `USDCLP`. La watchlist mock usa una fuente compartida para que Mercado y Usuario vean los mismos cambios.

```bash
npm install
npm start
```

`package-lock.json` queda versionado para que `npm ci` instale exactamente el árbol validado en revisión.

## Backend real

Configura `EXPO_PUBLIC_USE_MOCKS=false`. En emulador Android usa `10.0.2.2`:

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3000/api
EXPO_PUBLIC_SOCKET_URL=http://10.0.2.2:3000/realtime
```

En Android físico usa la IP LAN del computador. El backend debe estar levantado y permitir CORS para Expo.

Registro usa `POST /api/auth/register` con `fullName`, `email`, `password` y `username` opcional. Tras crear cuenta, la app vuelve al login para iniciar sesión manualmente, que coincide con el contrato actual del backend.

Perfil usa `GET/PATCH /api/users/me`, `PATCH /api/users/me/email` y `PATCH /api/users/me/password`. Watchlist usa `GET/POST /api/users/me/watchlist` y `DELETE /api/users/me/watchlist/:symbol`. Amigos usa `GET /api/users/me/friends`, `GET /api/users/me/friends/requests`, `POST/PATCH/DELETE /api/users/me/friends/:userId`.

Si `EXPO_PUBLIC_FALLBACK_TO_MOCKS=true`, las lecturas y funciones sociales/watchlist pueden caer a datos demo cuando el backend responde con error o una función aún no está disponible. Login, cambios de credenciales y creación de órdenes no se simulan en modo backend.

Si `/currency/rates/USDCLP` no está disponible porque el backend usa `CURRENCY_PROVIDER=none`, la app mantiene el resto de datos reales y usa una tasa estimada visible como fallback. Esa tasa no se muestra como dato real.

## Desarrollo Android

```bash
npm install
npm ci
npm run android
```

También puedes iniciar Expo y escanear el QR con Expo Go:

```bash
npm start
```

Para Expo Go SDK 54, mantén `expo` en `54.x` y no apliques actualizaciones que migren el SDK sin revisión.

## Generar APK

Requiere cuenta y configuración de Expo/EAS:

```bash
npx eas build -p android --profile preview
```

El perfil `preview` en `eas.json` genera APK para distribución interna. No publica la app.

## Validación

```bash
npm run lint
npm test
npm run typecheck
npx expo install --fix
npx expo start --clear
npm audit
```

## Limitaciones conocidas

- La sesión se guarda con `expo-secure-store`; no se guardan credenciales ni contraseñas.
- Realtime está integrado en Mercado para modo backend y mantiene recarga manual como fallback si el socket falla.
- Las conversiones CLP/USD usan la tasa backend, la tasa mock o el fallback estimado explícito.
- Usuario usa navegación interna local para evitar una pantalla larga; no agrega tabs ni rutas nuevas.
- La búsqueda global de usuarios por email/username queda pendiente porque no hay endpoint de búsqueda confirmado; la pantalla social permite operar con IDs conocidos y filtra localmente amigos existentes.
- La compra por monto calcula `quantity` en mobile y envía el contrato existente de órdenes; no envía un campo `amount`.
- El gráfico móvil usa una visualización nativa simple para Expo Go en vez de una librería pesada de charts.
- La generación de APK con EAS requiere login y configuración externa.
- `npm audit` mantiene vulnerabilidades moderadas transitivas de Expo/tooling; ver `docs/security-and-audit.md`.
