"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
    cartItemId: string; // unique key for cart (postId + some variant)
    postId: string;
    title: string;
    artisanName: string;
    imageUrl: string;
    price: number;
    quantity: number;
    craftName: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'cartItemId' | 'quantity'>) => void;
    removeFromCart: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    isInCart: (postId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'qala_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    // Hydrate from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            if (saved) {
                setItems(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Cart hydration error:', e);
        }
        setIsHydrated(true);
    }, []);

    // Persist to localStorage on change
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isHydrated]);

    const addToCart = useCallback((item: Omit<CartItem, 'cartItemId' | 'quantity'>) => {
        setItems(prev => {
            const existing = prev.find(i => i.postId === item.postId);
            if (existing) {
                // Increment quantity if already in cart
                return prev.map(i =>
                    i.postId === item.postId ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, cartItemId: `${item.postId}_${Date.now()}`, quantity: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((cartItemId: string) => {
        setItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
    }, []);

    const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
        if (quantity <= 0) {
            setItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
        } else {
            setItems(prev =>
                prev.map(i => i.cartItemId === cartItemId ? { ...i, quantity } : i)
            );
        }
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const isInCart = useCallback((postId: string) => items.some(i => i.postId === postId), [items]);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            isInCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};
