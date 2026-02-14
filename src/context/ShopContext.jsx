import React, { createContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query,
  orderBy
} from "firebase/firestore";

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

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [galleryImages, setGalleryImages] = useState(initialGallery);
  const [paymentInstructions, setPaymentInstructions] = useState(initialPaymentInstructions);
  const [adminCredentials, setAdminCredentials] = useState({ username: "admin", password: "password123" });
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("thiwa_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("thiwa_isAdmin") === "true";
  });

  // Sync Cart to LocalStorage (Cart should stay local to the device)
  useEffect(() => {
    localStorage.setItem("thiwa_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("thiwa_isAdmin", isAdmin.toString());
  }, [isAdmin]);

  // Firebase Real-time Sync
  useEffect(() => {
    // 1. Sync Products
    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      if (!snapshot.empty) {
        setProducts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } else {
        // If empty, initialize with defaults
        initialProducts.forEach(async (p) => {
          await setDoc(doc(db, "products", p.id.toString()), p);
        });
      }
    });

    // 2. Sync Gallery
    const unsubGallery = onSnapshot(collection(db, "gallery"), (snapshot) => {
      if (!snapshot.empty) {
        setGalleryImages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } else {
        initialGallery.forEach(async (img) => {
          await setDoc(doc(db, "gallery", img.id.toString()), img);
        });
      }
    });

    // 3. Sync Settings (Payment & Admin)
    const unsubSettings = onSnapshot(collection(db, "settings"), (snapshot) => {
      snapshot.docs.forEach(doc => {
        if (doc.id === "payment") setPaymentInstructions(doc.data().text);
        if (doc.id === "admin") setAdminCredentials(doc.data());
      });
      if (snapshot.empty) {
        // Initialize settings
        setDoc(doc(db, "settings", "payment"), { text: initialPaymentInstructions });
        setDoc(doc(db, "settings", "admin"), { username: "admin", password: "password123" });
      }
    });

    // 4. Sync Orders
    const q = query(collection(db, "orders"), orderBy("date", "desc"));
    const unsubOrders = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    return () => {
      unsubProducts();
      unsubGallery();
      unsubSettings();
      unsubOrders();
    };
  }, []);

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

  const addProduct = async (product) => {
    await addDoc(collection(db, "products"), product);
  };

  const updateProduct = async (id, updatedProduct) => {
    await updateDoc(doc(db, "products", id.toString()), updatedProduct);
  };

  const removeProduct = async (id) => {
    await deleteDoc(doc(db, "products", id.toString()));
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

  const updateAdminCredentials = async (newUsername, newPassword) => {
    await setDoc(doc(db, "settings", "admin"), { username: newUsername, password: newPassword });
  };

  const updatePaymentInstructions = async (text) => {
    await setDoc(doc(db, "settings", "payment"), { text });
  };

  const addGalleryImage = async (image) => {
    await addDoc(collection(db, "gallery"), { image });
  };

  const removeGalleryImage = async (id) => {
    await deleteDoc(doc(db, "gallery", id.toString()));
  };

  const addOrder = async (orderData) => {
    const newOrder = {
      date: new Date().toISOString(),
      status: 'Pending',
      ...orderData
    };
    const docRef = await addDoc(collection(db, "orders"), newOrder);
    return { ...newOrder, id: docRef.id };
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        isAdmin,
        paymentInstructions,
        setPaymentInstructions: updatePaymentInstructions,
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
