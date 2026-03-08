// scripts.js - versión extendida: sesión, header dinámico, hogar, perfil, usuarios (admin) y citas
// Ajusta API_BASE si tu backend está en otro host/puerto
const API_BASE = 'http://localhost:3000/api';

// ---------- year ----------
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
setYear();

// ---------- sesión ----------
function getToken() { return localStorage.getItem('canem_token'); }
function setToken(t) { localStorage.setItem('canem_token', t); }
function clearToken() { localStorage.removeItem('canem_token'); }

function getUser() {
  const raw = localStorage.getItem('canem_user');
  return raw ? JSON.parse(raw) : null;
}
function setUser(u) { localStorage.setItem('canem_user', JSON.stringify(u)); }
function clearUser() { localStorage.removeItem('canem_user'); }

// ---------- header actions (ahora según rol) ----------
function renderHeaderActions() {
  const desktop = document.getElementById('header-actions');
  const mobile = document.getElementById('mobile-header-actions');
  if (desktop) desktop.innerHTML = '';
  if (mobile) mobile.innerHTML = '';

  const user = getUser();

  if (!user) {
    // no sesión
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
    return;
  }

  // hay sesión -> menú diferente según rol
  const isAdmin = Boolean(user.rol || user.role || user.isAdmin); // intenta varias claves
  const leftLink1 = isAdmin ? createAnchor('Usuarios', 'usuarios.html', 'text-primary font-semibold') : createAnchor('Perfil', 'perfil.html', 'text-primary font-semibold');
  const citasLink = createAnchor('Citas', 'citas.html', 'text-primary font-semibold');
  const hogarLink = createAnchor('Hogar', 'hogar.html', 'text-primary font-semibold');

  const logoutBtn = document.createElement('button');
  logoutBtn.className = 'ml-2 text-sm text-gray-500';
  logoutBtn.textContent = 'Cerrar sesión';
  logoutBtn.addEventListener('click', () => {
    clearToken(); clearUser(); renderHeaderActions();
    const path = location.pathname.split('/').pop();
    if (path === 'portal.html' || path === 'hogar.html' || path === 'perfil.html' || path === 'usuarios.html' || path === 'citas.html') {
      location.href = 'index.html';
    }
  });

  if (desktop) {
    desktop.appendChild(leftLink1);
    desktop.appendChild(citasLink);
    desktop.appendChild(hogarLink);
    desktop.appendChild(logoutBtn);
    desktop.classList.remove('hidden');
  }
  if (mobile) {
    mobile.appendChild(leftLink1.cloneNode(true));
    mobile.appendChild(citasLink.cloneNode(true));
    mobile.appendChild(hogarLink.cloneNode(true));
    const mobLogout = logoutBtn.cloneNode(true);
    mobLogout.addEventListener('click', () => { clearToken(); clearUser(); renderHeaderActions(); document.getElementById('mobile-menu')?.classList.add('hidden'); });
    mobile.appendChild(mobLogout);
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

// ---------- modal de auth (opcional) ----------
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
      if (path === 'portal.html' || path === 'hogar.html' || path === 'perfil.html' || path === 'citas.html') location.reload();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
}

// ---------- apiFetch (añade token) ----------
async function apiFetch(path, opts = {}) {
  const token = getToken();
  opts.headers = opts.headers || {};
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

// ---------- HOGAR (perros) ----------
async function getPerrosUsuario() {
  const user = getUser();
  if (!user) return null;
  try {
    const res = await apiFetch('/perros', { method: 'GET' });
    const all = await res.json().catch(()=>[]);
    const perros = Array.isArray(all) ? all.filter(p => Number(p.id_usuario) === Number(user.id)) : [];
    return perros;
  } catch (err) {
    console.error('Error al obtener perros:', err);
    throw err;
  }
}

async function renderHogar() {
  const container = document.getElementById('hogar-list');
  const emptyBox = document.getElementById('hogar-empty');
  if (!container) return;

  container.innerHTML = '';
  if (emptyBox) emptyBox.classList.add('hidden');

  const user = getUser();
  if (!user) {
    container.innerHTML = `<div class="soft-card p-6 text-center">Para ver tus perros necesitas iniciar sesión. <br/><a href="login.html" class="text-primary font-bold">Inicia sesión</a></div>`;
    return;
  }

  container.innerHTML = `<div class="soft-card p-6 text-center">Cargando perros...</div>`;
  try {
    const perros = await getPerrosUsuario();
    container.innerHTML = '';
    if (!perros || perros.length === 0) {
      if (emptyBox) emptyBox.classList.remove('hidden');
      return;
    }
    perros.forEach(perro => container.appendChild(createPerroCard(perro)));
  } catch (err) {
    container.innerHTML = `<div class="soft-card p-6 text-center text-red-600">No se pudieron cargar los perros.</div>`;
  }
}

function createPerroCard(perro) {
  const card = document.createElement('div');
  card.className = 'soft-card p-6 rounded-lg';

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

  const delBtn = card.querySelector('button[data-id]');
  if (delBtn) {
    delBtn.addEventListener('click', async () => {
      const id = delBtn.getAttribute('data-id');
      if (!confirm('¿Eliminar este perro? Esta acción no se puede deshacer.')) return;
      try {
        await deletePerro(id);
        card.remove();
        const container = document.getElementById('hogar-list');
        if (container && container.children.length === 0) document.getElementById('hogar-empty')?.classList.remove('hidden');
      } catch (err) {
        alert('No se pudo eliminar el perro.');
      }
    });
  }
  return card;
}

async function deletePerro(id) {
  if (!id) throw new Error('id inválido');
  const res = await apiFetch(`/perros/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const txt = await res.text().catch(()=>null);
    throw new Error(txt || 'Error al eliminar');
  }
  return true;
}

// ---------- CITAS ----------
async function getCitasAll() {
  try {
    const res = await apiFetch('/citas', { method: 'GET' });
    const all = await res.json().catch(()=>[]);
    return Array.isArray(all) ? all : [];
  } catch (err) {
    console.error('Error al obtener citas:', err);
    throw err;
  }
}

// Para usuario normal: sus citas (cruzando con sus perros)
async function getCitasUsuario() {
  const user = getUser();
  if (!user) return null;
  try {
    const perros = await getPerrosUsuario();
    const ids = (perros || []).map(p => Number(p.id));
    const all = await getCitasAll();
    // filtramos por id_perro
    return all.filter(c => ids.includes(Number(c.id_perro)));
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function createCitaCard(cita, extraInfo = {}) {
  // extraInfo puede contener nombrePerro, email usuario, etc.
  const card = document.createElement('div');
  card.className = 'soft-card p-4 rounded-lg';

  const fecha = cita.fecha || '';
  const hora = cita.hora || '';

  card.innerHTML = `
    <div class="flex flex-col">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="font-bold text-accent">${escapeHtml(extraInfo.nombrePerro || 'Perro')}</h4>
          <p class="text-sm text-gray-600">${fecha} ${hora}</p>
        </div>
        <div class="text-sm text-gray-500">${escapeHtml(extraInfo.usuarioEmail || '')}</div>
      </div>
      <div class="mt-3 flex gap-2">
        <a class="px-3 py-2 rounded border text-sm text-[var(--canem-primary)]" href="cita-edit.html?id=${encodeURIComponent(cita.id)}">Editar</a>
        <button class="px-3 py-2 rounded bg-red-600 text-white text-sm" data-id="${encodeURIComponent(cita.id)}">Eliminar</button>
      </div>
    </div>
  `;

  const delBtn = card.querySelector('button[data-id]');
  if (delBtn) {
    delBtn.addEventListener('click', async () => {
      const id = delBtn.getAttribute('data-id');
      if (!confirm('¿Eliminar esta cita?')) return;
      try {
        await deleteCita(id);
        card.remove();
      } catch (err) {
        alert('No se pudo eliminar la cita.');
      }
    });
  }

  return card;
}

async function deleteCita(id) {
  if (!id) throw new Error('id inválido');
  const res = await apiFetch(`/citas/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const txt = await res.text().catch(()=>null);
    throw new Error(txt || 'Error al eliminar cita');
  }
  return true;
}

// render de la página de citas
async function renderCitas() {
  const container = document.getElementById('citas-list');
  const emptyBox = document.getElementById('citas-empty');
  if (!container) return;

  container.innerHTML = '';
  if (emptyBox) emptyBox.classList.add('hidden');

  const user = getUser();
  if (!user) {
    container.innerHTML = `<div class="soft-card p-6 text-center">Necesitas iniciar sesión para ver citas. <a href="login.html" class="text-primary font-bold">Inicia sesión</a></div>`;
    return;
  }

  container.innerHTML = `<div class="soft-card p-6 text-center">Cargando citas...</div>`;
  const isAdmin = Boolean(user.rol || user.role || user.isAdmin);

  try {
    if (isAdmin) {
      // admin: mostrar todas las citas agrupadas por fecha
      const all = await getCitasAll();
      container.innerHTML = '';
      if (!all || all.length === 0) {
        if (emptyBox) emptyBox.classList.remove('hidden');
        return;
      }
      // ordenar por fecha
      all.sort((a,b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
      // crear tarjetas (podemos intentar mapear perro y usuario si el backend no lo ofrece)
      // pedimos perros y usuarios para enriquecer la info
      const perros = await (await apiFetch('/perros', { method: 'GET' })).json().catch(()=>[]);
      const usuarios = await (await apiFetch('/usuarios', { method: 'GET' })).json().catch(()=>[]);

      all.forEach(cita => {
        const perro = (perros || []).find(p => Number(p.id) === Number(cita.id_perro)) || {};
        const userOwner = (usuarios || []).find(u => Number(u.id) === Number(perro.id_usuario)) || {};
        const extra = { nombrePerro: perro.nombre || 'Perro', usuarioEmail: userOwner.email || '' };
        container.appendChild(createCitaCard(cita, extra));
      });
    } else {
      // usuario normal: mostrar solo sus citas
      const citas = await getCitasUsuario();
      container.innerHTML = '';
      if (!citas || citas.length === 0) {
        if (emptyBox) emptyBox.classList.remove('hidden');
        return;
      }
      // obtener perros del usuario para nombre
      const perros = await getPerrosUsuario();
      citas.sort((a,b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
      citas.forEach(cita => {
        const perro = (perros || []).find(p => Number(p.id) === Number(cita.id_perro)) || {};
        const extra = { nombrePerro: perro.nombre || 'Perro', usuarioEmail: '' };
        container.appendChild(createCitaCard(cita, extra));
      });
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = `<div class="soft-card p-6 text-center text-red-600">No se pudieron cargar las citas.</div>`;
  }
}

// ---------- USUARIOS (admin) ----------
async function getUsuariosAll() {
  try {
    const res = await apiFetch('/usuarios', { method: 'GET' });
    const all = await res.json().catch(()=>[]);
    return Array.isArray(all) ? all : [];
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    throw err;
  }
}

function createUsuarioRow(usuario) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="px-4 py-2 border-b">${escapeHtml(usuario.id)}</td>
    <td class="px-4 py-2 border-b">${escapeHtml(usuario.nombre)} ${escapeHtml(usuario.apellido)}</td>
    <td class="px-4 py-2 border-b">${escapeHtml(usuario.email)}</td>
    <td class="px-4 py-2 border-b">${usuario.rol ? 'Admin' : 'Cliente'}</td>
    <td class="px-4 py-2 border-b">
      <button class="px-3 py-1 rounded bg-yellow-500 text-white btn-toggle-role" data-id="${encodeURIComponent(usuario.id)}">Cambiar rol</button>
    </td>
  `;
  // listener cambiar rol
  const btn = tr.querySelector('.btn-toggle-role');
  if (btn) {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      // petición PUT para cambiar rol (backend debe soportarlo)
      try {
        // obtener usuario actual -> invertir rol
        const currentRol = usuario.rol ? 1 : 0;
        const newRol = currentRol ? 0 : 1;
        const res = await apiFetch(`/usuarios/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ rol: newRol })
        });
        if (!res.ok) {
          const txt = await res.text().catch(()=>null);
          throw new Error(txt || 'Error al actualizar rol');
        }
        // recargar tabla
        await renderUsuarios();
      } catch (err) {
        alert('No se pudo actualizar el rol.');
      }
    });
  }
  return tr;
}

