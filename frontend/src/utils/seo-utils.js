// SEO Utilities for Zoey's Heritage Embroidered Fabrics
// This file contains helper functions for managing SEO meta tags and structured data

/**
 * Business Information
 * TODO: Update SITE_URL when you get your domain
 */
export const BUSINESS_INFO = {
  name: "Zoey's Heritage Embroidered Fabrics",
  shortName: "Zoey's",
  description: "Handcrafted Bahawalpur embroidery and traditional Pakistani embroidered fabrics. Shop authentic chicken kaari, pakka tanka, tarkashi, and cut dana work.",
  url: "https://yourdomain.com", // TODO: Replace with your actual domain
  email: "zaiinabsanaullah@gmail.com",
  phone: "+923300390222",
  whatsapp: "+923300390222",
  address: {
    city: "Lahore",
    state: "Punjab",
    country: "Pakistan",
    countryCode: "PK"
  },
  businessHours: "Mo-Sa 10:00-20:00",
  foundingDate: "2024",
  priceRange: "$$",
  currencyCode: "PKR"
};

/**
 * Default SEO Configuration
 */
export const DEFAULT_SEO = {
  titleTemplate: "%s | Zoey's Heritage Embroidery",
  defaultTitle: "Zoey's Heritage Embroidered Fabrics | Authentic Bahawalpur Embroidery",
  defaultDescription: "Shop authentic handcrafted Bahawalpur embroidery including chicken kaari, pakka tanka, tarkashi, and cut dana work. Traditional Pakistani embroidered fabrics with heritage craftsmanship.",
  defaultKeywords: "bahawalpur embroidery, chicken kaari, pakka tanka, tarkashi, cut dana work, traditional embroidered dresses, pakistani embroidered fabrics, handcrafted embroidery, shadow work embroidery, mirror work embroidery, phulkari embroidery",
  ogImage: "https://res.cloudinary.com/dm7nsralr/image/upload/v1761469980/ha_pf5mak.jpg",
  twitterHandle: "@zoeys" // TODO: Update when you create social media
};

/**
 * Set document title and meta tags
 */
export const setPageMeta = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  article = null,
  product = null
}) => {
  // Set title
  document.title = title 
    ? `${title} | Zoey's Heritage Embroidery`
    : DEFAULT_SEO.defaultTitle;

  // Helper function to set or update meta tags
  const setMeta = (name, content, isProperty = false) => {
    if (!content) return;
    
    const attribute = isProperty ? 'property' : 'name';
    const selector = `meta[${attribute}="${name}"]`;
    let meta = document.querySelector(selector);
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  };

  // Basic Meta Tags
  setMeta('description', description || DEFAULT_SEO.defaultDescription);
  setMeta('keywords', keywords || DEFAULT_SEO.defaultKeywords);
  setMeta('author', BUSINESS_INFO.name);
  setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

  // Open Graph Tags
  setMeta('og:title', title || DEFAULT_SEO.defaultTitle, true);
  setMeta('og:description', description || DEFAULT_SEO.defaultDescription, true);
  setMeta('og:type', type, true);
  setMeta('og:url', url || BUSINESS_INFO.url, true);
  setMeta('og:image', image || DEFAULT_SEO.ogImage, true);
  setMeta('og:image:width', '1200', true);
  setMeta('og:image:height', '630', true);
  setMeta('og:site_name', BUSINESS_INFO.name, true);
  setMeta('og:locale', 'en_US', true);

  // Twitter Card Tags
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', title || DEFAULT_SEO.defaultTitle);
  setMeta('twitter:description', description || DEFAULT_SEO.defaultDescription);
  setMeta('twitter:image', image || DEFAULT_SEO.ogImage);
  setMeta('twitter:site', DEFAULT_SEO.twitterHandle);
  setMeta('twitter:creator', DEFAULT_SEO.twitterHandle);

  // Additional SEO Tags
  setMeta('theme-color', '#059669'); // emerald-600
  setMeta('mobile-web-app-capable', 'yes');
  setMeta('apple-mobile-web-app-capable', 'yes');
  setMeta('apple-mobile-web-app-status-bar-style', 'default');
  setMeta('apple-mobile-web-app-title', BUSINESS_INFO.shortName);

  // Article specific meta tags
  if (article) {
    setMeta('article:published_time', article.publishedTime, true);
    setMeta('article:modified_time', article.modifiedTime, true);
    setMeta('article:author', article.author, true);
    setMeta('article:section', article.section, true);
  }

  // Product specific meta tags
  if (product) {
    setMeta('product:price:amount', product.price, true);
    setMeta('product:price:currency', 'PKR', true);
    setMeta('product:availability', product.inStock ? 'in stock' : 'out of stock', true);
    setMeta('product:condition', 'new', true);
  }

  // Canonical URL
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', url || window.location.href);
};

