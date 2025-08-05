import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const Account = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Layout>
      <div className="px-4 md:px-16 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-3xl font-bold mb-8">Account Settings</h1>
          
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Account Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-gray-400 text-sm">Name</label>
                  <p className="text-white">{user?.name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Email</label>
                  <p className="text-white">{user?.email || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Member since</label>
                  <p className="text-white">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Not available'}
                  </p>
                </div>
              </div>
            </div>

            {/* Subscription Info */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Subscription</h2>
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
                  <label className="text-gray-400 text-sm">Next billing date</label>
                  <p className="text-white">-</p>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Account Actions</h2>
              <div className="space-y-4">
                <button className="w-full text-left bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded border border-gray-600">
                  Change Password
                </button>
                <button className="w-full text-left bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded border border-gray-600">
                  Update Email
                </button>
                <button className="w-full text-left bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded border border-gray-600">
                  Privacy Settings
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left bg-red-800 hover:bg-red-700 text-white px-4 py-3 rounded border border-red-600"
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
