# Carpeta `hooks`

Contiene hooks reutilizables para pantallas.

- `useAsyncResource.ts`: carga recursos asincrónicos con estados de carga, error y recarga manual.
- `useMarketRealtime.ts`: mantiene cotizaciones y tasa `USDCLP` en vivo desde `/realtime`, con limpieza de listeners al salir.

Las pantallas lo usan para consumir repositorios sin repetir manejo de errores.
