const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("petpal_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

export const api = {
  auth: {
    signup: (body) => request("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
    login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    me: () => request("/auth/me"),
  },
  pets: {
    list: () => request("/pets"),
    create: (body) => request("/pets", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) => request(`/pets/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id) => request(`/pets/${id}`, { method: "DELETE" }),
  },
  sitters: {
    list: () => request("/sitters"),
    get: (id) => request(`/sitters/${id}`),
    getProfile: () => request("/sitters/me"),
    updateProfile: (body) => request("/sitters/me", { method: "PUT", body: JSON.stringify(body) }),
  },
  bookings: {
    list: () => request("/bookings"),
    create: (body) => request("/bookings", { method: "POST", body: JSON.stringify(body) }),
    updateStatus: (id, status) =>
      request(`/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  },
};
