import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (course) => {
    // Check if course already exists in cart by title
    const exists = cart.find((item) => item.title === course.title);
    if (!exists) {
      setCart([...cart, course]);
      return true; // Successfully added
    }
    return false; // Already in cart
  };

  const removeFromCart = (courseTitle) => {
    const updatedCart = cart.filter((item) => item.title !== courseTitle);
    setCart(updatedCart);
  };

  const isInCart = (courseTitle) => {
    return cart.some((item) => item.title === courseTitle);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isInCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};