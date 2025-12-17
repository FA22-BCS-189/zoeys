import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../utils/CartContext';
import { useEffect, useState } from 'react';
import { formatPrice, getPlaceholderImage } from '../utils/helpers';
// Import SEO utilities
import { setPageMeta, getBreadcrumbSchema, injectSchema } from '../utils/seo-utils';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [stockWarnings, setStockWarnings] = useState({});

  // Set SEO meta tags
  useEffect(() => {
    const itemCount = cartItems.length;
    const totalPrice = getCartTotal();
    
    setPageMeta({
      title: `Shopping Cart (${itemCount} ${itemCount === 1 ? 'item' : 'items'})`,
      description: `Your shopping cart at Zoey's Heritage Embroidery. ${itemCount} handcrafted embroidered ${itemCount === 1 ? 'piece' : 'pieces'} totaling ${formatPrice(totalPrice)}. Secure checkout with cash on delivery.`,
      keywords: 'shopping cart, bahawalpur embroidery, traditional fabrics, checkout, cash on delivery, handcrafted textiles',
      url: `${import.meta.env.VITE_SITE_URL || 'https://yourdomain.com'}/cart`,
      type: 'website'
    });

    // Generate breadcrumb schema
    const breadcrumbSchema = getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Shop', url: '/shop' },
      { name: 'Shopping Cart', url: '/cart' }
    ]);

    injectSchema(breadcrumbSchema);

    // Generate order schema if cart has items
    if (cartItems.length > 0) {
      const orderSchema = {
        "@context": "https://schema.org",
        "@type": "Order",
        "merchant": {
          "@type": "Organization",
          "name": "Zoey's Heritage Embroidered Fabrics"
        },
        "acceptedOffer": cartItems.map(item => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": `${item.name} - ${item.color}`,
            "description": item.description || `Handcrafted ${item.name} in ${item.color} with traditional Bahawalpur embroidery`,
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
        "price": getCartTotal(),
        "paymentMethod": "CashOnDelivery"
      };

      injectSchema(orderSchema);
    }
  }, [cartItems, getCartTotal]);

  // ✅ Check backend stock when cart loads (to remove out-of-stock items)
  useEffect(() => {
    const checkStock = async () => {
      try {
        const res = await fetch('/api/check-stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cartItems.map(i => i.id) })
        });
        const data = await res.json();

        data.outOfStockIds?.forEach(id => removeFromCart(id));
      } catch (err) {
        console.error('Stock validation failed', err);
      }
    };

    if (cartItems.length > 0) checkStock();
  }, []);

  const handleIncrease = (item) => {
    const newQty = item.quantity + 1;
    
    // ✅ Check against stockQuantity
    const availableStock = item.stockQuantity || 999;
    
    if (newQty <= availableStock) {
      updateQuantity(item.id, newQty);
    } else {
      // ✅ Show "Maximum quantity reached" warning
      setStockWarnings(prev => ({ ...prev, [item.id]: true }));
      setTimeout(() => {
        setStockWarnings(prev => {
          const copy = { ...prev };
          delete copy[item.id];
          return copy;
        });
      }, 2000);
    }
  };

  const handleDecrease = (item) => {
    const newQty = item.quantity - 1;
    updateQuantity(item.id, newQty);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 p-8 bg-amber-25 rounded-2xl"
        >
          <ShoppingBag size={80} className="mx-auto text-emerald-300" aria-hidden="true" />
          <h1 className="text-2xl font-display font-bold text-charcoal">
            Your Cart is Empty
          </h1>
          <p className="text-charcoal/80">Looks like you haven't added any items yet</p>
          <Link 
            to="/shop" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 inline-block"
            aria-label="Continue shopping to browse our embroidered fabrics collection"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="bg-amber-25 border-b border-emerald-200/30">
        <div className="container-custom py-6">
          <ol className="flex items-center space-x-2 text-sm text-charcoal/80 mb-4">
            <li>
              <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            </li>
            <li aria-hidden="true">
              <span className="text-emerald-400">/</span>
            </li>
            <li>
              <Link to="/shop" className="hover:text-emerald-600 transition-colors">Shop</Link>
            </li>
            <li aria-hidden="true">
              <span className="text-emerald-400">/</span>
            </li>
            <li>
              <span className="text-emerald-700 font-semibold" aria-current="page">
                Shopping Cart
              </span>
            </li>
          </ol>
          
          <h1 className="text-2xl md:text-3xl font-display font-bold text-charcoal">
            Shopping Cart
          </h1>
          <p className="text-charcoal/80 mt-2">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>
      </nav>

      <main className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items Section */}
          <section className="lg:col-span-2 space-y-4" aria-labelledby="cart-items-heading">
            <h2 id="cart-items-heading" className="sr-only">
              Items in your shopping cart
            </h2>
            
            {cartItems.map((item) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 p-4 transition-all ${
                  stockWarnings[item.id] ? 'ring-2 ring-rose-400 shadow-rose-100 animate-shake' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={`/${item.slug}`} className="flex-shrink-0 mx-auto sm:mx-0">
                    <img
                      src={item.images?.[0] || getPlaceholderImage(item.color)}
                      alt={`${item.name} in ${item.color} - Traditional Bahawalpur embroidery`}
                      className="w-32 h-32 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover rounded-lg"
                    />
                  </Link>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-grow">
                        <Link
                          to={`/product/${item.slug}`}
                          className="font-display text-base md:text-lg font-semibold text-charcoal hover:text-emerald-600 line-clamp-2 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-charcoal/80 mt-1">{item.color}</p>
                        <p className="text-sm text-charcoal/80">{item.pieces}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-rose-500 hover:text-rose-700 transition-colors p-1"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={18} aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center border border-emerald-300 rounded-lg">
                        <button
                          onClick={() => handleDecrease(item)}
                          className="px-3 py-2 hover:bg-amber-50 active:bg-amber-100 transition-colors text-charcoal"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus size={16} aria-hidden="true" />
                        </button>
                        <span className="px-4 py-2 border-x border-emerald-300 min-w-[3rem] text-center font-medium text-emerald-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrease(item)}
                          className="px-3 py-2 hover:bg-amber-50 active:bg-amber-100 transition-colors text-charcoal"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus size={16} aria-hidden="true" />
                        </button>
                      </div>

                      <div className="text-center sm:text-right">
                        <p className="text-lg md:text-xl font-bold text-emerald-700">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        {stockWarnings[item.id] && (
                          <p className="text-xs text-rose-500 font-medium mt-1 animate-pulse">
                            Maximum quantity reached
                          </p>
                        )}
                        {item.quantity > 1 && (
                          <p className="text-xs text-charcoal/60 mt-1">
                            {formatPrice(item.price)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
              <Link 
                to="/shop" 
                className="border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 w-full sm:w-auto text-center"
                aria-label="Continue shopping for more embroidered fabrics"
              >
                ← Continue Shopping
              </Link>
              <button 
                onClick={clearCart} 
                className="text-rose-600 hover:text-rose-700 font-medium w-full sm:w-auto transition-colors"
                aria-label="Clear all items from shopping cart"
              >
                Clear Cart
              </button>
            </div>
          </section>

          {/* Order Summary Section */}
          <aside className="lg:col-span-1" aria-labelledby="order-summary-heading">
            <div className="bg-amber-25 rounded-xl shadow-soft border border-emerald-200/30 p-6 lg:sticky lg:top-24">
              <h2 id="order-summary-heading" className="text-xl font-display font-bold text-charcoal mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-charcoal/80">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-charcoal/80 text-sm">
                  <span>Delivery</span>
                  <span className="text-right">Calculated at checkout</span>
                </div>
                <div className="border-t border-emerald-200/50 pt-3 flex justify-between items-center">
                  <span className="text-lg font-semibold text-charcoal">Total</span>
                  <span className="text-xl md:text-2xl font-bold text-emerald-700">
                    {formatPrice(getCartTotal())}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                disabled={cartItems.length === 0}
                aria-label="Proceed to secure checkout"
              >
                Proceed to Checkout
              </button>

              <div className="mt-6 bg-amber-50 border border-emerald-200/50 rounded-lg p-4">
                <h3 className="font-semibold text-charcoal mb-2 text-sm">
                  Payment Method
                </h3>
                <p className="text-xs text-charcoal/80">
                  Cash on Delivery (COD) - Pay when you receive
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Cart;