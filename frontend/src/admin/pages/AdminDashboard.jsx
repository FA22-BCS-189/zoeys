import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, DollarSign, CheckCircle } from 'lucide-react';
import { adminAPI, adminAuth } from '../utils/adminAuth';
import { formatPrice } from '../../utils/helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated on component mount
    if (!adminAuth.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setAuthError('');
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      
      // Handle authentication errors
      if (error.message.includes('Authentication failed') || error.message.includes('401')) {
        console.log('Authentication failed during stats fetch. Redirecting to login.');
        setAuthError('Your session has expired. Please login again.');
        // Clear invalid password and redirect after a short delay
        setTimeout(() => {
          adminAuth.logout();
        }, 2000);
      } else {
        setAuthError('Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show authentication error state
  if (authError) {
    return (
      <div className="p-4 lg:p-6">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
          <div className="text-rose-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-rose-800 mb-2">Authentication Error</h3>
          <p className="text-rose-700 mb-4">{authError}</p>
          <p className="text-sm text-rose-600">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-amber-100 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-amber-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.products.total || 0,
      subtitle: `${stats?.products.inStock || 0} in stock`,
      icon: Package,
      color: 'bg-emerald-500',
      link: '/admin/products'
    },
    {
      title: 'Total Orders',
      value: stats?.orders.total || 0,
      subtitle: `${stats?.orders.pending || 0} pending`,
      icon: ShoppingCart,
      color: 'bg-amber-500',
      link: '/admin/orders'
    },
    {
      title: 'Total Revenue',
      value: formatPrice(stats?.revenue.total || 0),
      subtitle: 'From confirmed orders',
      icon: DollarSign,
      color: 'bg-emerald-600',
      link: '/admin/orders?status=confirmed'
    },
    {
      title: 'Confirmed Orders',
      value: stats?.orders.confirmed || 0,
      subtitle: 'Ready to deliver',
      icon: CheckCircle,
      color: 'bg-emerald-400',
      link: '/admin/orders?status=confirmed'
    }
  ];

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-charcoal">Dashboard</h1>
        <p className="text-charcoal/80 mt-2">Welcome back! Here's your store overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={card.link}
                className="block bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 p-4 lg:p-6 hover:shadow-subtle transition-all group"
              >
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className={`${card.color} p-2 lg:p-3 rounded-lg group-hover:scale-105 transition-transform`}>
                    <Icon size={20} className="text-white" />
                  </div>
                </div>
                <h3 className="text-charcoal/80 text-sm font-medium mb-1">{card.title}</h3>
                <p className="text-xl lg:text-2xl font-bold text-charcoal mb-1">{card.value}</p>
                <p className="text-xs lg:text-sm text-charcoal/60">{card.subtitle}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-emerald-200/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg lg:text-xl font-display font-bold text-charcoal">Recent Orders</h2>
          <Link to="/admin/orders" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors">
            View All →
          </Link>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-50">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-200/30">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-amber-50 transition-colors">
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                      <Link 
                        to={`/admin/orders`}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-charcoal">{order.customerName}</div>
                      <div className="text-xs text-charcoal/60">{order.customerPhone}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-charcoal">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm font-medium text-emerald-700">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        order.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'delivered' ? 'bg-emerald-200 text-emerald-900' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-charcoal/60">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 lg:p-8 text-center">
            <ShoppingCart size={48} className="mx-auto mb-4 text-emerald-300" />
            <p className="text-charcoal/80">No recent orders</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;