import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (order) => {
  try {
    const transporter = createTransporter();

    // Format items list
    const itemsList = order.items.map(item => 
      `- ${item.product.name} (${item.product.color}) x ${item.quantity} = PKR ${item.price * item.quantity}`
    ).join('\n');

    const emailContent = `
New Order Received - ${order.orderNumber}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Customer Details:
Name: ${order.customerName}
Phone: ${order.customerPhone}
Email: ${order.customerEmail || 'N/A'}
Address: ${order.deliveryAddress}
City: ${order.city}

Order Details:
${itemsList}

Total Amount: PKR ${order.totalAmount}
Payment Method: ${order.paymentMethod}

${order.notes ? `Notes: ${order.notes}` : ''}

Order placed on: ${new Date(order.createdAt).toLocaleString('en-PK')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please confirm this order by contacting the customer.
    `.trim();

    // Send email to business
    await transporter.sendMail({
      from: `"Zoey's Orders" <${process.env.EMAIL_USER}>`,
      to: process.env.BUSINESS_EMAIL,
      subject: `New Order: ${order.orderNumber}`,
      text: emailContent
    });

    // Send confirmation to customer if email provided
    if (order.customerEmail) {
      const customerEmail = `
Dear ${order.customerName},

Thank you for your order with Zoey's!

Your Order Number: ${order.orderNumber}
Total Amount: PKR ${order.totalAmount}
Payment Method: Cash on Delivery (COD)

Order Summary:
${itemsList}

Delivery Address:
${order.deliveryAddress}
${order.city}

We will contact you shortly to confirm your order.

For any queries, please contact us:
WhatsApp: ${process.env.BUSINESS_WHATSAPP}
Email: ${process.env.BUSINESS_EMAIL}

Best regards,
Zoey's Team
Handcrafted Embroidery from Bahawalpur
      `.trim();

      await transporter.sendMail({
        from: `"Zoey's" <${process.env.EMAIL_USER}>`,
        to: order.customerEmail,
        subject: `Order Confirmation - ${order.orderNumber}`,
        text: customerEmail
      });
    }

    console.log(`Order confirmation email sent for ${order.orderNumber}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
