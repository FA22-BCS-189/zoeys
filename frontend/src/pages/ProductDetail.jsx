import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, PlusCircle, Check, Sparkles, Crown, ChevronRight } from 'lucide-react';
import Loading from '../components/Loading';
import { productsAPI } from '../utils/api';
import { formatPrice, getPlaceholderImage } from '../utils/helpers';
import { useCart } from '../utils/CartContext';
// Import your SEO utilities
import { setPageMeta, getProductSchema, getBreadcrumbSchema, injectSchema, BUSINESS_INFO } from '../utils/seo-utils';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getBySlug(slug);
      const productData = response.data.data;
      setProduct(productData);
      
      // Set SEO meta tags when product data is available
      setProductSEO(productData);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const setProductSEO = (productData) => {
    if (!productData) return;

    const productTitle = `${productData.name} - ${productData.color} | Zoey's Heritage Embroidery`;
    const productDescription = productData.description || 
      `Handcrafted ${productData.color} ${productData.name} with traditional Bahawalpur ${productData.collection.name} embroidery. ${productData.pieces}.`;
    
    const productUrl = `${BUSINESS_INFO.url}/product/${slug}`;
    const productImage = productData.images && productData.images.length > 0 
      ? productData.images[0].startsWith('http') 
        ? productData.images[0] 
        : `${import.meta.env.VITE_API_BASE_URL}/${productData.images[0]}`
      : getPlaceholderImage(productData.color);

    // Set meta tags
    setPageMeta({
      title: `${productData.name} - ${productData.color}`,
      description: productDescription,
      keywords: `${productData.name}, ${productData.color}, ${productData.collection.name}, bahawalpur embroidery, traditional pakistani embroidery, handcrafted fabric`,
      image: productImage,
      url: productUrl,
      type: 'product',
      product: {
        price: productData.price,
        inStock: productData.quantity > 0
      }
    });

    // Generate and inject schemas
    const productSchema = getProductSchema({
      ...productData,
      slug: slug,
      images: productData.images || [productImage]
    });

    const breadcrumbSchema = getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Shop', url: '/shop' },
      { name: productData.collection.name, url: `/shop?collection=${productData.collection.slug}` },
      { name: `${productData.name} - ${productData.color}`, url: `/product/${slug}` }
    ]);

    // Inject schemas
    injectSchema(productSchema);
    injectSchema(breadcrumbSchema);
  };

  const handleOrderNow = () => {
    const cartItem = {
      ...product,
      stockQuantity: product.quantity,
    };
    addToCart(cartItem, quantity);
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      stockQuantity: product.quantity,
    };
    
    addToCart(cartItem, quantity);
    setShowAddedNotification(true);
    setTimeout(() => setShowAddedNotification(false), 3000);
  };

  if (loading) return <Loading />;
  
  if (!product) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-2xl font-display mb-4 text-charcoal">Product not found</h1>
        <Link to="/shop" className="text-emerald-600 hover:text-emerald-700 font-medium">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images.map(img =>
          img.startsWith('http') ? img : `${import.meta.env.VITE_API_BASE_URL}/${img}`
        )
      : [getPlaceholderImage(product.color)];

  const isOutOfStock = product.quantity <= 0;
  const maxQuantity = product.quantity || 1;

  return (
    <div className="min-h-screen bg-amber-50 py-6">
      {/* Success Notification */}
      {showAddedNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-6 right-6 z-50 bg-gradient-to-r from-emerald-600 to-navy-700 text-white px-6 py-4 rounded-xl shadow-soft flex items-center space-x-3"
        >
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Check size={20} />
          </div>
          <span className="font-semibold">Added to cart!</span>
        </motion.div>
      )}

      {/* Breadcrumb - Semantic HTML improvement */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-emerald-200/30">
        <div className="container-custom py-3">
          <ol className="flex items-center space-x-2 text-sm text-charcoal/80 font-medium flex-wrap">
            <li>
              <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} className="text-emerald-400" />
            </li>
            <li>
              <Link to="/shop" className="hover:text-emerald-600 transition-colors">Shop</Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} className="text-emerald-400" />
            </li>
            <li>
              <Link
                to={`/shop?collection=${product.collection.slug}`}
                className="hover:text-emerald-600 transition-colors"
              >
                {product.collection.name}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} className="text-emerald-400" />
            </li>
            <li>
              <span className="text-emerald-700 font-semibold" aria-current="page">
                {product.color}
              </span>
            </li>
          </ol>
        </div>
      </nav>

      <div className="container-custom py-4">
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 text-charcoal/80 hover:text-emerald-600 mb-4 font-medium transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Shop</span>
        </Link>

        {/* Main Product Container */}
        <main className="max-w-6xl mx-auto">
          <article className="bg-white rounded-2xl shadow-soft border border-emerald-200/30 p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Images Section */}
              <section className="space-y-4 max-w-lg mx-auto lg:max-w-none">
                <motion.figure
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="aspect-[3/4] rounded-xl overflow-hidden bg-white border border-emerald-200/30 max-w-md mx-auto"
                >
                  <img
                    src={images[selectedImage]}
                    alt={`${product.name} in ${product.color} - Traditional Bahawalpur ${product.collection.name} embroidery`}
                    className="w-full h-full object-cover"
                  />
                  
                  {isOutOfStock && (
                    <div className="absolute top-3 right-3 bg-rose-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-subtle">
                      Out of Stock
                    </div>
                  )}
                </motion.figure>

                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                    {images.map((image, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`aspect-square rounded-lg overflow-hidden transition-all ${
                          selectedImage === index
                            ? 'ring-2 ring-emerald-500 shadow-subtle'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                        aria-label={`View ${product.name} image ${index + 1}`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} in ${product.color} - View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>
                )}
              </section>

              {/* Product Details Section */}
              <section className="space-y-4 max-w-lg mx-auto lg:max-w-none lg:pl-4">
                <header className="space-y-3">
                  <Link
                    to={`/shop?collection=${product.collection.slug}`}
                    className="inline-flex items-center gap-2 text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                  >
                    <Sparkles size={14} />
                    {product.collection.name}
                  </Link>
                  
                  <h1 className="text-xl md:text-2xl font-display font-bold text-charcoal leading-tight">
                    {product.name}
                  </h1>
                  
                  <p className="text-base text-charcoal/80 font-medium">{product.color}</p>
                </header>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-display font-bold text-emerald-700">
                    {formatPrice(product.price)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      isOutOfStock
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                  </span>
                </div>

                <div className="border-t border-b border-emerald-200/50 py-3">
                  <div className="flex items-center gap-2 text-charcoal font-medium">
                    <Crown size={16} className="text-emerald-500" />
                    <span className="font-semibold text-sm">Set:</span>
                    <span className="text-emerald-700 font-semibold text-sm">{product.pieces}</span>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-charcoal/80 leading-relaxed font-medium text-sm">
                    {product.description ||
                      `Exquisite ${product.color.toLowerCase()} ${product.name.toLowerCase()} adorned with traditional Bahawalpur embroidery. Handcrafted with meticulous care and attention to detail by our master artisans.`}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="bg-emerald-50 border border-emerald-200/50 rounded-lg p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <label htmlFor="quantity-selector" className="text-sm font-bold text-charcoal font-display">
                      Quantity:
                    </label>
                    <div className="flex items-center border border-emerald-300 rounded-lg w-fit">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={isOutOfStock}
                        className="px-3 py-1.5 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-sm"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span 
                        id="quantity-selector"
                        className="px-4 py-1.5 border-x border-emerald-300 font-bold min-w-[2.5rem] text-center text-emerald-700 text-sm"
                      >
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                        disabled={isOutOfStock}
                        className="px-3 py-1.5 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-sm"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    {isOutOfStock ? (
                      <span className="text-xs text-rose-600 font-semibold">Out of Stock</span>
                    ) : (
                      <span className="text-xs text-charcoal/80 font-medium">
                        {maxQuantity === 1 ? '1 available' : `${maxQuantity} available`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`w-full btn-outline py-2.5 rounded-lg transition-all duration-300 inline-flex items-center justify-center space-x-2 group text-sm ${
                      isOutOfStock ? 'opacity-50 cursor-not-allowed border-charcoal/30 text-charcoal/50' : ''
                    }`}
                  >
                    <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                  </button>

                  <button
                    onClick={handleOrderNow}
                    disabled={isOutOfStock}
                    className={`w-full btn-primary py-2.5 rounded-lg transition-all duration-300 inline-flex items-center justify-center space-x-2 text-sm ${
                      isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <ShoppingBag size={18} />
                    <span>{isOutOfStock ? 'Out of Stock' : 'Order Now'}</span>
                  </button>
                </div>

                {/* Additional Info */}
                <aside className="bg-amber-50 border border-amber-200/50 rounded-lg p-3 space-y-2 text-xs text-charcoal/80 font-medium">
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-500 text-xs">✦</span>
                    <span>Cash on Delivery available</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-500 text-xs">✦</span>
                    <span>Free delivery on orders above Rs. 50,000</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-500 text-xs">✦</span>
                    <span>Handcrafted with traditional Bahawalpur embroidery</span>
                  </div>
                </aside>
              </section>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
};

export default ProductDetail;