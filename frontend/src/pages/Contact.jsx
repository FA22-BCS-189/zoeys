import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Crown } from 'lucide-react';
// Import SEO utilities
import { setPageMeta, getOrganizationSchema, getFAQSchema, injectSchema, BUSINESS_INFO } from '../utils/seo-utils';
// Import APIs
import { settingsAPI, contentAPI } from '../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState({});
  const [pageContent, setPageContent] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch settings and content on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsData, contentResponse] = await Promise.all([
          settingsAPI.getAll(),
          contentAPI.getByKey('contact').catch(() => ({ success: false, data: {} }))
        ]);
        // contentResponse is { success, data }
        const contentData = contentResponse.data || {};
        setSettings(settingsData);
        setPageContent(contentData);
        console.log('Contact page content loaded:', contentData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Set SEO meta tags when content loads
  useEffect(() => {
    // Always set meta tags, use database content if available
    setPageMeta({
      title: pageContent.metaTitle || `Contact Us - ${settings.business_name || 'Zoey\'s Heritage Embroidery'}`,
      description: pageContent.metaDescription || 'Get in touch with Zoey\'s Heritage Embroidered Fabrics. Custom orders, bulk purchases, and nationwide delivery across Pakistan.',
      keywords: pageContent.keywords || 'contact bahawalpur embroidery, custom embroidery orders, wholesale traditional fabrics, pakistani embroidery contact, whatsapp embroidery queries',
      url: `${import.meta.env.VITE_SITE_URL || 'https://yourdomain.com'}/contact`,
      type: 'website'
    });

    // Inject organization schema (includes contact info)
    const organizationSchema = getOrganizationSchema();
    
    // Use FAQs from database or fallback
    const faqData = pageContent.content?.faqs && pageContent.content.faqs.length > 0 ? pageContent.content.faqs : [
      {
        question: "Do you accept custom embroidery orders?",
        answer: "Yes, we specialize in custom Bahawalpur embroidery orders. You can provide your design preferences or work with our artisans to create unique pieces."
      },
      {
        question: "What is your delivery time for custom orders?",
        answer: "Custom embroidery orders typically take 2-4 weeks depending on complexity. Ready-made items ship within 3-5 business days across Pakistan."
      },
      {
        question: "Do you offer wholesale prices for bulk purchases?",
        answer: "Yes, we offer competitive wholesale pricing for bulk orders and retail partnerships. Contact us directly for bulk purchase discounts."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept Cash on Delivery (COD) nationwide. For bulk and custom orders, we also accept bank transfers with order confirmation."
      },
      {
        question: "Do you ship internationally?",
        answer: "Currently we ship across Pakistan. For international orders, please contact us directly to discuss shipping options and costs."
      }
    ];
    
    const faqSchema = getFAQSchema(faqData);

    injectSchema(organizationSchema);
    injectSchema(faqSchema);
  }, [pageContent, settings]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone / WhatsApp',
      value: settings.business_phone || '+92 330 0390222',
      link: settings.business_phone ? `https://wa.me/${settings.business_phone.replace(/[^0-9]/g, '')}` : 'https://wa.me/923300390222'
    },
    {
      icon: Mail,
      title: 'Email',
      value: settings.business_email || 'zaiinabsanaullah@gmail.com',
      link: `mailto:${settings.business_email || 'zaiinabsanaullah@gmail.com'}`
    },
    {
      icon: MapPin,
      title: 'Location',
      value: settings.business_address || 'Lahore, Punjab, Pakistan',
      link: null
    }
  ];

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 bg-gradient-to-r from-navy-800 via-navy-700 to-navy-900 text-softwhite">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <Crown className="w-10 h-10 md:w-14 md:h-14 mx-auto text-emerald-400" aria-hidden="true" />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-softwhite leading-tight">
              Get in Touch
            </h1>
            <div className="divider max-w-xs mx-auto border-emerald-400/30" aria-hidden="true" />
            <p className="text-sm md:text-base text-softwhite/80 max-w-2xl mx-auto">
              {pageContent.content?.introText || "Have questions about our products or custom orders? We'd love to hear from you!"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-amber-50">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-amber rounded-xl p-6 shadow-subtle hover:shadow-lg transition-all text-center border border-emerald-300/50"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-emerald-600" aria-hidden="true" />
                  </div>
                  <h2 className="font-display font-bold text-charcoal mb-2">{info.title}</h2>
                  {info.link ? (
                    <a
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 transition-colors text-sm"
                      aria-label={`Contact us via ${info.title}: ${info.value}`}
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-charcoal/70 text-sm">{info.value}</p>
                  )}
                </motion.article>
              );
            })}
          </div>

          {/* Contact Form and Info */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.section
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-subtle p-8"
              aria-labelledby="contact-form-heading"
            >
              <h2 id="contact-form-heading" className="text-2xl font-display font-bold text-charcoal mb-6">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-1">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Tell us about your embroidery needs, custom order requirements, or any questions..."
                    aria-required="true"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 inline-flex items-center justify-center space-x-2"
                  aria-label="Send your message to Zoey's Heritage Embroidery"
                >
                  <Send size={18} aria-hidden="true" />
                  <span>Send Message</span>
                </button>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm"
                    role="alert"
                  >
                    Thank you for your message! We'll get back to you within 24 hours.
                  </motion.div>
                )}
              </form>
            </motion.section>

            {/* Additional Info */}
            <motion.aside
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* WhatsApp CTA */}
              <section className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-8 shadow-soft">
                <MessageCircle className="w-12 h-12 mb-4" aria-hidden="true" />
                <h3 className="text-2xl font-display font-bold mb-3">
                  Prefer WhatsApp?
                </h3>
                <p className="mb-6 text-emerald-100">
                  Get instant responses to your queries about custom embroidery, bulk orders, or product availability. Chat with us directly on WhatsApp!
                </p>
                <a
                  href="https://wa.me/923300390222"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-white text-emerald-600 hover:bg-emerald-50 font-medium px-6 py-3 rounded-lg transition-colors"
                  aria-label="Start a WhatsApp chat with Zoey's Heritage Embroidery"
                >
                  <MessageCircle size={20} aria-hidden="true" />
                  <span>Chat on WhatsApp</span>
                </a>
              </section>

              {/* Business Hours */}
              <section className="bg-amber rounded-xl p-8 shadow-subtle border border-emerald-300/50">
                <h3 className="text-xl font-display font-bold text-charcoal mb-4">
                  Business Hours
                </h3>
                <div className="space-y-3 text-charcoal/70">
                  <div className="flex justify-between">
                    <span>Monday - Saturday</span>
                    <span className="font-medium">10:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
                <p className="text-sm text-charcoal/60 mt-4">
                  * We respond to all inquiries within 24 hours during business days
                </p>
              </section>

              {/* FAQ Section */}
              <section className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <h3 className="font-display font-bold text-charcoal mb-3">
                  Common Questions
                </h3>
                <ul className="space-y-2 text-sm text-charcoal/70">
                  <li>• Custom orders and bulk purchases available</li>
                  <li>• Delivery available nationwide across Pakistan</li>
                  <li>• Cash on Delivery (COD) accepted</li>
                  <li>• Product care instructions provided with each order</li>
                  <li>• Wholesale pricing for retailers</li>
                </ul>
              </section>

              {/* Local Business Info */}
              <section className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="font-display font-bold text-charcoal mb-3">
                  Local Business
                </h3>
                <div className="space-y-2 text-sm text-charcoal/70">
                  <p>📍 Based in Lahore, Pakistan</p>
                  <p>🎯 Serving customers nationwide</p>
                  <p>🏆 Traditional Bahawalpur embroidery specialists</p>
                  <p>👑 Heritage craftsmanship since 2024</p>
                </div>
              </section>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* Structured Data for Local Business - Hidden but accessible */}
      <div className="sr-only" aria-hidden="true">
        <h2>Zoey's Heritage Embroidered Fabrics</h2>
        <p>Traditional Bahawalpur embroidery including pakka tanka, tarkashi, cut dana, and chicken kaari work.</p>
        <p>Contact: +92 330 0390222</p>
        <p>Email: zaiinabsanaullah@gmail.com</p>
        <p>Location: Lahore, Punjab, Pakistan</p>
        <p>Hours: Monday-Saturday 10:00-20:00</p>
      </div>
    </div>
  );
};

export default Contact;