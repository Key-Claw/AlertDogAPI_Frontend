// scripts.js - utilidades generales + lógica "Hogar"
// Asegúrate de cambiar API_BASE si tu backend está en otra URL/puerto
const API_BASE = 'http://localhost:3000/api';

// ----------------- Año en footer -----------------
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
setYear();

// ----------------- Gestión sesión (localStorage) -----------------
function getToken() { return localStorage.getItem('canem_token'); }
function setToken(t) { localStorage.setItem('canem_token', t); }
function clearToken() { localStorage.removeItem('canem_token'); }

function getUser() {
  const raw = localStorage.getItem('canem_user');
  return raw ? JSON.parse(raw) : null;
}
function setUser(u) { localStorage.setItem('canem_user', JSON.stringify(u)); }
function clearUser() { localStorage.removeItem('canem_user'); }

// ----------------- Header actions (login / portal / logout) -----------------
function renderHeaderActions() {
  const desktop = document.getElementById('header-actions');
  const mobile = document.getElementById('mobile-header-actions');
  if (desktop) desktop.innerHTML = '';
  if (mobile) mobile.innerHTML = '';

  const user = getUser();

  if (!user) {
    // botones cuando NO hay sesión
    const loginLink = createAnchor('Iniciar sesión', 'login.html', 'text-primary font-semibold');
    const registerLink = createAnchor('Registrarse', 'register.html', 'px-5 py-2.5 rounded-xl bg-white text-primary font-bold border shadow-sm hover:shadow-md transition-all');

    if (desktop) {
      desktop.appendChild(loginLink.cloneNode(true));
      desktop.appendChild(registerLink.cloneNode(true));
      desktop.classList.remove('hidden');
    }
    if (mobile) {
      mobile.appendChild(loginLink);
      mobile.appendChild(registerLink);
    }
  } else {
    // botones cuando HAY sesión
    const hogarLink = createAnchor('<i class="fas fa-home mr-1"></i> Hogar', 'hogar.html', 'text-primary font-semibold', true);
    const portalLink = createAnchor('<i class="fas fa-user-circle mr-1"></i> Tus perros', 'portal.html', 'text-primary font-semibold', true);
    const bookingLink = createAnchor('Pedir cita', 'booking.html', 'px-5 py-2.5 rounded-xl bg-white text-primary font-bold border shadow-sm hover:shadow-md transition-all');

    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'ml-2 text-sm text-gray-500';
    logoutBtn.textContent = 'Cerrar sesión';
    logoutBtn.addEventListener('click', () => {
      clearToken(); clearUser(); renderHeaderActions();
      // si estamos en páginas privadas, redirigir a inicio
      const path = location.pathname.split('/').pop();
      if (path === 'portal.html' || path === 'hogar.html') location.href = 'index.html';
    });

    if (desktop) {
      desktop.appendChild(hogarLink);
      desktop.appendChild(bookingLink);
      desktop.appendChild(logoutBtn);
      desktop.classList.remove('hidden');
    }
    if (mobile) {
      mobile.appendChild(hogarLink.cloneNode(true));
      mobile.appendChild(bookingLink.cloneNode(true));
      const mobLogout = logoutBtn.cloneNode(true);
      mobLogout.addEventListener('click', () => { clearToken(); clearUser(); renderHeaderActions(); document.getElementById('mobile-menu')?.classList.add('hidden'); });
      mobile.appendChild(mobLogout);
    }
  }
}

// helper para crear <a>
function createAnchor(textOrHtml, href, className = '', isHtml = false) {
  const a = document.createElement('a');
  a.href = href;
  a.className = className;
  if (isHtml) a.innerHTML = textOrHtml;
  else a.textContent = textOrHtml;
  return a;
}
renderHeaderActions();

