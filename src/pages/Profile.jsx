import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../stores/authStore';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="px-4 md:px-16 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-3xl font-bold mb-8">Manage Profiles</h1>
          
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-20 h-20 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold mb-2">
                  {user?.name || 'User'}
                </h2>
                <p className="text-gray-400">{user?.email}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-white text-lg font-semibold mb-4">Profile Settings</h3>
              <div className="space-y-4">
                <p className="text-gray-400">Profile management features coming soon...</p>
                <div className="flex space-x-4">
                  <Link
                    to="/"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium"
                  >
                    Back to Home
                  </Link>
                  <Link
                    to="/account"
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded font-medium"
                  >
                    Account Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
