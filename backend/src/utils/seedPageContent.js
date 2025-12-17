import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const pageContentData = [
  {
    pageKey: 'home',
    title: 'Home - Authentic Bahawalpur Embroidery',
    content: {
      heroTitle: 'Handcrafted Bahawalpur Embroidery',
      heroSubtitle: 'Authentic chicken kaari, pakka tanka, and tarkashi embroidery crafted by master artisans. Preserving heritage, one stitch at a time.',
      ctaText: 'Browse Collections',
      trivia: [
        { title: 'Master Artisans', fact: '40+ Hours', stat: 'Per masterpiece' },
        { title: 'Heritage', fact: '3 Generations', stat: 'Of craftsmanship' },
        { title: 'Precision', fact: '5,000+ Stitches', stat: 'Hand embroidered' }
      ]
    },
    metaTitle: 'Authentic Bahawalpur Embroidery & Handcrafted Pakistani Fabrics | Zoey\'s',
    metaDescription: 'Shop exquisite handcrafted Bahawalpur embroidery including chicken kaari, pakka tanka, tarkashi, and cut dana work. Traditional Pakistani embroidered dresses delivered nationwide.',
    keywords: 'bahawalpur embroidery, chicken kaari pakistan, pakka tanka embroidery, tarkashi work, cut dana embroidery, traditional embroidered dresses, pakistani embroidered fabrics',
    published: true
  },
  {
    pageKey: 'about',
    title: 'Our Story - Heritage & Craftsmanship',
    content: {
      aboutText: `Zoey's Heritage Embroidery preserves the rich tradition of Bahawalpur embroidery. For centuries, skilled artisans in Punjab have passed down intricate techniques - from pakka tanka's bold stitches to tarkashi's delicate threadwork, cut dana's sparkly embellishments, and chicken kaari's intricate patterns. We work directly with master artisans, providing fair wages while keeping these precious traditional techniques alive.

Each piece tells a story of dedication and craftsmanship. Our artisans spend countless hours perfecting every stitch, ensuring that each creation meets the highest standards of quality and authenticity. We believe in preserving heritage while creating beautiful pieces for the modern world.`,
      faqs: [
        {
          question: 'What is Bahawalpur embroidery?',
          answer: 'Bahawalpur embroidery is a traditional Pakistani craft from the Punjab region, known for distinctive techniques like pakka tanka (bold colorful stitches), tarkashi (delicate threadwork), cut dana (sparkly embellishments), and chicken kaari (intricate patterns).'
        },
        {
          question: 'How do you support local artisans?',
          answer: 'We work directly with skilled Bahawalpur artisans, providing fair wages and preserving traditional embroidery techniques passed down through generations while creating sustainable livelihoods.'
        },
        {
          question: 'What makes your embroidery techniques special?',
          answer: 'Our embroidery preserves centuries-old techniques with meticulous handcrafting. Each piece features authentic pakka tanka, tarkashi, cut dana, or chicken kaari work done by master artisans using traditional methods.'
        },
        {
          question: 'How long does it take to create one embroidered piece?',
          answer: 'Depending on the complexity and embroidery technique, a single piece can take our artisans from several days to weeks to complete, with meticulous attention to every stitch and detail.'
        }
      ]
    },
    metaTitle: 'Our Story - Heritage & Craftsmanship | Zoey\'s Bahawalpur Embroidery',
    metaDescription: 'Discover Zoey\'s Heritage Embroidered Fabrics - preserving centuries-old Bahawalpur embroidery techniques including pakka tanka, tarkashi, cut dana, and chicken kaari work.',
    keywords: 'bahawalpur embroidery heritage, traditional pakistani crafts, artisan support, embroidery techniques, pakka tanka, tarkashi, cut dana, chicken kaari',
    published: true
  },
  {
    pageKey: 'contact',
    title: 'Contact Us',
    content: {
      introText: `Have questions about our products or custom orders? We'd love to hear from you! Reach out for custom embroidery orders, wholesale inquiries, or any questions about our traditional Bahawalpur embroidered fabrics. Our team is here to help bring your vision to life.`,
      faqs: [
        {
          question: 'Do you accept custom embroidery orders?',
          answer: 'Yes, we specialize in custom Bahawalpur embroidery orders. You can provide your design preferences or work with our artisans to create unique pieces tailored to your needs.'
        },
        {
          question: 'What is your delivery time for custom orders?',
          answer: 'Custom embroidery orders typically take 2-4 weeks depending on complexity and design. Ready-made items ship within 3-5 business days across Pakistan.'
        },
        {
          question: 'Do you offer wholesale prices for bulk purchases?',
          answer: 'Yes, we offer competitive wholesale pricing for bulk orders and retail partnerships. Contact us directly to discuss your requirements and receive a custom quote.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept Cash on Delivery (COD) nationwide for retail orders. For bulk and custom orders, we also accept bank transfers with order confirmation.'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Currently we ship across Pakistan with nationwide delivery. For international orders, please contact us directly to discuss shipping options, costs, and delivery times.'
        }
      ]
    },
    metaTitle: 'Contact Us - Zoey\'s Heritage Embroidery',
    metaDescription: 'Get in touch with Zoey\'s Heritage Embroidered Fabrics. Custom orders, bulk purchases, and nationwide delivery across Pakistan.',
    keywords: 'contact bahawalpur embroidery, custom embroidery orders, wholesale traditional fabrics, pakistani embroidery contact',
    published: true
  },
  {
    pageKey: 'shop',
    title: 'Shop Traditional Embroidered Fabrics',
    content: {
      pageTitle: 'Shop Our Collections',
      description: 'Browse our collection of authentic Bahawalpur embroidered fabrics featuring pakka tanka, tarkashi, cut dana, and chicken kaari work. Each piece is handcrafted by skilled artisans preserving centuries-old traditions.'
    },
    metaTitle: 'Shop Traditional Bahawalpur Embroidered Fabrics | Zoey\'s',
    metaDescription: 'Browse authentic Bahawalpur embroidery collection - pakka tanka, tarkashi, cut dana, chicken kaari. Handcrafted traditional Pakistani fabrics.',
    keywords: 'buy bahawalpur embroidery, shop pakistani embroidered fabrics, traditional embroidery online, handcrafted fabrics pakistan',
    published: true
  },
  {
    pageKey: 'footer',
    title: 'About Us',
    content: {
      aboutText: 'Handcrafted embroidered masterpieces from the heart of Bahawalpur, preserving centuries of traditional craftsmanship for the modern connoisseur.'
    },
    metaTitle: 'Zoey\'s Heritage Embroidery',
    metaDescription: 'Traditional Bahawalpur embroidery - handcrafted with heritage and passion',
    keywords: 'bahawalpur embroidery, traditional pakistani embroidery, handcrafted fabrics',
    published: true
  }
];

