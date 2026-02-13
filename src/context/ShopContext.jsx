import React, { createContext, useState, useEffect } from "react";

export const ShopContext = createContext();

const initialProducts = [
  {
    id: 1,
    name: "Custom DTF Vibes T-Shirt",
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "High quality DTF printed t-shirt with custom vibes design.",
    category: "Men",
  },
  {
    id: 2,
    name: "Abstract Art Tee",
    price: 2800,
    image:
      "https://images.unsplash.com/photo-1503341455253-b2e72333dbdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Modern abstract art specific for creative souls.",
    category: "Unisex",
  },
  {
    id: 3,
    name: "Urban Streetwear Black",
    price: 3000,
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Premium cotton streetwear essential.",
    category: "Men",
  },
  {
    id: 4,
    name: "Flora Design White",
    price: 2600,
    image:
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Elegant floral design for casual wear.",
    category: "Women",
  },
];

const initialGallery = [
  { id: 1, image: "https://images.unsplash.com/photo-1576566582149-434ee41cfa01?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 2, image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 3, image: "https://images.unsplash.com/photo-1551799517-eb8f03cb5e6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
];

const initialPaymentInstructions = `
Please deposit the total amount to the following bank account:
Bank: Commercial Bank
Account Name: GTΞRA
Account Number: 1234567890
Branch: Colombo

Send a screenshot of the receipt to our WhatsApp: +94 77 123 4567
`;

// Helper function to safely save to localStorage
const saveToLocalStorage = (key, value) => {
  try {
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

// Helper function to safely load from localStorage
const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) return defaultValue;
    
    // If default value is a string, return saved as string
    if (typeof defaultValue === 'string') return saved;
    
    // Otherwise parse as JSON
    return JSON.parse(saved);
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    return loadFromLocalStorage("thiwa_products", initialProducts);
  });

  const [cart, setCart] = useState(() => {
    return loadFromLocalStorage("thiwa_cart", []);
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return loadFromLocalStorage("thiwa_isAdmin", "false") === "true";
  });

  const [paymentInstructions, setPaymentInstructions] = useState(() => {
    return loadFromLocalStorage("thiwa_payment_instructions", initialPaymentInstructions);
  });

  const [adminCredentials, setAdminCredentials] = useState(() => {
    return loadFromLocalStorage("thiwa_admin_creds", { username: "admin", password: "password123" });
  });

  const [galleryImages, setGalleryImages] = useState(() => {
    return loadFromLocalStorage("thiwa_gallery", initialGallery);
  });

  const [orders, setOrders] = useState(() => {
    return loadFromLocalStorage("thiwa_orders", []);
  });

  // Automatically save to localStorage whenever state changes
  useEffect(() => {
    saveToLocalStorage("thiwa_products", products);
  }, [products]);

  useEffect(() => {
    saveToLocalStorage("thiwa_cart", cart);
  }, [cart]);

  useEffect(() => {
    saveToLocalStorage("thiwa_isAdmin", isAdmin.toString());
  }, [isAdmin]);

  useEffect(() => {
    saveToLocalStorage("thiwa_payment_instructions", paymentInstructions);
  }, [paymentInstructions]);

  useEffect(() => {
    saveToLocalStorage("thiwa_admin_creds", adminCredentials);
  }, [adminCredentials]);

  useEffect(() => {
    saveToLocalStorage("thiwa_gallery", galleryImages);
  }, [galleryImages]);

  useEffect(() => {
    saveToLocalStorage("thiwa_orders", orders);
  }, [orders]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const addProduct = (product) => {
    setProducts((prev) => [...prev, { ...product, id: Date.now() }]);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)),
    );
  };

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const loginAdmin = (username, password) => {
    if (
      username === adminCredentials.username &&
      password === adminCredentials.password
    ) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  const updateAdminCredentials = (newUsername, newPassword) => {
    setAdminCredentials({ username: newUsername, password: newPassword });
  };

  const addGalleryImage = (image) => {
    setGalleryImages((prev) => [...prev, { id: Date.now(), image }]);
  };

  const removeGalleryImage = (id) => {
    setGalleryImages((prev) => prev.filter((img) => img.id !== id));
  };

  const addOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      status: 'Pending',
      ...orderData
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        isAdmin,
        paymentInstructions,
        setPaymentInstructions,
        addToCart,
        removeFromCart,
        clearCart,
        addProduct,
        updateProduct,
        removeProduct,
        loginAdmin,
        logoutAdmin,
        updateAdminCredentials,
        galleryImages,
        addGalleryImage,
        removeGalleryImage,
        orders,
        addOrder,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
