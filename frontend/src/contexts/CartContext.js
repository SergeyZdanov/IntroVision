import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';

// --- Задаем структуру и начальные значения по умолчанию ---
const defaultCartContextValue = {
    cart: [],
    addToCart: () => console.warn('Default addToCart called'),
    removeFromCart: () => console.warn('Default removeFromCart called'),
    updateQuantity: () => console.warn('Default updateQuantity called'),
    incrementQuantity: () => console.warn('Default incrementQuantity called'),
    decrementQuantity: () => console.warn('Default decrementQuantity called'),
    clearCart: () => console.warn('Default clearCart called'),
    totalCartItems: 0, // Начальное значение 0
    totalCartPrice: 0  // Начальное значение 0
};
// Передаем defaultCartContextValue в createContext
const CartContext = createContext(defaultCartContextValue);
// ---------------------------------------------------------

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [totalCartItems, setTotalCartItems] = useState(0); // Инициализируем нулем
  console.log('[CartProvider] Initializing state: totalCartItems =', 0);

  // Эффект для пересчета итогов при изменении корзины
  useEffect(() => {
    let itemsCount = 0;
    let priceSum = 0;
    cart.forEach(item => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      itemsCount += quantity;
      priceSum += price * quantity;
    });

    console.log('[CartProvider useEffect] Calculated totals:', { itemsCount, priceSum });
    console.log('[CartProvider useEffect] Current state before set:', { currentTotalItems: totalCartItems, currentTotalPrice: totalCartPrice });

    // Обновляем состояния, только если значения действительно изменились
    if (itemsCount !== totalCartItems) {
      console.log('[CartProvider useEffect] Updating totalCartItems from', totalCartItems, 'to', itemsCount);
      setTotalCartItems(itemsCount);
    }
    if (priceSum !== totalCartPrice) {
       console.log('[CartProvider useEffect] Updating totalCartPrice from', totalCartPrice, 'to', priceSum);
      setTotalCartPrice(priceSum);
    }
  // Зависимость только от корзины. Стейты totalCartItems/Price здесь не нужны.
  }, [cart]);

  // Оборачиваем функции в useCallback для стабильности ссылок
  const addToCart = useCallback((product) => {
     if (!product || typeof product.id === 'undefined' || typeof product.stock === 'undefined') {
        console.error('[CartContext] Invalid product passed to addToCart:', product);
        return;
     }
    console.log('[CartContext] addToCart called for:', product.name, 'ID:', product.id);
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
            return prevCart; // Не меняем, если сток достигнут
        } else {
            const stock = Number(product.stock) || 0;
            if (stock > 0) {
                return [...prevCart, { ...product, quantity: 1 }];
            }
            return prevCart; // Не меняем, если нет в стоке
        }
    });
  }, []); // Пустой массив зависимостей, т.к. используется только setCart

  const removeFromCart = useCallback((productId) => {
    console.log('[CartContext] removeFromCart called for ID:', productId);
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    console.log('[CartContext] updateQuantity called for ID:', productId, 'New Qty:', newQuantity);
     const numValue = parseInt(newQuantity, 10);

     // Если ввод некорректный или <= 0, удаляем товар (согласно логике CartPage)
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
  }, [removeFromCart]); // Зависит от removeFromCart

  const incrementQuantity = useCallback((productId) => {
     console.log('[CartContext] incrementQuantity called for ID:', productId);
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
     console.log('[CartContext] decrementQuantity called for ID:', productId);
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
      console.log('[CartContext] clearCart called');
      setCart([]);
  }, []);

  // --- Мемоизируем объект value ---
  const contextValue = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    totalCartItems, // Передаем актуальные значения из стейта
    totalCartPrice
  }), [
      cart, addToCart, removeFromCart, updateQuantity, incrementQuantity, decrementQuantity, clearCart, // Функции тоже в зависимостях useMemo
      totalCartItems, totalCartPrice // Стейты тоже в зависимостях useMemo
  ]);
  // --------------------------------

   console.log("[CartProvider] Providing context value:", contextValue);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Хук useCart остается без изменений
export const useCart = () => useContext(CartContext);