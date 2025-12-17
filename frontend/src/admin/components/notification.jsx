import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Notification = ({ message, type = 'success', onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
  };

  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`fixed top-4 right-4 z-50 border rounded-lg p-4 min-w-80 ${styles[type]} shadow-lg`}
    >
      <div className="flex items-center space-x-3">
        <Icon size={20} className="flex-shrink-0" />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-charcoal/60 hover:text-charcoal transition-colors"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
};

export default Notification;