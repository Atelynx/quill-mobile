# Quill Mobile

Aplicación Android de Quill construida con React Native, Expo Router y TypeScript. Replica las áreas principales del producto web con diseño móvil: mercado, portafolio, órdenes, historial, usuario y moneda CLP/USD.

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

Es el modo por defecto. No requiere backend y usa datos locales de mercado, portafolio, órdenes, operaciones, usuario demo y tasa `USDCLP`.

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
npx expo start --clear
npm audit
```

## Limitaciones conocidas

- La sesión se guarda con `expo-secure-store`; no se guardan credenciales ni contraseñas.
- Realtime está integrado en Mercado para modo backend y mantiene recarga manual como fallback.
- Las conversiones CLP/USD usan la tasa backend o el fallback mock, según modo.
- La generación de APK con EAS requiere login y configuración externa.
- `npm audit` mantiene vulnerabilidades moderadas transitivas de Expo/tooling; ver `docs/security-and-audit.md`.
