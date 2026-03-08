// scripts.js (frontend)
const API_BASE = 'http://localhost:3000/api'; 

function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
setYear();

// --- Estado de sesión ---
function getToken() { return localStorage.getItem('canem_token'); }
function setToken(t) { localStorage.setItem('canem_token', t); }
function clearToken() { localStorage.removeItem('canem_token'); }

function getUser() {
  const raw = localStorage.getItem('canem_user');
  return raw ? JSON.parse(raw) : null;
}
function setUser(u) { localStorage.setItem('canem_user', JSON.stringify(u)); }
function clearUser() { localStorage.removeItem('canem_user'); }

// --- renderHeaderActions (replace previous) ---
function renderHeaderActions() {
  const desktop = document.getElementById('header-actions');
  const mobile = document.getElementById('mobile-header-actions');
  if (desktop) desktop.innerHTML = '';
  if (mobile) mobile.innerHTML = '';

  const user = getUser();

  if (!user) {
    // botones cuando NO hay sesión
    const loginLink = createAnchor('Login', 'login.html', 'text-primary font-semibold');
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
    const portalLink = createAnchor('<i class="fas fa-user-circle mr-1"></i> Tus perros', 'portal.html', 'text-primary font-semibold', true);
    const bookingLink = createAnchor('Pedir cita', 'booking.html', 'px-5 py-2.5 rounded-xl bg-white text-primary font-bold border shadow-sm hover:shadow-md transition-all');
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'ml-2 text-sm text-gray-500';
    logoutBtn.textContent = 'Cerrar sesión';
    logoutBtn.addEventListener('click', () => {
      clearToken(); clearUser(); renderHeaderActions();
      if (location.pathname.endsWith('portal.html')) location.href = 'index.html';
    });

    if (desktop) {
      desktop.appendChild(portalLink);
      desktop.appendChild(bookingLink);
      desktop.appendChild(logoutBtn);
      desktop.classList.remove('hidden');
    }
    if (mobile) {
      mobile.appendChild(portalLink.cloneNode(true));
      mobile.appendChild(bookingLink.cloneNode(true));
      const mobLogout = logoutBtn.cloneNode(true);
      mobLogout.addEventListener('click', () => { clearToken(); clearUser(); renderHeaderActions(); document.getElementById('mobile-menu')?.classList.add('hidden'); });
      mobile.appendChild(mobLogout);
    }
  }
}

// helper: crea <a> con clases y (opcional) html dentro
function createAnchor(textOrHtml, href, className = '', isHtml = false) {
  const a = document.createElement('a');
  a.href = href;
  a.className = className;
  if (isHtml) a.innerHTML = textOrHtml;
  else a.textContent = textOrHtml;
  return a;
}
renderHeaderActions();

// --- Modal simple de login / register (crea un modal en DOM) ---
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
      // si estás en portal y eres usuario normal, recargar para ver perros
      if (location.pathname.endsWith('portal.html')) location.reload();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
}

// --- utils fetch con token ---
async function apiFetch(path, opts = {}) {
  const token = getToken();
  opts.headers = opts.headers || {};
  opts.headers['Content-Type'] = 'application/json';
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API_BASE + path, opts);
  if (res.status === 401) {
    // sesión caducada, limpiar
    clearToken(); clearUser(); renderHeaderActions();
    throw new Error('No autorizado');
  }
  return res;
} 