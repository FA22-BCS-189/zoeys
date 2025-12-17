import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/content - Get all published content
router.get('/', async (req, res) => {
  try {
    const content = await prisma.pageContent.findMany({
      where: { published: true },
      select: {
        id: true,
        pageKey: true,
        title: true,
        content: true,
        metaTitle: true,
        metaDescription: true,
        updatedAt: true
      },
      orderBy: { pageKey: 'asc' }
    });

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content'
    });
  }
});

// GET /api/content/:pageKey - Get specific published page content
router.get('/:pageKey', async (req, res) => {
  try {
    const { pageKey } = req.params;
    
    const content = await prisma.pageContent.findUnique({
      where: { pageKey },
      select: {
        id: true,
        pageKey: true,
        title: true,
        content: true,
        metaTitle: true,
        metaDescription: true,
        keywords: true,
        published: true,
        updatedAt: true
      }
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    if (!content.published) {
      return res.status(404).json({
        success: false,
        error: 'Content not published'
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content'
    });
  }
});

export default router;
