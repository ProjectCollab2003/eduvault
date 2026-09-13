const API_BASE = "/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("eduvault_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authApi = {
  async register({ name, email, password, grade_id }) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, grade_id }),
    });
  },

  async login({ email, password }) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async getMe() {
    return request("/auth/me");
  },
};

export const statsApi = {
  async get() {
    return request("/stats");
  },
};

export const gradesApi = {
  async getAll() {
    return request("/grades");
  },
  async getById(id) {
    return request(`/grades/${id}`);
  },
};

export const announcementsApi = {
  async getAll() {
    return request("/announcements");
  },
};

export const materialsApi = {
  async getRecent(limit = 6) {
    return request(`/materials/recent?limit=${limit}`);
  },
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/materials${query ? `?${query}` : ""}`);
  },
  async incrementView(id) {
    return request(`/materials/${id}/view`, { method: "POST" });
  },
  async incrementDownload(id) {
    return request(`/materials/${id}/download`, { method: "POST" });
  },
};
