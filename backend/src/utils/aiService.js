/**
 * AI Service for generating SEO-optimized product descriptions
 * Uses OpenAI or a fallback template-based approach
 */

/**
 * Generate an SEO-optimized product description using AI or template
 * @param {Object} product - Product details
 * @param {string} product.name - Product name
 * @param {string} product.color - Product color
 * @param {number} product.price - Product price
 * @param {string} product.pieces - Number of pieces
 * @param {string} product.description - Product description
 * @param {Object} product.collection - Collection details
 * @param {string} product.collection.name - Collection name
 * @returns {Promise<string>} Generated SEO description
 */
export async function generateSEODescription(product) {
  // Check if OpenAI API key is available
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (openaiApiKey) {
    try {
      return await generateWithOpenAI(product, openaiApiKey);
    } catch (error) {
      console.error('OpenAI generation failed, falling back to template:', error);
      return generateWithTemplate(product);
    }
  } else {
    // Fallback to template-based generation
    console.log('No OpenAI API key found, using template-based generation');
    return generateWithTemplate(product);
  }
}

/**
 * Generate SEO description using OpenAI API
 */
async function generateWithOpenAI(product, apiKey) {
  const prompt = `Create a compelling, SEO-optimized product description for an e-commerce website selling traditional Pakistani embroidered fabrics.

Product Details:
- Name: ${product.name}
- Color: ${product.color}
- Price: PKR ${product.price}
- Pieces: ${product.pieces}
- Collection: ${product.collection?.name || 'Premium'}
${product.description ? `- Current Description: ${product.description}` : ''}

Requirements:
- Length: 150-160 characters (ideal for meta descriptions)
- Include relevant keywords: traditional embroidery, Bahawalpur, handcrafted, Pakistani fabric
- Highlight the unique selling points
- Make it engaging and conversion-focused
- Natural, flowing language

Generate only the description text, no additional commentary.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert SEO copywriter specializing in e-commerce product descriptions for traditional Pakistani textiles and embroidery.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const generatedText = data.choices[0]?.message?.content?.trim();

  if (!generatedText) {
    throw new Error('No description generated from OpenAI');
  }

  return generatedText;
}

/**
 * Generate SEO description using template-based approach
 */
function generateWithTemplate(product) {
  const collectionName = product.collection?.name || 'Premium Collection';
  const color = product.color;
  const name = product.name;
  const pieces = product.pieces;
  const price = product.price;

  // Extract key features from description if available
  const hasDescription = product.description && product.description.length > 0;
  
  // Create various template options for variety
  const templates = [
    `Exquisite ${color} ${name} from our ${collectionName}. ${pieces} of handcrafted Bahawalpur embroidery at PKR ${price}. Traditional Pakistani artistry meets modern elegance.`,
    
    `Discover the beauty of ${color} ${name} - ${pieces} of authentic Bahawalpur embroidery. Part of our ${collectionName}, priced at PKR ${price}. Premium handcrafted Pakistani fabric.`,
    
    `Premium ${color} ${name} featuring traditional Bahawalpur embroidery. ${collectionName} piece includes ${pieces} at PKR ${price}. Handcrafted with care for authentic Pakistani heritage.`,
    
    `Elegant ${color} ${name} in ${pieces} from ${collectionName}. Traditional Pakistani embroidery crafted in Bahawalpur style. Premium quality at PKR ${price}.`,
    
    `Authentic ${color} ${name} - ${pieces} of handcrafted embroidery from our ${collectionName}. PKR ${price}. Experience the rich heritage of Bahawalpur traditional textiles.`
  ];

  // Select template based on product name hash for consistency
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selectedTemplate = templates[hash % templates.length];

  // Ensure it's within SEO meta description length (150-160 chars is ideal)
  if (selectedTemplate.length > 160) {
    return selectedTemplate.substring(0, 157) + '...';
  }

  return selectedTemplate;
}

/**
 * Validate and optimize SEO description
 */
export function validateSEODescription(description) {
  if (!description || description.trim().length === 0) {
    return {
      valid: false,
      error: 'Description cannot be empty'
    };
  }

  const length = description.length;
  const warnings = [];

  if (length < 120) {
    warnings.push('Description is shorter than recommended (120-160 characters)');
  } else if (length > 160) {
    warnings.push('Description exceeds recommended length (120-160 characters)');
  }

  // Check for important keywords
  const keywords = ['embroidery', 'handcrafted', 'traditional', 'bahawalpur', 'pakistani'];
  const hasKeywords = keywords.some(keyword => 
    description.toLowerCase().includes(keyword)
  );

  if (!hasKeywords) {
    warnings.push('Consider including relevant keywords (embroidery, handcrafted, traditional, etc.)');
  }

  return {
    valid: true,
    length,
    warnings,
    optimal: length >= 120 && length <= 160 && hasKeywords
  };
}

/**
 * Generate page content using AI or templates
 * @param {string} pageKey - The page identifier (about, contact, home-hero, etc.)
 * @param {Object} context - Additional context for generation
 * @returns {Promise<Object>} Generated content object
 */
export async function generatePageContent(pageKey, context = {}) {
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (openaiApiKey) {
    try {
      return await generatePageContentWithAI(pageKey, context, openaiApiKey);
    } catch (error) {
      console.error('AI generation failed, falling back to template:', error);
      return generatePageContentTemplate(pageKey, context);
    }
  } else {
    return generatePageContentTemplate(pageKey, context);
  }
}

/**
 * Generate page content using OpenAI
 */
async function generatePageContentWithAI(pageKey, context, apiKey) {
  const prompts = {
    'about-story': {
      system: 'You are an expert copywriter specializing in heritage brands and traditional crafts.',
      user: `Write a compelling "Our Story" section for Zoey's Heritage Embroidery, a business preserving traditional Bahawalpur embroidery techniques. Include:
- How the business started
- The heritage and tradition being preserved
- The artisans and their skills
- The mission and values
Make it warm, authentic, and engaging. Length: 200-300 words.`
    },
    'about-mission': {
      system: 'You are an expert copywriter for purpose-driven brands.',
      user: `Write a mission statement for Zoey's Heritage Embroidery focusing on:
- Preserving traditional Bahawalpur embroidery
- Supporting local artisans
- Combining heritage with modern design
- Quality craftsmanship
Keep it concise and impactful. Length: 100-150 words.`
    },
    'home-hero': {
      system: 'You are an expert e-commerce copywriter.',
      user: `Write a compelling hero section headline and subheadline for Zoey's Heritage Embroidery e-commerce site.
Headline: Bold, attention-grabbing (5-8 words)
Subheadline: Describes the value proposition (15-25 words)
Focus on: Traditional craftsmanship, handmade quality, heritage preservation, Pakistani embroidery`
    },
    'collection-intro': {
      system: 'You are an expert in traditional crafts marketing.',
      user: `Write an introduction for the ${context.collectionName || 'embroidery'} collection highlighting:
- The unique embroidery technique used
- Traditional heritage
- Quality and craftsmanship
- Why customers should choose this collection
Length: 150-200 words.`
    }
  };

  const prompt = prompts[pageKey] || {
    system: 'You are an expert copywriter for traditional crafts and heritage brands.',
    user: `Write engaging content for the ${pageKey} section of an e-commerce website selling traditional Bahawalpur embroidery. Make it authentic, warm, and conversion-focused. ${context.instructions || ''}`
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content?.trim();

  if (!content) {
    throw new Error('No content generated from OpenAI');
  }

  return {
    content,
    metaDescription: content.substring(0, 160),
    generatedBy: 'ai'
  };
}

/**
 * Generate page content using templates
 */
function generatePageContentTemplate(pageKey, context = {}) {
  const templates = {
    'about-story': {
      title: 'Our Story',
      content: `Zoey's Heritage Embroidery was born from a deep passion for preserving the rich tradition of Bahawalpur embroidery. For centuries, skilled artisans in the Punjab region of Pakistan have passed down intricate embroidery techniques through generations - from the bold, colorful stitches of pakka tanka to the delicate threadwork of tarkashi, the sparkly embellishments of cut dana, and the intricate patterns of chicken kaari.

Our journey began with a simple mission: to honor these master craftspeople and bring their extraordinary work to the world. Every piece in our collection tells a story of dedication, skill, and cultural heritage. We work directly with local artisans, providing fair wages and sustainable livelihoods while ensuring that these precious traditional techniques continue to thrive.

At Zoey's, we believe that true luxury lies in authenticity and craftsmanship. Each embroidered piece requires days, sometimes weeks, of meticulous handwork. Our artisans don't just create fabric - they create heirlooms that carry the spirit of Bahawalpur's rich cultural heritage into contemporary wardrobes.`,
      metaDescription: 'Discover how Zoey\'s Heritage Embroidery preserves centuries-old Bahawalpur techniques, supporting skilled artisans and bringing traditional Pakistani craftsmanship to modern fashion.'
    },
    'about-mission': {
      title: 'Our Mission',
      content: `Our mission is to preserve and celebrate the art of traditional Bahawalpur embroidery while empowering the skilled artisans who keep these techniques alive. We are committed to:

• Preserving centuries-old embroidery techniques including pakka tanka, tarkashi, cut dana, and chicken kaari work
• Supporting local craftspeople with fair wages and sustainable employment
• Creating beautiful, high-quality pieces that blend traditional craftsmanship with contemporary design
• Educating customers about the rich heritage and cultural significance of Bahawalpur embroidery
• Building a sustainable business model that honors both artisans and customers

Every purchase you make helps preserve a piece of cultural heritage and supports the livelihoods of skilled artisans in Pakistan.`,
      metaDescription: 'Zoey\'s mission: preserving traditional Bahawalpur embroidery, supporting local artisans, and creating sustainable livelihoods through authentic handcrafted textiles.'
    },
    'home-hero': {
      title: 'Heritage Crafted by Hand',
      content: `Discover Exquisite Bahawalpur Embroidery\n\nHandcrafted with centuries-old techniques, each piece celebrates the rich heritage of traditional Pakistani embroidery while empowering skilled artisans.`,
      metaDescription: 'Shop authentic Bahawalpur embroidery - handcrafted Pakistani fabrics featuring traditional techniques. Support local artisans. Nationwide delivery.'
    },
    'collection-intro': {
      title: context.collectionName || 'Our Collections',
      content: `Explore our ${context.collectionName || 'exquisite'} collection, where each piece showcases the mastery of traditional Bahawalpur embroidery. Our skilled artisans use time-honored techniques passed down through generations, creating stunning textiles that blend cultural heritage with contemporary elegance.

Every item is meticulously handcrafted with attention to the finest details. From the first stitch to the final embellishment, our craftspeople pour their expertise and passion into creating pieces that stand the test of time. Whether adorned with intricate chicken kaari patterns, bold pakka tanka stitches, delicate tarkashi threadwork, or sparkling cut dana embellishments, each collection represents the pinnacle of Pakistani textile artistry.`,
      metaDescription: `Explore the ${context.collectionName || ''} collection of handcrafted Bahawalpur embroidery. Authentic Pakistani craftsmanship with traditional techniques.`
    }
  };

  return templates[pageKey] || {
    title: pageKey.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    content: `Welcome to Zoey's Heritage Embroidery. We specialize in preserving traditional Bahawalpur embroidery techniques while supporting skilled local artisans. Each piece is handcrafted with meticulous attention to detail, combining centuries-old methods with contemporary design.`,
    metaDescription: 'Authentic Bahawalpur embroidery - handcrafted Pakistani textiles by skilled artisans. Traditional techniques meet modern design.',
    generatedBy: 'template'
  };
}