async function renderUsuarios() {
  const container = document.getElementById('usuarios-table-body');
  const emptyBox = document.getElementById('usuarios-empty');
  if (!container) return;
  container.innerHTML = '';
  if (emptyBox) emptyBox.classList.add('hidden');

  const user = getUser();
  if (!user || !(user.rol || user.role || user.isAdmin)) {
    container.parentElement.innerHTML = `<div class="soft-card p-6 text-center">No autorizado. Solo admins.</div>`;
    return;
  }

  try {
    const usuarios = await getUsuariosAll();
    if (!usuarios || usuarios.length === 0) {
      if (emptyBox) emptyBox.classList.remove('hidden');
      return;
    }
    // crear filas
    usuarios.forEach(u => {
      container.appendChild(createUsuarioRow(u));
    });
  } catch (err) {
    container.parentElement.innerHTML = `<div class="soft-card p-6 text-center text-red-600">No se pudieron cargar los usuarios.</div>`;
  }
}

// ---------- helpers ----------
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

// ---------- inicialización al cargar la página ----------
document.addEventListener('DOMContentLoaded', () => {
  // mobile toggle
  const btn = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) btn.addEventListener('click', () => menu.classList.toggle('hidden'));

  // re-render header (por si el usuario cambió)
  renderHeaderActions();

  const path = location.pathname.split('/').pop();
  if (path === 'hogar.html' || path === 'portal.html') {
    renderHogar();
  } else if (path === 'citas.html') {
    renderCitas();
  } else if (path === 'usuarios.html') {
    renderUsuarios();
  } else if (path === 'perfil.html') {
    renderPerfilPage();
  }
});

