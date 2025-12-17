import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { generateSEODescription, validateSEODescription, generatePageContent, generateFooterAbout, generateSiteTagline } from '../utils/aiService.js';

const router = express.Router();
const prisma = new PrismaClient();

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const password = req.headers['x-admin-password'];
  const adminPassword = process.env.ADMIN_PASSWORD;

  console.log('Received password:', password ? 'Yes' : 'No');
  console.log('Expected password:', adminPassword ? 'Set' : 'Not set');

  if (!password || password !== adminPassword) {
    console.log('Authentication failed');
    return res.status(401).json({ 
      success: false,
      error: 'Unauthorized' 
    });
  }

  console.log('Authentication successful');
  next();
};

// Apply authentication to all admin routes
router.use(authenticateAdmin); // ✅ Fixed: use authenticateAdmin, not authenticate

// GET /api/admin/orders - Get all orders
router.get('/orders', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    const where = status ? { status } : {};

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                include: {
                  collection: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset)
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      success: true,
      count: orders.length,
      total: totalCount,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
});

// GET /api/admin/orders/:id - Get single order
router.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                collection: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
});

// PATCH /api/admin/orders/:id/status - Update order status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: {
              include: {
                collection: true
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Order status updated',
      data: order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order'
    });
  }
});

// GET /api/admin/products - Get all products for admin
router.get('/products', async (req, res) => {
  try {
    const { collectionId, stockStatus } = req.query;

    const where = {};
    if (collectionId) where.collectionId = collectionId;
    if (stockStatus) where.stockStatus = stockStatus;

    const products = await prisma.product.findMany({
      where,
      include: {
        collection: true,
        _count: {
          select: { orderItems: true }
        }
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

// POST /api/admin/products - Create new product
router.post('/products',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('color').trim().notEmpty().withMessage('Color is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
    body('collectionId').notEmpty().withMessage('Collection is required'),
    body('pieces').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { name, description, seoDescription, color, price, pieces, collectionId, images, stockStatus } = req.body;

      // Generate slug
      const slug = `${name}-${color}`.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if slug already exists
      const existingProduct = await prisma.product.findUnique({
        where: { slug }
      });

      if (existingProduct) {
        return res.status(400).json({
          success: false,
          error: 'A product with this name and color already exists'
        });
      }

      const product = await prisma.product.create({
        data: {
          name,
          slug,
          description,
          seoDescription,
          color,
          price: parseFloat(price),
          pieces: pieces || '3 pc',
          collectionId,
          images: images || [],
          stockStatus: stockStatus || 'in_stock'
        },
        include: {
          collection: true
        }
      });

      res.status(201).json({
        success: true,
        message: 'Product created',
        data: product
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create product'
      });
    }
  }
);

// PATCH /api/admin/products/:id - Update product
router.patch('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If name or color changed, regenerate slug
    if (updateData.name || updateData.color) {
      const product = await prisma.product.findUnique({ where: { id } });
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      const newName = updateData.name || product.name;
      const newColor = updateData.color || product.color;
      const newSlug = `${newName}-${newColor}`.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if new slug conflicts with another product
      if (newSlug !== product.slug) {
        const existingProduct = await prisma.product.findUnique({
          where: { slug: newSlug }
        });

        if (existingProduct && existingProduct.id !== id) {
          return res.status(400).json({
            success: false,
            error: 'A product with this name and color already exists'
          });
        }

        updateData.slug = newSlug;
      }
    }

    // Convert price to float if provided
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        collection: true
      }
    });

    res.json({
      success: true,
      message: 'Product updated',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product'
    });
  }
});

// DELETE /api/admin/products/:id - Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product has any orders
    const orderItems = await prisma.orderItem.count({
      where: { productId: id }
    });

    if (orderItems > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete product with existing orders. Consider marking it as out of stock instead.'
      });
    }

    await prisma.product.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Product deleted'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product'
    });
  }
});

// GET /api/admin/stats - Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalProducts,
      inStockProducts,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      totalRevenue,
      recentOrders
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { stockStatus: 'in_stock' } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.count({ where: { status: 'confirmed' } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ['confirmed', 'delivered'] } }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        products: {
          total: totalProducts,
          inStock: inStockProducts,
          outOfStock: totalProducts - inStockProducts
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          confirmed: confirmedOrders
        },
        revenue: {
          total: totalRevenue._sum.totalAmount || 0
        },
        recentOrders
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

// GET /api/admin/collections - Get all collections for admin
router.get('/collections', async (req, res) => {
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

// POST /api/admin/collections - Create new collection
router.post('/collections',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('slug').trim().notEmpty().withMessage('Slug is required'),
    body('description').optional().trim(),
    body('image').optional().trim(),
    body('order').optional().isInt()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { name, slug, description, image, order } = req.body;

      const collection = await prisma.collection.create({
        data: {
          name,
          slug,
          description: description || null,
          image: image || null,
          order: order ? parseInt(order) : 0
        }
      });

      res.status(201).json({
        success: true,
        message: 'Collection created',
        data: collection
      });
    } catch (error) {
      console.error('Error creating collection:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create collection'
      });
    }
  }
);

// PATCH /api/admin/collections/:id - Update collection
router.patch('/collections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image, order } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (order !== undefined) updateData.order = parseInt(order);

    const collection = await prisma.collection.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    res.json({
      success: true,
      message: 'Collection updated',
      data: collection
    });
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update collection'
    });
  }
});

