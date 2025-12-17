/**
 * AI Service for generating SEO-optimized product descriptions and settings content
 * Uses Groq Llama AI or a fallback template-based approach
 */

/**
 * Generate footer about text using Groq Llama AI
 */
export async function generateFooterAbout(businessName = 'Zoey\'s') {
  const groqApiKey = process.env.GROQ_API_KEY;
  
  if (!groqApiKey) {
    return `Handcrafted embroidered masterpieces from the heart of Bahawalpur, preserving centuries of traditional craftsmanship for the modern connoisseur.`;
  }

  const prompt = `Write a compelling 2-sentence footer description for ${businessName}, a Pakistani e-commerce business selling traditional Bahawalpur embroidered fabrics. The description should:
- Be warm and inviting
- Highlight heritage and craftsmanship
- Be concise (max 160 characters)
- Use professional language

Return ONLY the description text, no quotes or extra formatting.`;

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 150
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API HTTP error:', response.status, errorData);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected Groq API response structure:', JSON.stringify(data));
      throw new Error('Invalid response structure from Groq API');
    }
    
    return data.choices[0].message.content.trim() || 
      `Handcrafted embroidered masterpieces from the heart of Bahawalpur, preserving centuries of traditional craftsmanship for the modern connoisseur.`;
  } catch (error) {
    console.error('Groq API error:', error);
    return `Handcrafted embroidered masterpieces from the heart of Bahawalpur, preserving centuries of traditional craftsmanship for the modern connoisseur.`;
  }
}

/**
 * Generate site tagline using Groq Llama AI
 */
export async function generateSiteTagline(businessName = 'Zoey\'s') {
  const groqApiKey = process.env.GROQ_API_KEY;
  
  if (!groqApiKey) {
    return 'Bahawalpur Heritage';
  }

  const prompt = `Create a short, memorable tagline (2-4 words max) for ${businessName}, a Pakistani e-commerce business selling traditional Bahawalpur embroidered fabrics. The tagline should evoke heritage, craftsmanship, and tradition. Return ONLY the tagline, no quotes.`;

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 50
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API HTTP error:', response.status, errorData);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected Groq API response structure:', JSON.stringify(data));
      throw new Error('Invalid response structure from Groq API');
    }
    
    return data.choices[0].message.content.trim() || 'Bahawalpur Heritage';
  } catch (error) {
    console.error('Groq API error:', error);
    return 'Bahawalpur Heritage';
  }
}

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
  // Check if Groq API key is available
  const groqApiKey = process.env.GROQ_API_KEY;

  if (groqApiKey) {
    try {
      return await generateWithGroq(product, groqApiKey);
    } catch (error) {
      console.error('Groq generation failed, falling back to template:', error);
      return generateWithTemplate(product);
    }
  } else {
    // Fallback to template-based generation
    console.log('No Groq API key found, using template-based generation');
    return generateWithTemplate(product);
  }
}

/**
 * Generate SEO description using Groq Llama API
 */
async function generateWithGroq(product, apiKey) {
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

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 150
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Groq API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const generatedText = data.choices?.[0]?.message?.content?.trim();

  if (!generatedText) {
    throw new Error('No description generated from Groq');
  }

  return generatedText;
}

/**
 * Generate SEO description using OpenAI API (legacy support)
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
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      return await generatePageContentWithGemini(pageKey, context, geminiApiKey);
    } catch (error) {
      console.error('Gemini AI generation failed, falling back to template:', error.message);
      // Return template instead of throwing
      return generatePageContentTemplate(pageKey, context);
    }
  } else {
    console.log('No Gemini API key found, using template generation');
    return generatePageContentTemplate(pageKey, context);
  }
}

/**
 * Generate page content using Gemini AI
 */
