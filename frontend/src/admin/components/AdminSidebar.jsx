import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, FolderOpen, LogOut, X, FileText } from 'lucide-react';
import { adminAuth } from '../utils/adminAuth';

const AdminSidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminAuth.logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/collections', icon: FolderOpen, label: 'Collections' },
    { path: '/admin/content', icon: FileText, label: 'Page Content' },
  ];

  return (
    <div className="w-64 bg-amber-25 border-r border-emerald-200/30 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-emerald-200/30">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-charcoal">Admin Panel</h1>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-charcoal/70 hover:text-charcoal hover:bg-amber-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-soft'
                  : 'text-charcoal/80 hover:text-charcoal hover:bg-amber-100'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer with Logout */}
      <div className="p-4 border-t border-emerald-200/30">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-charcoal/80 hover:text-rose-600 hover:bg-amber-100 w-full transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;