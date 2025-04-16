import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';

const defaultCartContextValue = {
    cart: [],
    addToCart: () => {},
    removeFromCart: () => {},
    updateQuantity: () => {},
    incrementQuantity: () => {},
    decrementQuantity: () => {},
    clearCart: () => {},
    totalCartItems: 0,
    totalCartPrice: 0
};
const CartContext = createContext(defaultCartContextValue);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [totalCartItems, setTotalCartItems] = useState(0);

  useEffect(() => {
    let itemsCount = 0;
    let priceSum = 0;
    cart.forEach(item => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      itemsCount += quantity;
      priceSum += price * quantity;
    });
    if (itemsCount !== totalCartItems) {
        setTotalCartItems(itemsCount);
    }
    if (priceSum !== totalCartPrice) {
        setTotalCartPrice(priceSum);
    }
  }, [cart, totalCartItems, totalCartPrice]);

  const addToCart = useCallback((product) => {
     if (!product || typeof product.id === 'undefined' || typeof product.quantity === 'undefined') {
        console.error('[CartContext] Invalid product passed to addToCart:', product);
        return;
     }
    setCart(prevCart => {
        const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
        if (existingItemIndex > -1) {
            const updatedCart = [...prevCart];
            const currentItem = updatedCart[existingItemIndex];
            const stock = Number(currentItem.stock) || 0;
            if (currentItem.quantity < stock) {
                updatedCart[existingItemIndex] = { ...currentItem, quantity: currentItem.quantity + 1 };
                return updatedCart;
            }
            return prevCart;
        } else {
            const stock = Number(product.quantity) || 0;
            if (stock > 0) {
                return [...prevCart, { ...product, quantity: 1, stock: product.quantity }];
            }
            return prevCart;
        }
    });
  }, []);

    const removeFromCart = useCallback((productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId, newQuantity) => {
         const numValue = parseInt(newQuantity, 10);
          if (isNaN(numValue) || numValue < 1) {
              removeFromCart(productId);
              return;
          }
        setCart(prevCart => {
             const itemIndex = prevCart.findIndex(item => item.id === productId);
             if (itemIndex === -1) return prevCart;
             const itemToUpdate = prevCart[itemIndex];
             const stock = Number(itemToUpdate.stock) || 0;
             const validatedQuantity = Math.max(1, Math.min(numValue, stock));

             if (validatedQuantity === itemToUpdate.quantity) return prevCart;

             const updatedCart = [...prevCart];
             updatedCart[itemIndex] = { ...itemToUpdate, quantity: validatedQuantity };
             return updatedCart;
        });
    }, [removeFromCart]);

    const incrementQuantity = useCallback((productId) => {
        setCart(prevCart => {
            const itemIndex = prevCart.findIndex(item => item.id === productId);
            if (itemIndex === -1) return prevCart;
            const updatedCart = [...prevCart];
            const currentItem = updatedCart[itemIndex];
            const stock = Number(currentItem.stock) || 0;
            if (currentItem.quantity < stock) {
                 updatedCart[itemIndex] = { ...currentItem, quantity: currentItem.quantity + 1 };
                 return updatedCart;
            }
            return prevCart;
        });
    }, []);

     const decrementQuantity = useCallback((productId) => {
         setCart(prevCart => {
             const itemIndex = prevCart.findIndex(item => item.id === productId);
             if (itemIndex === -1) return prevCart;
             const updatedCart = [...prevCart];
             const currentItem = updatedCart[itemIndex];
             if (currentItem.quantity > 1) {
                  updatedCart[itemIndex] = { ...currentItem, quantity: currentItem.quantity - 1 };
                  return updatedCart;
             } else if (currentItem.quantity === 1) {
                 return prevCart.filter(item => item.id !== productId);
             }
             return prevCart;
         });
     }, []);

      const clearCart = useCallback(() => {
          setCart([]);
      }, []);

  const contextValue = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    totalCartItems,
    totalCartPrice
  }), [
      cart, addToCart, removeFromCart, updateQuantity, incrementQuantity, decrementQuantity, clearCart,
      totalCartItems, totalCartPrice
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);