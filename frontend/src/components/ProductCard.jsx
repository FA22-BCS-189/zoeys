import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { formatPrice, getPlaceholderImage } from '../utils/helpers';

const ProductCard = ({ product, compact = false, small = false }) => {
  const image = product.images?.[0] || getPlaceholderImage(product.color);
  const isOutOfStock = product.stockStatus === 'out_of_stock';

  // Size classes based on props
  const sizeClasses = {
    card: small ? 'rounded-lg' : compact ? 'rounded-xl' : 'rounded-xl',
    image: small ? 'aspect-[3/4] rounded-t-lg' : compact ? 'aspect-[3/4] rounded-t-xl' : 'aspect-[3/4] rounded-t-xl',
    content: small ? 'p-2 space-y-1 rounded-b-lg' : compact ? 'p-3 space-y-1.5 rounded-b-xl' : 'p-4 space-y-2 rounded-b-xl',
    name: small ? 'text-xs' : compact ? 'text-sm' : 'text-base',
    details: small ? 'text-[10px] mb-1' : compact ? 'text-xs mb-1' : 'text-xs mb-2',
    price: small ? 'text-sm' : compact ? 'text-base' : 'text-base',
    priceLabel: small ? 'text-[9px]' : compact ? 'text-[10px]' : 'text-[10px]',
    badge: small ? 'px-1.5 py-1 text-[8px]' : compact ? 'px-2 py-1 text-[9px]' : 'px-2.5 py-1.5 text-[10px]',
    cta: small ? 'px-2 py-1 text-[10px]' : compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-1.5 text-xs'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: small ? -2 : compact ? -4 : -8 }}
      transition={{ duration: 0.4 }}
      className={`card overflow-hidden group hover-lift relative bg-amber-50 shadow-subtle h-full flex flex-col ${sizeClasses.card}`}
    >
      <Link to={`/${product.slug}`} className="block flex-1 flex flex-col">
        {/* Image Container */}
        <div className={`relative overflow-hidden bg-amber-50 flex-shrink-0 ${sizeClasses.image}`}>
          <img
            src={image}
            alt={`${product.name} - ${product.color}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Badges Container */}
          <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-1 z-10">
            {/* Collection Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`bg-white/95 backdrop-blur-md rounded-md font-semibold text-emerald-700 shadow-subtle border border-emerald-200/50 flex items-center space-x-1 max-w-[65%] ${sizeClasses.badge}`}
            >
              <Sparkles size={small ? 8 : 10} className="text-emerald-500 flex-shrink-0" />
              <span className="truncate">{product.collection.name}</span>
            </motion.div>

            {/* Out of Stock Badge */}
            {isOutOfStock && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-gradient-to-br from-rose-600 to-rose-700 text-white rounded-md font-bold shadow-subtle backdrop-blur-sm border border-rose-400/30 whitespace-nowrap ${sizeClasses.badge}`}
              >
                Sold Out
              </motion.div>
            )}
          </div>

          {/* Decorative Corner Accents */}
          {!small && (
            <>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400/0 group-hover:border-emerald-400/60 transition-all duration-500" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400/0 group-hover:border-emerald-400/60 transition-all duration-500" />
            </>
          )}
        </div>

        {/* Content */}
        <div className={`bg-amber-50 relative flex-1 flex flex-col justify-between ${sizeClasses.content}`}>
          {/* Decorative Top Border */}
          {!small && (
            <div className="absolute top-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
          )}
          
          {/* Product Name */}
          <div>
            <h3 className={`font-display font-bold text-charcoal line-clamp-1 group-hover:text-emerald-700 transition-colors duration-300 ${sizeClasses.name}`}>
              {product.name}
            </h3>
            
            {/* Product Details */}
            <div className={`flex items-center justify-center space-x-1 text-charcoal/80 font-medium ${sizeClasses.details}`}>
              <span className="font-semibold text-emerald-600">{product.color}</span>
              <span className="text-emerald-400">•</span>
              <span>{product.pieces}</span>
            </div>

            {/* Ornamental Divider */}
            {!small && (
              <div className="flex items-center space-x-1 py-1">
                <div className="h-px flex-grow bg-gradient-to-r from-emerald-300/50 to-transparent" />
                <div className="w-0.5 h-0.5 rounded-full bg-emerald-400" />
                <div className="h-px flex-grow bg-gradient-to-l from-emerald-300/50 to-transparent" />
              </div>
            )}
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className={`text-charcoal/60 font-medium mb-0.5 ${sizeClasses.priceLabel}`}>Price</p>
              <span className={`font-sans font-semibold text-navy-800 tracking-tight ${sizeClasses.price}`}>
                {formatPrice(product.price)}
              </span>
            </div>
            
            {/* Always show View button, even for sold out items */}
            <motion.div
              whileHover={{ x: 3 }}
              className={`flex items-center space-x-1 rounded-lg transition-all duration-300 ${
                isOutOfStock 
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 group-hover:from-emerald-100 group-hover:to-emerald-200 shadow-sm'
              } ${sizeClasses.cta}`}
            >
              <span className="font-semibold">View</span>
              <ArrowRight size={small ? 10 : 12} className="group-hover:translate-x-0.5 transition-transform" />
            </motion.div>
          </div>
        </div>

        {/* Shimmer Effect on Hover */}
        {!small && (
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 pointer-events-none" />
        )}
      </Link>
    </motion.div>
  );
};

export default ProductCard;