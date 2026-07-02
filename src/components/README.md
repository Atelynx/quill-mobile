# Carpeta `components`

Contiene componentes visuales reutilizables.

- `Card.tsx`: contenedor de contenido con borde y espaciado.
- `Badge.tsx`: etiqueta de estado para variaciones, lados y órdenes.
- `EmptyState.tsx`: estado vacío reutilizable.
- `StatusBanner.tsx`: indica backend, demo o backend con respaldo demo visible.
- `CurrencySwitch.tsx`: cambia moneda de visualización.
- `ThemeSelector.tsx`: permite cambiar entre temas claro, oscuro y océano.
- `SegmentedControl.tsx`: selector compacto para modos mutuamente excluyentes como lado, tipo de orden o compra por monto.
- `MarketTrendChart.tsx`: visualización nativa del historial de precios del símbolo seleccionado.
- `MarketQuoteCard.tsx`: tarjeta compacta para cotizaciones con precio, variación y acción de seguimiento.
- `OrderForm.tsx`: formulario móvil para crear órdenes `BUY`/`SELL`, `LIMIT`/`MARKET` y compra por monto calculada localmente.
- `user/`: componentes de centro de cuenta, navegación interna, perfil, configuración, watchlist y amigos usados por `UserScreen`.

Las pantallas combinan estos componentes con datos de `src/services`.
