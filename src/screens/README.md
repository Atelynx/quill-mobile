# Carpeta `screens`

Contiene las pantallas de alto nivel de la app móvil.

- `LoginScreen.tsx`: inicio de sesión demo o real según entorno.
- `MarketScreen.tsx`: lista de activos, selector CLP/USD y actualizaciones realtime en modo backend.
- `PortfolioScreen.tsx`: resumen de equity y posiciones.
- `OrdersScreen.tsx`: listado y creación de órdenes.
- `HistoryScreen.tsx`: operaciones ejecutadas.
- `UserScreen.tsx`: perfil, modo de datos y cierre de sesión.

Cada pantalla usa componentes compartidos y consume datos mediante `src/state` y `src/services`.
