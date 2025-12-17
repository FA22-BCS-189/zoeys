import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { productsAPI, collectionsAPI, settingsAPI } from '../utils/api';
import { 
  setPageMeta, 
  getOrganizationSchema, 
  getWebSiteSchema, 
  injectMultipleSchemas,
  setLanguage,
  BUSINESS_INFO 
} from '../utils/seo-utils';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SEO Setup
    setLanguage('en');
    
    setPageMeta({
      title: "Authentic Bahawalpur Embroidery & Handcrafted Pakistani Fabrics",
      description: "Shop exquisite handcrafted Bahawalpur embroidery including chicken kaari, pakka tanka, tarkashi, and cut dana work. Traditional Pakistani embroidered dresses with heritage craftsmanship delivered nationwide.",
      keywords: "bahawalpur embroidery, chicken kaari pakistan, pakka tanka embroidery, tarkashi work, cut dana embroidery, traditional embroidered dresses, pakistani embroidered fabrics, handcrafted embroidery lahore, shadow work embroidery, mirror work phulkari",
      url: BUSINESS_INFO.url,
      type: "website"
    });

    // Inject structured data
    const schemas = [
      getOrganizationSchema(),
      getWebSiteSchema()
    ];
    injectMultipleSchemas(schemas);

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, collectionsRes, settingsData] = await Promise.all([
        productsAPI.getAll({ limit: 6 }),
        collectionsAPI.getAll(),
        settingsAPI.getAll()
      ]);
      setFeaturedProducts(productsRes.data.data.slice(0, 6));
      setCollections(collectionsRes.data.data);
      setSettings(settingsData || {});
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const triviaFacts = [
    {
      icon: Clock,
      title: 'The Art of Patience',
      fact: 'Each piece undergoes 40+ hours of meticulous hand embroidery, with some complex designs taking up to 2 weeks to complete.',
      stat: '40+ Hours'
    },
    {
      icon: Users,
      title: 'Generational Legacy',
      fact: 'Our artisans inherit techniques passed down through 3 generations, preserving centuries-old Bahawalpur embroidery traditions.',
      stat: '3 Generations'
    },
    {
      icon: Sparkles,
      title: 'Precision in Every Stitch',
      fact: 'A single piece can contain over 5,000 individual stitches, each placed with intention and expert craftsmanship.',
      stat: '5,000 Stitches'
    }
  ];

  return (
    <div className="overflow-hidden bg-amber-50 text-charcoal">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col justify-center items-center text-center py-12 px-4 space-y-4">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url("https://res.cloudinary.com/dm7nsralr/image/upload/v1761469980/ha_pf5mak.jpg")',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 20%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
          }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-2 relative z-10"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight">
            Handcrafted Bahawalpur Embroidery
          </h1>

          <p className="text-sm md:text-base text-charcoal/80 max-w-2xl mx-auto bg-amber/60 backdrop-blur-sm px-4 py-3 rounded-lg">
            Authentic chicken kaari, pakka tanka, and tarkashi embroidery inspired by Mughal heritage, crafted for the modern minimalist.
          </p>

          <Link
            to="/shop"
            className="btn-primary inline-flex items-center space-x-2 mt-2 text-sm"
            aria-label="Explore our embroidery collection"
          >
            <span>Explore Collection</span>
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* Collections - Horizontal Scroll */}
      <section className="py-10 bg-amber-50">
        <div className="container-custom text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-display heading-accent mb-2">
            Our Heritage Collections
          </h2>
          <div className="divider max-w-xs mx-auto mb-2" />
          <p className="text-sm text-charcoal/70">
            Explore traditional Pakistani embroidery styles from Bahawalpur
          </p>
        </div>

        <nav className="flex overflow-x-auto pb-6 px-4 gap-6 scrollbar-hide" aria-label="Product collections">
          {collections.map((collection) => (
            <Link 
              key={collection.id} 
              to={`/collection/${collection.slug || collection.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex-shrink-0 w-80 group relative rounded-xl overflow-hidden shadow-subtle hover:shadow-soft transition-all duration-300 hover:scale-105"
              aria-label={`View ${collection.name} collection`}
            >
              {collection.image ? (
                <img
                  src={collection.image}
                  alt={`${collection.name} - Traditional Bahawalpur embroidery collection`}
                  className="w-full h-48 object-cover rounded-xl"
                  loading="lazy"
                  width="320"
                  height="192"
                />
              ) : (
                <div className="w-full h-48 bg-emerald-100 rounded-xl" />
              )}

              <div className="mt-2 text-center px-2 pb-4">
                <h3 className="font-display text-lg font-semibold group-hover:text-emerald-600 transition-colors">
                  {collection.name}
                </h3>
                {collection.description && (
                  <p className="text-xs text-charcoal/70 line-clamp-2 mt-1">{collection.description}</p>
                )}
              </div>
            </Link>
          ))}
        </nav>
      </section>

      {/* Embroidery Trivia Section */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-emerald-50/95 shadow-subtle border border-emerald-200">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-display heading-accent mb-2">
              The Art Behind Every Stitch
            </h2>
            <div className="divider max-w-xs mx-auto mb-4" />
            <p className="text-sm text-charcoal/70 max-w-2xl mx-auto">
              Discover the dedication and heritage woven into every Bahawalpur embroidery piece
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {triviaFacts.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-600 transition-all duration-500">
                    <Icon className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors duration-500" aria-hidden="true" />
                  </div>
                  
                  <div className="bg-amber-25 rounded-lg px-3 py-1 mb-4 inline-block">
                    <span className="text-sm font-semibold text-emerald-600 tracking-wide">
                      {item.stat}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-charcoal mb-4">
                    {item.title}
                  </h3>
                  
                  <p className="text-charcoal/70 leading-relaxed text-sm">
                    {item.fact}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-emerald-50 text-charcoal text-center">
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
          Ready to Experience <br />
          <span className="heading-accent">Bahawalpur's Finest Embroidery?</span>
        </h2>
        <p className="text-sm text-charcoal/70 max-w-xl mx-auto mb-4">
          Every piece tells a story of heritage, tradition, and centuries of craftsmanship.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/shop"
            className="btn-primary inline-flex items-center justify-center space-x-2 text-sm"
            aria-label="Browse our embroidery collection"
          >
            <span>Browse Collection</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            to="/contact"
            className="btn-outline inline-flex items-center justify-center space-x-2 text-sm"
            aria-label="Contact us for custom orders"
          >
            <span>Get in Touch</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
