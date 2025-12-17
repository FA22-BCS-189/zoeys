// Format price in Pakistani Rupees
export const formatPrice = (price) => {
  return `PKR ${price.toLocaleString('en-PK')}`;
};

// Generate slug from text
export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format date and time
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone (Pakistani format)
export const isValidPhone = (phone) => {
  const re = /^(\+92|0)?[0-9]{10}$/;
  return re.test(phone.replace(/[\s-]/g, ''));
};

export const getPlaceholderImage = (color = 'default') => {
  // Safety check - handle undefined, null, or non-string values
  if (!color || typeof color !== 'string') {
    color = 'default';
  }
  
  const colorMap = {
    'red': '#dc2626',
    'blue': '#2563eb',
    'green': '#16a34a',
    'yellow': '#ca8a04',
    'purple': '#9333ea',
    'pink': '#db2777',
    'black': '#000000',
    'white': '#ffffff',
    'gray': '#6b7280',
    'brown': '#92400e',
    'orange': '#ea580c',
    'navy': '#1e3a8a',
    'maroon': '#991b1b',
    'teal': '#0d9488',
    'gold': '#d97706',
    'silver': '#9ca3af',
    'default': '#6b7280'
  };

  try {
    const normalizedColor = color.toLowerCase().trim();
    const hexColor = colorMap[normalizedColor] || colorMap.default;
    
    return `https://via.placeholder.com/200/${hexColor.replace('#', '')}/FFFFFF?text=${encodeURIComponent(normalizedColor)}`;
  } catch (error) {
    // Fallback if anything goes wrong
    return 'https://via.placeholder.com/200/6b7280/FFFFFF?text=Product';
  }
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Calculate order total
export const calculateOrderTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// Get order status badge color
export const getOrderStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Get stock status badge color
export const getStockStatusColor = (status) => {
  return status === 'in_stock' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
};
