import express from 'express';
import { PrismaClient } from '@prisma/client';
import { generateCollectionSEO } from '../utils/aiService.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/collections - Get all collections
router.get('/', async (req, res) => {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    res.json({
      success: true,
      data: collections
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch collections'
    });
  }
});

// GET /api/collections/:slug - Get single collection with products
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const collection = await prisma.collection.findUnique({
      where: { slug },
      include: {
        products: {
          where: {
            stockStatus: 'in_stock' // Only show in-stock products on frontend
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found'
      });
    }

    res.json({
      success: true,
      data: collection
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch collection'
    });
  }
});

// POST /api/collections/generate-seo - Generate SEO content for a collection using AI
router.post('/generate-seo', async (req, res) => {
  try {
    const { collectionId, collectionData } = req.body;

    let collection = collectionData;
    
    // If collectionId provided, fetch collection from database
    if (collectionId && !collectionData) {
      collection = await prisma.collection.findUnique({
        where: { id: collectionId },
        include: {
          _count: {
            select: { products: true }
          }
        }
      });
      
      if (!collection) {
        return res.status(404).json({
          success: false,
          error: 'Collection not found'
        });
      }
    }

    // Prepare data for AI generation
    const collectionInfo = {
      name: collection.name,
      description: collection.description,
      productCount: collection._count?.products || collectionData?.productCount || 0
    };

    // Generate SEO content
    const seoContent = await generateCollectionSEO(collectionInfo);

    res.json({
      success: true,
      data: seoContent
    });
  } catch (error) {
    console.error('Error generating collection SEO:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate SEO content',
      details: error.message
    });
  }
});

export default router;