// ----------------- Modal Auth (opcional, se mantiene si quieres usarlo) -----------------
function openAuthModal() {
  if (document.getElementById('auth-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'auth-modal';
  modal.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:9999">
      <div style="background:white;padding:24px;border-radius:12px;max-width:420px;width:92%;">
        <h3 style="margin:0 0 12px">Entrar / Registrarse</h3>
        <div style="display:flex;gap:8px;margin-bottom:12px">
          <button id="tab-login" style="flex:1;padding:8px">Login</button>
          <button id="tab-register" style="flex:1;padding:8px">Registrarse</button>
        </div>
        <form id="authForm" style="display:flex;flex-direction:column;gap:8px">
          <input id="auth-username" placeholder="Usuario" required />
          <input id="auth-password" type="password" placeholder="Contraseña" required />
          <div style="display:flex;gap:8px">
            <button type="submit" id="auth-submit" style="flex:1;padding:8px">Login</button>
            <button type="button" id="auth-cancel" style="flex:1;padding:8px">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  let mode = 'login';
  document.getElementById('tab-login').addEventListener('click', () => { mode='login'; document.getElementById('auth-submit').textContent='Login'; });
  document.getElementById('tab-register').addEventListener('click', () => { mode='register'; document.getElementById('auth-submit').textContent='Registrarse'; });
  document.getElementById('auth-cancel').addEventListener('click', () => { modal.remove(); });

  document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('auth-username').value.trim();
    const password = document.getElementById('auth-password').value.trim();
    try {
      const url = mode === 'login' ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setToken(data.token);
      setUser(data.user);
      renderHeaderActions();
      modal.remove();
      const path = location.pathname.split('/').pop();
      if (path === 'portal.html' || path === 'hogar.html') location.reload();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
}

// ----------------- apiFetch (añade token automáticamente) -----------------
async function apiFetch(path, opts = {}) {
  const token = getToken();
  opts.headers = opts.headers || {};
  // si body es FormData no debemos setear Content-Type
  if (!(opts.body instanceof FormData)) opts.headers['Content-Type'] = 'application/json';
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API_BASE + path, opts);
  if (res.status === 401) {
    // sesión caducada
    clearToken(); clearUser(); renderHeaderActions();
    throw new Error('No autorizado');
  }
  return res;
}

// ----------------- HOGAR: obtener perros del usuario -----------------
async function getPerrosUsuario() {
  const user = getUser();
  if (!user) return null; // indica que no hay sesión

  try {
    // GET /perros -> espera array de perros; si el backend devuelve solo los del usuario mejor
    const res = await apiFetch('/perros', { method: 'GET' });
    const all = await res.json().catch(()=>[]);
    // filtrar por id_usuario por seguridad si backend devuelve todo
    const perros = Array.isArray(all) ? all.filter(p => Number(p.id_usuario) === Number(user.id)) : [];
    return perros;
  } catch (err) {
    console.error('Error al obtener perros:', err);
    throw err;
  }
}

// ----------------- renderHogar: pinta la lista -----------------
async function renderHogar() {
  const container = document.getElementById('hogar-list');
  const emptyBox = document.getElementById('hogar-empty');
  if (!container) return;

  container.innerHTML = '';
  if (emptyBox) emptyBox.classList.add('hidden');

  const user = getUser();
  if (!user) {
    container.innerHTML = `
      <div class="col-span-1 md:col-span-2 lg:col-span-3 soft-card p-8 text-center">
        <p class="text-gray-700 mb-4">Para ver tus perros necesitas iniciar sesión.</p>
        <div class="flex justify-center gap-4">
          <a href="login.html" class="px-6 py-2 rounded-xl bg-white text-[var(--canem-primary)] border shadow-sm">Iniciar sesión</a>
          <a href="register.html" class="px-6 py-2 rounded-xl bg-white text-[var(--canem-primary)] border shadow-sm">Registrarse</a>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `<div class="col-span-1 md:col-span-2 lg:col-span-3 soft-card p-8 text-center">Cargando perros...</div>`;

  try {
    const perros = await getPerrosUsuario();
    container.innerHTML = '';
    if (!perros || perros.length === 0) {
      if (emptyBox) emptyBox.classList.remove('hidden');
      return;
    }

    perros.forEach(perro => {
      const card = createPerroCard(perro);
      container.appendChild(card);
    });

  } catch (err) {
    container.innerHTML = `<div class="col-span-1 md:col-span-2 lg:col-span-3 soft-card p-8 text-center text-red-600">No se pudieron cargar los perros. Intenta más tarde.</div>`;
  }
}

// ----------------- tarjeta de perro -----------------
function createPerroCard(perro) {
  const card = document.createElement('div');
  card.className = 'soft-card p-6 rounded-lg';

  // edad (intentar calcular)
  let edad = '';
  if (perro.fecha_de_nacimiento) {
    try {
      const born = new Date(perro.fecha_de_nacimiento);
      const diff = Date.now() - born.getTime();
      const years = Math.floor(diff / (1000*60*60*24*365.25));
      if (years > 0) edad = `${years} año${years>1?'es':''}`;
      else edad = Math.max(0, Math.floor(diff / (1000*60*60*24*30))) + ' meses';
    } catch {}
  }

  const generoTxt = (perro.genero === 1 || perro.genero === '1' || perro.genero === true) ? 'Macho' : 'Hembra';
  const imgSrc = perro.imagen || 'public/Foto2.jpg';

  card.innerHTML = `
    <div class="flex flex-col h-full">
      <div class="h-44 w-full overflow-hidden rounded-lg mb-4">
        <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(perro.nombre)}" class="w-full h-full object-cover"/>
      </div>
      <div class="flex-1">
        <h3 class="text-xl font-bold text-accent">${escapeHtml(perro.nombre || 'Sin nombre')}</h3>
        <p class="text-gray-600">${escapeHtml(perro.raza || '')} · ${escapeHtml(generoTxt)}</p>
        <p class="text-gray-500 text-sm mt-2">${perro.fecha_de_nacimiento ? 'Nacido: ' + escapeHtml(perro.fecha_de_nacimiento) : ''} ${edad ? ' · ' + edad : ''}</p>
      </div>
      <div class="mt-4 flex gap-3">
        <a class="px-4 py-2 rounded-lg border text-sm text-[var(--canem-primary)] hover:bg-[var(--canem-primary)] hover:text-white transition-colors" href="perro-edit.html?id=${encodeURIComponent(perro.id)}">Editar</a>
        <button class="px-4 py-2 rounded-lg bg-red-600 text-white text-sm" data-id="${encodeURIComponent(perro.id)}">Eliminar</button>
      </div>
    </div>
  `;

  // listener eliminar
  const delBtn = card.querySelector('button[data-id]');
  if (delBtn) {
    delBtn.addEventListener('click', async () => {
      const id = delBtn.getAttribute('data-id');
      if (!confirm('¿Eliminar este perro? Esta acción no se puede deshacer.')) return;
      try {
        await deletePerro(id);
        // eliminar tarjeta
        card.remove();
        const container = document.getElementById('hogar-list');
        if (container && container.children.length === 0) {
          document.getElementById('hogar-empty')?.classList.remove('hidden');
        }
      } catch (err) {
        alert('No se pudo eliminar el perro. Intenta más tarde.');
      }
    });
  }

  return card;
}

// ----------------- borrar perro (DELETE) -----------------
async function deletePerro(id) {
  if (!id) throw new Error('id inválido');
  const res = await apiFetch(`/perros/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const txt = await res.text().catch(()=>null);
    throw new Error(txt || 'Error al eliminar');
  }
  return true;
}

// ----------------- escape HTML -----------------
function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return String(str).replace(/[&<>"'`=\/]/g, function(s) {
    return ({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#39;',
      '/':'&#x2F;',
      '`':'&#x60;',
      '=':'&#x3D;'
    })[s];
  });
}

// ----------------- inicialización al cargar la página -----------------
document.addEventListener('DOMContentLoaded', () => {
  // mobile toggle
  const btn = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) btn.addEventListener('click', () => menu.classList.toggle('hidden'));

  // si estamos en hogar.html o portal.html, renderizar lista
  const path = location.pathname.split('/').pop();
  if (path === 'hogar.html' || path === 'portal.html') {
    renderHogar();
  }
});