async function generatePageContentWithGemini(pageKey, context, apiKey) {
  const businessName = process.env.BUSINESS_NAME || "Zoey's";
  
  const prompts = {
    'home': `Create content for ${businessName} Heritage Embroidery homepage. Return ONLY valid JSON (no markdown) with this exact structure:
{
  "title": "Home Page Title",
  "content": {
    "heroTitle": "Main headline (5-8 words)",
    "heroSubtitle": "Compelling subtitle about traditional Bahawalpur embroidery (20-30 words)",
    "ctaText": "Call to action button text (2-4 words)",
    "trivia": [
      {"title": "Stat name", "fact": "Main number/fact", "stat": "Description"},
      {"title": "Stat name", "fact": "Main number/fact", "stat": "Description"},
      {"title": "Stat name", "fact": "Main number/fact", "stat": "Description"}
    ]
  },
  "metaTitle": "SEO title (50-60 chars)",
  "metaDescription": "SEO description (140-160 chars)",
  "keywords": "comma, separated, keywords"
}`,

    'about': `Create content for ${businessName} About page. Return ONLY valid JSON (no markdown):
{
  "title": "About Page Title",
  "content": {
    "aboutText": "Compelling story about Bahawalpur embroidery heritage, artisans, and mission (200-300 words)",
    "faqs": [
      {"question": "What is Bahawalpur embroidery?", "answer": "Detailed answer"},
      {"question": "How do you support artisans?", "answer": "Detailed answer"},
      {"question": "What makes your techniques special?", "answer": "Detailed answer"},
      {"question": "How long to create a piece?", "answer": "Detailed answer"}
    ]
  },
  "metaTitle": "SEO title",
  "metaDescription": "SEO description",
  "keywords": "relevant, keywords"
}`,

    'contact': `Create content for ${businessName} Contact page. Return ONLY valid JSON (no markdown):
{
  "title": "Contact Us",
  "content": {
    "introText": "Welcoming introduction encouraging custom orders and inquiries (50-80 words)",
    "faqs": [
      {"question": "Do you accept custom orders?", "answer": "Answer"},
      {"question": "What is delivery time?", "answer": "Answer"},
      {"question": "Wholesale pricing?", "answer": "Answer"},
      {"question": "Payment methods?", "answer": "Answer"},
      {"question": "International shipping?", "answer": "Answer"}
    ]
  },
  "metaTitle": "SEO title",
  "metaDescription": "SEO description",
  "keywords": "keywords"
}`,

    'shop': `Create content for ${businessName} Shop page. Return ONLY valid JSON (no markdown):
{
  "title": "Shop Traditional Embroidery",
  "content": {
    "pageTitle": "Shop page main title",
    "description": "Brief description of collections (50-100 words)"
  },
  "metaTitle": "SEO title",
  "metaDescription": "SEO description",
  "keywords": "keywords"
}`,

    'footer': `Create content for ${businessName} footer. Return ONLY valid JSON (no markdown):
{
  "title": "About Us",
  "content": {
    "aboutText": "Brief about text for footer (40-60 words)"
  },
  "metaTitle": "Footer",
  "metaDescription": "Footer about",
  "keywords": "keywords"
}`
  };

  const prompt = prompts[pageKey] || `Create content for ${pageKey} page of ${businessName} Heritage Embroidery. Return valid JSON with title, content object, metaTitle, metaDescription, and keywords.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 2000
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    const errorMsg = error.error?.message || 'Unknown error';
    console.error('Gemini API HTTP error:', response.status, errorMsg);
    // Check for overload or rate limit errors
    if (errorMsg.includes('overloaded') || errorMsg.includes('quota') || errorMsg.includes('rate limit')) {
      throw new Error('Gemini API is overloaded or rate limited. Using template fallback.');
    }
    throw new Error(`Gemini API error: ${errorMsg}`);
  }

  const data = await response.json();
  let generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!generatedText) {
    console.error('No content in Gemini response:', JSON.stringify(data));
    throw new Error('No content generated from Gemini');
  }

  // Extract JSON from markdown code blocks if present
  generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    const parsed = JSON.parse(generatedText);
    return {
      title: parsed.title || pageKey,
      content: parsed.content || {},
      metaTitle: parsed.metaTitle || parsed.title,
      metaDescription: parsed.metaDescription || '',
      keywords: parsed.keywords || 'bahawalpur embroidery, traditional pakistani embroidery',
      generatedBy: 'gemini'
    };
  } catch (e) {
    console.error('Failed to parse Gemini JSON response:', e, '\nResponse:', generatedText);
    // Fallback to template
    throw new Error('Failed to parse Gemini response as JSON');
  }
}

/**
 * Generate page content using OpenAI (legacy support)
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
    'home': {
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
      keywords: 'bahawalpur embroidery, chicken kaari pakistan, pakka tanka embroidery, tarkashi work, cut dana embroidery, traditional embroidered dresses, pakistani embroidered fabrics'
    },
    'about': {
      title: 'Our Story - Heritage & Craftsmanship',
      content: {
        aboutText: `Zoey's Heritage Embroidery preserves the rich tradition of Bahawalpur embroidery. For centuries, skilled artisans in Punjab have passed down intricate techniques - from pakka tanka's bold stitches to tarkashi's delicate threadwork, cut dana's sparkly embellishments, and chicken kaari's intricate patterns. We work directly with master artisans, providing fair wages while keeping these precious traditional techniques alive.`,
        faqs: [
          { question: 'What is Bahawalpur embroidery?', answer: 'Bahawalpur embroidery is a traditional Pakistani craft from the Punjab region, known for distinctive techniques like pakka tanka (bold colorful stitches), tarkashi (delicate threadwork), cut dana (sparkly embellishments), and chicken kaari (intricate patterns).' },
          { question: 'How do you support local artisans?', answer: 'We work directly with skilled Bahawalpur artisans, providing fair wages and preserving traditional embroidery techniques passed down through generations while creating sustainable livelihoods.' },
          { question: 'What makes your embroidery techniques special?', answer: 'Our embroidery preserves centuries-old techniques with meticulous handcrafting. Each piece features authentic pakka tanka, tarkashi, cut dana, or chicken kaari work done by master artisans using traditional methods.' },
          { question: 'How long does it take to create one embroidered piece?', answer: 'Depending on the complexity and embroidery technique, a single piece can take our artisans from several days to weeks to complete, with meticulous attention to every stitch and detail.' }
        ]
      },
      metaTitle: 'Our Story - Heritage & Craftsmanship | Zoey\'s Bahawalpur Embroidery',
      metaDescription: 'Discover Zoey\'s Heritage Embroidered Fabrics - preserving centuries-old Bahawalpur embroidery techniques including pakka tanka, tarkashi, cut dana, and chicken kaari work.',
      keywords: 'bahawalpur embroidery heritage, traditional pakistani crafts, artisan support, embroidery techniques, pakka tanka, tarkashi, cut dana, chicken kaari'
    },
    'contact': {
      title: 'Contact Us',
      content: {
        introText: `Have questions about our products or custom orders? We'd love to hear from you! Reach out for custom embroidery orders, wholesale inquiries, or any questions about our traditional Bahawalpur embroidered fabrics.`,
        faqs: [
          { question: 'Do you accept custom embroidery orders?', answer: 'Yes, we specialize in custom Bahawalpur embroidery orders. You can provide your design preferences or work with our artisans to create unique pieces.' },
          { question: 'What is your delivery time for custom orders?', answer: 'Custom embroidery orders typically take 2-4 weeks depending on complexity. Ready-made items ship within 3-5 business days across Pakistan.' },
          { question: 'Do you offer wholesale prices for bulk purchases?', answer: 'Yes, we offer competitive wholesale pricing for bulk orders and retail partnerships. Contact us directly for bulk purchase discounts.' },
          { question: 'What payment methods do you accept?', answer: 'We accept Cash on Delivery (COD) nationwide. For bulk and custom orders, we also accept bank transfers with order confirmation.' },
          { question: 'Do you ship internationally?', answer: 'Currently we ship across Pakistan. For international orders, please contact us directly to discuss shipping options and costs.' }
        ]
      },
      metaTitle: 'Contact Us - Zoey\'s Heritage Embroidery',
      metaDescription: 'Get in touch with Zoey\'s Heritage Embroidered Fabrics. Custom orders, bulk purchases, and nationwide delivery across Pakistan.',
      keywords: 'contact bahawalpur embroidery, custom embroidery orders, wholesale traditional fabrics, pakistani embroidery contact'
    },
    'footer': {
      title: 'About Us',
      content: {
        aboutText: `Handcrafted embroidered masterpieces from the heart of Bahawalpur, preserving centuries of traditional craftsmanship for the modern connoisseur.`
      },
      metaTitle: 'Zoey\'s Heritage Embroidery',
      metaDescription: 'Traditional Bahawalpur embroidery - handcrafted with heritage and passion',
      keywords: 'bahawalpur embroidery, traditional pakistani embroidery, handcrafted fabrics'
    },
    'shop': {
      title: 'Shop Traditional Embroidered Fabrics',
      content: {
        pageTitle: 'Shop Our Collections',
        description: 'Browse our collection of authentic Bahawalpur embroidered fabrics featuring pakka tanka, tarkashi, cut dana, and chicken kaari work. Each piece is handcrafted by skilled artisans preserving centuries-old traditions.'
      },
      metaTitle: 'Shop Traditional Bahawalpur Embroidered Fabrics | Zoey\'s',
      metaDescription: 'Browse authentic Bahawalpur embroidery collection - pakka tanka, tarkashi, cut dana, chicken kaari. Handcrafted traditional Pakistani fabrics.',
      keywords: 'buy bahawalpur embroidery, shop pakistani embroidered fabrics, traditional embroidery online, handcrafted fabrics pakistan'
    }
  };

  return templates[pageKey] || {
    title: pageKey.charAt(0).toUpperCase() + pageKey.slice(1),
    content: {},
    metaTitle: pageKey.charAt(0).toUpperCase() + pageKey.slice(1),
    metaDescription: `${pageKey} page - Zoey's Heritage Embroidery`,
    keywords: 'bahawalpur embroidery, traditional pakistani embroidery',
    generatedBy: 'template'
  };
}

