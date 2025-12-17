import { motion } from 'framer-motion';
import { Crown, Sparkles } from 'lucide-react';

const Loading = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 p-4">
      {/* Rotating Crown with Glow */}
      <div className="relative">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="relative"
        >
          <Crown size={64} className="text-emerald-500 drop-shadow-sm" />
          
          {/* Glowing Background */}
          <div className="absolute inset-0 bg-emerald-400/20 blur-2xl rounded-full animate-pulse" />
        </motion.div>
        
        {/* Orbiting Sparkles */}
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sparkles size={20} className="text-emerald-600 absolute -top-8" />
        </motion.div>
        
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sparkles size={16} className="text-emerald-400 absolute -right-8" />
        </motion.div>
      </div>
      
      {/* Loading Text */}
      <div className="text-center space-y-2">
        <p className="text-charcoal font-display font-semibold text-lg">{text}</p>
        
        {/* Animated Dots */}
        <div className="flex items-center justify-center space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
              }}
              className="w-2 h-2 bg-emerald-500 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="card overflow-hidden hover-lift bg-amber-50 rounded-xl shadow-subtle">
      {/* Image Skeleton with Shimmer */}
      <div className="aspect-[3/4] bg-gradient-to-br from-amber-100 via-emerald-50 to-amber-100 skeleton relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-ornate opacity-10" />
      </div>
      
      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100 rounded skeleton w-full" />
          <div className="h-6 bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100 rounded skeleton w-3/4" />
        </div>
        
        {/* Details */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 rounded skeleton w-1/3" />
          <div className="h-4 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 rounded skeleton w-1/4" />
        </div>
        
        {/* Price */}
        <div className="h-8 bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-200 rounded skeleton w-1/2" />
        
        {/* Button */}
        <div className="h-12 bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100 rounded-lg skeleton w-full" />
      </div>
      
      {/* Decorative Corner Accents */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-300/30" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-300/30" />
    </div>
  );
};

export default Loading;