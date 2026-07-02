# Conexión con backend

La app usa backend por defecto. Configura sus URLs:

```env
EXPO_PUBLIC_USE_MOCKS=false
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3000/api
EXPO_PUBLIC_SOCKET_URL=http://10.0.2.2:3000/realtime
```

En emulador Android, `10.0.2.2` apunta al computador anfitrión. En dispositivo físico, usa la IP LAN del computador, por ejemplo `http://192.168.1.20:3000/api`.

El backend debe permitir CORS para el cliente Expo y debe estar iniciado con MongoDB/Redis según su propia documentación. Para una demo local explícita usa `EXPO_PUBLIC_USE_MOCKS=true`.

## Railway

Para apuntar al backend público de Railway sin tocar `.env` ni `.env.example`, inicia Expo con variables inline:

```bash
EXPO_PUBLIC_USE_MOCKS=false \
EXPO_PUBLIC_FALLBACK_TO_MOCKS=false \
EXPO_PUBLIC_API_BASE_URL=https://quill-backend-production-70a1.up.railway.app/api \
EXPO_PUBLIC_SOCKET_URL=https://quill-backend-production-70a1.up.railway.app/realtime \
npm start
```

`EXPO_PUBLIC_API_BASE_URL` debe incluir `/api`. `EXPO_PUBLIC_SOCKET_URL` debe incluir `/realtime`, porque el cliente Socket.IO usa esa URL completa para conectarse. No guardes URLs locales, tokens ni secretos en archivos versionados.

## Registro y sesión

El registro real envía:

```json
{
  "fullName": "Usuario Demo",
  "email": "demo@quill.local",
  "password": "Demo123456!",
  "username": "usuario_demo"
}
```

`username` es opcional. Si el backend lo autogenera o lo devuelve después del login/perfil, la app lo conserva en sesión. Después del registro, la app muestra el mensaje y vuelve al login para iniciar sesión.

## Perfil, watchlist y amigos

La app usa endpoints confirmados del backend:

- `GET /api/market/status`: muestra si el mercado está abierto y sus horarios.
- `GET /api/market/stocks`: lista cotizaciones.
- `GET /api/market/stocks/:symbol/history?limit=24`: carga historial para gráfico.
- `GET /api/portfolio/summary`: carga balance, posiciones y resultado no realizado.
- `GET /api/orders?status=PENDING`: lista órdenes pendientes.
- `POST /api/orders`: crea órdenes `MARKET` o `LIMIT`.
- `PATCH /api/orders/:id/cancel`: cancela órdenes pendientes.
- `GET /api/trades?limit=20`: lista operaciones ejecutadas.
- `GET /api/users/me`: restaura perfil con `username`, `watchlist`, saldos y correo.
- `PATCH /api/users/me`: actualiza `fullName` y `username`.
- `PATCH /api/users/me/email`: cambia correo con contraseña actual.
- `PATCH /api/users/me/password`: cambia contraseña.
- `GET /api/users/me/watchlist`: lista símbolos seguidos con cotizaciones.
- `POST /api/users/me/watchlist`: agrega `{ "symbols": ["AAPL.US"] }`.
- `DELETE /api/users/me/watchlist/:symbol`: quita un símbolo.
- `GET /api/users/me/friends`: lista amigos.
- `GET /api/users/me/friends/requests`: lista solicitudes recibidas.
- `POST/PATCH/DELETE /api/users/me/friends/:userId`: envía, acepta/rechaza o elimina relación.

No hay endpoint confirmado de búsqueda global por email o username. La pantalla social filtra localmente amigos existentes y permite enviar solicitud si se conoce el `userId`.

## Funciones de usuario

Mercado muestra estado abierto/cerrado, cotizaciones, historial y watchlist. El estado de mercado es secundario: si falla, no bloquea cotizaciones ni historial.

Órdenes lista pendientes, permite crear órdenes y cancelar órdenes pendientes. La app no inventa estados: si el backend rechaza la cancelación, muestra el mensaje de error recibido.

Portafolio carga resumen y posiciones aunque `USDCLP` use tasa estimada. Historial de operaciones muestra trades recientes o un estado vacío cuando no hay ejecuciones.

Usuario refresca `GET /api/users/me` al abrir el centro de cuenta y actualiza la sesión local después de `PATCH /api/users/me`. El cambio de correo y contraseña muestra el resultado del backend; si el backend devuelve un error de sesión, se muestra claramente y el gestor de sesión limpia credenciales cuando corresponde.

Watchlist usa símbolos exactos del mercado y sincroniza la lista persistida del usuario después de agregar o quitar símbolos. Amigos lista contactos, solicitudes pendientes y permite aceptar, rechazar o eliminar relaciones existentes. La app no implementa búsqueda global de usuarios porque no hay endpoint confirmado.

## Fallback controlado

Fuera de producción, `EXPO_PUBLIC_FALLBACK_TO_MOCKS=true` habilita fallback visible solo para mercado, historial y tasa `USDCLP` ante fallos de transporte. Errores HTTP y mutaciones nunca se convierten en respuestas demo. En producción este fallback queda deshabilitado.

## Tipo de cambio USDCLP

Si `GET /api/currency/rates/USDCLP` responde `404` o no entrega una tasa utilizable, Mercado, Portafolio y Órdenes siguen cargando sus datos principales y usan una tasa estimada visible de 950 CLP/USD. La advertencia mostrada es “Usando tasa estimada.”.

Esta tasa no usa mocks de mercado ni reemplaza respuestas reales del backend. Solo evita bloquear conversiones CLP/USD mientras Railway no entregue `USDCLP`. Para confirmar que Railway ya entrega tasa real, revisa:

```bash
curl https://quill-backend-production-70a1.up.railway.app/api/currency/rates/USDCLP
```

## Realtime

El socket usa `EXPO_PUBLIC_SOCKET_URL`, JWT en `auth.token` y suscripciones `{ topic, type }` para acciones y `USDCLP`. La URL debe apuntar al namespace Socket.IO completo `/realtime`; la app no lo agrega automáticamente para evitar ambigüedad entre entornos.

Estados esperados:

- `Tiempo real conectado`: Socket.IO conectó y puede recibir `price_update`.
- `Actualización manual disponible`: el socket está desconectado, falló o no se habilitó; Mercado sigue usando REST.

Diagnóstico rápido:

1. Confirma que `EXPO_PUBLIC_USE_MOCKS=false`.
2. Confirma que `EXPO_PUBLIC_SOCKET_URL` termine en `/realtime`.
3. Inicia sesión para que el socket reciba JWT en `auth.token`.
4. Abre Mercado y verifica que las cotizaciones REST carguen aunque Socket.IO falle.
5. Si el backend emite `price_update`, revisa que cambien precios o `USDCLP` sin recargar.
