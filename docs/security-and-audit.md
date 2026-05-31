# Seguridad y auditoría npm

## Persistencia de sesión

La app usa `expo-secure-store` para guardar la sesión autenticada. Se persiste el JWT recibido por backend o el token demo local junto con el perfil mínimo necesario para restaurar la sesión.

- `src/storage/sessionStorage.ts`: guarda, carga y limpia la sesión.
- `src/state/AppSessionContext.tsx`: restaura sesión al abrir la app y elimina sesión ante cierre manual o respuesta 401.
- `src/api/httpClient.ts`: llama al limpiador de sesión cuando el backend responde 401.

No se guardan credenciales reales ni contraseñas.

## Resultado de npm audit

Con Expo SDK 54, `npm audit` reporta 21 vulnerabilidades moderadas asociadas a dependencias Expo, `postcss` y la cadena `xcode -> uuid`. El resumen de `npm install` las agrupa como 14 vulnerabilidades moderadas.

Paquetes directos afectados por rutas transitivas:

- `expo`
- `expo-router`
- `expo-constants`
- `expo-linking`
- `expo-secure-store`
- `@expo/vector-icons`
- `jest-expo`

Paquetes transitivos principales:

- `@expo/cli`
- `@expo/config`
- `@expo/config-plugins`
- `@expo/metro-config`
- `@expo/prebuild-config`
- `xcode`
- `uuid`
- `postcss`

`npm audit fix --dry-run` propone resolver el árbol instalando `expo@56.0.8`, lo que rompe el objetivo de compatibilidad con Expo Go SDK 54. No se aplicó `npm audit fix` ni `--force`.

Riesgo estimado para esta etapa: moderado-bajo en runtime móvil, porque las rutas señaladas corresponden principalmente a tooling, configuración, prebuild y generación nativa. La recomendación segura es mantener Expo SDK 54 actualizado con parches compatibles o planificar una actualización coordinada de SDK cuando Expo publique una ruta sin conflicto.
