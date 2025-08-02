import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-16 relative z-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;
