# Carpeta `state`

Contiene estado global liviano para sesión y preferencias.

- `AppSessionContext.tsx`: administra sesión activa solo en memoria, último email recordado, moneda preferida, modo de datos, repositorio activo y actualización local del perfil. El logout cierra primero la sesión en memoria y observa errores al limpiar SecureStore.

La app no restaura token ni perfil al iniciar. `expo-secure-store` solo conserva preferencias no sensibles y el último correo usado. Las contraseñas nunca se guardan.
