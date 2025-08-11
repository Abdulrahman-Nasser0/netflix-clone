import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";

const Account = () => {
  const { user, logout, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogout = async () => {
    await logout();
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    const payload = { name: form.name, bio: form.bio, phone: form.phone };
    const res = await updateUser(payload);
    if (!res.success) setError(res.error || "Failed to update");
    else setSuccess("Profile updated");
    setSaving(false);
  };

  return (
    <Layout>
      <div className="px-4 md:px-16 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-3xl font-bold mb-8">
            Account Settings
          </h1>

          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-white text-xl font-semibold mb-4">
                Account Information
              </h2>
              <form onSubmit={onSave} className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-1">
                    Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">
                    Email
                  </label>
                  <input
                    disabled
                    value={user?.email || ""}
                    className="w-full bg-gray-900 text-gray-400 px-3 py-2 rounded border border-gray-700"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={onChange}
                    rows={3}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
                  />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                {success && <p className="text-green-400 text-sm">{success}</p>}
                <div className="flex gap-3">
                  <button
                    disabled={saving}
                    type="submit"
                    className="cursor-pointer bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-4 py-2 rounded"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        name: user?.name || "",
                        bio: user?.bio || "",
                        phone: user?.phone || "",
                      })
                    }
                    className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    Reset
                  </button>
                </div>
                <div className="pt-2 text-xs text-gray-400">
                  Member since:{" "}
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "Not available"}
                </div>
              </form>
            </div>

            {/* Subscription Info */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-white text-xl font-semibold mb-4">
                Subscription
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-gray-400 text-sm">Plan</label>
                  <p className="text-white">Netflix Standard</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Status</label>
                  <p className="text-green-400">Active</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">
                    Next billing date
                  </label>
                  <p className="text-white">-</p>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-white text-xl font-semibold mb-4">
                Account Actions
              </h2>
              <div className="space-y-4">
                <Link to="/coming-soon" className="block w-full text-left cursor-pointer bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded border border-gray-600">
                  Change Password
                </Link>
                <Link to="/coming-soon" className="block w-full text-left cursor-pointer bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded border border-gray-600">
                  Update Email
                </Link>
                <Link to="/coming-soon" className="block w-full text-left cursor-pointer bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded border border-gray-600">
                  Privacy Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left cursor-pointer bg-red-800 hover:bg-red-700 text-white px-4 py-3 rounded border border-red-600"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex space-x-4">
              <Link
                to="/"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium"
              >
                Back to Home
              </Link>
              <Link
                to="/profile"
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded font-medium"
              >
                Manage Profiles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
