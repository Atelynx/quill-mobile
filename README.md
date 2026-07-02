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
EXPO_PUBLIC_USE_MOCKS=false
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000/realtime
EXPO_PUBLIC_FALLBACK_TO_MOCKS=false
```

## Modo mock

Requiere activación explícita con `EXPO_PUBLIC_USE_MOCKS=true`. No requiere backend y usa datos locales de registro, perfil con `username`, mercado, watchlist, amigos, solicitudes, historial gráfico, portafolio, órdenes, operaciones y tasa `USDCLP`. La interfaz muestra claramente que son datos demo.

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

Para ejecutar contra Railway sin modificar `.env` ni `.env.example`, usa variables inline:

```bash
EXPO_PUBLIC_USE_MOCKS=false \
EXPO_PUBLIC_FALLBACK_TO_MOCKS=false \
EXPO_PUBLIC_API_BASE_URL=https://quill-backend-production-70a1.up.railway.app/api \
EXPO_PUBLIC_SOCKET_URL=https://quill-backend-production-70a1.up.railway.app/realtime \
npm start
```

`EXPO_PUBLIC_SOCKET_URL` debe incluir la ruta `/realtime`. No subas valores locales, tokens ni secretos a archivos versionados.

Realtime usa Socket.IO contra el namespace configurado en `EXPO_PUBLIC_SOCKET_URL`. Para Railway el valor esperado es `https://quill-backend-production-70a1.up.railway.app/realtime`; la app no agrega el namespace automáticamente. Si el socket no conecta, Mercado mantiene datos REST y muestra recarga manual disponible.

Registro usa `POST /api/auth/register` con `fullName`, `email`, `password` y `username` opcional. Tras crear cuenta, la app vuelve al login para iniciar sesión manualmente, que coincide con el contrato actual del backend.

Mercado usa `GET /api/market/status`, `GET /api/market/stocks` y `GET /api/market/stocks/:symbol/history?limit=24`. Si el estado de mercado falla, las cotizaciones e historial siguen cargando por REST.

Órdenes usa `GET /api/orders?status=PENDING`, `POST /api/orders` y `PATCH /api/orders/:id/cancel`. La cancelación solo se muestra para órdenes pendientes y recarga el listado al terminar.

Portafolio usa `GET /api/portfolio/summary`. Historial usa `GET /api/trades?limit=20` y muestra estado vacío cuando no hay ejecuciones confirmadas.

Perfil usa `GET/PATCH /api/users/me`, `PATCH /api/users/me/email` y `PATCH /api/users/me/password`. Watchlist usa `GET/POST /api/users/me/watchlist` y `DELETE /api/users/me/watchlist/:symbol`. Amigos usa `GET /api/users/me/friends`, `GET /api/users/me/friends/requests`, `POST/PATCH/DELETE /api/users/me/friends/:userId`.

La pantalla Usuario refresca el perfil real al entrar, conserva la sesión persistida al editar datos y muestra estados de carga, vacío, éxito y error en perfil, credenciales, watchlist y amigos. No existe búsqueda global confirmada de usuarios; el envío de solicitud requiere un `userId` conocido.

Fuera de producción, `EXPO_PUBLIC_FALLBACK_TO_MOCKS=true` habilita un respaldo demo visible solo para mercado, historial y tasa `USDCLP` ante fallos de transporte. Respuestas HTTP, perfil, portafolio, órdenes, trades, watchlist, acciones sociales y cualquier mutación siempre propagan el error real.

Si el backend real responde `404` o no entrega `USDCLP`, Mercado, Portafolio y Órdenes usan temporalmente una tasa estimada de 950 CLP/USD. La app muestra la advertencia “Usando tasa estimada.” para que la conversión no parezca un dato real confirmado. Para verificar si Railway ya entrega tasa real, revisa `GET https://quill-backend-production-70a1.up.railway.app/api/currency/rates/USDCLP`.

En producción el fallback queda deshabilitado aunque se solicite. Si se usa backend, `EXPO_PUBLIC_API_BASE_URL` y `EXPO_PUBLIC_SOCKET_URL` son obligatorias; su ausencia detiene el inicio con un error claro.

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

GitHub Actions ejecuta automáticamente `npm ci`, typecheck, tests y lint en cada push y pull request mediante el workflow `Mobile CI`. El workflow usa Node `20.19.4`, caché npm y un directorio `HOME` temporal escribible para Expo.