/**
 * Generate Organization Schema
 */
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BUSINESS_INFO.url}#organization`,
  "name": BUSINESS_INFO.name,
  "alternateName": BUSINESS_INFO.shortName,
  "description": BUSINESS_INFO.description,
  "url": BUSINESS_INFO.url,
  "logo": {
    "@type": "ImageObject",
    "url": DEFAULT_SEO.ogImage,
    "width": "1200",
    "height": "630"
  },
  "image": DEFAULT_SEO.ogImage,
  "email": BUSINESS_INFO.email,
  "telephone": BUSINESS_INFO.phone,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": BUSINESS_INFO.address.city,
    "addressRegion": BUSINESS_INFO.address.state,
    "addressCountry": BUSINESS_INFO.address.countryCode
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "31.5204",
    "longitude": "74.3587"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "10:00",
    "closes": "20:00"
  },
  "priceRange": BUSINESS_INFO.priceRange,
  "currenciesAccepted": "PKR",
  "paymentAccepted": "Cash, Cash on Delivery",
  "foundingDate": BUSINESS_INFO.foundingDate,
  "areaServed": {
    "@type": "Country",
    "name": "Pakistan"
  },
  "sameAs": []
});

/**
 * Generate WebSite Schema
 */
export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BUSINESS_INFO.url}#website`,
  "url": BUSINESS_INFO.url,
  "name": BUSINESS_INFO.name,
  "description": BUSINESS_INFO.description,
  "publisher": {
    "@id": `${BUSINESS_INFO.url}#organization`
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${BUSINESS_INFO.url}/shop?search={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
});

/**
 * Generate Product Schema
 */
export const getProductSchema = (product) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${product.name} - ${product.color}`,
    "description": product.description || `Handcrafted ${product.name} in ${product.color} with traditional Bahawalpur embroidery. ${product.pieces}`,
    "image": product.images || [DEFAULT_SEO.ogImage],
    "sku": product.id?.toString(),
    "brand": {
      "@type": "Brand",
      "name": BUSINESS_INFO.name
    },
    "offers": {
      "@type": "Offer",
      "url": `${BUSINESS_INFO.url}/product/${product.slug}`,
      "priceCurrency": "PKR",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": product.quantity > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@id": `${BUSINESS_INFO.url}#organization`
      }
    }
  };

  // Add aggregateRating if available (you can add this later when you have reviews)
  // schema.aggregateRating = {
  //   "@type": "AggregateRating",
  //   "ratingValue": "4.8",
  //   "reviewCount": "24"
  // };

  return schema;
};

/**
 * Generate BreadcrumbList Schema
 */
export const getBreadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": `${BUSINESS_INFO.url}${crumb.url}`
  }))
});

/**
 * Generate CollectionPage Schema
 */
export const getCollectionSchema = (collection, products) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": collection.name,
  "description": collection.description,
  "url": `${BUSINESS_INFO.url}/${collection.slug}`,
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": products.length,
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${BUSINESS_INFO.url}/product/${product.slug}`
    }))
  }
});

/**
 * Generate FAQ Schema
 */
export const getFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

/**
 * Inject JSON-LD Schema
 */
export const injectSchema = (schema) => {
  const scriptId = `schema-${schema['@type']}`;
  let script = document.getElementById(scriptId);
  
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(schema);
};

/**
 * Inject Multiple Schemas
 */
export const injectMultipleSchemas = (schemas) => {
  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": schemas
  };
  
  let script = document.getElementById('schema-graph');
  
  if (!script) {
    script = document.createElement('script');
    script.id = 'schema-graph';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(graphSchema);
};

/**
 * Generate alternate links for language/region
 */
export const setAlternateLinks = (currentUrl) => {
  const link = document.createElement('link');
  link.rel = 'alternate';
  link.hreflang = 'en-pk';
  link.href = currentUrl;
  document.head.appendChild(link);
};

/**
 * Preload important resources
 */
export const preloadResources = (resources) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = resource.as;
    link.href = resource.href;
    if (resource.type) link.type = resource.type;
    if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
    document.head.appendChild(link);
  });
};

/**
 * Set language attribute
 */
export const setLanguage = (lang = 'en') => {
  document.documentElement.lang = lang;
};

export default {
  BUSINESS_INFO,
  DEFAULT_SEO,
  setPageMeta,
  getOrganizationSchema,
  getWebSiteSchema,
  getProductSchema,
  getBreadcrumbSchema,
  getCollectionSchema,
  getFAQSchema,
  injectSchema,
  injectMultipleSchemas,
  setAlternateLinks,
  preloadResources,
  setLanguage
};