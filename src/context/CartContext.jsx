"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // إضافة طبق للسلة
  const addToCart = (dish) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === dish.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...dish, quantity: 1 }];
    });
  };

  // تقليل الكمية أو مسح الطبق لو وصل لـ 0
  const removeFromCart = (dishId) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === dishId);
      if (existingItem.quantity === 1) {
        return prevItems.filter((item) => item.id !== dishId);
      }
      return prevItems.map((item) =>
        item.id === dishId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  // مسح الطبق تماماً من السلة
  const clearItem = (dishId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== dishId));
  };

  // تفريغ السلة كاملة (بعد إتمام الطلب مثلاً)
  const clearCart = () => setCartItems([]);

  // تعلية الـ Performance بإستخدام useMemo لحساب الإجمالي والعدد
  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearItem,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

// الـ Custom Hook السريع عشان ننادي الداتا في الـ UI بـ Clean Syntax
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}