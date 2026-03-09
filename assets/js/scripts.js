// scripts.js - versión corregida: sesión, header dinámico, hogar, perfil, usuarios (admin) y citas
const API_BASE = 'http://localhost:3000';

let swalLoader;
function loadSwal() {
  if (window.Swal) return Promise.resolve(window.Swal);
  if (!swalLoader) {
    swalLoader = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
      script.onload = () => resolve(window.Swal);
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    });
  }
  return swalLoader;
}

async function notify(type, message) {
  const swal = await loadSwal();
  if (!swal) {
    alert(message);
    return;
  }
  const icon = type === 'error' ? 'error' : 'success';
  await swal.fire({
    icon,
    text: message,
    timer: 1800,
    showConfirmButton: false
  });
}

async function confirmAction(message) {
  const swal = await loadSwal();
  if (!swal) {
    return confirm(message);
  }
  const result = await swal.fire({
    icon: 'warning',
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar'
  });
  return result.isConfirmed;
}

function isAdminUser(user) {
  const roleValue = user?.rol ?? user?.role ?? user?.isAdmin;
  return roleValue === true || roleValue === 1 || roleValue === '1' || roleValue === 'admin';
}

function toPublicUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

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

// ---------- utils ----------
function pathEndsWithAny(targetPath, arr) {
  return arr.some(p => targetPath.endsWith(p));
}