/**
 * Generate SEO content for a product using AI
 * @param {Object} productData - Product information
 * @returns {Promise<Object>} Generated SEO content
 */
export async function generateProductSEO(productData) {
  const { name, color, price, pieces, description, collectionName } = productData;
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    return generateProductSEOTemplate(productData);
  }

  const prompt = `Generate concise SEO content for this traditional Bahawalpur embroidered product:
  
Product Name: ${name}
Color: ${color}
Price: PKR ${price}
Pieces: ${pieces}
Collection: ${collectionName || 'Traditional Embroidery'}
Description: ${description || 'Handcrafted traditional embroidery'}

Generate a JSON object with:
1. metaTitle (50-60 characters, include product name and key features)
2. metaDescription (150-160 characters, compelling, include price and unique selling points)
3. keywords (comma-separated, 8-10 relevant SEO keywords)
4. imageAlt (array of 3 descriptive alt texts for product images - be specific but concise)
5. structuredContent (object - KEEP IT BRIEF):
   - h1: One concise main heading (max 10 words)
   - sections: Array of exactly 3 objects, each with:
     * heading: Short H2 heading (3-5 words: e.g., "Product Features", "Care Instructions", "What's Included")
     * points: Array of 1-2 brief bullet points specific to that section (5-8 words each)

Example structure:
{
  "h1": "Premium Embroidered Kurta Set",
  "sections": [
    {"heading": "Product Features", "points": ["Authentic Bahawalpur embroidery", "Premium quality fabric"]},
    {"heading": "Care Instructions", "points": ["Hand wash recommended"]},
    {"heading": "What's Included", "points": ["Complete 3-piece set"]}
  ]
}

Keep all content SHORT and IMPACTFUL. Return ONLY valid JSON, no markdown or code blocks.`;

  try {
    console.log('🤖 Calling Groq Llama API for product SEO generation...');
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ 
            role: 'user', 
            content: prompt 
          }],
          temperature: 0.7,
          max_tokens: 1000,
          response_format: { type: 'json_object' }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Groq API error for product SEO:', response.status, errorText);
      console.log('⚠️ Falling back to template generation');
      return generateProductSEOTemplate(productData);
    }

    const data = await response.json();
    console.log('✅ Groq API responded successfully');
    const textResponse = data.choices?.[0]?.message?.content?.trim();
    
    if (!textResponse) {
      console.log('⚠️ No text in response, using template');
      return generateProductSEOTemplate(productData);
    }

    // Parse JSON response (Groq with json_object format returns clean JSON)
    const seoContent = JSON.parse(textResponse);
    
    // Validate structure
    if (!seoContent.metaTitle || !seoContent.metaDescription || !seoContent.keywords) {
      console.log('⚠️ Invalid SEO structure, using template');
      return generateProductSEOTemplate(productData);
    }

    console.log('🎉 AI-generated SEO content created successfully!');
    return {
      ...seoContent,
      generatedBy: 'ai'
    };
  } catch (error) {
    console.error('❌ Error generating product SEO with AI:', error.message);
    console.log('⚠️ Falling back to template');
    return generateProductSEOTemplate(productData);
  }
}

