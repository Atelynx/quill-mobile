# Carpeta `screens`

Contiene las pantallas de alto nivel de la app móvil.

- `LoginScreen.tsx`: inicio de sesión y registro demo o real con `username` opcional según entorno.
- `MarketScreen.tsx`: lista de activos, watchlist, selector CLP/USD, gráfico de historial y actualizaciones realtime en modo backend.
- `PortfolioScreen.tsx`: resumen de equity y posiciones.
- `OrdersScreen.tsx`: listado y creación de órdenes con compra por cantidad o monto.
- `HistoryScreen.tsx`: operaciones ejecutadas.
- `UserScreen.tsx`: centro de cuenta con navegación interna local para perfil, configuración, watchlist y amigos, sin tabs nuevas.

Cada pantalla usa componentes compartidos y consume datos mediante `src/state` y `src/services`.
