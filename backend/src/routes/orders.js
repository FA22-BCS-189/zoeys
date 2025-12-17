import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/orders - Create new order
router.post('/',
  [
    body('customerName').trim().notEmpty().withMessage('Name is required'),
    body('customerPhone').trim().notEmpty().withMessage('Phone is required'),
    body('customerEmail').optional().isEmail().withMessage('Invalid email'),
    body('deliveryAddress').trim().notEmpty().withMessage('Address is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item required'),
    body('items.*.productId').notEmpty().withMessage('Product ID required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Valid quantity required')
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

      const {
        customerName,
        customerPhone,
        customerEmail,
        deliveryAddress,
        city,
        items,
        notes
      } = req.body;

      const date = new Date();
      const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `ZOE-${dateStr}-${randomNum}`;

      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { collection: true }
        });

        if (!product) {
          return res.status(404).json({
            success: false,
            error: `Product not found: ${item.productId}`
          });
        }

        if (product.quantity <= 0) {
          return res.status(400).json({
            success: false,
            error: `Product out of stock: ${product.name} - ${product.color}`
          });
        }

        if (item.quantity > product.quantity) {
          return res.status(400).json({
            success: false,
            error: `Only ${product.quantity} available for: ${product.name}`
          });
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price
        });
      }

      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            customerName,
            customerPhone,
            customerEmail,
            deliveryAddress,
            city,
            totalAmount,
            paymentMethod: 'COD',
            notes,
            items: {
              create: orderItemsData
            }
          },
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

        // ↓↓↓ Only addition: update quantity + stockStatus ↓↓↓
        for (const item of orderItemsData) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            select: { quantity: true }
          });

          const newQuantity = Math.max(product.quantity - item.quantity, 0);

          await tx.product.update({
            where: { id: item.productId },
            data: {
              quantity: newQuantity,
              stockStatus: newQuantity > 0 ? 'in_stock' : 'out_of_stock'
            }
          });
        }
        // ↑↑↑ Only addition ends here ↑↑↑

        return newOrder;
      });

      if (customerEmail) {
        sendOrderConfirmationEmail(order).catch((emailError) => {
          console.error('Failed to send confirmation email:', emailError);
        });
      }

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create order'
      });
    }
  }
);

router.get('/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
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

export default router;
