/**
 * AI Service for generating SEO-optimized product descriptions and settings content
 * Uses Gemini AI or a fallback template-based approach
 */

/**
 * Generate footer about text using Gemini AI
 */
export async function generateFooterAbout(businessName = 'Zoey\'s') {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  
  if (!geminiApiKey) {
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API HTTP error:', response.status, errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Unexpected Gemini API response structure:', JSON.stringify(data));
      throw new Error('Invalid response structure from Gemini API');
    }
    
    return data.candidates[0]?.content?.parts[0]?.text?.trim() || 
      `Handcrafted embroidered masterpieces from the heart of Bahawalpur, preserving centuries of traditional craftsmanship for the modern connoisseur.`;
  } catch (error) {
    console.error('Gemini API error:', error);
    return `Handcrafted embroidered masterpieces from the heart of Bahawalpur, preserving centuries of traditional craftsmanship for the modern connoisseur.`;
  }
}

/**
 * Generate site tagline using Gemini AI
 */
export async function generateSiteTagline(businessName = 'Zoey\'s') {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  
  if (!geminiApiKey) {
    return 'Bahawalpur Heritage';
  }

  const prompt = `Create a short, memorable tagline (2-4 words max) for ${businessName}, a Pakistani e-commerce business selling traditional Bahawalpur embroidered fabrics. The tagline should evoke heritage, craftsmanship, and tradition. Return ONLY the tagline, no quotes.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API HTTP error:', response.status, errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Unexpected Gemini API response structure:', JSON.stringify(data));
      throw new Error('Invalid response structure from Gemini API');
    }
    
    return data.candidates[0]?.content?.parts[0]?.text?.trim() || 'Bahawalpur Heritage';
  } catch (error) {
    console.error('Gemini API error:', error);
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
  // Check if Gemini API key is available
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      return await generateWithGemini(product, geminiApiKey);
    } catch (error) {
      console.error('Gemini generation failed, falling back to template:', error);
      return generateWithTemplate(product);
    }
  } else {
    // Fallback to template-based generation
    console.log('No Gemini API key found, using template-based generation');
    return generateWithTemplate(product);
  }
}

/**
 * Generate SEO description using Gemini API
 */
async function generateWithGemini(product, apiKey) {
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

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
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
        temperature: 0.7,
        maxOutputTokens: 150
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!generatedText) {
    throw new Error('No description generated from Gemini');
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
 * Generate page content using Gemini AI
 */
async function generatePageContentWithGemini(pageKey, context, apiKey) {
  const businessName = process.env.BUSINESS_NAME || "Zoey's";
  
  const prompts = {
    'about-story': `Write a compelling "Our Story" section for ${businessName} Heritage Embroidery, a business preserving traditional Bahawalpur embroidery techniques. Include how the business started, the heritage being preserved, the artisans and their skills, and the mission. Also generate:
- A suitable meta title (50-60 characters)
- A meta description (150-160 characters)
- 5-7 relevant keywords

Format the response as JSON with keys: title, content, metaTitle, metaDescription, keywords`,
    
    'about-mission': `Write a mission statement for ${businessName} Heritage Embroidery focusing on preserving traditional Bahawalpur embroidery, supporting local artisans, combining heritage with modern design, and quality craftsmanship. Also generate:
- A suitable meta title
- A meta description  
- 5-7 relevant keywords

Format as JSON with keys: title, content, metaTitle, metaDescription, keywords`,
    
    'home-hero': `Write a compelling hero section for ${businessName} Heritage Embroidery e-commerce site.
Include:
- A bold headline (5-8 words)
- A subheadline describing the value proposition (15-25 words)
- Meta title
- Meta description
- Keywords

Focus on: Traditional craftsmanship, handmade quality, heritage preservation, Pakistani embroidery.
Format as JSON with keys: title, content, metaTitle, metaDescription, keywords`,
    
    'collection-intro': `Write an introduction for the ${context.collectionName || 'embroidery'} collection highlighting the unique embroidery technique, traditional heritage, quality and craftsmanship. Include meta title, description, and keywords. Format as JSON.`,
    
    'contact-intro': `Write a welcoming contact page introduction for ${businessName} Heritage Embroidery. Encourage customers to reach out for custom orders, wholesale inquiries, and any questions. Include meta fields. Format as JSON.`,
    
    'footer-about': `Write a brief "About Us" text for the footer of ${businessName} Heritage Embroidery website (50-80 words). Include meta fields. Format as JSON.`
  };

  const prompt = prompts[pageKey] || `Write engaging content for the ${pageKey} section of ${businessName} Heritage Embroidery website selling traditional Bahawalpur embroidery. Include meta title, meta description, and keywords. Format as JSON with keys: title, content, metaTitle, metaDescription, keywords`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
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
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  let generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!generatedText) {
    throw new Error('No content generated from Gemini');
  }

  // Extract JSON from markdown code blocks if present
  generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    const parsed = JSON.parse(generatedText);
    return {
      title: parsed.title || pageKey,
      content: parsed.content || generatedText,
      metaTitle: parsed.metaTitle || parsed.title,
      metaDescription: parsed.metaDescription || (parsed.content?.substring(0, 160)),
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.join(', ') : parsed.keywords,
      generatedBy: 'gemini'
    };
  } catch (e) {
    // If not JSON, use the text as content
    return {
      title: pageKey.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      content: generatedText,
      metaTitle: pageKey,
      metaDescription: generatedText.substring(0, 160),
      keywords: 'bahawalpur embroidery, traditional pakistani embroidery, handcrafted',
      generatedBy: 'gemini'
    };
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
