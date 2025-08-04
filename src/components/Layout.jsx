import React from 'react';
import Header from './Header';
import NetflixBg from './ui/NetflixBg';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen relative ">
      <NetflixBg/>
      <Header />
      <main className="pt-16 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
