import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, ChevronDown, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collectionsAPI, settingsAPI } from '../utils/api';
import { useCart } from '../utils/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [settings, setSettings] = useState({});
  const [showCollections, setShowCollections] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    fetchCollections();
    fetchSettings();
    
    // Handle scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await collectionsAPI.getAll();
      setCollections(response.data.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const data = await settingsAPI.getAll();
      setSettings(data || {});
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-amber-50/95 backdrop-blur-md shadow-soft' 
          : 'bg-amber-50 shadow-subtle'
      }`}
    >
      {/* Decorative Top Border */}
      <div className="h-1 bg-gradient-to-r from-emerald-400 via-emerald-600 to-emerald-400" />
      
      <div className="container-custom px-4 sm:px-6 lg:px-8"> {/* Added horizontal padding */}
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <Crown className="w-8 h-8 md:w-10 md:h-10 text-emerald-600 drop-shadow-sm" />
              <div className="absolute -inset-1 bg-emerald-400/20 rounded-full blur-md group-hover:bg-emerald-400/30 transition-all" />
            </motion.div>
            
            <div className="flex flex-col">
              <div className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-emerald-600 leading-none">
                {settings.business_name || "Zoey's"}
              </div>
              <div className="text-[9px] md:text-xs text-charcoal font-medium tracking-wider uppercase mt-0.5 md:mt-1">
                {settings.site_tagline || 'Bahawalpur Heritage'}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 xl:space-x-10">
            {navLinks.map((link) => (
              link.name === 'Shop' ? (
                <div
                  key={link.name}
                  className="relative group"
                  onMouseEnter={() => setShowCollections(true)}
                  onMouseLeave={() => setShowCollections(false)}
                >
                  <Link
                    to={link.path}
                    className={`flex items-center space-x-1 text-charcoal hover:text-emerald-600 transition-all duration-300 font-semibold relative ${
                      isActive(link.path) ? 'text-emerald-600' : ''
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform duration-300 ${showCollections ? 'rotate-180' : ''}`}
                    />
                    {isActive(link.path) && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600"
                      />
                    )}
                  </Link>

                  {/* Collections Dropdown */}
                  <AnimatePresence>
                    {showCollections && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-4 w-72 bg-amber-50/95 backdrop-blur-lg rounded-xl shadow-soft border border-emerald-200/30 py-3 overflow-hidden"
                      >
                        {/* Decorative Header */}
                        <div className="px-4 pb-3 border-b border-emerald-200/50">
                          <Link
                            to="/shop"
                            className="block text-sm font-display font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                          >
                            All Collections →
                          </Link>
                        </div>
                        
                        {/* Collections List */}
                        <div className="max-h-96 overflow-y-auto scrollbar-thin">
                          {collections.map((collection, index) => (
                            <motion.div
                              key={collection.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                to={`/collection/${collection.slug}`}
                                className="block px-4 py-3 text-sm text-charcoal hover:bg-gradient-to-r hover:from-emerald-50 hover:to-transparent hover:text-emerald-700 transition-all group"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{collection.name}</span>
                                  <span className="text-xs text-emerald-600 font-semibold">
                                    {collection._count.products}
                                  </span>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                        
                        {/* Decorative Bottom Border */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-charcoal hover:text-emerald-600 transition-all duration-300 font-semibold relative ${
                    isActive(link.path) ? 'text-emerald-600' : ''
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600"
                    />
                  )}
                </Link>
              )
            ))}

            {/* Cart Icon with Badge */}
            <Link
              to="/cart"
              className="relative flex items-center text-charcoal hover:text-emerald-600 transition-all duration-300 group ml-4"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <ShoppingBag size={24} className="drop-shadow-sm" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-subtle ring-2 ring-amber-50"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="flex lg:hidden items-center space-x-3">
            {/* Mobile Cart - Moved closer to menu button */}
            <Link
              to="/cart"
              className="relative text-charcoal hover:text-emerald-600 transition-colors p-2"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Hamburger Menu */}
            <button
              onClick={toggleMenu}
              className="text-charcoal hover:text-emerald-600 transition-colors p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: '60vh' }} // Fixed height for scrolling
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden border-t border-emerald-200/30"
            >
              {/* Scrollable Container for Entire Mobile Menu */}
              <div className="max-h-[60vh] overflow-y-auto bg-gradient-to-b from-emerald-50/50 to-transparent scrollbar-thin">
                <div className="py-6 space-y-1 px-4"> {/* Added horizontal padding to mobile menu content */}
                  {navLinks.map((link) => (
                    <div key={link.name}>
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-3 text-charcoal hover:text-emerald-600 hover:bg-emerald-50/50 transition-all font-semibold rounded-lg ${
                          isActive(link.path) ? 'text-emerald-600 bg-emerald-50' : ''
                        }`}
                      >
                        {link.name}
                      </Link>

                      {/* Collections submenu for mobile */}
                      {link.name === 'Shop' && (
                        <div className="ml-4 mt-2 space-y-1 border-l-2 border-emerald-300/30 pl-4">
                          {collections.map((collection) => (
                            <Link
                              key={collection.id}
                              to={`/collection/${collection.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="block py-2 text-sm text-charcoal/80 hover:text-emerald-600 transition-colors"
                            >
                              {collection.name}
                              <span className="text-xs text-emerald-600 ml-2">
                                ({collection._count.products})
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;