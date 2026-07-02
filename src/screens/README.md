# Carpeta `screens`

Contiene las pantallas de alto nivel de la app móvil.

- `LoginScreen.tsx`: inicio de sesión y registro, mostrando claramente backend, demo o respaldo demo.
- `MarketScreen.tsx`: estado de mercado, lista de activos, watchlist, selector CLP/USD, gráfico de historial y actualizaciones realtime en modo backend.
- `PortfolioScreen.tsx`: resumen de equity y posiciones.
- `OrdersScreen.tsx`: listado de órdenes pendientes, creación de órdenes con compra por cantidad o monto y cancelación de pendientes.
- `screenDataLoaders.ts`: carga datos principales de Mercado, Portafolio y Órdenes sin bloquear la pantalla cuando falta `USDCLP`; delega la tasa visible en `services`.
- `HistoryScreen.tsx`: operaciones ejecutadas con estado vacío cuando no hay trades.
- `UserScreen.tsx`: centro de cuenta con perfil real, configuración, watchlist y amigos, sin tabs nuevas ni funciones admin.

Cada pantalla usa componentes compartidos y consume datos mediante `src/state` y `src/services`.
