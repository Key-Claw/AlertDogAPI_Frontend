// 1. URL base del backend (prioriza variables de entorno)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// 2. Cliente HTTP generico para metodos REST
async function request(path, options = {}) {
  const { body, headers, ...rest } = options;
  const hasBody = body !== undefined && body !== null;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(headers || {}),
    },
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  // 3. Intentar parsear respuesta segun tipo de contenido
  const contentType = response.headers.get('content-type') || '';
  let payload = null;

  if (contentType.includes('application/json')) {
    payload = await response.json();
  } else {
    const text = await response.text();
    payload = text || null;
  }

  // 4. Normalizar errores para que toda la app los maneje igual
  if (!response.ok) {
    const message = payload?.error || payload?.message || `HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

// 5. API client publico por verbo HTTP
export const apiClient = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, data) => request(path, { method: 'POST', body: data }),
  put: (path, data) => request(path, { method: 'PUT', body: data }),
  delete: (path) => request(path, { method: 'DELETE' }),
};