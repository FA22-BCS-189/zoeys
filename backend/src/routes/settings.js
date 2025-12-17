import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/settings - Get all site settings
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.siteSettings.findMany({
      select: {
        key: true,
        value: true,
        label: true,
        category: true
      }
    });

    // Convert to key-value object for easier frontend use
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    res.json({
      success: true,
      data: settingsObject,
      all: settings // Also provide full array
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch settings'
    });
  }
});

// GET /api/settings/:key - Get specific setting
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    
    const setting = await prisma.siteSettings.findUnique({
      where: { key },
      select: {
        key: true,
        value: true,
        label: true
      }
    });

    if (!setting) {
      return res.status(404).json({
        success: false,
        error: 'Setting not found'
      });
    }

    res.json({
      success: true,
      data: setting.value
    });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch setting'
    });
  }
});

export default router;
