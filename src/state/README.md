# Carpeta `state`

Contiene estado global liviano para sesión y preferencias.

- `AppSessionContext.tsx`: administra sesión en memoria, moneda preferida, modo de datos y repositorio activo.

La sesión no persiste tokens en archivos ni almacenamiento local; en modo backend se vuelve a iniciar sesión al reabrir la app.
