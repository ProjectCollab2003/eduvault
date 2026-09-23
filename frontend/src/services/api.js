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
  async create(payload) {
    return request("/grades", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async update(id, payload) {
    return request(`/grades/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  async remove(id) {
    return request(`/grades/${id}`, { method: "DELETE" });
  },
};

export const announcementsApi = {
  async getAll() {
    return request("/announcements");
  },
  async create(payload) {
    return request("/announcements", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async update(id, payload) {
    return request(`/announcements/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  async remove(id) {
    return request(`/announcements/${id}`, { method: "DELETE" });
  },
};

export const subjectsApi = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/subjects${query ? `?${query}` : ""}`);
  },
  async getById(id) {
    return request(`/subjects/${id}`);
  },
  async create(payload) {
    return request("/subjects", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async update(id, payload) {
    return request(`/subjects/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  async remove(id) {
    return request(`/subjects/${id}`, { method: "DELETE" });
  },
};

export const usersApi = {
  async getStudents() {
    return request("/users/students");
  },
};

export const materialsApi = {
  async getCategories() { return request("/materials/categories"); },
  async getRecent(limit = 6) {
    return request(`/materials/recent?limit=${limit}`);
  },
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/materials${query ? `?${query}` : ""}`);
  },
  async upload(file) {
    const token = localStorage.getItem("eduvault_token");
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE}/materials/upload`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Upload failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  },
  async incrementView(id) {
    return request(`/materials/${id}/view`, { method: "POST" });
  },
  async incrementDownload(id) {
    return request(`/materials/${id}/download`, { method: "POST" });
  },
  async create(payload) {
    return request("/materials", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async update(id, payload) {
    return request(`/materials/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  async remove(id) {
    return request(`/materials/${id}`, { method: "DELETE" });
  },
};

export const studentApi = {
  async getDashboard() { return request("/student/dashboard"); },
  async getBookmarks() { return request("/student/bookmarks"); },
  async addBookmark(materialId) { return request(`/student/bookmarks/${materialId}`, { method: "POST" }); },
  async removeBookmark(materialId) { return request(`/student/bookmarks/${materialId}`, { method: "DELETE" }); },
  async recordAccess(materialId) { return request(`/student/history/${materialId}`, { method: "POST" }); },
};
