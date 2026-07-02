# Carpeta `__tests__`

Contiene pruebas automatizadas de la app móvil.

- `env.test.ts`: valida defaults seguros, demo explícita y bloqueo del fallback en producción.
- `loginScreen.test.ts`: valida último email precargado, contraseña vacía y ausencia de credenciales demo por defecto.
- `money.test.ts`: valida formato y conversión CLP/USD.
- `orderValidation.test.ts`: valida reglas del formulario de órdenes.
- `orderAmount.test.ts`: valida cálculo de cantidad estimada al comprar por monto.
- `registerValidation.test.ts`: valida registro con `fullName`, correo, contraseña y `username` opcional.
- `mockRepository.test.ts`: valida órdenes, registro, watchlist compartida, amigos e historial en modo demo.
- `marketOrdersRepository.test.ts`: valida endpoints backend de estado de mercado y cancelación de órdenes.
- `portfolioOrdersLoaders.test.ts`: valida loaders de Portafolio, Órdenes y Trades para comandos filtrados por área.
- `userFriendsWatchlist.test.ts`: valida perfil, credenciales, watchlist, amigos, solicitudes y propagación de errores HTTP.
- `fallbackRepository.test.ts`: valida fallback de lecturas públicas, propagación HTTP y mutaciones reales.
- `currencyFallback.test.ts`: valida tasa estimada y que backend no oculte errores de `USDCLP`.
- `screenDataLoaders.test.ts`: valida que Mercado, Portafolio, Órdenes y Trades sigan cargando o muestren vacío cuando corresponde, aunque `USDCLP` no esté disponible.
- `history.test.ts`: valida transformación de historial para el gráfico.
- `theme.test.ts`: valida temas disponibles y nombres persistibles.
- `httpClient.test.ts`: valida token Bearer y limpieza ante 401.
- `sessionStorage.test.ts`: valida que no se restaure sesión/token y que solo se guarde el último correo.
- `appSessionContext.test.ts`: valida ausencia de auto-login, login manual y logout con limpieza de sesión antigua.
- `realtimeUpdates.test.ts`: valida actualización de cotizaciones y `USDCLP`.
- `realtimeService.test.ts`: valida URL Socket.IO, namespace `/realtime`, estados y fallback no bloqueante.
- `marketRealtime.test.ts`: valida mensajes de estado realtime y recarga manual ante fallos de socket.

Las pruebas se ejecutan con `npm test`.
