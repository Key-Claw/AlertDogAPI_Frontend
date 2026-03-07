# AlertDogAPI_Frontend

Frontend de AlertDogAPI construido con React, Vite y TailwindCSS para gestionar:

- Usuarios
- Perros de alerta
- Citas

## Tecnologias usadas

### Core

- React 18 (componentes funcionales + hooks)
- React Router DOM (navegacion)
- Vite (build tool y dev server)

### Estilos

- TailwindCSS 3
- PostCSS
- Autoprefixer

### Comunicacion con backend

- Fetch API (cliente propio en `src/api/apiClient.js`)
- API REST backend (Node/Express) en endpoints:
	- `/usuarios`
	- `/perros`
	- `/citas`

## Arquitectura y organizacion

La app sigue una estructura modular orientada a capas:

- `src/api`
	- Encapsula llamadas HTTP por dominio (`usuariosApi`, `perrosApi`, `citasApi`).
	- `apiClient.js` centraliza base URL, parseo de respuesta y manejo de errores.

- `src/hooks`
	- Hooks de dominio (`useUsuarios`, `usePerros`, `useCitas`) para carga y CRUD.
	- `useApi` estandariza `loading` + `error` para llamadas async.

- `src/pages`
	- Pantallas completas de cada modulo.
	- Componen UI + hooks de dominio.

- `src/components`
	- `layout`: estructura general (`AppLayout`, `Navbar`, `Sidebar`).
	- `common`: componentes reutilizables (`Button`, `Table`, `Modal`, etc.).
	- `usuarios/perros/citas`: formularios y tablas de cada entidad.

- `src/routes`
	- Configuracion de React Router.

- `src/utils`
	- Helpers puros (`formatDate`, `validators`, `httpErrors`, `constants`).

- `src/context`
	- Estado global compartido (ejemplo: control de sidebar).

- `src/assets`
	- Recursos visuales de marca y fondos.

## Flujo de datos

1. Una pagina invoca un hook de dominio (`useUsuarios`, por ejemplo).
2. El hook usa su modulo `api/*` para ejecutar la operacion REST.
3. El resultado actualiza estado local del hook (`usuarios`, `loading`, `error`).
4. La pagina renderiza componentes UI segun ese estado.

## Variables de entorno

Archivo: `.env`

- `VITE_API_URL=http://localhost:3000`

Opcionalmente se admite `VITE_API_BASE_URL`.

## Scripts disponibles

- `npm run dev`
	- Levanta el servidor de desarrollo.

- `npm run build`
	- Genera el build de produccion en `dist/`.

- `npm run preview`
	- Sirve localmente el contenido generado en `dist/`.

## Ejecucion local

1. Instalar dependencias:
	 - `npm install`
2. Arrancar desarrollo:
	 - `npm run dev`
3. Abrir URL local mostrada por Vite (ejemplo: `http://127.0.0.1:5173/`).

## Buenas practicas aplicadas

- Componentes funcionales + hooks.
- Separacion de responsabilidades por capas.
- Reutilizacion de componentes comunes.
- Manejo centralizado de errores HTTP.
- Estilos consistentes con Tailwind y tema visual de marca.
