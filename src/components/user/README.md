# Componentes de usuario

Esta carpeta agrupa componentes de cuenta usados por la pantalla `Usuario`.

- `ProfileSummary.tsx`: muestra nombre, correo, username y saldos disponibles/reservados del perfil cargado.
- `UserHomeSection.tsx`: muestra accesos internos para perfil, configuración, watchlist y amigos sin crear tabs nuevas.
- `UserSectionHeader.tsx`: encabezado de sección con botón visible para volver al centro de cuenta.
- `ProfileEditCard.tsx`: permite actualizar nombre y username mediante el repositorio activo, sincronizando el formulario con el perfil cargado.
- `AccountSettingsCard.tsx`: agrupa moneda, tema, cambio de correo y cambio de contraseña con feedback visible.
- `WatchlistPanel.tsx`: lista símbolos seguidos, recarga al enfocar la sección, permite agregar o quitar activos y sincroniza la sesión local.
- `SocialPanel.tsx`: muestra amigos, solicitudes pendientes y acciones sociales soportadas; el envío requiere un `userId` conocido porque no hay búsqueda global confirmada.

Los componentes se conectan con `AppSessionContext`, `DataRepository` y los tipos de `src/types/domain.ts`.
