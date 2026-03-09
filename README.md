# AlertDogAPI Frontend

[![Frontend CI](https://github.com/Key-Claw/AlertDogAPI_Frontend/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/Key-Claw/AlertDogAPI_Frontend/actions/workflows/frontend-ci.yml)

Frontend de AlertDog para gestionar autenticacion, usuarios, perros y citas sobre la API backend.

## Autoria del frontend
Este frontend fue consolidado como una solucion multipagina clara, estable y facil de mantener.

Decisiones de autoria clave:
- Limpieza de capas duplicadas para dejar una unica ruta de ejecucion.
- Estructura multipagina por dominios (`public`, `auth`, `app`).
- Script central (`assets/js/scripts.js`) con logica CRUD y navegacion.
- Integracion de feedback visual con SweetAlert2 y fallback seguro.

Documentos relacionados:
- `DEPLOYMENT_CHECKLIST.md`: checklist de despliegue.

## Estado actual (Marzo 2026)
- Frontend consolidado en `pages/` + `assets/`.
- Build de produccion funcional con Vite.
- Integracion con backend en `http://localhost:3000`.
- Rutas privadas (`/pages/app/*`) validadas para carga de datos en `usuarios`, `citas` y `hogar`.

## Tecnologias usadas (que son y para que sirven)
| Tecnologia | Que es | Para que se usa en este proyecto |
|---|---|---|
| HTML5 | Lenguaje de estructura web | Construir pantallas multipagina |
| CSS3 | Lenguaje de estilos | Definir el diseno visual |
| JavaScript (ES Modules) | Lenguaje de programacion del navegador | Logica de formularios, fetch y render dinamico |
| Vite | Herramienta de desarrollo y build | Servidor dev rapido y empaquetado de produccion |
| Fetch API | API nativa del navegador | Consumir endpoints backend (`/usuarios`, `/perros`, `/citas`) |
| SweetAlert2 | Libreria de alertas bonitas | Confirmaciones y mensajes de exito/error |
| GitHub Actions | CI/CD en GitHub | Verificar build y rutas clave automaticamente |

## Estructura principal
```text
pages/
  public/                       # paginas informativas
  auth/                         # login y registro
  app/                          # vistas de gestion CRUD
assets/
  js/scripts.js                 # logica principal frontend
  css/style.css                 # estilos base
.github/workflows/
  frontend-ci.yml               # pipeline CI frontend
```

## Tutorial paso a paso (para quien no sabe programar)
### Paso 1. Instala herramientas
Necesitas:
- Node.js LTS
- Git

Verifica instalacion:
```bash
node -v
npm -v
git --version
```

### Paso 2. Clona el repositorio
```bash
git clone https://github.com/Key-Claw/AlertDogAPI_Frontend.git
cd AlertDogAPI_Frontend
```

### Paso 3. Instala dependencias
```bash
npm install
```

### Paso 4. Arranca el frontend
```bash
npm run dev
```

Alternativa para probar build de produccion:
```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4174
```

### Paso 5. Abre la aplicacion
En consola veras una URL parecida a `http://127.0.0.1:5173/`.
Abrela en el navegador.

### Paso 6. Conecta con backend
Para operar CRUD real, el backend debe estar activo en `http://localhost:3000`.

Checklist minimo full-stack:
1. Backend DB arriba (`docker compose up -d db` en backend).
2. Backend API arriba (`npm start` o `npm run dev` en backend).
3. Frontend arriba (`npm run dev` o `npm run preview`).

### Paso 7. Prueba flujos clave sin programar
- Registro y login en `pages/auth/`.
- Alta y listado de perros en `pages/app/perros.html`.
- Alta y listado de citas en `pages/app/booking.html`.

Credenciales de demo (seed backend por defecto):
- Admin: `admin@alertdog.com` / `admin123`
- Usuario: `luis@correo.com` / `luis123`

### Paso 8. Genera version de produccion
```bash
npm run build
```

Esto crea una carpeta `dist/` lista para despliegue.

### Paso 9. Entiende como se construye este frontend
Orden recomendado de lectura:
1. `pages/auth/login.html` y `pages/auth/register.html`.
2. `pages/app/perros.html` y `pages/app/booking.html`.
3. `assets/js/scripts.js`.
4. `assets/css/style.css`.

## Scripts npm
- `npm run dev`: servidor de desarrollo.
- `npm run build`: build de produccion en `dist/`.
- `npm run preview`: servir build localmente.

Nota de puertos:
- `npm run dev` suele usar `5173`.
- `npm run preview` puede cambiar de puerto si hay conflicto (por ejemplo `4174` o `4175`).
- Si backend bloquea por CORS, revisa `CORS_ORIGINS` en backend.

## CI (GitHub Actions)
Workflow: `.github/workflows/frontend-ci.yml`

Valida automaticamente:
1. Instalacion (`npm ci`).
2. Build de produccion (`npm run build`).
3. Arranque de Vite.
4. Smoke checks HTTP a rutas clave.

## Buenas practicas aplicadas
- Separacion clara entre paginas publicas y de aplicacion.
- Formularios con validaciones y feedback al usuario.
- Integracion real con backend por recursos.
- Verificacion automatica en CI.
