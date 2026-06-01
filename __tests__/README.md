# Carpeta `__tests__`

Contiene pruebas automatizadas de la app móvil.

- `env.test.ts`: valida selección de modo mediante entorno.
- `money.test.ts`: valida formato y conversión CLP/USD.
- `orderValidation.test.ts`: valida reglas del formulario de órdenes.
- `registerValidation.test.ts`: valida registro con `fullName`, correo y contraseña.
- `mockRepository.test.ts`: valida órdenes, registro e historial en modo demo.
- `currencyFallback.test.ts`: valida fallback estimado para `USDCLP`.
- `history.test.ts`: valida transformación de historial para el gráfico.
- `theme.test.ts`: valida temas disponibles y nombres persistibles.
- `httpClient.test.ts`: valida token Bearer y limpieza ante 401.
- `sessionStorage.test.ts`: valida persistencia segura con mock de SecureStore.
- `realtimeUpdates.test.ts`: valida actualización de cotizaciones y `USDCLP`.

Las pruebas se ejecutan con `npm test`.
