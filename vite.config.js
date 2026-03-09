import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  publicDir: 'public_static',
  build: {
    // Build every HTML page used by public/auth/app navigation.
    rollupOptions: {
      input: {
        root: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'pages/public/index.html'),
        about: resolve(__dirname, 'pages/public/about.html'),
        contact: resolve(__dirname, 'pages/public/contact.html'),
        services: resolve(__dirname, 'pages/public/services.html'),
        login: resolve(__dirname, 'pages/auth/login.html'),
        register: resolve(__dirname, 'pages/auth/register.html'),
        forgotPassword: resolve(__dirname, 'pages/auth/forgot-password.html'),
        portal: resolve(__dirname, 'pages/app/portal.html'),
        hogar: resolve(__dirname, 'pages/app/hogar.html'),
        perros: resolve(__dirname, 'pages/app/perros.html'),
        citas: resolve(__dirname, 'pages/app/citas.html'),
        booking: resolve(__dirname, 'pages/app/booking.html'),
        perfil: resolve(__dirname, 'pages/app/perfil.html'),
        usuarios: resolve(__dirname, 'pages/app/usuarios.html'),
      },
    },
  },
});
