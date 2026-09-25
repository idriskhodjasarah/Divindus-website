const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Une erreur est survenue.");
  }
  return data;
}

// Reads the session saved at login and returns an Authorization header for it,
// so requests that need to prove "who's asking" (admin writes, own orders, etc.)
// can be sent as: apiFetch(path, { method: "POST", headers: authHeader(), ... })
export function authHeader() {
  try {
    const raw = localStorage.getItem("divindus_session");
    if (!raw) return {};
    const session = JSON.parse(raw);
    return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
  } catch {
    return {};
  }
}