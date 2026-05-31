# Carpeta `app/(tabs)`

Contiene las rutas visibles en la barra inferior.

- `_layout.tsx`: define pestañas, iconos y protección por sesión.
- `market.tsx`, `portfolio.tsx`, `orders.tsx`, `history.tsx`, `user.tsx`: exponen cada pantalla móvil.

Las rutas importan pantallas desde `src/screens` para mantener navegación separada de lógica visual.
