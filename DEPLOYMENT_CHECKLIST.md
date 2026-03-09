# Frontend Deployment Checklist

## Target
Deploy static frontend with public URL and connected backend API.

## Build
1. Install dependencies: `npm ci`.
2. Build static assets: `npm run build`.
3. Validate output exists in `dist/`.

## Hosting Options
- Vercel (static)
- Netlify (static)
- Render static site
- Nginx/Apache static hosting

## Runtime Configuration
Current frontend calls backend at `http://localhost:3000` in scripts.
Before production, update API base URL references in:
- `assets/js/scripts.js`
- `pages/auth/login.html`
- `pages/auth/register.html`
- `pages/app/perros.html`
- `pages/app/booking.html`

Set them to deployed backend URL, for example:
- `https://your-backend.example.com`

## Post-Deploy Validation
1. Open home page and verify dynamic list loads.
2. Test login/register flows.
3. Test create/update/delete for perros and citas.
4. Verify SweetAlert2 notifications appear for success/error.

## CORS Alignment
Ensure backend `CORS_ORIGINS` includes frontend public URL.
