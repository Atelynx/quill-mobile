# Carpeta `services`

Contiene la capa de aplicación y acceso a datos.

- `contracts.ts`: interfaz común `DataRepository` para mocks y backend.
- `orderAmount.ts`: calcula cantidad estimada desde monto de compra con redondeo hacia abajo.
- `orderValidation.ts`: valida creación de órdenes y exige precio en `LIMIT`.
- `registerValidation.ts`: valida `fullName`, `email`, `password` y `username` opcional antes de registrar.
- `currencyFallback.ts`: define la tasa estimada local para `USDCLP` cuando el backend no la entrega.
- `currencyRateService.ts`: obtiene la tasa real `USDCLP` y entrega una tasa estimada visible si el backend no responde con un valor utilizable.
- `mockRepository.ts`: repositorio local mutable para demo, conectado al estado compartido mock.
- `mockState.ts`: mantiene una fuente compartida de sesión, watchlist, órdenes, amigos y solicitudes para todas las instancias mock.
- `mockOrders.ts`: construye órdenes y operaciones demo desde el contrato de órdenes.
- `backendRepository.ts`: implementación REST contra NestJS para mercado, estado de mercado, portfolio, órdenes, cancelación, trades, perfil, watchlist y social; propaga errores backend sin simular respuestas reales.
- `fallbackRepository.ts`: limita fallback demo a mercado, historial y currency ante fallos de transporte; nunca degrada HTTP ni mutaciones.
- `repositoryFactory.ts`: selecciona backend, demo explícita o backend con fallback demo visible según entorno.
- `realtimeService.ts`: cliente Socket.IO autenticado para `price_update`, acciones y `USDCLP`; exige que `EXPO_PUBLIC_SOCKET_URL` incluya el namespace `/realtime`.

Las pantallas consumen esta carpeta mediante el estado global, sin conocer detalles HTTP.
