# AlertDogAPI Frontend

[![Frontend CI](https://github.com/Key-Claw/AlertDogAPI_Frontend/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/Key-Claw/AlertDogAPI_Frontend/actions/workflows/frontend-ci.yml)

Frontend de AlertDog para gestionar:
- autenticacion local (contra API de usuarios)
- usuarios
- perros de alerta
- citas

## Estado actual (Marzo 2026)
- Frontend consolidado como sitio multipagina (`pages/` + `assets/`).
- Se eliminaron capas y archivos duplicados que no participaban en el flujo principal.
- `assets/js/scripts.js` se carga como modulo para evitar warnings de build en Vite.

## Que contiene este repositorio
Incluye una capa frontend multipagina:
- `pages/` + `assets/` HTML multipagina con JS global para flujos operativos.

Tambien incluye CI en GitHub Actions para validar build y rutas criticas.

## Tecnologias
### Core
- Vite

### Integracion backend
- Fetch API
- Base esperada del backend: `http://localhost:3000`
- Recursos consumidos: `/usuarios`, `/perros`, `/citas`

## Estructura principal
```text
pages/                 # HTML multipagina (auth/public/app)
assets/
  js/scripts.js        # logica global de sesion y operaciones
  css/style.css        # estilos base

.github/workflows/
  frontend-ci.yml      # pipeline CI del frontend
```

## Scripts npm
- `npm run dev`: servidor de desarrollo (Vite).
- `npm run build`: build de produccion en `dist/`.
- `npm run preview`: servir build de `dist/` localmente.

## Ejecucion local
1. Instalar dependencias:
```bash
npm install
```
2. Levantar frontend:
```bash
npm run dev
```
3. Abrir URL mostrada por Vite (ej. `http://127.0.0.1:5173/`).

Nota: para funcionalidades completas, backend y DB deben estar arriba.

## CI (GitHub Actions)
Workflow: `.github/workflows/frontend-ci.yml`

Se ejecuta en:
- `push` a `main`, `dev`, `feature/**`
- `pull_request` a `main` y `dev`
- ejecucion manual (`workflow_dispatch`)

Que valida el pipeline:
1. Instalacion (`npm ci`).
2. Build de produccion (`npm run build`).
3. Arranque de Vite en CI.
4. Smoke checks HTTP a rutas clave:
   - `/`
   - `/pages/auth/login.html`
   - `/pages/auth/register.html`
   - `/pages/public/about.html`
   - `/pages/public/contact.html`
   - `/pages/public/services.html`

Si falla, imprime `frontend.log` para diagnostico.

## Buenas practicas aplicadas
- Estructura multipagina clara por dominio (public/auth/app).
- Reutilizacion de estilos y logica global de sesion.
- Validaciones de formulario en flujos auth/perros/citas.
- Integracion backend real para operaciones CRUD.
- Verificacion automatica en CI.
