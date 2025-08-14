const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
});

export const userApi = {
  async getCurrent() {
    const res = await fetch(`${API_URL}/user`, { headers: authHeaders(), credentials: 'include' });
    if (!res.ok) throw new Error(`GET /user failed: ${res.status}`);
    return res.json();
  },
  async updateProfile(payload) {
    const res = await fetch(`${API_URL}/userUpdate`, {
      method: 'PUT',
      headers: authHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`PUT /userUpdate failed: ${res.status} ${text}`);
    }
    return res.json();
  },
 
};
