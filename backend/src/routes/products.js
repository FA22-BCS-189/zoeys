import express from 'express';
import { PrismaClient } from '@prisma/client';
import { generateProductSEO, generateProductSchema } from '../utils/aiService.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/products - Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { 
      collection, 
      minPrice, 
      maxPrice, 
      stockStatus,
      search,
      limit = 100,
      offset = 0
    } = req.query;

    // Build filter object
    const where = {};

    if (collection) {
      where.collection = {
        slug: collection
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (stockStatus) {
      where.stockStatus = stockStatus;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { color: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          collection: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset)
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      success: true,
      count: products.length,
      total: totalCount,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
});

// GET /api/products/:slug - Get single product
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        collection: true
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product'
    });
  }
});

// GET /api/products/collection/:collectionSlug - Get products by collection
router.get('/collection/:collectionSlug', async (req, res) => {
  try {
    const { collectionSlug } = req.params;

    const products = await prisma.product.findMany({
      where: {
        collection: {
          slug: collectionSlug
        }
      },
      include: {
        collection: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
});

// POST /api/products/generate-seo - Generate SEO content for a product using AI
router.post('/generate-seo', async (req, res) => {
  try {
    const { productId, productData } = req.body;

    let product = productData;
    
    // If productId provided, fetch product from database
    if (productId && !productData) {
      product = await prisma.product.findUnique({
        where: { id: productId },
        include: { collection: true }
      });
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
    }

    // Prepare data for AI generation
    const productInfo = {
      name: product.name,
      color: product.color,
      price: product.price,
      pieces: product.pieces,
      description: product.description,
      collectionName: product.collection?.name || productData?.collectionName
    };

    // Generate SEO content
    const seoContent = await generateProductSEO(productInfo);

    // Generate JSON-LD schema
    const jsonLdSchema = generateProductSchema({
      ...product,
      collectionName: product.collection?.name || productData?.collectionName,
      metaDescription: seoContent.metaDescription
    });

    res.json({
      success: true,
      data: {
        ...seoContent,
        jsonLdSchema
      }
    });
  } catch (error) {
    console.error('Error generating product SEO:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate SEO content',
      details: error.message
    });
  }
});

export default router;