// ---------- header actions (ahora según rol) ----------
function renderHeaderActions() {
  const desktop = document.getElementById('header-actions');
  const mobile = document.getElementById('mobile-header-actions');
  if (desktop) desktop.innerHTML = '';
  if (mobile) mobile.innerHTML = '';

  const user = getUser();

  if (!user) {
    const loginLink = createAnchor('Iniciar sesión', '/pages/auth/login.html', 'text-primary font-semibold');
    const registerLink = createAnchor('Registrarse', '/pages/auth/register.html', 'soft-btn soft-btn-primary px-5 py-2.5 text-white font-bold');

    if (desktop) {
      // dejamos las utilidades de CSS originales: 'hidden md:flex' en el markup
      desktop.appendChild(loginLink.cloneNode(true));
      desktop.appendChild(registerLink.cloneNode(true));
    }
    if (mobile) {
      // para móvil queremos enlaces verticales: clonamos y añadimos clases block
      const mLogin = loginLink.cloneNode(true);
      mLogin.classList.add('block', 'py-2', 'text-accent');
      const mRegister = registerLink.cloneNode(true);
      mRegister.classList.add('block', 'py-2', 'text-accent');
      mobile.appendChild(mLogin);
      mobile.appendChild(mRegister);
    }
    return;
  }

  const isAdmin = isAdminUser(user);
  const leftLink1 = isAdmin
    ? createAnchor('Usuarios', '/pages/app/usuarios.html', 'text-primary font-semibold')
    : createAnchor('Perfil', '/pages/app/perfil.html', 'text-primary font-semibold');
  const citasLink = createAnchor('Citas', '/pages/app/citas.html', 'text-primary font-semibold');
  const hogarLink = createAnchor('Hogar', '/pages/app/hogar.html', 'text-primary font-semibold');

  const logoutBtn = document.createElement('button');
  logoutBtn.className = 'ml-2 text-sm text-gray-500';
  logoutBtn.textContent = 'Cerrar sesión';
  logoutBtn.addEventListener('click', () => {
    clearToken(); clearUser(); renderHeaderActions();
    const currentPath = location.pathname;
    if (pathEndsWithAny(currentPath, [
      '/pages/app/portal.html',
      '/pages/app/hogar.html',
      '/pages/app/perfil.html',
      '/pages/app/usuarios.html',
      '/pages/app/citas.html',
      '/pages/app/perros.html',
      '/pages/app/booking.html'
    ])) {
      location.href = '/pages/public/index.html';
    }
  });

  if (desktop) {
    // NO removemos 'hidden' para que siga respetando el breakpoint (hidden md:flex)
    desktop.appendChild(leftLink1);
    desktop.appendChild(citasLink);
    desktop.appendChild(hogarLink);
    desktop.appendChild(logoutBtn);
  }

  if (mobile) {
    // para móvil: clonamos y forzamos estilos de bloque (orden vertical)
    const mLeft = leftLink1.cloneNode(true);
    const mCitas = citasLink.cloneNode(true);
    const mHogar = hogarLink.cloneNode(true);
    mLeft.classList.add('block', 'py-2', 'text-accent');
    mCitas.classList.add('block', 'py-2', 'text-accent');
    mHogar.classList.add('block', 'py-2', 'text-accent');

    mobile.appendChild(mLeft);
    mobile.appendChild(mCitas);
    mobile.appendChild(mHogar);

    const mobLogout = logoutBtn.cloneNode(true);
    mobLogout.classList.add('block', 'py-2', 'text-accent', 'w-full', 'text-left');
    mobLogout.addEventListener('click', () => {
      clearToken(); clearUser(); renderHeaderActions();
      document.getElementById('mobile-menu')?.classList.add('hidden');
      location.href = '/pages/public/index.html';
    });
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
      if (mode === 'login') {
        const res = await fetch(`${API_BASE}/usuarios`);
        const usuarios = await res.json();
        if (!res.ok || !Array.isArray(usuarios)) throw new Error('No se pudo consultar usuarios');

        const found = usuarios.find((u) => {
          const identifier = username.toLowerCase();
          const emailMatch = String(u.email || '').toLowerCase() === identifier;
          const phoneMatch = String(u.telefono || '') === username;
          const nameMatch = String(u.nombre || '').toLowerCase() === identifier;
          return (emailMatch || phoneMatch || nameMatch) && String(u.password || '') === password;
        });

        if (!found) throw new Error('Credenciales inválidas');

        setToken('local-session');
        setUser(toPublicUser(found));
      } else {
        const email = username.includes('@') ? username : `${username}@canem.local`;
        const payload = {
          rol: 0,
          nombre: username,
          apellido: 'Usuario',
          email,
          telefono: String(Date.now()).slice(-10),
          password
        };

        const res = await fetch(`${API_BASE}/usuarios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'No se pudo crear la cuenta');

        setToken('local-session');
        setUser({
          id: data.id_usuario,
          rol: 0,
          nombre: payload.nombre,
          apellido: payload.apellido,
          email: payload.email,
          telefono: payload.telefono
        });
      }
      renderHeaderActions();
      modal.remove();
      const currentPath = location.pathname;
      if (pathEndsWithAny(currentPath, [
        '/pages/app/portal.html',
        '/pages/app/hogar.html',
        '/pages/app/perfil.html',
        '/pages/app/citas.html',
        '/pages/app/usuarios.html',
        '/pages/app/perros.html',
        '/pages/app/booking.html'
      ])) location.reload();
    } catch (err) {
      await notify('error', 'Error: ' + err.message);
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

async function getPerrosAll() {
  try {
    const res = await apiFetch('/perros', { method: 'GET' });
    const all = await res.json().catch(() => []);
    return Array.isArray(all) ? all : [];
  } catch (err) {
    console.error('Error al obtener perros:', err);
    throw err;
  }
}

async function getPerrosByQuery(searchText = '') {
  const qs = new URLSearchParams();
  if (searchText) qs.set('q', searchText);
  const res = await apiFetch(`/perros${qs.toString() ? `?${qs.toString()}` : ''}`, { method: 'GET' });
  const all = await res.json().catch(() => []);
  return Array.isArray(all) ? all : [];
}

async function renderHomeListado(searchText = '') {
  const list = document.getElementById('home-list');
  if (!list) return;

  list.innerHTML = `<div class="soft-card p-6 text-center col-span-full">Cargando listado...</div>`;
  try {
    const perros = await getPerrosByQuery(searchText);
    list.innerHTML = '';

    if (!perros.length) {
      list.innerHTML = `<div class="soft-card p-6 text-center col-span-full">No se encontraron perros para ese criterio.</div>`;
      return;
    }

    perros.forEach((perro) => {
      const card = document.createElement('article');
      card.className = 'soft-card p-5';
      card.innerHTML = `
        <h3 class="text-xl font-bold text-accent">${escapeHtml(perro.nombre || 'Sin nombre')}</h3>
        <p class="text-gray-600">${escapeHtml(perro.raza || 'Sin raza')}</p>
        <a class="inline-block mt-4 text-primary font-semibold" href="/pages/app/perros.html?id=${encodeURIComponent(perro.id)}">Ver detalle</a>
      `;
      list.appendChild(card);
    });
  } catch (err) {
    list.innerHTML = `<div class="soft-card p-6 text-center text-red-600 col-span-full">No se pudo cargar el listado.</div>`;
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
    container.innerHTML = `<div class="soft-card p-6 text-center">Para ver tus perros necesitas iniciar sesión. <br/><a href="/pages/auth/login.html" class="text-primary font-bold">Inicia sesión</a></div>`;
    return;
  }

  container.innerHTML = `<div class="soft-card p-6 text-center">Cargando perros...</div>`;
  try {
    const perros = isAdminUser(user) ? await getPerrosAll() : await getPerrosUsuario();
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
  const imgSrc = perro.imagen || '/Foto2.jpg';

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
        <a class="px-4 py-2 rounded-lg border text-sm text-[var(--canem-primary)] hover:bg-[var(--canem-primary)] hover:text-white transition-colors" href="/pages/app/perros.html?id=${encodeURIComponent(perro.id)}">Gestionar</a>
        <button class="px-4 py-2 rounded-lg bg-red-600 text-white text-sm" data-id="${encodeURIComponent(perro.id)}">Eliminar</button>
      </div>
    </div>
  `;

  const delBtn = card.querySelector('button[data-id]');
  if (delBtn) {
    delBtn.addEventListener('click', async () => {
      const id = delBtn.getAttribute('data-id');
      if (!(await confirmAction('¿Eliminar este perro? Esta acción no se puede deshacer.'))) return;
      try {
        await deletePerro(id);
        card.remove();
        const container = document.getElementById('hogar-list');
        if (container && container.children.length === 0) document.getElementById('hogar-empty')?.classList.remove('hidden');
      } catch (err) {
        await notify('error', 'No se pudo eliminar el perro.');
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

async function getCitasUsuario() {
  const user = getUser();
  if (!user) return null;
  try {
    const perros = isAdminUser(user) ? await getPerrosAll() : await getPerrosUsuario();
    const ids = (perros || []).map(p => Number(p.id));
    const all = await getCitasAll();
    return all.filter(c => ids.includes(Number(c.id_perro)));
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function createCitaCard(cita, extraInfo = {}) {
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
        <a class="px-3 py-2 rounded border text-sm text-[var(--canem-primary)]" href="/pages/app/booking.html?id=${encodeURIComponent(cita.id)}">Gestionar</a>
        <button class="px-3 py-2 rounded bg-red-600 text-white text-sm" data-id="${encodeURIComponent(cita.id)}">Eliminar</button>
      </div>
    </div>
  `;

  const delBtn = card.querySelector('button[data-id]');
  if (delBtn) {
    delBtn.addEventListener('click', async () => {
      const id = delBtn.getAttribute('data-id');
      if (!(await confirmAction('¿Eliminar esta cita?'))) return;
      try {
        await deleteCita(id);
        card.remove();
      } catch (err) {
        await notify('error', 'No se pudo eliminar la cita.');
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

async function renderCitas() {
  const container = document.getElementById('citas-list');
  const emptyBox = document.getElementById('citas-empty');
  if (!container) return;

  container.innerHTML = '';
  if (emptyBox) emptyBox.classList.add('hidden');

  const user = getUser();
  if (!user) {
    container.innerHTML = `<div class="soft-card p-6 text-center">Necesitas iniciar sesión para ver citas. <a href="/pages/auth/login.html" class="text-primary font-bold">Inicia sesión</a></div>`;
    return;
  }

  container.innerHTML = `<div class="soft-card p-6 text-center">Cargando citas...</div>`;
  const isAdmin = isAdminUser(user);

  try {
    if (isAdmin) {
      const all = await getCitasAll();
      container.innerHTML = '';
      if (!all || all.length === 0) {
        if (emptyBox) emptyBox.classList.remove('hidden');
        return;
      }
      all.sort((a,b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
      const perros = await (await apiFetch('/perros', { method: 'GET' })).json().catch(()=>[]);
      const usuarios = await (await apiFetch('/usuarios', { method: 'GET' })).json().catch(()=>[]);

      all.forEach(cita => {
        const perro = (perros || []).find(p => Number(p.id) === Number(cita.id_perro)) || {};
        const userOwner = (usuarios || []).find(u => Number(u.id) === Number(perro.id_usuario)) || {};
        const extra = { nombrePerro: perro.nombre || 'Perro', usuarioEmail: userOwner.email || '' };
        container.appendChild(createCitaCard(cita, extra));
      });
    } else {
      const citas = await getCitasUsuario();
      container.innerHTML = '';
      if (!citas || citas.length === 0) {
        if (emptyBox) emptyBox.classList.remove('hidden');
        return;
      }
      const perros = isAdminUser(user) ? await getPerrosAll() : await getPerrosUsuario();
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
    <td class="px-4 py-2 border-b">${isAdminUser(usuario) ? 'Admin' : 'Cliente'}</td>
    <td class="px-4 py-2 border-b">
      <button class="px-3 py-1 rounded bg-yellow-500 text-white btn-toggle-role" data-id="${encodeURIComponent(usuario.id)}">Cambiar rol</button>
    </td>
  `;
  const btn = tr.querySelector('.btn-toggle-role');
  if (btn) {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      try {
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
        await renderUsuarios();
      } catch (err) {
        await notify('error', 'No se pudo actualizar el rol.');
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
  if (!user || !isAdminUser(user)) {
    container.parentElement.innerHTML = `<div class="soft-card p-6 text-center">No autorizado. Solo admins.</div>`;
    return;
  }

  try {
    const usuarios = await getUsuariosAll();
    if (!usuarios || usuarios.length === 0) {
      if (emptyBox) emptyBox.classList.remove('hidden');
      return;
    }
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

// ---------- page bootstrap ----------
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) btn.addEventListener('click', () => menu.classList.toggle('hidden'));

  renderHeaderActions();

  const path = location.pathname;
  const user = getUser();
  const protectedPaths = [
    '/pages/app/hogar.html',
    '/pages/app/portal.html',
    '/pages/app/citas.html',
    '/pages/app/perfil.html',
    '/pages/app/perros.html',
    '/pages/app/booking.html',
    '/pages/app/usuarios.html'
  ];

  if (pathEndsWithAny(path, protectedPaths) && !user) {
    location.href = '/pages/auth/login.html';
    return;
  }

  if (pathEndsWithAny(path, ['/pages/app/usuarios.html']) && !isAdminUser(user)) {
    location.href = '/pages/public/index.html';
    return;
  }

  if ((pathEndsWithAny(path, ['/pages/auth/login.html', '/pages/auth/register.html'])) && user) {
    location.href = '/pages/app/portal.html';
    return;
  }

  if (pathEndsWithAny(path, ['/pages/app/hogar.html', '/pages/app/portal.html'])) {
    renderHogar();
  } else if (pathEndsWithAny(path, ['/pages/app/citas.html'])) {
    renderCitas();
  } else if (pathEndsWithAny(path, ['/pages/app/usuarios.html'])) {
    renderUsuarios();
  } else if (pathEndsWithAny(path, ['/pages/app/perfil.html'])) {
    renderPerfilPage();
  } else if (path === '/' || pathEndsWithAny(path, ['/index.html', '/pages/public/index.html'])) {
    renderHomeListado();
    const searchInput = document.getElementById('home-search');
    if (searchInput) {
      let timer;
      searchInput.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          renderHomeListado(searchInput.value.trim());
        }, 250);
      });
    }
  }
});

// ---------- PERFIL ----------
function renderPerfilPage() {
  const el = document.getElementById('perfil-container');
  if (!el) return;
  const user = getUser();
  if (!user) {
    el.innerHTML = `<div class="soft-card p-6 text-center">Para ver tu perfil, inicia sesión. <br/><a href="/pages/auth/login.html" class="text-primary font-bold">Inicia sesión</a></div>`;
    return;
  }
  el.innerHTML = `
    <div class="soft-card p-8">
      <h2 class="text-2xl font-bold mb-4">Tu perfil</h2>
      <div class="space-y-2 text-gray-700">
        <p><strong>Nombre:</strong> ${escapeHtml(user.nombre || user.name || '')} ${escapeHtml(user.apellido || user.lastname || '')}</p>
        <p><strong>Email:</strong> ${escapeHtml(user.email || '')}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(user.telefono || '')}</p>
        <p><strong>Rol:</strong> ${isAdminUser(user) ? 'Admin' : 'Cliente'}</p>
      </div>
      <div class="mt-6 flex gap-3">
        <a href="/pages/auth/register.html" class="px-4 py-2 rounded bg-[var(--canem-primary)] text-white">Actualizar datos</a>
        <button id="perfil-logout" class="px-4 py-2 rounded bg-gray-100">Cerrar sesión</button>
      </div>
    </div>
  `;
  document.getElementById('perfil-logout').addEventListener('click', () => {
    clearToken(); clearUser(); renderHeaderActions(); location.href = '/pages/public/index.html';
  });
}