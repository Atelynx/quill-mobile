# Carpeta `types`

Contiene los tipos TypeScript compartidos por pantallas, servicios, mocks y utilidades.

- `domain.ts`: define los contratos móviles alineados con backend y frontend: usuario, mercado, portafolio, órdenes, operaciones y moneda.
- `env.d.ts`: declara `process.env` para variables públicas de Expo usadas por TypeScript y tests.

Estos tipos conectan la capa de datos con los componentes visuales y evitan duplicar estructuras en cada pantalla.