// DELETE /api/admin/collections/:id - Delete collection
router.delete('/collections/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if collection has products
    const productCount = await prisma.product.count({
      where: { collectionId: id }
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete collection with products. Delete or reassign products first.'
      });
    }

    await prisma.collection.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Collection deleted'
    });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete collection'
    });
  }
});

// POST /api/admin/products/:id/generate-seo - Generate SEO description using AI
router.post('/products/:id/generate-seo', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch product with collection details
    const product = await prisma.product.findUnique({
      where: { id },
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

    // Generate SEO description
    const seoDescription = await generateSEODescription(product);

    // Validate the generated description
    const validation = validateSEODescription(seoDescription);

    // Update product with the generated SEO description
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { seoDescription },
      include: {
        collection: true
      }
    });

    res.json({
      success: true,
      message: 'SEO description generated successfully',
      data: updatedProduct,
      validation
    });
  } catch (error) {
    console.error('Error generating SEO description:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate SEO description',
      details: error.message
    });
  }
});

// GET /api/admin/content - Get all page content
router.get('/content', async (req, res) => {
  try {
    const content = await prisma.pageContent.findMany({
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

// GET /api/admin/content/:pageKey - Get specific page content
router.get('/content/:pageKey', async (req, res) => {
  try {
    const { pageKey } = req.params;
    
    const content = await prisma.pageContent.findUnique({
      where: { pageKey }
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
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

// POST /api/admin/content - Create new page content
router.post('/content', async (req, res) => {
  try {
    const { pageKey, title, content, metaTitle, metaDescription, keywords, published } = req.body;

    // Check if content already exists
    const existing = await prisma.pageContent.findUnique({
      where: { pageKey }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Content with this page key already exists'
      });
    }

    const newContent = await prisma.pageContent.create({
      data: {
        pageKey,
        title,
        content,
        metaTitle,
        metaDescription,
        keywords,
        published: published !== undefined ? published : true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: newContent
    });
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create content'
    });
  }
});

// PATCH /api/admin/content/:id - Update page content
router.patch('/content/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, metaTitle, metaDescription, keywords, published } = req.body;

    const updatedContent = await prisma.pageContent.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(keywords !== undefined && { keywords }),
        ...(published !== undefined && { published })
      }
    });

    res.json({
      success: true,
      message: 'Content updated successfully',
      data: updatedContent
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update content'
    });
  }
});

// DELETE /api/admin/content/:id - Delete page content
router.delete('/content/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.pageContent.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete content'
    });
  }
});

// POST /api/admin/content/:pageKey/generate - Generate content using AI
router.post('/content/:pageKey/generate', async (req, res) => {
  try {
    const { pageKey } = req.params;
    const { context } = req.body;

    // Generate content
    const generated = await generatePageContent(pageKey, context || {});

    res.json({
      success: true,
      message: 'Content generated successfully',
      data: {
        pageKey,
        title: generated.title,
        content: generated.content,
        metaTitle: generated.metaTitle,
        metaDescription: generated.metaDescription,
        keywords: generated.keywords,
        generatedBy: generated.generatedBy || 'template'
      }
    });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate content',
      details: error.message
    });
  }
});

// GET /api/admin/settings - Get all site settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await prisma.siteSettings.findMany({
      orderBy: [{ category: 'asc' }, { key: 'asc' }]
    });

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch settings'
    });
  }
});

// POST /api/admin/settings - Create or update setting
router.post('/settings', async (req, res) => {
  try {
    const { key, value, label, category } = req.body;

    const setting = await prisma.siteSettings.upsert({
      where: { key },
      update: { value, label, category: category || 'general' },
      create: { key, value, label, category: category || 'general' }
    });

    res.json({
      success: true,
      message: 'Setting saved successfully',
      data: setting
    });
  } catch (error) {
    console.error('Error saving setting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save setting'
    });
  }
});

// PATCH /api/admin/settings/:id - Update setting
router.patch('/settings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { value, label, category } = req.body;

    const setting = await prisma.siteSettings.update({
      where: { id },
      data: {
        ...(value !== undefined && { value }),
        ...(label !== undefined && { label }),
        ...(category !== undefined && { category })
      }
    });

    res.json({
      success: true,
      message: 'Setting updated successfully',
      data: setting
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update setting'
    });
  }
});

// DELETE /api/admin/settings/:id - Delete setting
router.delete('/settings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.siteSettings.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Setting deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting setting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete setting'
    });
  }
});

// POST /api/admin/settings/generate/:field - Generate AI content for specific setting field
router.post('/settings/generate/:field', async (req, res) => {
  try {
    const { field } = req.params;
    const { businessName } = req.body;
    
    let generatedContent = '';
    
    switch(field) {
      case 'footer_about':
        generatedContent = await generateFooterAbout(businessName || 'Zoey\'s');
        break;
      case 'site_tagline':
        generatedContent = await generateSiteTagline(businessName || 'Zoey\'s');
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid field for AI generation'
        });
    }

    res.json({
      success: true,
      content: generatedContent
    });
  } catch (error) {
    console.error('Error generating AI content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI content'
    });
  }
});

export default router; // ✅ Only ONE export default at the end