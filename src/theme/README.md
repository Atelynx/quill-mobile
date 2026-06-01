# Carpeta `theme`

Contiene los temas visuales nativos de la app móvil. Traduce los conceptos del frontend web a tokens compatibles con React Native.

- `palette.ts`: define los temas disponibles, sus nombres, modo claro/oscuro y tokens semánticos usados por pantallas y componentes.
- `ThemeContext.tsx`: expone el tema activo, permite cambiarlo y persiste la selección con almacenamiento seguro.

La carpeta se conecta con `app/_layout.tsx`, componentes reutilizables y pantallas para mantener colores consistentes en cards, botones, inputs, tabs, textos y gráficos.
