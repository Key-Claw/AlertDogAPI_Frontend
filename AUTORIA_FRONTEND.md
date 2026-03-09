# Tutorial de autoria - Frontend (AlertDogAPI)

Este documento explica como esta construido el frontend, por que se eligio una arquitectura multipagina y como defender la autoria tecnica.

## 1. Objetivo del frontend
El frontend permite operar el sistema AlertDog desde navegador:
- autenticacion local
- gestion de usuarios
- gestion de perros
- gestion de citas

Consume la API del backend en `http://localhost:3000`.

## 2. Arquitectura aplicada
Se consolido una arquitectura multipagina:
- `pages/`: vistas por dominio (public, auth, app).
- `assets/js/scripts.js`: logica de sesion, CRUD y eventos de UI.
- `assets/css/style.css`: estilos base.

Flujo general:
1. Carga pagina HTML.
2. Se inicializa script global.
3. Se detecta pantalla actual por ruta/elementos.
4. Se ejecutan acciones `fetch` al backend.
5. Se renderiza feedback al usuario.

## 3. Decisiones de autoria (y como justificarlas)
### 3.1 Consolidacion y limpieza de capas
Se removieron archivos/capas duplicadas no usadas en el flujo principal para evitar deuda tecnica.

Justificacion:
- Menor complejidad.
- Menos puntos de falla.
- Build y mantenimiento mas predecibles.

### 3.2 Carga de JS como modulo
Se definio carga de scripts como `type="module"` para compatibilidad con build de Vite y evitar warnings.

Justificacion:
- Evita problemas de empaquetado.
- Mantiene comportamiento consistente entre dev y build.

### 3.3 UX con notificaciones claras
Se integraron notificaciones para confirmaciones y errores (SweetAlert2 con fallback).

Justificacion:
- Mejor feedback de usuario.
- Menos errores operativos.
- Flujos de alta/edicion/borrado mas seguros.

### 3.4 Formularios en modo crear/editar por parametro `id`
Pantallas de perros y citas soportan `?id=` para editar con `PUT`.

Justificacion:
- Reutilizacion de formularios.
- Menos duplicacion de pantallas.
- Flujo CRUD completo y coherente.

## 4. Evidencia tecnica de autoria
Para demostrar autoria de forma practica:
1. Ejecutar build:
```bash
npm run build
```
2. Mostrar puntos clave en codigo:
- `assets/js/scripts.js` (CRUD, render y feedback)
- `pages/app/perros.html` (formulario dinamico)
- `pages/app/booking.html` (edicion por `id`)
3. Mostrar rutas verificadas por CI:
- `.github/workflows/frontend-ci.yml`

## 5. Tutorial rapido para explicar el frontend en defensa
Guion sugerido (2-3 minutos):
1. "Se eligio multipagina para mantener simplicidad y entrega estable".
2. "Se limpio codigo duplicado para reducir deuda tecnica".
3. "La logica de operaciones vive en `assets/js/scripts.js`".
4. "Las vistas de perros y citas comparten formulario para crear y editar".
5. "CI valida build y rutas criticas en cada push/PR".

## 6. Limites y mejoras futuras
- Migrar progresivamente a componentes modulares por dominio.
- Agregar pruebas E2E (Playwright/Cypress).
- Internacionalizacion y accesibilidad avanzada.
- Mejorar manejo de sesion con tokens seguros.
