# Componentes de usuario

Esta carpeta agrupa componentes de cuenta usados por la pantalla `Usuario`.

- `ProfileSummary.tsx`: muestra nombre, correo, username y saldos disponibles/reservados de la sesión actual.
- `UserHomeSection.tsx`: muestra accesos internos para perfil, configuración, watchlist y amigos sin crear tabs nuevas.
- `UserSectionHeader.tsx`: encabezado de sección con botón visible para volver al centro de cuenta.
- `ProfileEditCard.tsx`: permite actualizar nombre y username mediante el repositorio activo.
- `AccountSettingsCard.tsx`: agrupa moneda, tema, cambio de correo y cambio de contraseña.
- `WatchlistPanel.tsx`: lista símbolos seguidos, recarga al enfocar la sección y permite agregar o quitar activos.
- `SocialPanel.tsx`: muestra amigos, solicitudes pendientes y acciones sociales soportadas por el contrato móvil.

Los componentes se conectan con `AppSessionContext`, `DataRepository` y los tipos de `src/types/domain.ts`.
