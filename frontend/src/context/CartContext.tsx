import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { CartItem } from "../types/CartItem";

// Define the type for the CartContext
interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (bookID: number) => void;
    clearCart: () => void;
}

// Initialize the context with undefined
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    // Load cart data from localStorage or set as an empty array
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Update localStorage whenever the cart changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((c) => c.bookID === item.bookID);
            if (existingItem) {
                return prevCart.map((c) =>
                    c.bookID === item.bookID
                        ? { ...c, quantity: c.quantity + 1, price: item.price }
                        : c
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (bookID: number) => {
        setCart((prevCart) => prevCart.filter((c) => c.bookID !== bookID));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
