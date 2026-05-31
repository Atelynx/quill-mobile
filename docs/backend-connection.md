# Conexión con backend local

La app usa por defecto mocks. Para backend real configura:

```env
EXPO_PUBLIC_USE_MOCKS=false
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3000/api
EXPO_PUBLIC_SOCKET_URL=http://10.0.2.2:3000/realtime
```

En emulador Android, `10.0.2.2` apunta al computador anfitrión. En dispositivo físico, usa la IP LAN del computador, por ejemplo `http://192.168.1.20:3000/api`.

El backend debe permitir CORS para el cliente Expo y debe estar iniciado con MongoDB/Redis según su propia documentación. Si el backend no responde, vuelve a `EXPO_PUBLIC_USE_MOCKS=true`.
