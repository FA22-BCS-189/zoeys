import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, Plus, Edit2, Trash2, Save, Sparkles } from 'lucide-react';
import { adminAPI } from '../utils/adminAuth';
import Notification from '../components/notification';

const AdminSettings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [editingSettings, setEditingSettings] = useState({});
  const [generatingAI, setGeneratingAI] = useState({});

  const defaultSettings = [
    { key: 'business_name', label: 'Business Name', category: 'general', value: "Zoey's Heritage Embroidery" },
    { key: 'business_phone', label: 'Phone Number', category: 'contact', value: '+92 330 0390222' },
    { key: 'business_whatsapp', label: 'WhatsApp Number', category: 'contact', value: '+92 330 0390222' },
    { key: 'business_email', label: 'Email Address', category: 'contact', value: 'zaiinabsanaullah@gmail.com' },
    { key: 'business_address', label: 'Business Address', category: 'contact', value: 'Lahore, Punjab, Pakistan' },
    { key: 'facebook_url', label: 'Facebook URL', category: 'social', value: '' },
    { key: 'instagram_url', label: 'Instagram URL', category: 'social', value: '' },
    { key: 'twitter_url', label: 'Twitter URL', category: 'social', value: '' },
    { key: 'site_tagline', label: 'Site Tagline', category: 'general', value: 'Heritage Crafted by Hand' },
    { key: 'footer_about', label: 'Footer About Text', category: 'general', value: 'Preserving traditional Bahawalpur embroidery through skilled artisanship.' }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSettings();
      setSettings(response.data);

      // Initialize editing settings
      const editing = {};
      response.data.forEach(setting => {
        editing[setting.key] = setting.value;
      });
      setEditingSettings(editing);

      // Add default settings if they don't exist
      const existingKeys = response.data.map(s => s.key);
      const missingSettings = defaultSettings.filter(ds => !existingKeys.includes(ds.key));
      
      if (missingSettings.length > 0) {
        missingSettings.forEach(s => {
          editing[s.key] = s.value;
        });
        setEditingSettings(editing);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      showNotification('Failed to load settings', 'error');
      
      // Use default settings
      const editing = {};
      defaultSettings.forEach(s => {
        editing[s.key] = s.value;
      });
      setEditingSettings(editing);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async (settingKey) => {
    try {
      const settingDef = defaultSettings.find(s => s.key === settingKey) || 
                         settings.find(s => s.key === settingKey);
      
      if (!settingDef) return;

      await adminAPI.saveSetting({
        key: settingKey,
        value: editingSettings[settingKey],
        label: settingDef.label,
        category: settingDef.category
      });

      showNotification('Setting saved successfully');
      fetchSettings();
    } catch (error) {
      console.error('Error saving setting:', error);
      showNotification('Failed to save setting', 'error');
    }
  };

  const handleSaveAll = async () => {
    try {
      const settingsToSave = Object.keys(editingSettings).map(key => {
        const settingDef = defaultSettings.find(s => s.key === key) || 
                           settings.find(s => s.key === key);
        return {
          key,
          value: editingSettings[key],
          label: settingDef?.label || key,
          category: settingDef?.category || 'general'
        };
      });

      await Promise.all(settingsToSave.map(s => adminAPI.saveSetting(s)));
      
      showNotification('All settings saved successfully');
      fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      showNotification('Failed to save settings', 'error');
    }
  };

  const handleGenerateAI = async (field) => {
    try {
      setGeneratingAI({ ...generatingAI, [field]: true });
      
      const response = await adminAPI.generateSettingContent(field, {
        businessName: editingSettings.business_name || 'Zoey\'s'
      });

      setEditingSettings({
        ...editingSettings,
        [field]: response.data.content
      });

      showNotification(`AI generated ${field.replace('_', ' ')} successfully`);
    } catch (error) {
      console.error('Error generating AI content:', error);
      showNotification('Failed to generate AI content', 'error');
    } finally {
      setGeneratingAI({ ...generatingAI, [field]: false });
    }
  };

  const groupedSettings = {};
  const allSettingsKeys = [...new Set([...settings.map(s => s.key), ...defaultSettings.map(s => s.key)])];
  
  allSettingsKeys.forEach(key => {
    const setting = settings.find(s => s.key === key) || defaultSettings.find(s => s.key === key);
    if (setting) {
      const category = setting.category || 'general';
      if (!groupedSettings[category]) {
        groupedSettings[category] = [];
      }
      groupedSettings[category].push(setting);
    }
  });

  const categoryLabels = {
    general: 'General',
    contact: 'Contact Information',
    social: 'Social Media'
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
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-charcoal">Site Settings</h1>
          <p className="text-charcoal/80 mt-1 lg:mt-2">Manage site-wide settings, contact information, and social links</p>
        </div>
        <button
          onClick={handleSaveAll}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 mt-4 md:mt-0 inline-flex items-center space-x-2"
        >
          <Save size={20} />
          <span>Save All Changes</span>
        </button>
      </div>

      {/* Settings by Category */}
      <div className="space-y-6">
        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 p-6"
          >
            <h2 className="text-xl font-display font-bold text-charcoal mb-4 flex items-center gap-2">
              <SettingsIcon size={20} className="text-emerald-600" />
              {categoryLabels[category] || category}
            </h2>

            <div className="space-y-4">
              {categorySettings.map((setting) => {
                const canGenerateAI = ['footer_about', 'site_tagline'].includes(setting.key);
                
                return (
                  <div key={setting.key} className="flex flex-col md:flex-row md:items-center gap-3">
                    <label className="block text-sm font-medium text-charcoal md:w-1/3">
                      {setting.label}
                    </label>
                    <div className="flex-1 flex gap-2">
                      {setting.key === 'footer_about' ? (
                        <textarea
                          value={editingSettings[setting.key] || ''}
                          onChange={(e) => setEditingSettings({
                            ...editingSettings,
                            [setting.key]: e.target.value
                          })}
                          className="flex-1 px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                          placeholder={setting.label}
                          rows={3}
                        />
                      ) : (
                        <input
                          type="text"
                          value={editingSettings[setting.key] || ''}
                          onChange={(e) => setEditingSettings({
                            ...editingSettings,
                            [setting.key]: e.target.value
                          })}
                          className="flex-1 px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder={setting.label}
                        />
                      )}
                      {canGenerateAI && (
                        <button
                          onClick={() => handleGenerateAI(setting.key)}
                          disabled={generatingAI[setting.key]}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Generate with AI"
                        >
                          <Sparkles size={16} className={generatingAI[setting.key] ? 'animate-spin' : ''} />
                          <span className="hidden lg:inline">AI</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleSave(setting.key)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                        title="Save this setting"
                      >
                        <Save size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> These settings will be displayed across your website. Changes take effect immediately on the frontend.
          Make sure to click "Save" after updating any field.
        </p>
      </div>
    </div>
  );
};

export default AdminSettings;
