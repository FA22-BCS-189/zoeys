import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('zoeys_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('zoeys_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantityToAdd = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => String(item.id) === String(product.id));
      
      // ✅ Use stockQuantity if available, otherwise fall back to quantity
      const availableStock = product.stockQuantity || product.quantity || 0;

      if (availableStock <= 0) {
        alert('Out of stock');
        return prevItems;
      }

      if (existingItem) {
        // Calculate new total quantity in cart
        const newCartQuantity = existingItem.quantity + quantityToAdd;
        
        // Check against available stock
        if (newCartQuantity > availableStock) {
          alert(`Only ${availableStock} available in stock`);
          return prevItems;
        }

        return prevItems.map(item =>
          String(item.id) === String(product.id)
            ? { ...item, quantity: newCartQuantity }
            : item
        );
      } else {
        // New item - check if requested quantity exceeds stock
        if (quantityToAdd > availableStock) {
          alert(`Only ${availableStock} available in stock`);
          return prevItems;
        }

        // ✅ Store stockQuantity when adding new item
        return [...prevItems, { 
          ...product, 
          quantity: quantityToAdd,
          stockQuantity: availableStock // ✅ Preserve stock amount
        }];
      }
    });
  };

  const removeFromCart = productId => {
    setCartItems(prevItems =>
      prevItems.filter(item => String(item.id) !== String(productId))
    );
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item => {
        if (String(item.id) === String(productId)) {
          // ✅ Check against stored stockQuantity
          const maxStock = item.stockQuantity || 999;
          
          if (newQuantity > maxStock) {
            // ✅ Don't show alert here - let Cart.jsx handle the warning
            return item; // Don't update if exceeds stock
          }
          
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};