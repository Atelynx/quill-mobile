# Auditoría de paridad web/mobile

Fecha: 2026-07-02  
Alcance: funciones de usuario normal de Quill web y Quill mobile contra backend Railway.  
Exclusiones: panel admin, configuración admin, snapshots admin, stocks admin y gestión de roles admin.

## Resumen ejecutivo

Quill Mobile tiene paridad funcional razonable con el frontend web para los flujos principales de usuario normal: autenticación, mercado, portfolio, órdenes, trades, watchlist, perfil, configuración de cuenta y social. La app móvil usa los mismos endpoints REST principales que la web y agrega protecciones operativas móviles, como fallback visible para `USDCLP` y continuidad por REST cuando Socket.IO falla.

Las brechas relevantes antes de APK no son de endpoints críticos, sino de validación en dispositivo físico: comportamiento de Expo/Android con Railway, Socket.IO en namespace `/realtime`, persistencia de sesión, formularios con teclado móvil, y confirmación real de eventos `price_update`.

## Tabla de paridad

| Funcionalidad | Existe en web | Existe en mobile | Endpoint backend | Estado | Observaciones |
|---|---:|---:|---|---|---|
| Login | Sí | Sí | `POST /api/auth/login` | Completo | Mobile persiste sesión con almacenamiento seguro. |
| Registro | Sí | Sí | `POST /api/auth/register` | Completo | Mobile vuelve a login después de registrar, alineado con contrato actual. |
| Restaurar perfil | Sí | Sí | `GET /api/users/me` | Completo | Mobile refresca perfil en Usuario y normaliza `username`/`watchlist`. |
| Editar perfil | Sí | Sí | `PATCH /api/users/me` | Completo | Mobile actualiza sesión local tras guardar. |
| Cambiar email | Sí | Sí | `PATCH /api/users/me/email` | Completo | Requiere contraseña actual. Validar UX en teclado móvil. |
| Cambiar contraseña | Sí | Sí | `PATCH /api/users/me/password` | Completo | Requiere contraseña actual. |
| Estado de mercado | Sí | Sí | `GET /api/market/status` | Completo | En mobile es secundario: si falla, no bloquea cotizaciones. |
| Cotizaciones | Sí | Sí | `GET /api/market/stocks` | Completo | Mobile muestra lista, moneda preferida y watchlist. |
| Historial de precio | Sí | Sí | `GET /api/market/stocks/:symbol/history?limit=24` | Completo | Mobile usa gráfico nativo simple. |
| Realtime de mercado | Sí | Sí | Socket.IO `/realtime`, `price_update` | Requiere validación física | Mobile exige `EXPO_PUBLIC_SOCKET_URL` con `/realtime` y conserva REST si falla. |
| Tasa `USDCLP` real | Sí | Sí | `GET /api/currency/rates/USDCLP` | Con fallback | Si Railway responde `404` o vacío, mobile usa 950 CLP/USD con advertencia visible. |
| Portfolio | Sí | Sí | `GET /api/portfolio/summary` | Completo | Mobile no bloquea portfolio por fallo de `USDCLP`. |
| Crear orden | Sí | Sí | `POST /api/orders` | Completo | Mobile soporta `MARKET`, `LIMIT`, cantidad y compra por monto calculada localmente. |
| Órdenes pendientes | Sí | Sí | `GET /api/orders?status=PENDING` | Completo | Mobile muestra empty/error/loading. |
| Cancelar orden | Sí | Sí | `PATCH /api/orders/:id/cancel` | Completo | Mobile muestra acción solo en pendientes y recarga listado. |
| Trades | Sí | Sí | `GET /api/trades?limit=20` | Completo | Mobile los muestra en Historial con estado vacío. |
| Watchlist en mercado | Sí | Sí | `POST /api/users/me/watchlist`, `DELETE /api/users/me/watchlist/:symbol` | Completo | Mobile sincroniza sesión local tras cambios. |
| Watchlist dedicada | Sí | Sí | `GET /api/users/me/watchlist` | Completo | Mobile permite agregar por símbolo exacto. |
| Listar amigos | Sí | Sí | `GET /api/users/me/friends` | Completo | Mobile filtra localmente amigos existentes. |
| Solicitudes recibidas | Sí | Sí | `GET /api/users/me/friends/requests` | Completo | Mobile muestra estado vacío. |
| Enviar solicitud | Sí | Sí | `POST /api/users/me/friends/:userId` | Parcial por contrato | No hay búsqueda global confirmada; requiere `userId` conocido. |
| Aceptar solicitud | Sí | Sí | `PATCH /api/users/me/friends/:userId` | Completo | Mobile recarga amigos y solicitudes. |
| Rechazar solicitud | Sí | Sí | `DELETE /api/users/me/friends/:userId` | Completo | Mobile usa el contrato disponible. |
| Eliminar amigo | Sí | Sí | `DELETE /api/users/me/friends/:userId` | Completo | Mobile recarga lista. |
| Preferencia de moneda | Sí | Sí | Local UI + tasa `USDCLP` | Completo | Mobile mantiene preferencia en sesión de app. |
| Tema visual | Sí | Sí | Local UI | Completo | Mobile soporta selector de tema. |
| Cierre de sesión | Sí | Sí | Local session cleanup | Completo | Mobile limpia token y sesión persistida. |

