# Carpeta `utils`

Contiene funciones puras reutilizables.

- `money.ts`: convierte CLP/USD con tasa `USDCLP`, formatea montos y porcentajes.
- `dates.ts`: formatea fechas ISO para pantallas móviles.
- `history.ts`: genera, normaliza y convierte historial de precios para el gráfico móvil.
- `realtimeUpdates.ts`: aplica eventos `price_update` a cotizaciones y tasa `USDCLP`.

Estas utilidades no dependen de React Native y se prueban de forma aislada.
