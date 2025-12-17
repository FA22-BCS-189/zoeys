import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Migrate existing PageContent entries to new JSON structure
 * Old structure: content as Text string, faqs as separate JSON field
 * New structure: content as JSON object containing all page-specific fields
 */
async function migrateContent() {
  try {
    console.log('Starting content migration...');
    
    const allContent = await prisma.pageContent.findMany();
    console.log(`Found ${allContent.length} content entries to migrate`);

    for (const item of allContent) {
      console.log(`\nMigrating ${item.pageKey}...`);
      
      let newContent = {};
      
      // Check if content is already an object
      if (typeof item.content === 'object' && item.content !== null) {
        console.log(`  ${item.pageKey} already migrated, skipping`);
        continue;
      }

      // Migrate based on page type
      switch (item.pageKey) {
        case 'home':
          // Extract hero content from old text content
          newContent = {
            heroTitle: 'Handcrafted Bahawalpur Embroidery',
            heroSubtitle: typeof item.content === 'string' ? item.content : 'Authentic embroidery from Bahawalpur',
            ctaText: 'Browse Collections',
            trivia: [
              { title: 'Master Artisans', fact: '40+ Hours', stat: 'Per masterpiece' },
              { title: 'Heritage', fact: '3 Generations', stat: 'Of craftsmanship' },
              { title: 'Precision', fact: '5,000+ Stitches', stat: 'Hand embroidered' }
            ]
          };
          break;

        case 'about':
          newContent = {
            aboutText: typeof item.content === 'string' ? item.content : '',
            faqs: item.faqs || []
          };
          break;

        case 'contact':
          newContent = {
            introText: typeof item.content === 'string' ? item.content : '',
            faqs: item.faqs || []
          };
          break;

        case 'shop':
          newContent = {
            pageTitle: 'Shop Our Collections',
            description: typeof item.content === 'string' ? item.content : ''
          };
          break;

        case 'footer':
          newContent = {
            aboutText: typeof item.content === 'string' ? item.content : ''
          };
          break;

        default:
          // For unknown page types, just wrap the text content
          newContent = {
            text: typeof item.content === 'string' ? item.content : ''
          };
      }

      // Update the content entry
      await prisma.pageContent.update({
        where: { id: item.id },
        data: { content: newContent }
      });

      console.log(`  ✓ Migrated ${item.pageKey}`);
    }

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateContent()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default migrateContent;
