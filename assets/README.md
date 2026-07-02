# Carpeta `assets`

Reservada para íconos, splash e imágenes de la app móvil.

## Archivos

- `quill.png`: logo base usado por Expo como ícono principal, imagen de splash y foreground del adaptive icon de Android.

## Conexión con Expo

`app.json` referencia `quill.png` en `expo.icon`, `expo.splash.image` y `expo.android.adaptiveIcon.foregroundImage`. El mismo archivo se usa temporalmente para preparar una APK instalable mientras no exista un set final de assets por densidad o variante visual.
