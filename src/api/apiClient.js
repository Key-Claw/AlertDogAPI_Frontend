
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Función genérica para hacer peticiones a la API
async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  };

  // Si el cuerpo es un objeto, convertirlo a JSON
  if (options.body && typeof options.body === 'object') {
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  // Intentar parsear la respuesta como JSON, pero manejar casos donde no sea posible
  let payload = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    payload = await response.json();
  } else {
    const text = await response.text();
    payload = text || null;
  }

  if (!response.ok) {
    const message =
      (payload && payload.error) ||
      (payload && payload.message) ||
      `HTTP ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    err.payload = payload;
    throw err;
  }

  return payload;
}

// Exportar un objeto con métodos para cada verbo HTTP
export const apiClient = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, data) =>
    request(path, { method: 'POST', body: JSON.stringify(data) }),
  put: (path, data) =>
    request(path, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (path) => request(path, { method: 'DELETE' })
};