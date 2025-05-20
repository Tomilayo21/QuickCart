'use client';

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
};

export const AppContextProvider = (props) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY;
    const router = useRouter();

    const { user } = useUser();
    const { getToken } = useAuth();

    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [cartItems, setCartItems] = useState({}); // Start cart from 0 (empty object)

    const fetchProductData = async () => {
        try {
            const { data } = await axios.get('/api/product/list');
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fetchUserData = async () => {
        try {
            if (user?.publicMetadata?.role === 'admin') {
                setIsAdmin(true);
            }

            const token = await getToken();
            const { data } = await axios.get('/api/user/data', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setUserData(data.user);

                // ✅ Fallback to empty object if cartItems is undefined
                setCartItems(data.user.cartItems || {});
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const addToCart = async (product) => {
        const itemId = product._id;
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }

        setCartItems(cartData);
        toast.success("Item added to cart");

        if (user) {
            try {
                const token = await getToken();
                await axios.post('/api/cart/update', { cartData }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const updateCartQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);

        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }

        setCartItems(cartData);

        if (user) {
            try {
                const token = await getToken();
                await axios.post('/api/cart/update', { cartData }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Cart updated");
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const getCartCount = () => {
        // ✅ Ensure it returns 0 when cart is empty
        return Object.values(cartItems || {}).reduce((acc, curr) => acc + curr, 0);
    };

    const getCartAmount = () => {
        let totalAmount = 0;

        for (const itemId in cartItems) {
            const quantity = cartItems[itemId];
            const itemInfo = products.find(product => product._id === itemId);

            if (itemInfo && typeof itemInfo.offerPrice === 'number') {
                totalAmount += itemInfo.offerPrice * quantity;
            }
        }

        return Math.floor(totalAmount * 100) / 100;
    };

    useEffect(() => {
        fetchProductData();
    }, []);

    useEffect(() => {
        if (user) {
            fetchUserData();
        } else {
            // ✅ Clear cart when user logs out
            setCartItems({});
        }
    }, [user]);

    const value = {
        user,
        getToken,
        currency,
        router,
        isAdmin,
        setIsAdmin,
        userData,
        fetchUserData,
        products,
        setProducts,
        addToCart,
        updateCartQuantity,
        cartItems,
        setCartItems,
        getCartCount,
        getCartAmount,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
