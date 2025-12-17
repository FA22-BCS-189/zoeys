import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Edit2, Trash2, Sparkles } from 'lucide-react';
import { adminAPI } from '../utils/adminAuth';
import Notification from '../components/notification';

const AdminContent = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [notification, setNotification] = useState(null);
  const [generatingAI, setGeneratingAI] = useState(false);

  const [formData, setFormData] = useState({
    pageKey: '',
    title: '',
    content: {},
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    published: true
  });

  const pageKeyOptions = [
    { value: 'home', label: 'Home Page' },
    { value: 'about', label: 'About Page' },
    { value: 'contact', label: 'Contact Page' },
    { value: 'shop', label: 'Shop Page' },
    { value: 'footer', label: 'Footer Content' }
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getContent();
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
      showNotification('Failed to load content', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContent) {
        await adminAPI.updateContent(editingContent.id, formData);
        showNotification('Content updated successfully');
      } else {
        await adminAPI.createContent(formData);
        showNotification('Content created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchContent();
    } catch (error) {
      console.error('Error saving content:', error);
      showNotification('Failed to save content', 'error');
    }
  };

  const handleEdit = (item) => {
    setEditingContent(item);
    setFormData({
      pageKey: item.pageKey,
      title: item.title,
      content: typeof item.content === 'object' ? item.content : {},
      metaTitle: item.metaTitle || '',
      metaDescription: item.metaDescription || '',
      keywords: item.keywords || '',
      published: item.published
    });
    setShowModal(true);
  };

  const handleDeleteClick = (item) => {
    setContentToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contentToDelete) return;

    try {
      await adminAPI.deleteContent(contentToDelete.id);
      showNotification('Content deleted successfully');
      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      showNotification('Failed to delete content', 'error');
    } finally {
      setShowDeleteModal(false);
      setContentToDelete(null);
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.pageKey) {
      showNotification('Please select a page key first', 'error');
      return;
    }

    try {
      setGeneratingAI(true);
      const response = await adminAPI.generateContent(formData.pageKey, {});

      // axios returns response.data, which contains the actual payload
      const data = response.data;
      if (data && data.success !== false) {
        setFormData({
          ...formData,
          title: data.title || data.data?.title,
          content: data.content || data.data?.content || {},
          metaTitle: data.metaTitle || data.data?.metaTitle || data.title,
          metaDescription: data.metaDescription || data.data?.metaDescription,
          keywords: data.keywords || data.data?.keywords || ''
        });
        showNotification('Content generated successfully!');
      } else {
        throw new Error(data.error || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      showNotification(error.response?.data?.error || 'Failed to generate content', 'error');
    } finally {
      setGeneratingAI(false);
    }
  };

  const updateContentField = (field, value) => {
    setFormData({
      ...formData,
      content: { ...formData.content, [field]: value }
    });
  };

  const addArrayItem = (field, defaultValue) => {
    const current = formData.content[field] || [];
    updateContentField(field, [...current, defaultValue]);
  };

  const updateArrayItem = (field, index, value) => {
    const current = [...(formData.content[field] || [])];
    current[index] = value;
    updateContentField(field, current);
  };

  const removeArrayItem = (field, index) => {
    const current = formData.content[field] || [];
    updateContentField(field, current.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setEditingContent(null);
    setFormData({
      pageKey: '',
      title: '',
      content: {},
      keywords: '',
      metaTitle: '',
      metaDescription: '',
      published: true
    });
  };

  const renderHomeFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">Hero Title</label>
        <input
          type="text"
          value={formData.content.heroTitle || ''}
          onChange={(e) => updateContentField('heroTitle', e.target.value)}
          placeholder="e.g., Handcrafted Bahawalpur Embroidery"
          className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">Hero Subtitle</label>
        <textarea
          value={formData.content.heroSubtitle || ''}
          onChange={(e) => updateContentField('heroSubtitle', e.target.value)}
          placeholder="Brief description for hero section"
          rows="3"
          className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">CTA Button Text</label>
        <input
          type="text"
          value={formData.content.ctaText || ''}
          onChange={(e) => updateContentField('ctaText', e.target.value)}
          placeholder="e.g., Browse Collections"
          className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {/* Trivia Items */}
      <div className="border-t border-emerald-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-charcoal">Trivia Items</label>
          <button
            type="button"
            onClick={() => addArrayItem('trivia', { title: '', fact: '', stat: '' })}
            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-all"
          >
            <Plus size={14} />
            Add Trivia
          </button>
        </div>
        
        {formData.content.trivia && formData.content.trivia.length > 0 && (
          <div className="space-y-3">
            {formData.content.trivia.map((item, index) => (
              <div key={index} className="bg-amber-50 p-3 rounded-lg border border-emerald-200">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-600">Trivia #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('trivia', index)}
                    className="text-rose-600 hover:text-rose-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateArrayItem('trivia', index, { ...item, title: e.target.value })}
                  placeholder="Title (e.g., Master Artisans)"
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm mb-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={item.fact}
                  onChange={(e) => updateArrayItem('trivia', index, { ...item, fact: e.target.value })}
                  placeholder="Fact (e.g., 3 Generations)"
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm mb-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={item.stat}
                  onChange={(e) => updateArrayItem('trivia', index, { ...item, stat: e.target.value })}
                  placeholder="Stat description"
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderAboutFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">About Content</label>
        <textarea
          value={formData.content.aboutText || ''}
          onChange={(e) => updateContentField('aboutText', e.target.value)}
          placeholder="Main content for about page"
          rows="6"
          className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
        />
      </div>

      {/* FAQs Section */}
      <div className="border-t border-emerald-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-charcoal">FAQs</label>
          <button
            type="button"
            onClick={() => addArrayItem('faqs', { question: '', answer: '' })}
            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-all"
          >
            <Plus size={14} />
            Add FAQ
          </button>
        </div>
        
        {formData.content.faqs && formData.content.faqs.length > 0 && (
          <div className="space-y-3">
            {formData.content.faqs.map((faq, index) => (
              <div key={index} className="bg-amber-50 p-3 rounded-lg border border-emerald-200">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-600">FAQ #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('faqs', index)}
                    className="text-rose-600 hover:text-rose-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateArrayItem('faqs', index, { ...faq, question: e.target.value })}
                  placeholder="Question"
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm mb-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateArrayItem('faqs', index, { ...faq, answer: e.target.value })}
                  placeholder="Answer"
                  rows="2"
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderContactFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">Contact Intro Text</label>
        <textarea
          value={formData.content.introText || ''}
          onChange={(e) => updateContentField('introText', e.target.value)}
          placeholder="Introduction text for contact page"
          rows="4"
          className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
        />
      </div>

      {/* FAQs Section */}
      <div className="border-t border-emerald-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-charcoal">FAQs</label>
          <button
            type="button"
            onClick={() => addArrayItem('faqs', { question: '', answer: '' })}
            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-all"
          >
            <Plus size={14} />
            Add FAQ
          </button>
        </div>
        
        {formData.content.faqs && formData.content.faqs.length > 0 && (
          <div className="space-y-3">
            {formData.content.faqs.map((faq, index) => (
              <div key={index} className="bg-amber-50 p-3 rounded-lg border border-emerald-200">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-600">FAQ #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('faqs', index)}
                    className="text-rose-600 hover:text-rose-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateArrayItem('faqs', index, { ...faq, question: e.target.value })}
                  placeholder="Question"
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm mb-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateArrayItem('faqs', index, { ...faq, answer: e.target.value })}
                  placeholder="Answer"
                  rows="2"
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderShopFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">Shop Page Title</label>
        <input
          type="text"
          value={formData.content.pageTitle || ''}
          onChange={(e) => updateContentField('pageTitle', e.target.value)}
          placeholder="e.g., Shop Our Collections"
          className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">Shop Description</label>
        <textarea
          value={formData.content.description || ''}
          onChange={(e) => updateContentField('description', e.target.value)}
          placeholder="Brief description for shop page"
          rows="3"
          className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
        />
      </div>
    </>
  );

  const renderFooterFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">Footer About Text</label>
        <textarea
          value={formData.content.aboutText || ''}
          onChange={(e) => updateContentField('aboutText', e.target.value)}
          placeholder="Brief about text for footer"
          rows="4"
          className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
        />
      </div>
    </>
  );

  const renderPageSpecificFields = () => {
    switch (formData.pageKey) {
      case 'home':
        return renderHomeFields();
      case 'about':
        return renderAboutFields();
      case 'contact':
        return renderContactFields();
      case 'shop':
        return renderShopFields();
      case 'footer':
        return renderFooterFields();
      default:
        return null;
    }
  };

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
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-charcoal">Page Content</h1>
          <p className="text-charcoal/80 mt-1 lg:mt-2">Manage website content and generate with AI</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 mt-4 md:mt-0 inline-flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Content</span>
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {content.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={18} className="text-emerald-600" />
                  <h3 className="font-semibold text-charcoal">{item.title}</h3>
                </div>
                <p className="text-xs text-charcoal/60">{item.pageKey}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                item.published ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {item.published ? 'Published' : 'Draft'}
              </span>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(item)}
                className="flex-1 p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors inline-flex items-center justify-center gap-1"
              >
                <Edit2 size={16} />
                <span className="text-sm">Edit</span>
              </button>
              <button
                onClick={() => handleDeleteClick(item)}
                className="flex-1 p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center justify-center gap-1"
              >
                <Trash2 size={16} />
                <span className="text-sm">Delete</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit/Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 w-full max-w-3xl mx-auto my-8"
          >
            <div className="p-4 lg:p-6 border-b border-emerald-200/30 flex items-center justify-between">
              <h2 className="text-xl lg:text-2xl font-display font-bold text-charcoal">
                {editingContent ? 'Edit Content' : 'Add Content'}
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

            <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Page Key *</label>
                <select
                  value={formData.pageKey}
                  onChange={(e) => setFormData({ ...formData, pageKey: e.target.value })}
                  required
                  disabled={!!editingContent}
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Page Key</option>
                  {pageKeyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Page Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Internal title for this content"
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* AI Generation Button */}
              {formData.pageKey && (
                <div className="border-t border-emerald-200 pt-4">
                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={generatingAI}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generatingAI ? (
                      <>
                        <span className="animate-spin">⚙️</span>
                        Generating Content with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Generate All Fields with AI
                      </>
                    )}
                  </button>
                  <p className="text-xs text-charcoal/60 mt-2 text-center">
                    AI will generate all fields below including SEO meta tags
                  </p>
                </div>
              )}

              {/* Page-specific fields */}
              {formData.pageKey && (
                <div className="border-t border-emerald-200 pt-4 space-y-4">
                  <h3 className="text-sm font-semibold text-charcoal mb-3">Page Content</h3>
                  {renderPageSpecificFields()}
                </div>
              )}

              {/* SEO Fields */}
              <div className="border-t border-emerald-200 pt-4 space-y-4">
                <h3 className="text-sm font-semibold text-charcoal mb-3">SEO Meta Tags</h3>
                
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Meta Title</label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="SEO title (defaults to page title)"
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Meta Description</label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="SEO meta description (120-160 characters recommended)"
                    rows="3"
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-charcoal/60 mt-1">
                    {formData.metaDescription.length} characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Keywords</label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="comma, separated, keywords"
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <p className="text-xs text-charcoal/60 mt-1">
                    Separate keywords with commas
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="published" className="text-sm font-medium text-charcoal">
                  Published (visible on website)
                </label>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
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
                  {editingContent ? 'Update Content' : 'Add Content'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && contentToDelete && (
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

              <h3 className="text-lg font-semibold text-charcoal mb-2">Delete Content</h3>

              <p className="text-charcoal/80 text-sm mb-4">
                Are you sure you want to delete <strong>"{contentToDelete.title}"</strong>?
                This action cannot be undone.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setContentToDelete(null);
                  }}
                  className="px-4 py-2 border border-emerald-300 rounded-lg hover:bg-amber-50 transition-colors text-charcoal text-sm flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm flex-1"
                >
                  Delete Content
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
