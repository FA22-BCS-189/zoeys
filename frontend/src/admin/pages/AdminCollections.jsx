import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, FolderOpen, Image as ImageIcon, Package, Move, Search } from 'lucide-react';
import { adminAPI } from '../utils/adminAuth';
import Notification from '../components/notification';
import RichTextEditor from '../components/RichTextEditor';
import { renderMarkdown } from '../utils/markdownUtils';

const AdminCollections = () => {
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [generatingSEO, setGeneratingSEO] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    imageAlt: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    order: 0,
  });

  useEffect(() => {
    fetchCollections();
    fetchAllProducts();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await adminAPI.getCollections();
      setCollections(response.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
      showNotification('Failed to load collections', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await adminAPI.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { 
        ...formData, 
        order: parseInt(formData.order) || 0 
      };
      
      if (editingCollection) {
        await adminAPI.updateCollection(editingCollection.id, data);
        showNotification('Collection updated successfully');
      } else {
        await adminAPI.createCollection(data);
        showNotification('Collection created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchCollections();
    } catch (error) {
      console.error('Error saving collection:', error);
      showNotification('Failed to save collection', 'error');
    }
  };

  const handleEdit = (collection) => {
    console.log('Editing collection:', collection);
    console.log('Collection SEO data:', {
      metaTitle: collection.metaTitle,
      metaDescription: collection.metaDescription,
      keywords: collection.keywords,
      imageAlt: collection.imageAlt,
      structuredContent: collection.structuredContent
    });
    
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      slug: collection.slug,
      description: collection.description || '',
      image: collection.image || '',
      imageAlt: collection.imageAlt || '',
      metaTitle: collection.metaTitle || '',
      metaDescription: collection.metaDescription || '',
      keywords: collection.keywords || '',
      order: collection.order || 0,
    });
    setShowModal(true);
  };

  const handleGenerateSEO = async () => {
    try {
      setGeneratingSEO(true);
      
      // Prepare collection data for AI generation
      const productCount = products.filter(p => p.collectionId === editingCollection?.id).length || 0;
      const collectionData = {
        name: formData.name,
        description: formData.description,
        productCount
      };

      console.log('Generating SEO for collection:', collectionData);

      // Call SEO generation endpoint
      const response = editingCollection 
        ? await adminAPI.generateCollectionSEO(editingCollection.id)
        : await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/collections/generate-seo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ collectionData })
          }).then(r => r.json());
      
      console.log('Collection SEO Response:', response);
      
      if (response.success && response.data) {
        const seoData = response.data;
        
        // Generate description from meta description
        let generatedDescription = seoData.metaDescription || '';
        
        setFormData({
          ...formData,
          description: generatedDescription,
          metaTitle: seoData.metaTitle || formData.metaTitle,
          metaDescription: seoData.metaDescription || formData.metaDescription,
          keywords: seoData.keywords || formData.keywords,
          imageAlt: seoData.imageAlt || formData.imageAlt
        });
        
        const generationType = seoData.generatedBy === 'ai' ? '🤖 AI' : '📝 Template';
        showNotification(`${generationType} content generated successfully! All SEO fields populated.`);
      } else {
        throw new Error(response.error || 'Failed to generate SEO content');
      }
    } catch (error) {
      console.error('Error generating collection SEO:', error);
      showNotification('Failed to generate SEO content', 'error');
    } finally {
      setGeneratingSEO(false);
    }
  };

  const handleDeleteClick = (collection) => {
    setCollectionToDelete(collection);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!collectionToDelete) return;
    
    try {
      await adminAPI.deleteCollection(collectionToDelete.id);
      showNotification('Collection deleted successfully');
      fetchCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
      showNotification(error.message || 'Failed to delete collection', 'error');
    } finally {
      setShowDeleteModal(false);
      setCollectionToDelete(null);
    }
  };

  const handleManageProducts = (collection) => {
    setSelectedCollection(collection);
    setShowProductModal(true);
    setSearchTerm(''); // Reset search when opening modal
  };

  const handleMoveProduct = async (productId, newCollectionId) => {
    try {
      await adminAPI.updateProduct(productId, { collectionId: newCollectionId });
      showNotification('Product moved successfully');
      fetchAllProducts();
      fetchCollections();
    } catch (error) {
      console.error('Error moving product:', error);
      showNotification('Failed to move product', 'error');
    }
  };

  const handleRemoveFromCollection = async (productId) => {
    try {
      await adminAPI.updateProduct(productId, { collectionId: null });
      showNotification('Product removed from collection');
      fetchAllProducts();
      fetchCollections();
    } catch (error) {
      console.error('Error removing product:', error);
      showNotification('Failed to remove product', 'error');
    }
  };

  const generateSlug = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const resetForm = () => {
    setEditingCollection(null);
    setFormData({ 
      name: '', 
      slug: '', 
      description: '', 
      image: '',
      imageAlt: '',
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      order: 0 
    });
  };

  // Get products in the selected collection
  const collectionProducts = selectedCollection 
    ? products.filter(product => product.collectionId === selectedCollection.id)
    : [];

  // Get products not in any collection or in other collections
  const availableProducts = selectedCollection
    ? products.filter(product => product.collectionId !== selectedCollection.id)
    : [];

  // Filter products based on search term
  const filteredCollectionProducts = collectionProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAvailableProducts = availableProducts.filter(product =>
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-charcoal">Collections</h1>
          <p className="text-charcoal/80 mt-2">{collections.length} total collections</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 mt-4 md:mt-0 inline-flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Collection</span>
        </button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {collections.map((collection) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 overflow-hidden hover:shadow-subtle transition-all"
          >
            {/* Collection Image */}
            {collection.image ? (
              <div className="h-48 overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                <FolderOpen size={64} className="text-emerald-400" />
              </div>
            )}

            <div className="p-4 lg:p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg lg:text-xl font-bold text-charcoal">{collection.name}</h3>
                <div className="flex items-center space-x-1 lg:space-x-2">
                  <button
                    onClick={() => handleManageProducts(collection)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Manage Products"
                  >
                    <Package size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(collection)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(collection)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-charcoal/80 mb-3 line-clamp-2">
  <span dangerouslySetInnerHTML={{ __html: renderMarkdown(collection.description) || 'No description' }} />
</p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-charcoal/60">{collection._count?.products || 0} products</span>
                <span className="text-charcoal/60">Order: {collection.order}</span>
              </div>

              <div className="mt-3 pt-3 border-t border-emerald-200/30">
                <code className="text-xs text-charcoal/60 bg-amber-50 px-2 py-1 rounded">
                  {collection.slug}
                </code>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {collections.length === 0 && (
        <div className="bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 p-8 lg:p-12 text-center">
          <FolderOpen size={48} className="mx-auto mb-4 text-emerald-300" />
          <p className="text-charcoal/80">No collections found</p>
        </div>
      )}

      {/* Collection Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 w-full max-w-md mx-auto my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 lg:p-6 border-b border-emerald-200/30 flex items-center justify-between">
              <h2 className="text-xl lg:text-2xl font-display font-bold text-charcoal">
                {editingCollection ? 'Edit Collection' : 'Add New Collection'}
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
              {/* Collection Name */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({ 
                      ...formData, 
                      name, 
                      slug: generateSlug(name) 
                    });
                  }}
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="e.g., Summer Collection"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="summer-collection"
                />
                <p className="text-xs text-charcoal/60 mt-1">URL-friendly version (auto-generated)</p>
              </div>

              {/* Description */}
              {/* Description with AI Generation */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-charcoal">
                    Description
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateSEO}
                    disabled={generatingSEO || !formData.name}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    title={!formData.name ? 'Fill in collection name first' : 'Generate description and all SEO fields with AI'}
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
                  onChange={(newValue) => setFormData({ ...formData, description: newValue })}
                  placeholder="Enter collection description or generate with AI..."
                  rows={5}
                />
                <p className="text-xs text-charcoal/60 mt-1">Brief description of this collection</p>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2 flex items-center gap-2">
                  <ImageIcon size={16} />
                  Collection Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-charcoal/60 mt-1">Enter a full image URL (optional)</p>

                {formData.image && (
                  <div className="mt-2">
                    <p className="text-xs text-charcoal/60 mb-1">Preview:</p>
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-24 object-cover rounded-lg border border-emerald-200/30"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* SEO Section */}
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
                    placeholder="collection name, bahawalpur embroidery, traditional..."
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal/70 mb-1">Image Alt Text</label>
                  <input
                    type="text"
                    value={formData.imageAlt}
                    onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                    placeholder="Descriptive alt text for collection banner image"
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-charcoal/60 mt-1">Describes the collection image for accessibility and SEO</p>
                </div>
                </div>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="0"
                />
                <p className="text-xs text-charcoal/60 mt-1">Lower numbers appear first</p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-emerald-300 rounded-lg hover:bg-amber-50 transition-colors text-charcoal text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                >
                  {editingCollection ? 'Update Collection' : 'Create Collection'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && collectionToDelete && (
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
                Delete Collection
              </h3>
              
              <p className="text-charcoal/80 mb-4">
                Are you sure you want to delete <strong>"{collectionToDelete.name}"</strong>? 
                This action cannot be undone.
              </p>

              {collectionToDelete._count?.products > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <p className="text-amber-800 text-sm">
                    ⚠️ This collection contains <strong>{collectionToDelete._count.products} products</strong>. 
                    You must reassign or delete these products first.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCollectionToDelete(null);
                  }}
                  className="px-4 py-2 border border-emerald-300 rounded-lg hover:bg-amber-50 transition-colors text-charcoal text-sm flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={collectionToDelete._count?.products > 0}
                  className="bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm flex-1"
                >
                  Delete Collection
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Product Management Modal */}
      {showProductModal && selectedCollection && (
        <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 w-full max-w-6xl mx-auto my-8 max-h-[90vh] overflow-hidden"
          >
            <div className="p-4 lg:p-6 border-b border-emerald-200/30">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl lg:text-2xl font-display font-bold text-charcoal">
                    Manage Products - {selectedCollection.name}
                  </h2>
                  <p className="text-charcoal/60 text-sm mt-1">
                    {collectionProducts.length} products in this collection
                  </p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full lg:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={18} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <button 
                  onClick={() => setShowProductModal(false)} 
                  className="text-charcoal/60 hover:text-charcoal transition-colors text-2xl absolute top-4 right-4 lg:static"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
              {/* Products in Collection */}
              <div className="bg-white rounded-xl border border-emerald-200/30 p-4">
                <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
                  <Package size={20} />
                  Products in Collection ({filteredCollectionProducts.length})
                </h3>
                <div className="space-y-3">
                  {filteredCollectionProducts.map(product => (
                    <div key={product.id} className="bg-amber-25 rounded-lg border border-emerald-200/30 p-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-charcoal truncate">{product.name}</p>
                          <p className="text-xs text-charcoal/60">{product.color} - {product.pieces}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleMoveProduct(product.id, e.target.value);
                              }
                            }}
                            className="text-xs border border-emerald-300 rounded px-2 py-2 w-full sm:w-auto"
                          >
                            <option value="">Move to...</option>
                            {collections
                              .filter(c => c.id !== selectedCollection.id)
                              .map(collection => (
                                <option key={collection.id} value={collection.id}>
                                  {collection.name}
                                </option>
                              ))
                            }
                            <option value="null">Remove from collection</option>
                          </select>
                          <button
                            onClick={() => handleRemoveFromCollection(product.id)}
                            className="text-rose-600 hover:text-rose-700 text-xs p-2 border border-rose-200 rounded hover:bg-rose-50 transition-colors"
                            title="Remove from collection"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredCollectionProducts.length === 0 && (
                    <div className="text-center py-6">
                      <Package size={32} className="mx-auto mb-2 text-emerald-300" />
                      <p className="text-charcoal/60 text-sm">
                        {searchTerm ? 'No products match your search' : 'No products in this collection'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Available Products */}
              <div className="bg-white rounded-xl border border-emerald-200/30 p-4">
                <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
                  <Move size={20} />
                  Available Products ({filteredAvailableProducts.length})
                </h3>
                <div className="space-y-3">
                  {filteredAvailableProducts.map(product => (
                    <div key={product.id} className="bg-amber-25 rounded-lg border border-emerald-200/30 p-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-charcoal truncate">{product.name}</p>
                          <p className="text-xs text-charcoal/60">{product.color} - {product.pieces}</p>
                          {product.collectionId && (
                            <p className="text-xs text-amber-600 mt-1">
                              Currently in: {collections.find(c => c.id === product.collectionId)?.name}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleMoveProduct(product.id, selectedCollection.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded transition-colors whitespace-nowrap"
                        >
                          Add to Collection
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredAvailableProducts.length === 0 && (
                    <div className="text-center py-6">
                      <Move size={32} className="mx-auto mb-2 text-emerald-300" />
                      <p className="text-charcoal/60 text-sm">
                        {searchTerm ? 'No products match your search' : 'No available products'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
                          </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminCollections;