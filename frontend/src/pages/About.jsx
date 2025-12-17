import { motion } from 'framer-motion';
import { Heart, Award, Users, Sparkles, Crown, Star, Feather } from 'lucide-react';
import { useEffect, useState } from 'react';
// Import SEO utilities
import { setPageMeta, getOrganizationSchema, getFAQSchema, injectSchema } from '../utils/seo-utils';
// Import APIs
import { contentAPI } from '../utils/api';

const About = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch page content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await contentAPI.getByKey('about');
        setContent(data || {});
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Set SEO meta tags on component mount
  useEffect(() => {
    if (!loading) {
      setPageMeta({
        title: content.metaTitle || 'Our Story - Heritage & Craftsmanship',
        description: content.metaDescription || 'Discover Zoey\'s Heritage Embroidered Fabrics - preserving centuries-old Bahawalpur embroidery techniques including pakka tanka, tarkashi, cut dana, and chicken kaari work.',
        keywords: content.keywords || 'bahawalpur embroidery heritage, traditional pakistani crafts, artisan support, embroidery techniques, pakka tanka, tarkashi, cut dana, chicken kaari, handcrafted fabrics',
        url: `${import.meta.env.VITE_SITE_URL || 'https://yourdomain.com'}/about`,
        type: 'website'
      });

      // Inject organization schema
      const organizationSchema = getOrganizationSchema();
      const faqSchema = getFAQSchema([
        {
          question: "What is Bahawalpur embroidery?",
          answer: "Bahawalpur embroidery is a traditional Pakistani craft from the Punjab region, known for distinctive techniques like pakka tanka (bold colorful stitches), tarkashi (delicate threadwork), cut dana (sparkly embellishments), and chicken kaari (intricate patterns)."
        },
        {
          question: "How do you support local artisans?",
          answer: "We work directly with skilled Bahawalpur artisans, providing fair wages and preserving traditional embroidery techniques passed down through generations while creating sustainable livelihoods."
        },
        {
          question: "What makes your embroidery techniques special?",
          answer: "Our embroidery preserves centuries-old techniques with meticulous handcrafting. Each piece features authentic pakka tanka, tarkashi, cut dana, or chicken kaari work done by master artisans using traditional methods."
        },
        {
          question: "How long does it take to create one embroidered piece?",
          answer: "Depending on the complexity and embroidery technique, a single piece can take our artisans from several days to weeks to complete, with meticulous attention to every stitch and detail."
        }
      ]);

      injectSchema(organizationSchema);
      injectSchema(faqSchema);
    }
  }, [loading, content]);

  const values = [
    {
      icon: Heart,
      title: 'Heritage & Tradition',
      description: 'Preserving centuries-old embroidery techniques passed down through generations of Bahawalpur artisans.',
    },
    {
      icon: Award,
      title: 'Quality Craftsmanship',
      description: 'Every piece is meticulously handcrafted with attention to detail, ensuring the highest quality standards.',
    },
    {
      icon: Users,
      title: 'Supporting Artisans',
      description: 'Empowering local craftspeople and keeping traditional embroidery skills alive in our community.',
    },
    {
      icon: Sparkles,
      title: 'Modern Elegance',
      description: 'Blending traditional techniques with contemporary designs for the modern wardrobe.',
    },
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
              Our Story
            </h1>

            <div className="divider max-w-xs mx-auto border-emerald-400/30" aria-hidden="true" />

            <p className="text-sm md:text-base text-softwhite/80 max-w-2xl mx-auto">
              Zoey's brings the rich tradition of Bahawalpur embroidery to contemporary fashion,
              honoring centuries of craftsmanship while creating pieces for today's world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.article
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-charcoal">
                The Art of Bahawalpur Embroidery
              </h2>

              <div className="space-y-4 text-charcoal/70 leading-relaxed">
                <p>
                  Bahawalpur, located in the heart of Punjab, Pakistan, has been a center of
                  traditional embroidery for centuries. The region is renowned for its distinctive
                  embroidery styles including{' '}
                  <strong className="text-emerald-600 font-semibold">pakka tanka</strong>,
                  <strong className="text-emerald-600 font-semibold"> tarkashi</strong>,
                  <strong className="text-emerald-600 font-semibold"> cut dana work</strong>, and the
                  intricate <strong className="text-emerald-600 font-semibold"> chicken kaari</strong>{' '}
                  technique.
                </p>

                <p>
                  Each embroidery style tells its own story. Pakka tanka features bold, colorful
                  stitches that create striking patterns. Tarkashi work involves delicate threadwork
                  that adds subtle elegance. Cut dana embellishments bring sparkle and glamour, while
                  chicken kaari's intricate patterns showcase the pinnacle of embroidery artistry.
                </p>

                <aside className="bg-emerald-50 p-6 rounded-lg my-6">
                  <p className="text-charcoal italic">
                    At Zoey's, we work directly with skilled artisans who have inherited these
                    techniques from their ancestors. Every piece is handcrafted with patience,
                    precision, and pride, ensuring that each stitch carries forward a legacy of
                    excellence.
                  </p>
                </aside>
              </div>
            </motion.article>

            <motion.figure
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden group">
                  <img
                    src="https://res.cloudinary.com/dm7nsralr/image/upload/v1761463044/about4_xbgu3z.jpg"
                    alt="Close-up detail of traditional pakka tanka embroidery showing intricate stitches and patterns"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="rounded-lg overflow-hidden group">
                  <img
                    src="https://res.cloudinary.com/dm7nsralr/image/upload/v1761463044/bahawalpur3_senagz.jpg"
                    alt="Traditional Bahawalpur embroidery craft tools and materials used by local artisans"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="rounded-lg overflow-hidden group">
                  <img
                    src="https://res.cloudinary.com/dm7nsralr/image/upload/v1761463043/about1_ipqerc.jpg"
                    alt="Skilled artisan carefully working on tarkashi embroidery technique with precision"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="rounded-lg overflow-hidden group">
                  <img
                    src="https://res.cloudinary.com/dm7nsralr/image/upload/v1761463044/about2_z7kc63.jpg"
                    alt="Completed heritage embroidery design showcasing cut dana and mirror work details"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <figcaption className="sr-only">
                Traditional Bahawalpur embroidery techniques including pakka tanka, tarkashi, and cut dana work
              </figcaption>
            </motion.figure>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-b from-white to-amber/95 shadow-subtle border border-emerald-200">
        <div className="container-custom">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-charcoal mb-4">
              What We Stand For
            </h2>
            <div className="divider max-w-xs mx-auto mb-4" aria-hidden="true" />
            <p className="text-charcoal/70 max-w-2xl mx-auto">
              Our commitment to excellence, heritage, and community drives everything we create
            </p>
          </motion.header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-white rounded-xl p-6 shadow-subtle hover:shadow-soft transition-all text-center"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-emerald-600" aria-hidden="true" />
                  </div>

                  <h3 className="text-lg font-display font-bold text-charcoal mb-3">{value.title}</h3>

                  <p className="text-sm text-charcoal/70 leading-relaxed">{value.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-emerald-50/95 shadow-subtle border border-emerald-200">
        <div className="container-custom">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-charcoal mb-4">
              From Thread to Treasure
            </h2>
            <div className="divider max-w-xs mx-auto mb-4" aria-hidden="true" />
            <p className="text-charcoal/70 max-w-2xl mx-auto">
              Every piece goes through a meticulous process before reaching you
            </p>
          </motion.header>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Design & Selection',
                description: 'We carefully select traditional patterns and adapt them for modern aesthetics, choosing premium fabrics that complement our embroidery styles.',
                icon: Feather,
              },
              {
                step: '02',
                title: 'Handcraft & Embroidery',
                description: 'Our skilled artisans bring each design to life with traditional techniques, spending hours on intricate embroidery work with precision and care.',
                icon: Sparkles,
              },
              {
                step: '03',
                title: 'Quality & Delivery',
                description: 'Each piece undergoes rigorous quality checks before being carefully packaged and delivered to your doorstep with love and attention.',
                icon: Crown,
              },
            ].map((process, index) => {
              const Icon = process.icon;
              return (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" aria-hidden="true" />
                  </div>

                  <div className="text-sm text-emerald-600 font-semibold mb-2">{process.step}</div>

                  <h3 className="text-xl font-display font-bold text-charcoal mb-4">
                    {process.title}
                  </h3>

                  <p className="text-charcoal/70 leading-relaxed">{process.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section - Added for better SEO */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-charcoal mb-4">
              Frequently Asked Questions
            </h2>
            <div className="divider max-w-xs mx-auto mb-4" aria-hidden="true" />
          </motion.header>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "What is Bahawalpur embroidery?",
                answer: "Bahawalpur embroidery is a traditional Pakistani craft from the Punjab region, known for distinctive techniques like pakka tanka (bold colorful stitches), tarkashi (delicate threadwork), cut dana (sparkly embellishments), and chicken kaari (intricate patterns)."
              },
              {
                question: "How do you support local artisans?",
                answer: "We work directly with skilled Bahawalpur artisans, providing fair wages and preserving traditional embroidery techniques passed down through generations while creating sustainable livelihoods."
              },
              {
                question: "What makes your embroidery techniques special?",
                answer: "Our embroidery preserves centuries-old techniques with meticulous handcrafting. Each piece features authentic pakka tanka, tarkashi, cut dana, or chicken kaari work done by master artisans using traditional methods."
              },
              {
                question: "How long does it take to create one embroidered piece?",
                answer: "Depending on the complexity and embroidery technique, a single piece can take our artisans from several days to weeks to complete, with meticulous attention to every stitch and detail."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-emerald-50 rounded-lg p-6"
              >
                <h3 className="font-display font-bold text-charcoal mb-2 text-lg">{faq.question}</h3>
                <p className="text-charcoal/70">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-50">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <Sparkles className="w-12 h-12 mx-auto text-emerald-600" aria-hidden="true" />

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-charcoal leading-tight">
              Experience Traditional Craftsmanship
            </h2>

            <div className="divider max-w-md mx-auto" aria-hidden="true" />

            <p className="text-charcoal/70">Each piece tells a story. Discover yours today.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="/shop"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 inline-flex items-center justify-center"
                aria-label="Explore our collection of traditional embroidered fabrics"
              >
                Explore Collection
              </a>

              <a
                href="/contact"
                className="border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 inline-flex items-center justify-center"
                aria-label="Contact us for custom embroidery inquiries"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;