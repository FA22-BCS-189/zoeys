import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../utils/CartContext';
import { formatPrice, getPlaceholderImage } from '../utils/helpers';
import { ShoppingBag, CheckCircle } from 'lucide-react';
// Import SEO utilities
import { setPageMeta, getBreadcrumbSchema, injectSchema, BUSINESS_INFO } from '../utils/seo-utils';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    city: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  // Set SEO meta tags
  useEffect(() => {
    const itemCount = cartItems.length;
    const totalPrice = getCartTotal();
    const shippingCost = getCartTotal() > 50000 ? 0 : 250;
    const finalTotal = totalPrice + shippingCost;

    setPageMeta({
      title: 'Checkout - Complete Your Order',
      description: `Secure checkout for ${itemCount} handcrafted embroidered ${itemCount === 1 ? 'piece' : 'pieces'}. Total: ${formatPrice(finalTotal)}. Cash on delivery available. Fast shipping across Pakistan.`,
      keywords: 'checkout, place order, bahawalpur embroidery, cash on delivery, traditional fabrics, secure checkout',
      url: `${import.meta.env.VITE_SITE_URL || 'https://yourdomain.com'}/checkout`,
      type: 'website'
    });

    // Generate breadcrumb schema
    const breadcrumbSchema = getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Shop', url: '/shop' },
      { name: 'Cart', url: '/cart' },
      { name: 'Checkout', url: '/checkout' }
    ]);

    injectSchema(breadcrumbSchema);

    // Generate order schema for e-commerce
    if (cartItems.length > 0) {
      const orderSchema = {
        "@context": "https://schema.org",
        "@type": "CheckoutPage",
        "name": "Checkout - Complete Your Order",
        "description": "Secure checkout for traditional Bahawalpur embroidered fabrics",
        "url": `${BUSINESS_INFO.url}/checkout`,
        "mainEntity": {
          "@type": "Order",
          "orderNumber": "pending",
          "orderStatus": "https://schema.org/OrderProcessing",
          "acceptedOffer": cartItems.map(item => ({
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": `${item.name} - ${item.color}`,
              "category": "Traditional Embroidery",
              "image": item.images?.[0] || getPlaceholderImage(item.color)
            },
            "price": item.price,
            "priceCurrency": "PKR",
            "eligibleQuantity": {
              "@type": "QuantitativeValue",
              "value": item.quantity
            }
          })),
          "priceCurrency": "PKR",
          "price": finalTotal,
          "paymentMethod": "CashOnDelivery",
          "seller": {
            "@type": "Organization",
            "name": BUSINESS_INFO.name,
            "url": BUSINESS_INFO.url
          }
        }
      };

      injectSchema(orderSchema);
    }
  }, [cartItems, getCartTotal]);

  // ✅ Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderSuccess]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^[0-9]{11}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Please enter a valid 11-digit phone number';
    }

    if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

