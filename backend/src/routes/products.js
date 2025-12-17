import express from 'express';
import { PrismaClient } from '@prisma/client';

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

export default router;