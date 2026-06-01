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
  "password": "Demo123456!"
}
```

El backend responde con mensaje y correo. Después del registro, la app muestra el mensaje y vuelve al login para iniciar sesión.

## Tipo de cambio USDCLP

Si el backend está con `CURRENCY_PROVIDER=none`, `GET /api/currency/rates/USDCLP` puede responder que la tasa no está disponible. En ese caso la app usa una tasa local estimada, muestra “Usando tasa estimada” y mantiene las demás consultas reales activas.

## Realtime

El socket usa `EXPO_PUBLIC_SOCKET_URL`, JWT en `auth.token` y suscripciones `{ topic, type }` para acciones y `USDCLP`. Si el socket falla, Mercado sigue funcionando con recarga manual.