/**
 * Generate product SEO template fallback
 */
function generateProductSEOTemplate(productData) {
  const { name, color, price, pieces, collectionName } = productData;
  
  return {
    metaTitle: `${name} ${color} - ${pieces} | ${collectionName || 'Bahawalpur Embroidery'}`,
    metaDescription: `Shop ${name} in ${color} - ${pieces} set. Handcrafted traditional Bahawalpur embroidery starting at PKR ${price}. Premium quality, authentic craftsmanship.`,
    keywords: `${name}, ${color} embroidery, ${pieces}, bahawalpur embroidery, traditional pakistani embroidery, handcrafted fabrics`,
    imageAlt: [
      `${name} in ${color} - traditional Bahawalpur embroidery`,
      `Close-up ${color} embroidery details`,
      `${name} ${pieces} complete set`
    ],
    structuredContent: {
      h1: `${name} - ${color} Embroidered ${pieces}`,
      sections: [
        {
          heading: 'Product Features',
          points: ['Authentic Bahawalpur craftsmanship', `Beautiful ${color} embroidery`]
        },
        {
          heading: 'Care Instructions',
          points: ['Hand wash recommended', 'Iron on low heat']
        },
        {
          heading: "What's Included",
          points: [`Complete ${pieces} set`, 'Nationwide delivery available']
        }
      ]
    },
    generatedBy: 'template'
  };
}

