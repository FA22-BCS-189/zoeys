import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { adminAPI } from '../utils/adminAuth';
import { formatPrice, getPlaceholderImage } from '../../utils/helpers';
import Notification from '../components/notification';
import RichTextEditor from '../components/RichTextEditor';
import { renderMarkdown } from '../utils/markdownUtils';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [generatingSEO, setGeneratingSEO] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    color: '',
    price: '',
    pieces: '3 pc',
    quantity: 0,
    description: '',
    seoDescription: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    imageAlts: [],
    structuredContent: null,
    jsonLdSchema: null,
    collectionId: '',
    images: [],
    stockStatus: 'out_of_stock'
  });

  useEffect(() => {
    fetchProducts();
    fetchCollections();
  }, [selectedCollection]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCollection) params.collectionId = selectedCollection;
      const response = await adminAPI.getProducts(params);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showNotification('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await adminAPI.getCollections();
      setCollections(response.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
      showNotification('Failed to load collections', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Auto-update stock status based on quantity
  const updateStockStatus = (quantity) => {
    return quantity > 0 ? 'in_stock' : 'out_of_stock';
  };

  const handleQuantityChange = (quantity) => {
    const newQuantity = parseInt(quantity) || 0;
    const newStockStatus = updateStockStatus(newQuantity);
    
    setFormData({
      ...formData,
      quantity: newQuantity,
      stockStatus: newStockStatus
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity) || 0
      };

      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct.id, data);
        showNotification('Product updated successfully');
      } else {
        await adminAPI.createProduct(data);
        showNotification('Product created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      showNotification('Failed to save product', 'error');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      color: product.color,
      price: product.price.toString(),
      pieces: product.pieces,
      quantity: product.quantity,
      description: product.description || '',
      seoDescription: product.seoDescription || '',
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
      keywords: product.keywords || '',
      imageAlts: product.imageAlts || [],
      structuredContent: product.structuredContent || null,
      jsonLdSchema: product.jsonLdSchema || null,
      collectionId: product.collectionId,
      images: product.images || [],
      stockStatus: product.stockStatus
    });
    setShowModal(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await adminAPI.deleteProduct(productToDelete.id);
      showNotification('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification(error.message || 'Failed to delete product', 'error');
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const handleGenerateSEO = async () => {
    try {
      setGeneratingSEO(true);
      
      // Prepare product data for AI generation
      const collection = collections.find(c => c.id === formData.collectionId);
      const productData = {
        name: formData.name,
        color: formData.color,
        price: parseFloat(formData.price) || 0,
        pieces: formData.pieces,
        description: formData.description,
        collectionName: collection?.name,
        images: formData.images,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        stockStatus: formData.stockStatus
      };

      console.log('Generating SEO for product:', productData);

      // Call new SEO generation endpoint
      let response;
      if (editingProduct) {
        response = await adminAPI.generateProductSEO(editingProduct.id);
      } else {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/products/generate-seo`;
        console.log('Calling API:', apiUrl);
        
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productData })
        });
        
        response = await res.json();
      }
      
      console.log('SEO Generation Response:', response);
      
      if (response.success && response.data) {
        const seoData = response.data;
        
        // Generate a clean, concise description from AI data
        let generatedDescription = seoData.metaDescription || '';
        
        // Add key features for a richer description
        if (seoData.structuredContent?.h3 && seoData.structuredContent.h3.length > 0) {
          const keyFeatures = seoData.structuredContent.h3.slice(0, 3);
          if (keyFeatures.length > 0) {
            generatedDescription += '\n\nKey Features:\n• ' + keyFeatures.join('\n• ');
          }
        }
        
        setFormData({
          ...formData,
          description: generatedDescription,
          metaTitle: seoData.metaTitle || formData.metaTitle,
          metaDescription: seoData.metaDescription || formData.metaDescription,
          keywords: seoData.keywords || formData.keywords,
          imageAlts: seoData.imageAlt || formData.imageAlts,
          structuredContent: seoData.structuredContent || formData.structuredContent,
          jsonLdSchema: seoData.jsonLdSchema || formData.jsonLdSchema,
          seoDescription: seoData.metaDescription || formData.seoDescription
        });
        
        const generationType = seoData.generatedBy === 'ai' ? '🤖 AI' : '📝 Template';
        showNotification(`${generationType} content generated successfully! All SEO fields populated.`);
        console.log('Form updated with:', { 
          metaTitle: seoData.metaTitle,
          hasStructuredContent: !!seoData.structuredContent,
          hasJsonLd: !!seoData.jsonLdSchema,
          imageAltsCount: seoData.imageAlt?.length || 0
        });
      } else {
        throw new Error(response.error || 'Failed to generate SEO content');
      }
    } catch (error) {
      console.error('Error generating SEO content:', error);
      showNotification(`Failed to generate SEO: ${error.message}`, 'error');
    } finally {
      setGeneratingSEO(false);
    }
  };

  const generateClientSideSEO = (product, collection) => {
    const collectionName = collection?.name || 'Premium Collection';
    const color = product.color || 'Elegant';
    const name = product.name || 'Product';
    const pieces = product.pieces || '3 pc';
    const price = product.price || '0';

    const templates = [
      `Exquisite ${color} ${name} from our ${collectionName}. ${pieces} of handcrafted Bahawalpur embroidery at PKR ${price}. Traditional Pakistani artistry meets modern elegance.`,
      `Discover the beauty of ${color} ${name} - ${pieces} of authentic Bahawalpur embroidery. Part of our ${collectionName}, priced at PKR ${price}. Premium handcrafted Pakistani fabric.`,
      `Premium ${color} ${name} featuring traditional Bahawalpur embroidery. ${collectionName} piece includes ${pieces} at PKR ${price}. Handcrafted with care for authentic Pakistani heritage.`,
    ];

    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const selected = templates[hash % templates.length];

    return selected.length > 160 ? selected.substring(0, 157) + '...' : selected;
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      color: '',
      price: '',
      pieces: '3 pc',
      quantity: 0,
      description: '',
      seoDescription: '',
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      imageAlts: [],
      structuredContent: null,
      jsonLdSchema: null,
      collectionId: '',
      images: [],
      stockStatus: 'out_of_stock'
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-amber-100 rounded w-1/4"></div>
          <div className="h-64 bg-amber-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 lg:mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-charcoal">Products</h1>
          <p className="text-charcoal/80 mt-1 lg:mt-2">{products.length} total products</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 mt-4 md:mt-0 inline-flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 p-3 lg:p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          <div className="relative">
            <Search className="absolute left-2 lg:left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 lg:pl-10 pr-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="px-3 lg:px-4 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">All Collections</option>
            {collections.map(collection => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table (desktop) */}
      <div className="hidden md:block bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-amber-50">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">Product</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">Color / Pieces</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">Price</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">Stock</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">Quantity</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">Collection</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-charcoal/80 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-200/30">
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-amber-50 transition-colors">
                <td className="px-4 lg:px-6 py-3 lg:py-4 flex items-center space-x-3 lg:space-x-4">
                  <img
                    src={product.images[0] || getPlaceholderImage(product.color)}
                    alt={product.name}
                    className="w-10 h-10 lg:w-12 lg:h-12 object-cover rounded-lg"
                  />
                  <span className="text-sm font-medium text-charcoal">{product.name}</span>
                </td>
                <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-charcoal/80">{product.color} - {product.pieces}</td>
                <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm font-medium text-emerald-700">{formatPrice(product.price)}</td>
                <td className="px-4 lg:px-6 py-3 lg:py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    product.stockStatus === 'in_stock' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {product.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-charcoal/80">
                  {product.quantity}
                </td>
                <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-charcoal/80">
                  {collections.find(c => c.id === product.collectionId)?.name || 'No Collection'}
                </td>
                <td className="px-4 lg:px-6 py-3 lg:py-4 flex space-x-1 lg:space-x-2">
                  <button onClick={() => handleEdit(product)} className="p-1 lg:p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <Edit2 size={16} className="lg:size-4" />
                  </button>
                  <button onClick={() => handleDeleteClick(product)} className="p-1 lg:p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 size={16} className="lg:size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Products Cards (mobile) */}
      <div className="md:hidden space-y-3">
        {filteredProducts.map(product => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 p-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <img
                  src={product.images[0] || getPlaceholderImage(product.color)}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-charcoal mb-1">{product.name}</div>
                  <div className="text-xs text-charcoal/60 mb-1">{product.color} - {product.pieces}</div>
                  <div className="text-sm font-medium text-emerald-700 mb-1">{formatPrice(product.price)}</div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      product.stockStatus === 'in_stock' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {product.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <span className="text-xs text-charcoal/60">Qty: {product.quantity}</span>
                  </div>
                  <div className="text-xs text-charcoal/60">
                    Collection: {collections.find(c => c.id === product.collectionId)?.name || 'None'}
                  </div>
                </div>
              </div>
              <div className="flex space-x-1 ml-2">
                <button onClick={() => handleEdit(product)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDeleteClick(product)} className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 p-6 lg:p-8 text-center">
          <Package size={48} className="mx-auto mb-4 text-emerald-300" />
          <p className="text-charcoal/80">No products found</p>
        </div>
      )}

      {/* Product Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 w-full max-w-md mx-auto my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 lg:p-6 border-b border-emerald-200/30 flex items-center justify-between">
              <h2 className="text-xl lg:text-2xl font-display font-bold text-charcoal">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }} 
                className="text-charcoal/60 hover:text-charcoal transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Color *</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Pieces</label>
                  <input
                    type="text"
                    value={formData.pieces}
                    onChange={(e) => setFormData({ ...formData, pieces: e.target.value })}
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Price *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Collection *</label>
                <div className="relative">
                  <select
                    value={formData.collectionId}
                    onChange={(e) => setFormData({ ...formData, collectionId: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none pr-8 max-h-32 overflow-y-auto"
                    size={collections.length > 5 ? 5 : collections.length + 1}
                  >
                    <option value="">Select Collection</option>
                    {collections.map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-charcoal/60">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Description with AI Generation */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-charcoal">Description</label>
                  <button
                    type="button"
                    onClick={handleGenerateSEO}
                    disabled={generatingSEO || !formData.name || !formData.color || !formData.collectionId}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    title={!formData.name || !formData.color || !formData.collectionId ? 'Fill in name, color, and collection first' : 'Generate description and all SEO fields with AI'}
                  >
                    {generatingSEO ? (
                      <>
                        <span className="animate-spin">⚙️</span>
                        Generating...
                      </>
                    ) : (
                      <>
                        <span>✨</span>
                        Generate with AI
                      </>
                    )}
                  </button>
                </div>
                <RichTextEditor
                  value={formData.description}
                  onChange={(content) => setFormData({ ...formData, description: content })}
                  placeholder="Enter product description or generate with AI..."
                />
                <p className="text-xs text-charcoal/60 mt-1">Main product description shown on product page</p>
              </div>

              {/* SEO Fields Section */}
              <div className="bg-purple-50/50 -mx-6 px-6 py-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-charcoal flex items-center gap-2">
                    <span>🔍</span>
                    SEO & Meta Tags
                  </h4>
                  <span className="text-xs text-purple-600 font-medium">Auto-filled by AI ✨</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-charcoal/70 mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      placeholder="SEO title for search engines (50-60 chars)"
                      className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      maxLength="60"
                    />
                    <p className={`text-xs mt-1 ${(formData.metaTitle?.length >= 50 && formData.metaTitle?.length <= 60) ? 'text-emerald-600' : 'text-charcoal/60'}`}>
                      {formData.metaTitle?.length || 0}/60 characters
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-charcoal/70 mb-1">Meta Description</label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      placeholder="SEO description for search results (150-160 chars)"
                      rows="2"
                      className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      maxLength="160"
                    />
                    <p className={`text-xs mt-1 ${(formData.metaDescription?.length >= 150 && formData.metaDescription?.length <= 160) ? 'text-emerald-600' : 'text-charcoal/60'}`}>
                      {formData.metaDescription?.length || 0}/160 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-charcoal/70 mb-1">Keywords (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      placeholder="bahawalpur embroidery, traditional pakistani, handcrafted..."
                      className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-charcoal/70 mb-1">Image Alt Texts (one per line)</label>
                    <textarea
                      value={Array.isArray(formData.imageAlts) ? formData.imageAlts.join('\n') : ''}
                      onChange={(e) => setFormData({ ...formData, imageAlts: e.target.value.split('\n').filter(t => t.trim()) })}
                      placeholder="Front view of embroidered dress&#10;Close-up of embroidery details&#10;Complete set display"
                      rows="3"
                      className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-charcoal/60 mt-1">One alt text per line for each product image</p>
                  </div>

                  {/* Structured Content Editor */}
                  {formData.structuredContent && (
                    <div className="bg-white/80 rounded-lg p-4 border border-purple-200 space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-purple-700">📝 Structured Content (Editable)</p>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, structuredContent: null })}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Clear
                        </button>
                      </div>

                      {/* H1 Editor */}
                      <div>
                        <label className="block text-xs font-medium text-charcoal/70 mb-1">Main Heading (H1)</label>
                        <input
                          type="text"
                          value={formData.structuredContent.h1 || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            structuredContent: {
                              ...formData.structuredContent,
                              h1: e.target.value
                            }
                          })}
                          placeholder="Main product heading"
                          className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      {/* Sections Editor (H2 + H3 points) */}
                      {formData.structuredContent.sections && formData.structuredContent.sections.length > 0 && (
                        <div className="space-y-3">
                          <label className="block text-xs font-medium text-charcoal/70">Content Sections</label>
                          {formData.structuredContent.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="bg-purple-50/50 rounded p-3 space-y-2">
                              {/* H2 Heading */}
                              <div>
                                <label className="block text-xs font-medium text-charcoal/60 mb-1">Section {sectionIndex + 1} - Heading (H2)</label>
                                <input
                                  type="text"
                                  value={section.heading || ''}
                                  onChange={(e) => {
                                    const newSections = [...formData.structuredContent.sections];
                                    newSections[sectionIndex].heading = e.target.value;
                                    setFormData({
                                      ...formData,
                                      structuredContent: {
                                        ...formData.structuredContent,
                                        sections: newSections
                                      }
                                    });
                                  }}
                                  placeholder="Section heading"
                                  className="w-full px-2 py-1.5 border border-purple-200 rounded text-xs focus:ring-1 focus:ring-purple-500"
                                />
                              </div>

                              {/* H3 Points */}
                              <div>
                                <label className="block text-xs font-medium text-charcoal/60 mb-1">Bullet Points (one per line)</label>
                                <textarea
                                  value={section.points?.join('\n') || ''}
                                  onChange={(e) => {
                                    const newSections = [...formData.structuredContent.sections];
                                    newSections[sectionIndex].points = e.target.value.split('\n').filter(p => p.trim());
                                    setFormData({
                                      ...formData,
                                      structuredContent: {
                                        ...formData.structuredContent,
                                        sections: newSections
                                      }
                                    });
                                  }}
                                  placeholder="Point 1&#10;Point 2"
                                  rows="2"
                                  className="w-full px-2 py-1.5 border border-purple-200 rounded text-xs focus:ring-1 focus:ring-purple-500 resize-none"
                                />
                              </div>

                              {/* Remove Section Button */}
                              {formData.structuredContent.sections.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newSections = formData.structuredContent.sections.filter((_, i) => i !== sectionIndex);
                                    setFormData({
                                      ...formData,
                                      structuredContent: {
                                        ...formData.structuredContent,
                                        sections: newSections
                                      }
                                    });
                                  }}
                                  className="text-xs text-red-600 hover:text-red-700"
                                >
                                  Remove Section
                                </button>
                              )}
                            </div>
                          ))}

                          {/* Add Section Button */}
                          <button
                            type="button"
                            onClick={() => {
                              const newSections = [
                                ...formData.structuredContent.sections,
                                { heading: '', points: [] }
                              ];
                              setFormData({
                                ...formData,
                                structuredContent: {
                                  ...formData.structuredContent,
                                  sections: newSections
                                }
                              });
                            }}
                            className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                          >
                            + Add Section
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Images URLs (comma separated)</label>
                <input
                  type="text"
                  value={formData.images.join(',')}
                  onChange={(e) =>
                    setFormData({ ...formData, images: e.target.value.split(',') })
                  }
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Stock Status</label>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    formData.stockStatus === 'in_stock' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    {formData.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                  </span>
                  <span className="text-xs text-charcoal/60">
                    {formData.quantity > 0 ? `${formData.quantity} items available` : 'No stock available'}
                  </span>
                </div>
                <p className="text-xs text-charcoal/60 mt-1">
                  Status updates automatically based on quantity
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 border border-emerald-300 rounded-lg hover:bg-amber-50 transition-colors text-charcoal text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 w-full max-w-md mx-auto p-6"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-rose-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                Delete Product
              </h3>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-amber-800 text-sm">
                  Are you sure you want to delete <strong>"{productToDelete.name}"</strong>?
                </p>
                <p className="text-amber-700 text-xs mt-1">
                  This action cannot be undone and will permanently remove the product from your store.
                </p>
              </div>

              {productToDelete.quantity > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 mb-4">
                  <p className="text-rose-800 text-sm">
                    ⚠️ This product has <strong>{productToDelete.quantity} items in stock</strong>.
                    Deleting it will remove all inventory data.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                  }}
                  className="px-4 py-2 border border-emerald-300 rounded-lg hover:bg-amber-50 transition-colors text-charcoal text-sm flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm flex-1"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;