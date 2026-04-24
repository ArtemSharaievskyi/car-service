"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { calculateCartTotal, CART_STORAGE_KEY, createCartItem } from "@/features/cart/lib/cart-utils";
import { cartSchema } from "@/lib/validations/cart";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let nextItems = [];

    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

      if (storedCart) {
        const parsedCart = cartSchema.safeParse(JSON.parse(storedCart));

        if (parsedCart.success) {
          nextItems = parsedCart.data.items;
        } else {
          window.localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }

    queueMicrotask(() => {
      setItems(nextItems);
      setHasLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items }));
  }, [hasLoaded, items]);

  const addPart = (part) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.sku === part.sku);

      if (!existingItem) {
        return [...currentItems, createCartItem(part)];
      }

      return currentItems.map((item) =>
        item.sku === part.sku ? { ...item, quantity: item.quantity + 1 } : item
      );
    });
  };

  const removePart = (sku) => {
    setItems((currentItems) => currentItems.filter((item) => item.sku !== sku));
  };

  const updateQuantity = (sku, quantity) => {
    const nextQuantity = Number.parseInt(quantity, 10);

    if (!Number.isFinite(nextQuantity) || nextQuantity <= 0) {
      removePart(sku);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => (item.sku === sku ? { ...item, quantity: nextQuantity } : item))
    );
  };

  const totalItems = items.reduce((count, item) => count + item.quantity, 0);
  const totalPrice = calculateCartTotal(items);

  return (
    <CartContext.Provider
      value={{
        items,
        addPart,
        removePart,
        updateQuantity,
        totalItems,
        totalPrice,
        hasLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider.");
  }

  return context;
}
