import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Crown, Heart, Facebook, Instagram, Twitter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { settingsAPI } from '../utils/api';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsAPI.getAll();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-gradient-to-b from-navy-800 to-navy-900 text-softwhite relative overflow-hidden">
      {/* Ornamental Background */}
      <div className="absolute inset-0 bg-pattern-ornate opacity-5" />
      
      {/* Decorative Top Border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
      
      <div className="container-custom py-12 md:py-16 relative px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1 text-center md:text-left">
            <div className="flex items-center space-x-3 justify-center md:justify-start">
              <Crown className="w-8 h-8 text-emerald-400" />
              <div>
                <h3 className="text-2xl font-display font-bold text-emerald-400">
                  {settings.business_name || 'Zoey\'s'}
                </h3>
                <p className="text-xs text-emerald-300 font-medium tracking-wider uppercase">
                  {settings.site_tagline || 'Bahawalpur Heritage'}
                </p>
              </div>
            </div>
            
            <p className="text-sm text-softwhite/80 leading-relaxed">
              {settings.footer_about || 'Handcrafted embroidered masterpieces from the heart of Bahawalpur, preserving centuries of traditional craftsmanship for the modern connoisseur.'}
            </p>
            
            {/* Social Media Links */}
            {(settings.social_facebook || settings.social_instagram || settings.social_twitter) && (
              <div className="flex space-x-3 justify-center md:justify-start pt-2">
                {settings.social_facebook && (
                  <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="text-softwhite/70 hover:text-emerald-300 transition-colors">
                    <Facebook size={20} />
                  </a>
                )}
                {settings.social_instagram && (
                  <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="text-softwhite/70 hover:text-emerald-300 transition-colors">
                    <Instagram size={20} />
                  </a>
                )}
                {settings.social_twitter && (
                  <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="text-softwhite/70 hover:text-emerald-300 transition-colors">
                    <Twitter size={20} />
                  </a>
                )}
              </div>
            )}
            
            <div className="flex items-center space-x-2 pt-2 justify-center md:justify-start">
              <div className="h-px flex-grow bg-gradient-to-r from-emerald-400/50 to-transparent" />
              <Heart size={12} className="text-emerald-400" />
              <div className="h-px flex-grow bg-gradient-to-l from-emerald-400/50 to-transparent" />
            </div>
          </div>

          {/* Three columns */}
          <div className="grid grid-cols-3 gap-6 md:gap-8 md:col-span-2 lg:col-span-3">
            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h4 className="font-display font-bold text-emerald-300 mb-4 text-lg relative inline-block">
                Quick Links
                <div className="absolute -bottom-1 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 w-8 h-0.5 bg-emerald-400" />
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/shop" className="text-sm text-softwhite/80 hover:text-emerald-300 transition-colors flex items-center group justify-center md:justify-start">
                    <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all mr-0 group-hover:mr-2" />
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm text-softwhite/80 hover:text-emerald-300 transition-colors flex items-center group justify-center md:justify-start">
                    <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all mr-0 group-hover:mr-2" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-softwhite/80 hover:text-emerald-300 transition-colors flex items-center group justify-center md:justify-start">
                    <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all mr-0 group-hover:mr-2" />
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Collections */}
            <div className="text-center md:text-left">
              <h4 className="font-display font-bold text-emerald-300 mb-4 text-lg relative inline-block">
                Collections
                <div className="absolute -bottom-1 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 w-8 h-0.5 bg-emerald-400" />
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/shop?collection=lawn-pakka-tanka" className="text-sm text-softwhite/80 hover:text-emerald-300 transition-colors flex items-center group justify-center md:justify-start">
                    <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all mr-0 group-hover:mr-2" />
                    Lawn Pakka Tanka
                  </Link>
                </li>
                <li>
                  <Link to="/shop?collection=cut-dana" className="text-sm text-softwhite/80 hover:text-emerald-300 transition-colors flex items-center group justify-center md:justify-start">
                    <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all mr-0 group-hover:mr-2" />
                    Cut Dana
                  </Link>
                </li>
                <li>
                  <Link to="/shop?collection=embellished" className="text-sm text-softwhite/80 hover:text-emerald-300 transition-colors flex items-center group justify-center md:justify-start">
                    <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all mr-0 group-hover:mr-2" />
                    Embellished
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="text-sm text-emerald-300 hover:text-emerald-200 transition-colors font-medium flex items-center group mt-3 justify-center md:justify-start">
                    <span className="w-2 h-px bg-emerald-400 mr-2" />
                    View All →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="text-center md:text-left">
              <h4 className="font-display font-bold text-emerald-300 mb-4 text-lg relative inline-block">
                Contact Us
                <div className="absolute -bottom-1 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 w-8 h-0.5 bg-emerald-400" />
              </h4>
              
              {/* Mobile: Simple link */}
              <div className="block md:hidden">
                <Link to="/contact" className="text-sm text-softwhite/80 hover:text-emerald-300 transition-colors flex items-center group justify-center">
                  <span className="w-0 group-hover:w-2 h-px bg-emerald-400 transition-all mr-0 group-hover:mr-2" />
                  Get In Touch
                </Link>
              </div>
              
              {/* Desktop: Full details */}
              <ul className="space-y-3 hidden md:block">
                <li className="flex items-start space-x-3 group">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0 text-emerald-400" />
                  <span className="text-sm text-softwhite/80">
                    {settings.business_address || 'Bahawalpur, Punjab, Pakistan'}
                  </span>
                </li>
                <li className="flex items-start space-x-3 group">
                  <Phone size={16} className="flex-shrink-0 text-emerald-400 mt-0.5" />
                  <a 
                    href={`https://wa.me/${(settings.business_phone || '+92 330 0390222').replace(/[^0-9]/g, '')}`}
                    className="text-sm text-softwhite/80 hover:text-emerald-300 transition-colors"
                  >
                    {settings.business_phone || '+92 330 0390222'}
                  </a>
                </li>
                <li className="flex items-start space-x-3 group">
                  <Mail size={16} className="flex-shrink-0 text-emerald-400 mt-0.5" />
                  <a 
                    href={`mailto:${settings.business_email || 'zaiinabsanaullah@gmail.com'}`}
                    className="text-sm text-softwhite/80 hover:text-emerald-300 transition-colors break-all"
                  >
                    {settings.business_email || 'zaiinabsanaullah@gmail.com'}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="relative my-6">
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400 text-xs">
            ❖
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 text-center">
          <p className="text-sm text-softwhite/70">
            © {currentYear} <span className="text-emerald-300 font-semibold">{settings.business_name || 'Zoey\'s'}</span>. 
            {settings.footer_copyright || <>Crafted with <Heart size={12} className="inline text-emerald-400 mx-1" /> in Bahawalpur</>}
          </p>
        </div>
      </div>
      
      {/* Decorative Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-emerald-400 via-emerald-600 to-emerald-400" />
    </footer>
  );
};

export default Footer;
