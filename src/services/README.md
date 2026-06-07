# Carpeta `services`

Contiene la capa de aplicación y acceso a datos.

- `contracts.ts`: interfaz común `DataRepository` para mocks y backend.
- `orderAmount.ts`: calcula cantidad estimada desde monto de compra con redondeo hacia abajo.
- `orderValidation.ts`: valida creación de órdenes y exige precio en `LIMIT`.
- `registerValidation.ts`: valida `fullName`, `email`, `password` y `username` opcional antes de registrar.
- `currencyFallback.ts`: define la tasa estimada local para `USDCLP` cuando el backend no la entrega.
- `mockRepository.ts`: repositorio local mutable para demo, conectado al estado compartido mock.
- `mockState.ts`: mantiene una fuente compartida de sesión, watchlist, órdenes, amigos y solicitudes para todas las instancias mock.
- `mockOrders.ts`: construye órdenes y operaciones demo desde el contrato de órdenes.
- `backendRepository.ts`: implementación REST contra NestJS para auth, usuario, mercado, historial, portafolio, órdenes, trades y currency.
- `fallbackRepository.ts`: deriva lecturas y funciones sociales/watchlist a mocks cuando el backend falla y el entorno permite fallback.
- `repositoryFactory.ts`: selecciona repositorio según entorno y aplica fallback controlado.
- `realtimeService.ts`: cliente Socket.IO autenticado para `price_update`, acciones y `USDCLP`.

Las pantallas consumen esta carpeta mediante el estado global, sin conocer detalles HTTP.
