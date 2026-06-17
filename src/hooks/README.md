# Carpeta `hooks`

Contiene hooks reutilizables para pantallas.

- `useAsyncResource.ts`: carga recursos asincrónicos con estados de carga, error y recarga manual.
- `useMarketRealtime.ts`: mantiene cotizaciones y tasa `USDCLP` en vivo para modos backend, incluso con fallback demo habilitado.

Las pantallas lo usan para consumir repositorios sin repetir manejo de errores.
