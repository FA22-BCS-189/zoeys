import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const defaultSettings = [
  // General Settings
  { key: 'business_name', value: 'Zoey\'s', label: 'Business Name', category: 'general' },
  { key: 'site_tagline', value: 'Bahawalpur Heritage', label: 'Site Tagline', category: 'general' },
  { key: 'footer_about', value: 'Handcrafted embroidered masterpieces from the heart of Bahawalpur, preserving centuries of traditional craftsmanship for the modern connoisseur.', label: 'Footer About Text', category: 'general' },
  
  // Contact Information
  { key: 'business_phone', value: '+92 330 0390222', label: 'Business Phone', category: 'contact' },
  { key: 'business_email', value: 'zaiinabsanaullah@gmail.com', label: 'Business Email', category: 'contact' },
  { key: 'business_address', value: 'Bahawalpur, Punjab, Pakistan', label: 'Business Address', category: 'contact' },
  
  // Social Media
  { key: 'social_facebook', value: '', label: 'Facebook URL', category: 'social' },
  { key: 'social_instagram', value: '', label: 'Instagram URL', category: 'social' },
  { key: 'social_twitter', value: '', label: 'Twitter URL', category: 'social' },
  
  // SEO Meta Tags
  { key: 'contact_meta_description', value: 'Get in touch with Zoey\'s Heritage Embroidered Fabrics. Custom orders, bulk purchases, and nationwide delivery across Pakistan.', label: 'Contact Page Meta Description', category: 'seo' },
  { key: 'contact_meta_keywords', value: 'contact bahawalpur embroidery, custom embroidery orders, wholesale traditional fabrics, pakistani embroidery contact, whatsapp embroidery queries', label: 'Contact Page Keywords', category: 'seo' },
];

async function seedSettings() {
  console.log('Seeding default settings...');
  
  try {
    for (const setting of defaultSettings) {
      // Use upsert to avoid duplicates
      await prisma.siteSettings.upsert({
        where: { key: setting.key },
        update: {}, // Don't update if it exists
        create: setting,
      });
      console.log(`✓ Seeded: ${setting.label}`);
    }
    
    console.log('\n✅ Settings seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedSettings();