const handleSubmitOrder = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setLoading(true);

  try {
    const orderData = {
      ...formData,
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: getCartTotal(),
      paymentMethod: 'COD'
    };

    // Fix: Use absolute URL to your backend
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to place order');
    }

    const result = await response.json();
    
    setOrderSuccess(true);
    clearCart();
    
    // Update SEO for success state
    setPageMeta({
      title: 'Order Confirmed - Thank You!',
      description: 'Your order has been placed successfully. We will contact you shortly to confirm delivery details.',
      url: `${import.meta.env.VITE_SITE_URL || 'https://yourdomain.com'}/checkout`
    });

    // Show success message for 3 seconds then redirect
    setTimeout(() => {
      navigate('/');
    }, 3000);

  } catch (error) {
    console.error('Order submission error:', error);
    alert(`Failed to place order: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  // Success screen
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 bg-amber-25 p-8 rounded-xl shadow-soft border border-emerald-200/30 max-w-md"
        >
          <CheckCircle size={80} className="mx-auto text-emerald-500" aria-hidden="true" />
          <h1 className="text-2xl md:text-3xl font-display font-bold text-charcoal">
            Order Placed Successfully!
          </h1>
          <p className="text-charcoal/80">
            Thank you for your order. We'll contact you shortly to confirm delivery details.
          </p>
          <p className="text-sm text-charcoal/60">
            Redirecting to home page...
          </p>
        </motion.div>
      </div>
    );
  }

  const shippingCost = getCartTotal() > 50000 ? 0 : 250;
  const finalTotal = getCartTotal() + shippingCost;

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="bg-amber-25 border-b border-emerald-200/30">
        <div className="container-custom py-6">
          <ol className="flex items-center space-x-2 text-sm text-charcoal/80 mb-4">
            <li>
              <a href="/" className="hover:text-emerald-600 transition-colors">Home</a>
            </li>
            <li aria-hidden="true">
              <span className="text-emerald-400">/</span>
            </li>
            <li>
              <a href="/shop" className="hover:text-emerald-600 transition-colors">Shop</a>
            </li>
            <li aria-hidden="true">
              <span className="text-emerald-400">/</span>
            </li>
            <li>
              <a href="/cart" className="hover:text-emerald-600 transition-colors">Cart</a>
            </li>
            <li aria-hidden="true">
              <span className="text-emerald-400">/</span>
            </li>
            <li>
              <span className="text-emerald-700 font-semibold" aria-current="page">
                Checkout
              </span>
            </li>
          </ol>
          
          <h1 className="text-2xl md:text-3xl font-display font-bold text-charcoal">
            Checkout
          </h1>
          <p className="text-charcoal/80 mt-2">Complete your order</p>
        </div>
      </nav>

      <main className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Checkout Form Section */}
          <section className="lg:col-span-2" aria-labelledby="checkout-form-heading">
            <div className="bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 p-6 md:p-8">
              <h2 id="checkout-form-heading" className="text-xl font-display font-bold text-charcoal mb-6">
                Delivery Information
              </h2>

              <form onSubmit={handleSubmitOrder} className="space-y-6" noValidate>
                {/* Name */}
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-charcoal mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.customerName ? 'border-rose-500' : 'border-emerald-300'
                    }`}
                    placeholder="Enter your full name"
                    required
                    aria-describedby={errors.customerName ? "name-error" : undefined}
                  />
                  {errors.customerName && (
                    <p id="name-error" className="mt-1 text-sm text-rose-500" role="alert">
                      {errors.customerName}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-charcoal mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.customerPhone ? 'border-rose-500' : 'border-emerald-300'
                    }`}
                    placeholder="03001234567"
                    maxLength="11"
                    pattern="[0-9]{11}"
                    required
                    aria-describedby={errors.customerPhone ? "phone-error" : undefined}
                  />
                  {errors.customerPhone && (
                    <p id="phone-error" className="mt-1 text-sm text-rose-500" role="alert">
                      {errors.customerPhone}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-charcoal mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.customerEmail ? 'border-rose-500' : 'border-emerald-300'
                    }`}
                    placeholder="your.email@example.com"
                    aria-describedby={errors.customerEmail ? "email-error" : undefined}
                  />
                  {errors.customerEmail && (
                    <p id="email-error" className="mt-1 text-sm text-rose-500" role="alert">
                      {errors.customerEmail}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="deliveryAddress" className="block text-sm font-medium text-charcoal mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.deliveryAddress ? 'border-rose-500' : 'border-emerald-300'
                    }`}
                    placeholder="House number, street name, area"
                    required
                    aria-describedby={errors.deliveryAddress ? "address-error" : undefined}
                  />
                  {errors.deliveryAddress && (
                    <p id="address-error" className="mt-1 text-sm text-rose-500" role="alert">
                      {errors.deliveryAddress}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-charcoal mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.city ? 'border-rose-500' : 'border-emerald-300'
                    }`}
                    placeholder="e.g., Lahore, Karachi, Islamabad"
                    required
                    aria-describedby={errors.city ? "city-error" : undefined}
                  />
                  {errors.city && (
                    <p id="city-error" className="mt-1 text-sm text-rose-500" role="alert">
                      {errors.city}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-charcoal mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Any special instructions for delivery"
                    aria-describedby="notes-help"
                  />
                  <p id="notes-help" className="mt-1 text-sm text-charcoal/60">
                    Delivery timing preferences, security gate codes, etc.
                  </p>
                </div>

                {/* Submit Button - Mobile */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 lg:hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={loading ? "Processing your order" : "Place your order"}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>
          </section>

          {/* Order Summary Section */}
          <aside className="lg:col-span-1" aria-labelledby="order-summary-heading">
            <div className="bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 p-6 lg:sticky lg:top-24">
              <h2 id="order-summary-heading" className="text-xl font-display font-bold text-charcoal mb-6">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.images?.[0] || getPlaceholderImage(item.color)}
                      alt={`${item.name} in ${item.color} - Traditional Bahawalpur embroidery`}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <h3 className="text-sm font-semibold text-charcoal truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-charcoal/80">{item.color}</p>
                      <p className="text-xs text-charcoal/80">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-emerald-700 mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-charcoal">Subtotal</span>
                  <span className="text-charcoal">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-charcoal">Shipping</span>
                  <span className="text-charcoal">{formatPrice(shippingCost)}</span>
                </div>
                {getCartTotal() > 50000 && (
                  <p className="text-xs text-emerald-600 text-right">
                    🎉 Free shipping on orders over Rs. 50,000
                  </p>
                )}
                <div className="border-t border-emerald-200/50 pt-3 flex justify-between items-center">
                  <span className="text-lg font-semibold text-charcoal">Total</span>
                  <span className="text-xl md:text-2xl font-bold text-emerald-700">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Submit Button - Desktop */}
              <button
                type="submit"
                onClick={handleSubmitOrder}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hidden lg:block disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={loading ? "Processing your order" : "Place your order"}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>

              <div className="mt-6 bg-amber-50 border border-emerald-200/50 rounded-lg p-4">
                <h3 className="font-semibold text-charcoal mb-2 text-sm">
                  Payment Method
                </h3>
                <p className="text-xs text-charcoal/80">
                  Cash on Delivery (COD) - Pay when you receive
                </p>
              </div>

              {/* Security Notice */}
              <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <p className="text-xs text-emerald-800 text-center">
                  🔒 Secure Checkout • Your information is protected
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Checkout;