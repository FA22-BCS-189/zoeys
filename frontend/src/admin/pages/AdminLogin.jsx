import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { adminAuth } from '../utils/adminAuth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/admin/stats`;
      console.log('🔐 Login attempt...');
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'x-admin-password': password,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        console.log('✅ Login successful! Storing password and redirecting...');
        adminAuth.setPassword(password);
        navigate('/admin/dashboard', { replace: true });
      } else {
        if (response.status === 401) {
          console.log('❌ Login failed: Invalid password');
          setError('Invalid password. Please try again.');
        } else {
          const errorText = await response.text();
          console.log('❌ Server error:', response.status, errorText);
          setError('Authentication failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('🚨 Login connection error:', error);
      if (error.message.includes('Failed to fetch')) {
        setError('Connection error. Please check if the backend is running.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-25 rounded-2xl shadow-soft border border-emerald-200/30 p-6 md:p-8 w-full max-w-md"
      >
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-emerald-100 rounded-full mb-3 md:mb-4">
            <Lock size={24} className="md:size-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-charcoal">
            Admin Panel
          </h1>
          <p className="text-charcoal/80 mt-2 text-sm md:text-base">Enter admin password to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-2">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(''); // Clear error when user types
                }}
                className="w-full px-4 py-3 pr-12 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-charcoal placeholder-charcoal/40 bg-white transition-colors duration-200"
                placeholder="Enter admin password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-charcoal/60 hover:text-charcoal transition-colors duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 rounded p-1"
              >
                {showPassword ? (
                  <EyeOff size={20} className="flex-shrink-0" />
                ) : (
                  <Eye size={20} className="flex-shrink-0" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors">
            ← Back to Store
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;