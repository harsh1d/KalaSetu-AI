import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Artisan, Order, Language, UserRole, FilterOptions } from '../types';
import { translations } from '../utils/translations';
import { seedProducts, seedArtisans } from '../../server/data/seedData';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeView: 'marketplace' | 'catalog-wizard' | 'artisan-hub' | 'admin-cooperative';
  setActiveView: (view: 'marketplace' | 'catalog-wizard' | 'artisan-hub' | 'admin-cooperative') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  
  // Data
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  artisans: Artisan[];
  orders: Order[];
  refreshData: () => Promise<void>;
  
  // Cart & Checkout
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  artisanTip: number;
  setArtisanTip: (tip: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  
  // Modals & Active items
  activeProductDetail: Product | null;
  setActiveProductDetail: (product: Product | null) => void;
  isVisualSearchOpen: boolean;
  setIsVisualSearchOpen: (open: boolean) => void;
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Search & Filter
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;
  
  // Notifications
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const initialFilters: FilterOptions = {
  searchQuery: '',
  craftCategory: 'all',
  state: 'all',
  priceRange: [0, 50000],
  giOnly: false,
  sortBy: 'featured',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('buyer');
  const [activeView, setActiveView] = useState<'marketplace' | 'catalog-wizard' | 'artisan-hub' | 'admin-cooperative'>('marketplace');
  const [language, setLanguage] = useState<Language>('en');

  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [artisans, setArtisans] = useState<Artisan[]>(seedArtisans);
  const [orders, setOrders] = useState<Order[]>([]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kalasetu_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [artisanTip, setArtisanTip] = useState<number>(100);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Modals
  const [activeProductDetail, setActiveProductDetail] = useState<Product | null>(null);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  useEffect(() => {
    localStorage.setItem('kalasetu_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refreshData = async () => {
    try {
      const prodRes = await fetch('/api/products');
      if (prodRes.ok) {
        const data = await prodRes.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      }
      const ordRes = await fetch('/api/orders');
      if (ordRes.ok) {
        const data = await ordRes.json();
        if (data.orders) {
          setOrders(data.orders);
        }
      }
      const artRes = await fetch('/api/artisans');
      if (artRes.ok) {
        const data = await artRes.json();
        if (data.artisans) {
          setArtisans(data.artisans);
        }
      }
    } catch (e) {
      // Offline / fallback to initial seed
      console.warn('API fallback to local state', e);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const t = (key: string): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.title.slice(0, 32)}..." to conscious cart.`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart.', 'info');
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeView,
        setActiveView,
        language,
        setLanguage,
        t,
        products,
        setProducts,
        artisans,
        orders,
        refreshData,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        artisanTip,
        setArtisanTip,
        isCartOpen,
        setIsCartOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        activeProductDetail,
        setActiveProductDetail,
        isVisualSearchOpen,
        setIsVisualSearchOpen,
        activeTrackingOrder,
        setActiveTrackingOrder,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        filters,
        setFilters,
        resetFilters,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