## Brechas pendientes

- Búsqueda global de usuarios por email o username: no hay endpoint confirmado. Mobile solo puede enviar solicitudes con `userId` conocido.
- Validación real de Socket.IO en celular físico: los tests cubren construcción de URL y manejo de estado, pero falta confirmar eventos reales desde Railway.
- Confirmación de `USDCLP` real en Railway: mobile funciona con fallback visible, pero debe verificarse cuándo el backend entregue tasa real.
- Validación de formularios móviles con teclado físico/virtual: cambio de email, cambio de contraseña, símbolos de watchlist y creación de órdenes requieren prueba en dispositivo.
- Pruebas end-to-end en APK no existen todavía; la cobertura actual es principalmente unitaria y de repositorio/loader.

## Riesgos antes de APK

- Red móvil o DNS pueden comportarse distinto a navegador/desktop; probar con Wi-Fi y red celular.
- Socket.IO puede fallar por configuración de namespace, transporte websocket o proxy; REST debe seguir funcionando.
- Sesión persistida puede quedar inválida después de `401`; validar que la app vuelve a login sin estados corruptos.
- Railway puede devolver `USDCLP` no disponible; validar que la advertencia se vea en Mercado, Portfolio y Órdenes.
- Formularios sensibles pueden quedar con feedback poco visible en pantallas pequeñas; revisar accesibilidad y scroll.
- Cancelación de órdenes puede fallar si la orden ya fue ejecutada o cancelada; mobile debe mostrar el mensaje backend sin bloquear el listado.

## Checklist manual contra Railway

Ejecutar sin modificar archivos de entorno:

```bash
EXPO_PUBLIC_USE_MOCKS=false \
EXPO_PUBLIC_FALLBACK_TO_MOCKS=false \
EXPO_PUBLIC_API_BASE_URL=https://quill-backend-production-70a1.up.railway.app/api \
EXPO_PUBLIC_SOCKET_URL=https://quill-backend-production-70a1.up.railway.app/realtime \
npm start
```

Validar en celular físico:

- Login con usuario real.
- Registro y regreso a login.
- Mercado carga cotizaciones.
- Mercado muestra estado abierto/cerrado.
- Historial de precio carga para al menos un símbolo CLP y uno USD.
- Realtime muestra conexión cuando Railway emite eventos.
- Si realtime falla, REST sigue mostrando mercado.
- Portfolio carga aunque `USDCLP` use fallback.
- Crear orden `LIMIT`.
- Crear orden `MARKET` si el backend la acepta para el activo elegido.
- Cancelar orden pendiente.
- Historial muestra trades o estado vacío.
- Watchlist agrega y quita símbolo exacto.
- Perfil carga datos reales.
- Editar nombre y username.
- Cambiar email con contraseña actual.
- Cambiar contraseña con contraseña actual.
- Amigos lista contactos o estado vacío.
- Solicitudes lista pendientes o estado vacío.
- Enviar solicitud solo con `userId` conocido.
- Aceptar o rechazar solicitud si existe una pendiente.
- Eliminar amigo si existe relación.
- Cierre de sesión limpia acceso y vuelve al login.
- Reabrir la app y validar restauración o cierre de sesión según corresponda.

## Pruebas automatizadas actuales

- Repositorio backend: endpoints de mercado, órdenes, perfil, watchlist y social.
- Loaders: fallback de `USDCLP`, estado de mercado no bloqueante, portfolio, órdenes y trades.
- Realtime: URL con namespace `/realtime`, estados de conexión y fallback funcional.
- Validaciones: registro, órdenes, cálculo de monto, dinero, sesión segura, HTTP y fallback repository.

## Pruebas automatizadas faltantes recomendadas

- Tests de UI con interacción para `UserScreen`, `WatchlistPanel`, `SocialPanel`, `OrdersScreen` y `MarketScreen`.
- Tests de flujos de sesión inválida y retorno a login ante `401` en pantallas principales.
- Tests de accesibilidad básica para botones críticos: cancelar orden, cambiar email, cambiar contraseña, cerrar sesión.
- Pruebas end-to-end en emulador o dispositivo para login, mercado, órdenes y perfil contra backend real o entorno staging.

## Comandos recomendados antes de APK

```bash
npm run typecheck
npm test
```

Luego iniciar Expo contra Railway con las variables inline del checklist manual y validar en celular físico antes de generar el APK.
