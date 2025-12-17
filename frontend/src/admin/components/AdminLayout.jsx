import { Navigate, Outlet } from 'react-router-dom';
import { adminAuth } from '../utils/adminAuth';
import AdminSidebar from './AdminSidebar';
import { useState } from 'react';
import { Menu } from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!adminAuth.isAuthenticated()) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }


  return (
    <div className="min-h-screen bg-amber-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-charcoal/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-amber-25 border-b border-emerald-200/30 p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-amber-50 border border-emerald-200/50 text-charcoal hover:bg-amber-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-display font-bold text-charcoal">
              Admin Panel
            </h1>
            <div className="w-10"> {/* Spacer for balance */}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;