async function seedPageContent() {
  try {
    console.log('🌱 Starting PageContent seeding...\n');

    for (const data of pageContentData) {
      console.log(`📄 Seeding ${data.pageKey}...`);
      
      // Check if already exists
      const existing = await prisma.pageContent.findUnique({
        where: { pageKey: data.pageKey }
      });

      if (existing) {
        console.log(`   ⚠️  ${data.pageKey} already exists, updating...`);
        await prisma.pageContent.update({
          where: { pageKey: data.pageKey },
          data: {
            title: data.title,
            content: data.content,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            keywords: data.keywords,
            published: data.published
          }
        });
        console.log(`   ✅ Updated ${data.pageKey}\n`);
      } else {
        await prisma.pageContent.create({
          data
        });
        console.log(`   ✅ Created ${data.pageKey}\n`);
      }
    }

    console.log('✨ PageContent seeding completed successfully!\n');

    // Display summary
    const allContent = await prisma.pageContent.findMany();
    console.log('📊 Summary:');
    console.log(`   Total entries: ${allContent.length}`);
    console.log(`   Published: ${allContent.filter(c => c.published).length}`);
    console.log(`   Draft: ${allContent.filter(c => !c.published).length}\n`);

  } catch (error) {
    console.error('❌ Error seeding PageContent:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
seedPageContent()
  .then(() => {
    console.log('🎉 Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });

export default seedPageContent;
