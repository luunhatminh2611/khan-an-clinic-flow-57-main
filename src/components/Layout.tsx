
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  const location = useLocation();
  const noLayoutRoutes = ['/auth', '/home'];
  const isNoLayoutPage = noLayoutRoutes.some(path => location.pathname.startsWith(path));

  if (isNoLayoutPage) {
    return <div className="min-h-screen bg-clinic-gray"><Outlet /></div>;
  }

  return (
    <div className="min-h-screen bg-clinic-gray flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;