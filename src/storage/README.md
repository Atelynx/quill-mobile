# Carpeta `storage`

Contiene almacenamiento móvil seguro para sesión y preferencias locales.

- `sessionStorage.ts`: elimina sesiones antiguas al iniciar, nunca restaura tokens y guarda solo el último correo usado para prellenar Login.
- `preferencesStorage.ts`: guarda y carga el tema seleccionado mediante `expo-secure-store`.

Esta carpeta se conecta con `src/state/AppSessionContext.tsx` para restaurar sesión al abrir la app y limpiar el JWT al cerrar sesión o ante 401.
