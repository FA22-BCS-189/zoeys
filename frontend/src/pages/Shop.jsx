import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Sparkles, Crown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Loading';
import { productsAPI, collectionsAPI } from '../utils/api';
import {
  setPageMeta,
  getBreadcrumbSchema,
  getCollectionSchema,
  injectMultipleSchemas,
  setLanguage,
  BUSINESS_INFO
} from '../utils/seo-utils';

const Shop = () => {
  const { collectionSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentCollection, setCurrentCollection] = useState(null);

  // Filter states
  const [selectedCollection, setSelectedCollection] = useState(collectionSlug || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [stockStatus, setStockStatus] = useState('');

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCollection, minPrice, maxPrice, stockStatus]);

  useEffect(() => {
    // Update selected collection from URL params
    setSelectedCollection(collectionSlug || '');
  }, [collectionSlug]);

  useEffect(() => {
    // SEO Setup
    setLanguage('en');
    
    const current = collections.find(c => c.slug === collectionSlug);
    setCurrentCollection(current);

    if (collectionSlug && current) {
      // Collection-specific SEO
      setPageMeta({
        title: `${current.name} - Traditional Bahawalpur Embroidery Collection`,
        description: `${current.description} Shop authentic ${current.name.toLowerCase()} with handcrafted Bahawalpur embroidery. ${products.length} unique pieces available.`,
        keywords: `${current.name}, bahawalpur embroidery, ${current.name.toLowerCase()}, traditional embroidered dresses, pakistani embroidery, handcrafted fabrics`,
        url: `${BUSINESS_INFO.url}/collection/${collectionSlug}`,
        type: "website"
      });

      // Structured data for collection
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Shop", url: "/shop" },
        { name: current.name, url: `/collection/${collectionSlug}` }
      ];

      const schemas = [
        getBreadcrumbSchema(breadcrumbs),
        getCollectionSchema(current, products)
      ];
      injectMultipleSchemas(schemas);
    } else {
      // General shop SEO
      setPageMeta({
        title: "Shop Authentic Bahawalpur Embroidery | Traditional Pakistani Fabrics",
        description: `Shop ${products.length}+ handcrafted Pakistani embroidered pieces. Authentic chicken kaari, pakka tanka, tarkashi, cut dana work, and traditional embroidered dresses. Cash on delivery available nationwide.`,
        keywords: "shop bahawalpur embroidery, buy traditional embroidered dresses, pakistani embroidered fabrics online, chicken kaari for sale, pakka tanka embroidery, handcrafted embroidery pakistan",
        url: `${BUSINESS_INFO.url}/shop`,
        type: "website"
      });

      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Shop", url: "/shop" }
      ];

      const schemas = [getBreadcrumbSchema(breadcrumbs)];
      injectMultipleSchemas(schemas);
    }
  }, [collectionSlug, collections, products]);

  const fetchCollections = async () => {
    try {
      const response = await collectionsAPI.getAll();
      setCollections(response.data.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCollection) params.collection = selectedCollection;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (stockStatus) params.stockStatus = stockStatus;

      const response = await productsAPI.getAll(params);
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionChange = (slug) => {
    setSelectedCollection(slug);
    if (slug) {
      navigate(`/collection/${slug}`);
    } else {
      navigate('/shop');
    }
  };

  const clearFilters = () => {
    setSelectedCollection('');
    setMinPrice('');
    setMaxPrice('');
    setStockStatus('');
    navigate('/shop');
  };

  const activeFiltersCount = [selectedCollection, minPrice, maxPrice, stockStatus].filter(Boolean).length;

  const truncateName = (name, maxLength = 12) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '..';
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-navy-800 via-navy-700 to-navy-900 relative overflow-hidden">
        <div className="container-custom py-12 md:py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <Crown className="w-12 h-12 md:w-16 md:h-16 mx-auto text-emerald-400" aria-hidden="true" />
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white">
              {currentCollection ? currentCollection.name : 'Our Collection'}
            </h1>
            
            <div className="divider max-w-xs mx-auto opacity-50" />
            
            <p className="text-softwhite/90 font-medium max-w-2xl mx-auto">
              {currentCollection 
                ? currentCollection.description 
                : `${products.length} exquisite piece${products.length !== 1 ? 's' : ''} of handcrafted embroidery`
              }
            </p>
          </motion.div>
        </div>
      </header>

      <div className="container-custom py-6 md:py-8">
        {/* Collections Horizontal Scroll */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg text-charcoal">Collections</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 bg-amber-50 text-charcoal hover:bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg transition-all duration-200 shadow-subtle hover:shadow-soft text-sm"
              aria-label="Open filters"
            >
              <Filter size={16} aria-hidden="true" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-gradient-to-r from-emerald-600 to-navy-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </motion.button>
          </div>

          <nav className="flex space-x-3 overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" aria-label="Filter by collection">
            {/* All Collections Card */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCollectionChange('')}
              className={`flex-shrink-0 w-28 h-32 rounded-lg p-3 flex flex-col items-center justify-center transition-all duration-300 border ${
                selectedCollection === '' 
                  ? 'bg-gradient-to-r from-emerald-600 to-navy-700 border-emerald-600 text-white shadow-soft' 
                  : 'bg-amber-50 border-emerald-300 text-charcoal hover:border-emerald-500 shadow-subtle hover:shadow-soft'
              }`}
              aria-label="View all collections"
              aria-pressed={selectedCollection === ''}
            >
              <Sparkles size={28} className={`mb-2 ${selectedCollection === '' ? 'text-white' : 'text-emerald-600'}`} aria-hidden="true" />
              <span className="font-display font-bold text-xs text-center">All Collections</span>
              <span className="text-xs opacity-80 mt-1">View all</span>
            </motion.button>

            {/* Collection Cards */}
            {collections.map((collection) => (
              <motion.button
                key={collection.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCollectionChange(collection.slug)}
                className={`flex-shrink-0 w-28 h-32 rounded-lg p-3 flex flex-col items-center justify-center transition-all duration-300 border relative group ${
                  selectedCollection === collection.slug
                    ? 'bg-amber border-navy-900 text-navy-900 shadow-lg border-20'
                    : 'bg-amber-50 border-emerald-200 text-charcoal hover:border-emerald-500 shadow-subtle hover:shadow-soft'
                }`}
                aria-label={`Filter by ${collection.name}`}
                aria-pressed={selectedCollection === collection.slug}
              >
                {collection.image ? (
                  <img 
                    src={collection.image} 
                    alt=""
                    className="w-14 h-14 rounded-md object-cover mb-2"
                    loading="lazy"
                    width="56"
                    height="56"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-md bg-emerald-100 flex items-center justify-center mb-2">
                    <Sparkles size={20} className="text-emerald-600" aria-hidden="true" />
                  </div>
                )}
                <span className="font-display font-bold text-xs text-center" title={collection.name}>
                  {truncateName(collection.name)}
                </span>
                <span className="text-xs opacity-80 mt-1">{collection._count?.products || 0} items</span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-charcoal text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                  {collection.name}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-charcoal"></div>
                </div>
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Mobile Filter Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(true)}
          className="lg:hidden fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-600 to-navy-700 text-white p-3 rounded-full shadow-soft hover:shadow-soft transition-all group"
          aria-label="Open filters"
        >
          <Filter size={20} className="group-hover:rotate-12 transition-transform" aria-hidden="true" />
          {activeFiltersCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-subtle ring-2 ring-amber-50 text-[10px]"
            >
              {activeFiltersCount}
            </motion.span>
          )}
        </motion.button>

        {/* Filters Modal */}
        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm"
                onClick={() => setShowFilters(false)}
                aria-hidden="true"
              />
              
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed right-0 top-0 h-full w-full max-w-sm bg-amber-50 shadow-soft z-50 overflow-y-auto"
                role="dialog"
                aria-label="Filters"
              >
                <div className="p-4 border-b border-emerald-200/50 bg-amber-50 sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Filter size={20} className="text-emerald-600" aria-hidden="true" />
                      <h3 className="text-lg font-display font-bold text-charcoal">Filters</h3>
                    </div>
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="p-1 hover:bg-emerald-100 rounded-full transition-colors"
                      aria-label="Close filters"
                    >
                      <X size={20} className="text-charcoal" />
                    </button>
                  </div>
                  
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="mt-2 text-sm font-semibold text-rose-600 hover:text-rose-700"
                    >
                      Clear all filters ({activeFiltersCount})
                    </button>
                  )}
                </div>
                
                <div className="p-4 space-y-6">
                  {/* Price Range Filter */}
                  <div>
                    <h4 className="font-display font-bold text-charcoal text-base mb-3">Price Range</h4>
                    <div className="space-y-3">
                      <div className="relative">
                        <label htmlFor="minPrice" className="sr-only">Minimum price</label>
                        <input
                          id="minPrice"
                          type="number"
                          placeholder="Min Price"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all font-medium text-charcoal placeholder:text-charcoal/60 text-sm"
                          aria-label="Minimum price in PKR"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 font-semibold text-sm" aria-hidden="true">
                          Rs
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-center">
                        <div className="h-px w-6 bg-emerald-300" aria-hidden="true" />
                      </div>
                      
                      <div className="relative">
                        <label htmlFor="maxPrice" className="sr-only">Maximum price</label>
                        <input
                          id="maxPrice"
                          type="number"
                          placeholder="Max Price"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all font-medium text-charcoal placeholder:text-charcoal/60 text-sm"
                          aria-label="Maximum price in PKR"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 font-semibold text-sm" aria-hidden="true">
                          Rs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stock Status Filter */}
                  <fieldset>
                    <legend className="font-display font-bold text-charcoal text-base mb-3">Availability</legend>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="stock"
                          checked={stockStatus === ''}
                          onChange={() => setStockStatus('')}
                          className="sr-only peer"
                        />
                        <div className="w-4 h-4 rounded-full border-2 border-emerald-400 peer-checked:border-emerald-600 peer-checked:bg-emerald-600 transition-all flex items-center justify-center">
                          {stockStatus === '' && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="text-sm text-charcoal/80 font-medium group-hover:text-emerald-700 transition-colors">
                          All
                        </span>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="stock"
                          checked={stockStatus === 'in_stock'}
                          onChange={() => setStockStatus('in_stock')}
                          className="sr-only peer"
                        />
                        <div className="w-4 h-4 rounded-full border-2 border-emerald-400 peer-checked:border-emerald-600 peer-checked:bg-emerald-600 transition-all flex items-center justify-center">
                          {stockStatus === 'in_stock' && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="text-sm text-charcoal/80 font-medium group-hover:text-emerald-700 transition-colors">
                          In Stock
                        </span>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="stock"
                          checked={stockStatus === 'out_of_stock'}
                          onChange={() => setStockStatus('out_of_stock')}
                          className="sr-only peer"
                        />
                        <div className="w-4 h-4 rounded-full border-2 border-emerald-400 peer-checked:border-emerald-600 peer-checked:bg-emerald-600 transition-all flex items-center justify-center">
                          {stockStatus === 'out_of_stock' && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="text-sm text-charcoal/80 font-medium group-hover:text-emerald-700 transition-colors">
                          Out of Stock
                        </span>
                      </label>
                    </div>
                  </fieldset>
                </div>
                
                <div className="p-4 border-t border-emerald-200/50 bg-amber-50 sticky bottom-0">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full btn-primary py-2.5 rounded-lg transition-all duration-300 text-sm"
                  >
                    View {products.length} Product{products.length !== 1 ? 's' : ''}
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <div className="pt-8 pb-4">
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
                {[...Array(10)].map((_, i) => (
                  <ProductCardSkeleton key={i} compact />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    className="transform scale-90"
                  >
                    <ProductCard product={product} compact small />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 px-4"
              >
                <div className="bg-white rounded-xl p-8 shadow-soft border border-emerald-200/30 max-w-md mx-auto">
                  <Sparkles size={40} className="mx-auto mb-4 text-emerald-400" aria-hidden="true" />
                  <p className="text-charcoal text-base font-medium mb-4">
                    No treasures found matching your criteria.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="btn-outline px-4 py-2 rounded-lg transition-all duration-300 text-sm"
                  >
                    Clear filters and explore all
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;