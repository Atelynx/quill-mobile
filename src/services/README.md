# Carpeta `services`

Contiene la capa de aplicación y acceso a datos.

- `contracts.ts`: interfaz común `DataRepository` para mocks y backend.
- `orderValidation.ts`: valida creación de órdenes y exige precio en `LIMIT`.
- `mockRepository.ts`: repositorio local mutable para demo.
- `backendRepository.ts`: implementación REST contra NestJS.
- `repositoryFactory.ts`: selecciona repositorio según entorno.
- `realtimeService.ts`: cliente Socket.IO autenticado para `price_update`, acciones y `USDCLP`.

Las pantallas consumen esta carpeta mediante el estado global, sin conocer detalles HTTP.