// ---------- PERFIL: render de la página perfil.html ----------
function renderPerfilPage() {
  const el = document.getElementById('perfil-container');
  if (!el) return;
  const user = getUser();
  if (!user) {
    el.innerHTML = `<div class="soft-card p-6 text-center">Para ver tu perfil, inicia sesión. <br/><a href="login.html" class="text-primary font-bold">Inicia sesión</a></div>`;
    return;
  }
  el.innerHTML = `
    <div class="soft-card p-8">
      <h2 class="text-2xl font-bold mb-4">Tu perfil</h2>
      <div class="space-y-2 text-gray-700">
        <p><strong>Nombre:</strong> ${escapeHtml(user.nombre || user.name || '')} ${escapeHtml(user.apellido || user.lastname || '')}</p>
        <p><strong>Email:</strong> ${escapeHtml(user.email || '')}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(user.telefono || '')}</p>
        <p><strong>Rol:</strong> ${user.rol ? 'Admin' : 'Cliente'}</p>
      </div>
      <div class="mt-6 flex gap-3">
        <a href="perfil-edit.html" class="px-4 py-2 rounded bg-[var(--canem-primary)] text-white">Editar perfil</a>
        <button id="perfil-logout" class="px-4 py-2 rounded bg-gray-100">Cerrar sesión</button>
      </div>
    </div>
  `;
  document.getElementById('perfil-logout').addEventListener('click', () => {
    clearToken(); clearUser(); renderHeaderActions(); location.href = 'index.html';
  });
}