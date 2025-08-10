const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
});

export const userApi = {
  async getCurrent() {
    const res = await fetch(`${API_URL}/me`, { headers: authHeaders(), credentials: 'include' });
    if (!res.ok) throw new Error(`GET /me failed: ${res.status}`);
    return res.json();
  },
  async updateProfile(payload) {
    const res = await fetch(`${API_URL}/user`, {
      method: 'PUT',
      headers: authHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`PUT /user failed: ${res.status} ${text}`);
    }
    return res.json();
  },
  async uploadAvatar(file) {
    const form = new FormData();
  // Backend expects the file field to be named 'avatarUrl'
  form.append('avatarUrl', file);
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` };
    const res = await fetch(`${API_URL}/user/avatar`, { method: 'POST', headers, body: form, credentials: 'include' });
    if (!res.ok) throw new Error(`POST /user/avatar failed: ${res.status}`);
    return res.json();
  },
};