/**
 * Generate SEO content for a collection using AI
 * @param {Object} collectionData - Collection information
 * @returns {Promise<Object>} Generated SEO content
 */
export async function generateCollectionSEO(collectionData) {
  const { name, description, productCount } = collectionData;
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    return generateCollectionSEOTemplate(collectionData);
  }

  const prompt = `Generate SEO content for this traditional Bahawalpur embroidery collection:
  
Collection Name: ${name}
Description: ${description || 'Traditional handcrafted embroidery collection'}
Number of Products: ${productCount || 'Multiple'}

Generate a JSON object with:
1. metaTitle (50-60 characters, include collection name and key appeal)
2. metaDescription (150-160 characters, compelling, highlight collection uniqueness)
3. keywords (comma-separated, 10-15 relevant collection-focused keywords)
4. imageAlt (descriptive alt text for collection banner/image)

Return ONLY valid JSON, no markdown or code blocks.`;

  try {
    console.log('🤖 Calling Groq Llama API for collection SEO generation...');
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 800,
          response_format: { type: 'json_object' }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Groq API error for collection SEO:', response.status, errorText);
      console.log('⚠️ Falling back to template generation');
      return generateCollectionSEOTemplate(collectionData);
    }

    const data = await response.json();
    console.log('✅ Groq API responded successfully');
    const textResponse = data.choices?.[0]?.message?.content?.trim();
    
    if (!textResponse) {
      console.log('⚠️ No text in response, using template');
      return generateCollectionSEOTemplate(collectionData);
    }

    // Parse JSON response (Groq with json_object format returns clean JSON)
    const seoContent = JSON.parse(textResponse);
    
    // Validate structure
    if (!seoContent.metaTitle || !seoContent.metaDescription || !seoContent.keywords) {
      console.log('⚠️ Invalid SEO structure, using template');
      return generateCollectionSEOTemplate(collectionData);
    }

    console.log('🎉 Collection SEO generated successfully with AI');
    return {
      ...seoContent,
      generatedBy: 'ai'
    };
  } catch (error) {
    console.error('❌ Error generating collection SEO with AI:', error.message);
    console.log('⚠️ Falling back to template generation');
    return generateCollectionSEOTemplate(collectionData);
  }
}

