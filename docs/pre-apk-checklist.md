# Checklist pre-APK

## Criterios de sesión

- La app siempre abre en Login al iniciar una ejecución nueva.
- No se restaura token ni sesión persistida para entrar automáticamente.
- No se inicia con usuario demo automáticamente, incluso si `EXPO_PUBLIC_USE_MOCKS=true`.
- El modo mock requiere login manual igual que backend real.
- Solo se recuerda el último correo usado para prellenar Login.
- La contraseña nunca se guarda ni se precarga.
- La sesión activa vive solo en memoria durante la ejecución actual después de un login manual exitoso.
- Al cerrar sesión se limpia la sesión activa y se vuelve a Login.
- Una sesión antigua guardada en `quill_mobile_session` se elimina al iniciar y no concede acceso.

## Railway sin modificar entorno

Ejecutar con variables inline:

```bash
EXPO_PUBLIC_USE_MOCKS=false \
EXPO_PUBLIC_FALLBACK_TO_MOCKS=false \
EXPO_PUBLIC_API_BASE_URL=https://quill-backend-production-70a1.up.railway.app/api \
EXPO_PUBLIC_SOCKET_URL=https://quill-backend-production-70a1.up.railway.app/realtime \
npm start
```

No modificar `.env` ni `.env.example` para esta validación.

## Checklist funcional

- App recién instalada muestra Login.
- No aparece usuario demo automático.
- No hay auto-login con sesión anterior.
- Último email se muestra precargado después de un login exitoso anterior.
- Contraseña inicia vacía siempre.
- Login manual exitoso permite entrar.
- Registro funciona y vuelve a Login.
- Cierre de sesión vuelve a Login.
- Cerrar y abrir la app vuelve a Login.
- Mercado carga cotizaciones.
- Historial de precio carga.
- Portfolio carga.
- Crear orden funciona.
- Cancelar orden pendiente funciona.
- Trades muestra operaciones o estado vacío.
- Watchlist agrega y quita símbolos.
- Perfil carga y permite editar datos.
- Amigos lista contactos, solicitudes y acciones disponibles.
- Realtime conecta o cae a recarga manual sin bloquear REST.
- Fallback `USDCLP` muestra “Usando tasa estimada.” cuando corresponde.
- Safe area respeta status bar, notch, bordes y navigation bar.
- Formularios funcionan con teclado abierto.
- Validar en Wi-Fi y, si aplica, con datos móviles.

## Moto Edge 50

1. Limpiar datos de Expo Go o reinstalar la app.
2. Abrir la app y confirmar Login.
3. Iniciar sesión real manualmente.
4. Navegar Market, Portfolio, Orders, History y User.
5. Cerrar completamente la app.
6. Abrir nuevamente y confirmar que vuelve a Login.
7. Confirmar email precargado y contraseña vacía.
8. Ingresar contraseña manualmente y entrar.
9. Cerrar sesión y confirmar que vuelve a Login.
10. Revisar bordes, status bar, navigation bar y teclado en formularios.

## Riesgos pendientes

- Confirmar eventos reales `price_update` desde Railway en celular físico.
- Confirmar comportamiento con red móvil y cambios de conectividad.
- Revisar formularios largos en pantallas pequeñas con teclado abierto.
- Confirmar que órdenes cambian de estado correctamente si backend ejecuta o cancela antes de la acción móvil.

## Comandos recomendados

```bash
npm run typecheck
npm test
```
