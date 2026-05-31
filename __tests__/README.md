# Carpeta `__tests__`

Contiene pruebas automatizadas de la app móvil.

- `env.test.ts`: valida selección de modo mediante entorno.
- `money.test.ts`: valida formato y conversión CLP/USD.
- `orderValidation.test.ts`: valida reglas del formulario de órdenes.
- `mockRepository.test.ts`: valida creación de órdenes en modo demo.
- `httpClient.test.ts`: valida token Bearer y limpieza ante 401.
- `sessionStorage.test.ts`: valida persistencia segura con mock de SecureStore.
- `realtimeUpdates.test.ts`: valida actualización de cotizaciones y `USDCLP`.

Las pruebas se ejecutan con `npm test`.
