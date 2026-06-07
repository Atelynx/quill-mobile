# Carpeta `state`

Contiene estado global liviano para sesión y preferencias.

- `AppSessionContext.tsx`: administra sesión en memoria, persistencia segura, moneda preferida, modo de datos, repositorio activo y actualización local del perfil.

La sesión usa `expo-secure-store` para restaurar token y perfil en el dispositivo. Las credenciales y contraseñas nunca se guardan.
