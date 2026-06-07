# Conexión con backend local

La app usa por defecto mocks. Para backend real configura:

```env
EXPO_PUBLIC_USE_MOCKS=false
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3000/api
EXPO_PUBLIC_SOCKET_URL=http://10.0.2.2:3000/realtime
```

En emulador Android, `10.0.2.2` apunta al computador anfitrión. En dispositivo físico, usa la IP LAN del computador, por ejemplo `http://192.168.1.20:3000/api`.

El backend debe permitir CORS para el cliente Expo y debe estar iniciado con MongoDB/Redis según su propia documentación. Si el backend no responde, vuelve a `EXPO_PUBLIC_USE_MOCKS=true`.

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

## Fallback controlado

Con `EXPO_PUBLIC_FALLBACK_TO_MOCKS=true`, lecturas, watchlist y acciones sociales usan mocks si el backend falla. Login, cambios de credenciales y creación de órdenes no hacen fallback para evitar simular acciones sensibles en modo backend.

## Tipo de cambio USDCLP

Si el backend está con `CURRENCY_PROVIDER=none`, `GET /api/currency/rates/USDCLP` puede responder que la tasa no está disponible. En ese caso la app usa una tasa local estimada, muestra “Usando tasa estimada” y mantiene las demás consultas reales activas.

## Realtime

El socket usa `EXPO_PUBLIC_SOCKET_URL`, JWT en `auth.token` y suscripciones `{ topic, type }` para acciones y `USDCLP`. Si el socket falla, Mercado sigue funcionando con recarga manual.
