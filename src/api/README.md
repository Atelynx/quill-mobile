# Carpeta `api`

Contiene la infraestructura HTTP mínima para el backend real.

- `httpClient.ts`: arma solicitudes `fetch`, adjunta JWT Bearer cuando existe y traduce errores a mensajes controlados.

La capa API no decide si se usan mocks; esa selección vive en `src/services`.