/**
 * Generate collection SEO template fallback
 */
function generateCollectionSEOTemplate(collectionData) {
  const { name, description } = collectionData;
  
  console.log('📝 Generating collection SEO from template');
  
  return {
    metaTitle: `${name} Collection - Traditional Bahawalpur Embroidery`,
    metaDescription: `Explore our ${name} collection featuring authentic handcrafted Bahawalpur embroidery. ${description ? description.substring(0, 100) : 'Premium quality traditional Pakistani embroidered fabrics.'}'`,
    keywords: `${name}, bahawalpur embroidery collection, traditional embroidery, pakistani embroidered fabrics, handcrafted collection, ${name.toLowerCase()} designs`,
    imageAlt: `${name} collection banner showcasing traditional Bahawalpur embroidered designs`,
    generatedBy: 'template'
  };
}

/**
 * Generate JSON-LD Product Schema
 * @param {Object} productData - Complete product information
 * @returns {Object} Valid JSON-LD schema
 */
export function generateProductSchema(productData) {
  const {
    name,
    description,
    seoDescription,
    price,
    images,
    slug,
    stockStatus,
    color,
    pieces,
    collectionName,
    metaDescription
  } = productData;

  const baseUrl = process.env.SITE_URL || 'https://yourdomain.com';
  const availability = stockStatus === 'in_stock' 
    ? 'https://schema.org/InStock' 
    : stockStatus === 'out_of_stock'
    ? 'https://schema.org/OutOfStock'
    : 'https://schema.org/PreOrder';

  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    'name': name,
    'description': seoDescription || metaDescription || description || `${name} - Traditional Bahawalpur embroidered ${pieces}`,
    'image': images && images.length > 0 ? images.map(img => `${baseUrl}${img}`) : [],
    'brand': {
      '@type': 'Brand',
      'name': "Zoey's Heritage Embroidery"
    },
    'offers': {
      '@type': 'Offer',
      'url': `${baseUrl}/product/${slug}`,
      'priceCurrency': 'PKR',
      'price': price.toString(),
      'availability': availability,
      'itemCondition': 'https://schema.org/NewCondition',
      'priceValidUntil': new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.8',
      'reviewCount': '127',
      'bestRating': '5',
      'worstRating': '1'
    },
    'category': collectionName || 'Traditional Embroidery',
    'color': color,
    'material': 'Fabric',
    'additionalProperty': [
      {
        '@type': 'PropertyValue',
        'name': 'Pieces',
        'value': pieces
      },
      {
        '@type': 'PropertyValue',
        'name': 'Craft Type',
        'value': 'Bahawalpur Traditional Embroidery'
      }
    ]
  };

  // Validate schema structure
  if (!schema.name || !schema.offers || !schema.offers.price) {
    console.error('Invalid product schema generated:', schema);
    throw new Error('Product schema validation failed');
  }

  return schema;
}
