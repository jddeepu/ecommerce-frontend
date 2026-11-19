import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, ShoppingCart, User, MapPin, 
  Store, ShieldCheck, Heart, Star, X, CheckCircle, 
  ArrowRight, Truck, RefreshCw, Zap, Lock,
  FileText, Download, Check, AlertCircle, Printer,
  Eye, EyeOff, ArrowLeft, Mail, KeyRound,
  Calendar, Clock, QrCode, Smartphone, Award, CreditCard,
  MessageSquare, Sparkles, CheckCheck
} from 'lucide-react';
import { authService, productService, orderService } from './services/api';
import SellerHub from './components/SellerHub';
import AdminPanel from './components/AdminPanel';

// Sample fallback catalog if backend has 0 products initially
const INITIAL_PRODUCTS = [
  {
    id: 201,
    title: "Organic A2 Gir Cow Milk (1 Litre, Chilled Glass Bottle)",
    description: "100% Pure Raw & Chilled A2 Beta-Casein milk from indigenous Gir cows. Farmed ethically, zero antibiotics, lab-tested 100% unadulterated. Delivered daily in cold-chain glass bottles by 6:00 AM.",
    brand: "Amrit Farms A2",
    categoryName: "Dairy & Fresh Milk",
    storeName: "Krishna Dairy Farms",
    basePrice: 85,
    mrp: 95,
    discount: "11% off",
    rating: 4.9,
    reviews: 5820,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 202,
    title: "Traditional Vedic Bilona A2 Desi Cow Ghee (500ml Glass Jar)",
    description: "Hand-churned using traditional wooden bilona method from cultured curd of grass-fed A2 Gir cows. Rich golden granular texture, divine aroma, and high smoke point.",
    brand: "Vedic Bilona",
    categoryName: "Dairy & Fresh Milk",
    storeName: "Krishna Dairy Farms",
    basePrice: 1199,
    mrp: 1499,
    discount: "20% off",
    rating: 4.9,
    reviews: 8410,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 203,
    title: "Fresh Malai Paneer (200g Fresh Vacuum Seal)",
    description: "Ultra-soft melt-in-mouth cottage cheese made directly from pure fresh whole cow milk. Zero starch, zero chemical preservatives, loaded with 18g natural protein.",
    brand: "DairyPure Organics",
    categoryName: "Dairy & Fresh Milk",
    storeName: "Krishna Dairy Farms",
    basePrice: 89,
    mrp: 105,
    discount: "15% off",
    rating: 4.8,
    reviews: 3200,
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 204,
    title: "Creamy Farm Fresh Buffalo Milk (1 Litre Pouch)",
    description: "Rich and thick unhomogenized buffalo milk with 6.5% natural fat. Ideal for making thick malai, authentic creamy tea, coffee, and traditional sweets.",
    brand: "Country Pure Dairy",
    categoryName: "Dairy & Fresh Milk",
    storeName: "Shreeji Dairy Network",
    basePrice: 72,
    mrp: 78,
    discount: "8% off",
    rating: 4.7,
    reviews: 4120,
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 205,
    title: "Probiotic Desi Dahi / Natural Thick Curd (400g Tub)",
    description: "Naturally set probiotic curd made with traditional live starter culture. Thick consistency, mild taste, and loaded with gut-friendly probiotics.",
    brand: "PureCulture Dairy",
    categoryName: "Dairy & Fresh Milk",
    storeName: "Shreeji Dairy Network",
    basePrice: 45,
    mrp: 52,
    discount: "13% off",
    rating: 4.8,
    reviews: 2190,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 206,
    title: "Traditional White Desi Makkhan / Churned Butter (250g)",
    description: "Freshly churned cultured white butter from A2 cream. 100% natural, unsalted, smooth and creamy for hot parathas and dal tadka.",
    brand: "Amrit Farms A2",
    categoryName: "Dairy & Fresh Milk",
    storeName: "Krishna Dairy Farms",
    basePrice: 160,
    mrp: 190,
    discount: "16% off",
    rating: 4.9,
    reviews: 1840,
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 207,
    title: "Shahi Kesar Badam Flavored Milk (200ml Glass Bottle - Pack of 4)",
    description: "Homogenized and sterilized pure milk infused with real Kashmiri saffron strands, crushed California almonds, and green cardamom.",
    brand: "Amul Heritage",
    categoryName: "Dairy & Fresh Milk",
    storeName: "Krishna Dairy Farms",
    basePrice: 155,
    mrp: 180,
    discount: "14% off",
    rating: 4.8,
    reviews: 2950,
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 208,
    title: "Pure Danedar Mawa / Khoya for Sweets (500g Vacuum Pack)",
    description: "Pure evaporated whole buffalo milk solid without any added starch or flour. Perfect for festive Gulab Jamun, Gajar Ka Halwa, and Gujiya.",
    brand: "Halwai Heritage",
    categoryName: "Dairy & Fresh Milk",
    storeName: "Shreeji Dairy Network",
    basePrice: 230,
    mrp: 280,
    discount: "18% off",
    rating: 4.9,
    reviews: 1420,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1605197148560-ef02868efc5b?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 101,
    title: "OnePlus 12 (Silky Black, 256GB, 12GB RAM)",
    description: "Snapdragon 8 Gen 3, 5400 mAh Battery, 50MP Sony LYT-808 with OIS",
    brand: "OnePlus",
    categoryName: "Electronics",
    storeName: "SuperRetail Mobiles",
    basePrice: 64999,
    mrp: 69999,
    discount: "7% off",
    rating: 4.6,
    reviews: 3412,
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 102,
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    description: "Industry leading noise cancellation, 30hr battery life, crystal clear hands-free calling",
    brand: "Sony",
    categoryName: "Electronics",
    storeName: "AudioPhile Hub",
    basePrice: 28990,
    mrp: 34990,
    discount: "17% off",
    rating: 4.8,
    reviews: 8940,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 103,
    title: "Men's Slim Fit Casual Denim Jacket",
    description: "100% Cotton premium washed denim jacket with dual front pockets",
    brand: "Roadster",
    categoryName: "Fashion & Apparel",
    storeName: "Trendz Fashion",
    basePrice: 1499,
    mrp: 3499,
    discount: "57% off",
    rating: 4.3,
    reviews: 1205,
    imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 104,
    title: "Nike Air Max 270 React Running Shoes",
    description: "Breathable mesh upper with high-rebound cushioning for all-day comfort",
    brand: "Nike",
    categoryName: "Fashion & Apparel",
    storeName: "SportsPlanet India",
    basePrice: 8495,
    mrp: 11995,
    discount: "29% off",
    rating: 4.7,
    reviews: 4210,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 105,
    title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker (6L)",
    description: "Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Sauté, Yogurt Maker & Warmer",
    brand: "Instant Pot",
    categoryName: "Home & Kitchen",
    storeName: "KitchenKart Solutions",
    basePrice: 8999,
    mrp: 12999,
    discount: "30% off",
    rating: 4.5,
    reviews: 2190,
    imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: 106,
    title: "Atomic Habits by James Clear (Hardcover Edition)",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones - Over 15M copies sold",
    brand: "Penguin",
    categoryName: "Books & Stationery",
    storeName: "BookWorm Plaza",
    basePrice: 549,
    mrp: 799,
    discount: "31% off",
    rating: 4.9,
    reviews: 24800,
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
  }
];

export default function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register' | 'seller' | 'forgot'
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Forgot Password (OTP Flow) states
  const [forgotStep, setForgotStep] = useState('email'); // 'email' | 'otp'
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otpDebugInfo, setOtpDebugInfo] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    storeName: '',
    gstNumber: ''
  });

  // Checkout & Order states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const [checkoutForm, setCheckoutForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    paymentMode: 'COD'
  });

  // PDP & Returns / Orders Portal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pdpPincode, setPdpPincode] = useState('400001');
  const [pincodeStatus, setPincodeStatus] = useState({ checked: true, deliveryDate: 'Tomorrow, by 2:00 PM (Express Prime Delivery)' });
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [userOrders, setUserOrders] = useState([
    {
      orderNumber: 'ORD-98210-4491',
      customerName: 'Rahul Sharma',
      customerEmail: 'rahul.sharma@example.com',
      customerPhone: '9820154321',
      shippingAddress: 'Flat 402, Green Valley Heights, Andheri West, Mumbai, Maharashtra - 400053',
      totalAmount: 170,
      paymentMode: 'UPI',
      status: 'PLACED',
      createdAt: new Date().toISOString(),
      items: [
        {
          title: 'Organic A2 Gir Cow Milk (1 Litre, Chilled Glass Bottle)',
          storeName: 'Krishna Dairy Farms',
          price: 85,
          quantity: 2,
          imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80'
        }
      ]
    },
    {
      orderNumber: 'ORD-74129-1982',
      customerName: 'Priya Verma',
      customerEmail: 'priya.verma@example.com',
      customerPhone: '9711288412',
      shippingAddress: 'Villa 14, Palm Meadows, Whitefield, Bangalore, Karnataka - 560066',
      totalAmount: 1199,
      paymentMode: 'CARD',
      status: 'CONFIRMED',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      items: [
        {
          title: 'Traditional Vedic Bilona A2 Desi Cow Ghee (500ml Glass Jar)',
          storeName: 'Krishna Dairy Farms',
          price: 1199,
          quantity: 1,
          imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600&auto=format&fit=crop&q=80'
        }
      ]
    },
    {
      orderNumber: 'ORD-62381-8812',
      customerName: 'Amit Saxena',
      customerEmail: 'amit.saxena@example.com',
      customerPhone: '9898012345',
      shippingAddress: 'Tower B, Flat 804, Cyber City, Gurgaon, Haryana - 122002',
      totalAmount: 28990,
      paymentMode: 'UPI',
      status: 'SHIPPED',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      items: [
        {
          title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
          storeName: 'SuperRetail Mobiles & Tech',
          price: 28990,
          quantity: 1,
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
        }
      ]
    }
  ]);
  const [orderEmailSearch, setOrderEmailSearch] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // 🥛 Country Delight Style Milk & Dairy Subscriptions
  const [isSubscriptionsOpen, setIsSubscriptionsOpen] = useState(false);
  const [milkWalletBalance, setMilkWalletBalance] = useState(60); // ₹20 x 3 returned bottles
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 'SUB-A2-9842',
      productId: 201,
      title: 'Organic A2 Gir Cow Milk (1 Litre, Chilled Glass Bottle)',
      brand: 'Amrit Farms A2',
      frequency: 'Daily (Every Morning)',
      slot: 'Early Morning (6:00 AM - 7:30 AM)',
      dailyQty: 1,
      bottleDeposit: 20,
      pricePerDay: 76, // 10% subscription discount applied
      status: 'ACTIVE', // 'ACTIVE' | 'PAUSED' | 'CANCELLED'
      nextDelivery: 'Tomorrow, by 6:30 AM',
      bottlesReturned: 3,
      startDate: '12 Nov 2026'
    }
  ]);
  const [pdpPurchaseMode, setPdpPurchaseMode] = useState('ONE_TIME'); // 'ONE_TIME' | 'SUBSCRIBE'
  const [subFrequency, setSubFrequency] = useState('DAILY'); // 'DAILY' | 'ALTERNATE' | 'CUSTOM'
  const [subSlot, setSubSlot] = useState('MORNING_6AM');

  // ⭐ Product Reviews State
  const [productReviews, setProductReviews] = useState({
    201: [
      { id: 1, name: 'Sanjay Deshmukh', rating: 5, date: '15 Nov 2026', comment: 'Superb quality pure Gir Cow milk! Natural sweet taste and thick malai layer. Delivers before 6:30 AM sharp in chilled glass bottles.', verified: true },
      { id: 2, name: 'Pooja Agarwal', rating: 5, date: '12 Nov 2026', comment: 'Switched from pouch milk. Purity test certificate matches 100%. Highly recommended for kids and family health.', verified: true }
    ],
    202: [
      { id: 1, name: 'Meenakshi Iyer', rating: 5, date: '11 Nov 2026', comment: 'Authentic Vedic Bilona method Ghee. Granular texture and divine aroma when poured on hot dal and parathas.', verified: true }
    ],
    203: [
      { id: 1, name: 'Kavita Joshi', rating: 5, date: '08 Nov 2026', comment: 'Softest fresh paneer! Melts in the mouth, no rubbery texture like supermarket packs.', verified: true }
    ]
  });
  const [newReviewForm, setNewReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [isAddingReview, setIsAddingReview] = useState(false);

  // 📱 Floating WhatsApp & SMS Notification Alert Simulator
  const [activeAlert, setActiveAlert] = useState(null);
  const triggerSmsAlert = (message, title = '📱 SMS Order Alert') => {
    setActiveAlert({ title, message, time: 'Just now' });
    setTimeout(() => setActiveAlert(null), 6000);
  };

  // UPI QR Code interactive state
  const [upiTimer, setUpiTimer] = useState(300); // 5 min
  const [upiPaidSimulated, setUpiPaidSimulated] = useState(false);

  // Dynamic Cross-Portal Platform State (Coupons & Commission)
  const [coupons, setCoupons] = useState([
    { id: 1, code: 'MEGAFREEDOM', discountType: 'PERCENT', discountValue: 20, maxDiscount: 1500, minOrderAmount: 2499, validUntil: '30 Nov 2026', timesUsed: 428, status: 'ACTIVE' },
    { id: 2, code: 'WELCOME500', discountType: 'FLAT', discountValue: 500, maxDiscount: 500, minOrderAmount: 1999, validUntil: '31 Dec 2026', timesUsed: 1205, status: 'ACTIVE' },
    { id: 3, code: 'FESTIVESALE', discountType: 'PERCENT', discountValue: 15, maxDiscount: 3000, minOrderAmount: 4999, validUntil: '15 Dec 2026', timesUsed: 890, status: 'ACTIVE' }
  ]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCodeInput, setCouponCodeInput] = useState('');

  const [commissionRules, setCommissionRules] = useState([
    { id: 0, categoryName: 'Dairy & Fresh Milk', defaultRate: 6, activeSellers: 18, lastUpdated: 'Today' },
    { id: 1, categoryName: 'Electronics', defaultRate: 8, activeSellers: 14, lastUpdated: '12 Nov 2026' },
    { id: 2, categoryName: 'Fashion & Apparel', defaultRate: 15, activeSellers: 28, lastUpdated: '10 Nov 2026' },
    { id: 3, categoryName: 'Home & Kitchen', defaultRate: 12, activeSellers: 19, lastUpdated: '08 Nov 2026' },
    { id: 4, categoryName: 'Beauty & Personal Care', defaultRate: 10, activeSellers: 12, lastUpdated: '11 Nov 2026' },
    { id: 5, categoryName: 'Books & Stationery', defaultRate: 5, activeSellers: 9, lastUpdated: '05 Nov 2026' }
  ]);

  // Faceted Filter & Sorting States
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price_low' | 'price_high' | 'rating' | 'discount'
  const [priceRange, setPriceRange] = useState('ALL'); // 'ALL' | 'UNDER_2000' | '2000_10000' | 'ABOVE_10000'
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('ALL');

  // View state: 'storefront' | 'seller_hub' | 'admin_panel'
  const [currentView, setCurrentView] = useState('storefront');

  // Role authorization helpers (Flipkart & Amazon architecture)
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';
  const isSeller = currentUser?.role === 'ROLE_SELLER' || currentUser?.role === 'SELLER';
  const isCustomer = currentUser?.role === 'ROLE_CUSTOMER' || currentUser?.role === 'CUSTOMER';

  const handleAddProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    showToast(`Product "${newProduct.title.slice(0, 20)}..." added to store!`);
  };

  const handleUpdateStock = (productId, newStock) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Product deleted from marketplace catalog.');
  };

  const handleEditProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p));
    showToast(`Product "${updatedProduct.title.slice(0, 20)}..." updated successfully!`);
  };

  const handleToggleProductStatus = (productId) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextStatus = p.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
        showToast(`Product status changed to ${nextStatus}!`);
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  const handleUpdateOrderStatus = (orderNumber, newStatus) => {
    setUserOrders(prev => prev.map(o => o.orderNumber === orderNumber ? { ...o, status: newStatus } : o));
    showToast(`Order #${orderNumber} status updated to ${newStatus}!`);
    triggerSmsAlert(`Order #${orderNumber} is now ${newStatus}. Live tracking synced across Buyer & Seller portals.`, '🚚 Shipment Lifecycle Update');
  };

  const handleCreateCategory = (newCat) => {
    setCategories(prev => [...prev, newCat]);
    showToast(`Category "${newCat.name}" added to catalog!`);
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    showToast('Category removed from marketplace.');
  };

  const handleEditCategory = (catId, newName) => {
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, name: newName, slug: newName.toLowerCase().replace(/[^a-z0-9]/g, '-') } : c));
    showToast('Category renamed successfully.');
  };

  const handleUpdateCommission = (ruleId, newRate) => {
    setCommissionRules(prev => prev.map(r => r.id === ruleId ? { ...r, defaultRate: parseInt(newRate) || r.defaultRate } : r));
    showToast('Platform Commission Rule Updated Successfully!');
  };

  const handleAddCoupon = (newCoupon) => {
    setCoupons(prev => [newCoupon, ...prev]);
    showToast(`Coupon "${newCoupon.code}" created!`);
  };

  const handleToggleCoupon = (couponId) => {
    setCoupons(prev => prev.map(c => {
      if (c.id === couponId) {
        const nextStatus = c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        showToast(`Coupon ${c.code} status changed to ${nextStatus}!`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const handleDeleteCoupon = (couponId) => {
    setCoupons(prev => prev.filter(c => c.id !== couponId));
    showToast('Coupon voucher deleted.');
  };

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!code) {
      showToast('Please enter a coupon promo code');
      return;
    }
    const coupon = coupons.find(c => c.code === code && c.status === 'ACTIVE');
    if (!coupon) {
      showToast(`Coupon "${code}" is invalid or expired!`);
      return;
    }
    if (cartSubtotal < coupon.minOrderAmount) {
      showToast(`Minimum order of ₹${coupon.minOrderAmount.toLocaleString()} required for ${code}!`);
      return;
    }
    const discount = coupon.discountType === 'PERCENT' 
      ? Math.min(coupon.maxDiscount, Math.round((cartSubtotal * coupon.discountValue) / 100))
      : coupon.discountValue;
    
    setAppliedCoupon({ ...coupon, calculatedDiscount: discount });
    setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, timesUsed: c.timesUsed + 1 } : c));
    showToast(`Coupon "${coupon.code}" applied! You saved ₹${discount.toLocaleString()} 🎉`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch categories from backend
  useEffect(() => {
    const loadCategories = async () => {
      const data = await productService.getCategories();
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        // Fallback categories
        setCategories([
          { id: 0, name: "Dairy & Fresh Milk", slug: "dairy-fresh-milk" },
          { id: 1, name: "Electronics", slug: "electronics" },
          { id: 2, name: "Fashion & Apparel", slug: "fashion" },
          { id: 3, name: "Home & Kitchen", slug: "home-kitchen" },
          { id: 4, name: "Beauty & Personal Care", slug: "beauty" },
          { id: 5, name: "Books & Stationery", slug: "books" }
        ]);
      }
    };
    loadCategories();

    // Check stored user
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, []);

  // Available unique brands for faceted pills
  const availableBrands = ['ALL', ...Array.from(new Set(products.map(p => p.brand).filter(Boolean)))];

  // Smart multi-keyword, root-stemmed & synonym search matching
  const matchProductSearch = (product, query) => {
    if (!query) return true;
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return true;

    // Combine all searchable text from product
    const searchable = `
      ${product.title || ''} 
      ${product.brand || ''} 
      ${product.categoryName || ''} 
      ${product.description || ''} 
      ${product.storeName || ''}
    `.toLowerCase();

    // 1. Direct substring match
    if (searchable.includes(cleanQuery)) return true;

    // 2. Query words token matching
    const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);
    
    // Synonyms / category aliases
    const synonyms = {
      'electric': ['electronics', 'electronic', 'device', 'gadget', 'charger', 'appliance', 'oneplus', 'sony', 'cooker', 'pot'],
      'electronics': ['electric', 'electronic', 'phone', 'gadget', 'headphone', 'tech', 'oneplus', 'sony'],
      'electronic': ['electronics', 'electric', 'tech', 'gadget', 'device', 'phone'],
      'phone': ['mobile', 'oneplus', 'smartphone', 'electronics', 'device'],
      'mobile': ['phone', 'oneplus', 'smartphone', 'electronics'],
      'headphone': ['sony', 'audio', 'earphone', 'electronics', 'wh-1000xm5'],
      'headphones': ['sony', 'audio', 'earphone', 'electronics', 'wh-1000xm5'],
      'milk': ['dairy', 'cow', 'buffalo', 'fresh', 'doodh', 'a2', 'gir'],
      'dairy': ['milk', 'ghee', 'paneer', 'dahi', 'curd', 'butter', 'makkhan', 'mawa'],
      'dahi': ['curd', 'probiotic', 'dairy', 'yogurt'],
      'curd': ['dahi', 'probiotic', 'dairy', 'yogurt'],
      'ghee': ['bilona', 'desi', 'dairy', 'vedic'],
      'paneer': ['cottage', 'cheese', 'dairy', 'malai'],
      'shoe': ['shoes', 'sneakers', 'running', 'nike', 'footwear', 'fashion'],
      'shoes': ['shoe', 'sneakers', 'running', 'nike', 'footwear', 'fashion'],
      'cloth': ['clothes', 'fashion', 'apparel', 'jacket', 'denim', 'wear'],
      'clothes': ['fashion', 'apparel', 'jacket', 'denim', 'wear'],
      'dress': ['fashion', 'apparel', 'cloth', 'clothes'],
      'jacket': ['denim', 'fashion', 'apparel', 'roadster', 'cloth'],
      'book': ['books', 'stationery', 'atomic', 'habits', 'reading'],
      'books': ['book', 'stationery', 'atomic', 'habits', 'reading'],
      'pot': ['cooker', 'instant', 'kitchen', 'home', 'appliances', 'electric']
    };

    // Check if every token matches via substring, stem, or synonym
    return queryTokens.every(token => {
      if (searchable.includes(token)) return true;
      if (token.length >= 4) {
        const root4 = token.slice(0, 4); // "elec", "dair", "fash"
        if (searchable.includes(root4)) return true;
        const root5 = token.slice(0, 5); // "elect"
        if (searchable.includes(root5)) return true;
      }
      const aliasList = synonyms[token] || [];
      return aliasList.some(alias => searchable.includes(alias));
    });
  };

  // Dynamic Filter & Sort Products
  const filteredProducts = products.filter(p => {
    const q = searchQuery ? searchQuery.trim().toLowerCase() : '';
    // If user has typed in search bar, search across all categories globally
    const matchesCat = q ? true : (selectedCategory ? (p.categoryName === selectedCategory || p.categoryId === selectedCategory) : true);
    const matchesSearch = matchProductSearch(p, q);
    const matchesStock = inStockOnly ? ((p.stock !== undefined ? p.stock : 25) > 0) : true;
    const matchesBrand = selectedBrand === 'ALL' ? true : p.brand === selectedBrand;
    
    let matchesPrice = true;
    if (priceRange === 'UNDER_2000') matchesPrice = p.basePrice < 2000;
    else if (priceRange === '2000_10000') matchesPrice = p.basePrice >= 2000 && p.basePrice <= 10000;
    else if (priceRange === 'ABOVE_10000') matchesPrice = p.basePrice > 10000;

    return matchesCat && matchesSearch && matchesStock && matchesBrand && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price_low') return a.basePrice - b.basePrice;
    if (sortBy === 'price_high') return b.basePrice - a.basePrice;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'discount') {
      const discA = parseInt(a.discount) || 0;
      const discB = parseInt(b.discount) || 0;
      return discB - discA;
    }
    return b.id - a.id; // featured / latest
  });

  const addToCart = (product) => {
    const currentStock = product.stock !== undefined ? product.stock : 25;
    if (currentStock <= 0) {
      showToast(`Sorry, "${product.title.slice(0, 20)}..." is currently Out of Stock!`);
      return;
    }
    const existingInCart = cart.find(item => item.id === product.id);
    const existingQty = existingInCart ? existingInCart.qty : 0;
    
    if (existingQty + 1 > currentStock) {
      showToast(`Cannot add more. Only ${currentStock} units available in stock!`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`Added "${product.title.slice(0, 25)}..." to cart!`);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const prod = products.find(p => p.id === id);
        const stockLimit = prod && prod.stock !== undefined ? prod.stock : 25;
        const newQty = item.qty + delta;
        if (delta > 0 && newQty > stockLimit) {
          showToast(`Maximum stock limit of ${stockLimit} units reached!`);
          return item;
        }
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.basePrice * item.qty), 0);
  const couponDiscountAmount = appliedCoupon ? appliedCoupon.calculatedDiscount : 0;
  const cartTotal = Math.max(0, cartSubtotal - couponDiscountAmount);
  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      if (authTab === 'login') {
        let userData = null;
        try {
          const res = await authService.login(formData.email, formData.password);
          if (res.success && res.data) {
            userData = res.data;
          }
        } catch (backendErr) {
          console.warn("Backend auth failed or offline, checking local/demo credentials...", backendErr);
          const emailLower = formData.email.toLowerCase();
          if (emailLower.includes('admin')) {
            userData = { name: 'Super Admin', email: formData.email, role: 'ROLE_ADMIN', token: 'mock-admin-token' };
          } else if (emailLower.includes('seller') || emailLower.includes('dairy') || emailLower.includes('store')) {
            userData = { name: 'Krishna Dairy Merchant', email: formData.email, role: 'ROLE_SELLER', token: 'mock-seller-token' };
          } else {
            userData = { name: formData.email.split('@')[0], email: formData.email, role: 'ROLE_CUSTOMER', token: 'mock-customer-token' };
          }
        }

        if (userData) {
          localStorage.setItem('token', userData.token || 'demo-token');
          localStorage.setItem('user', JSON.stringify(userData));
          setCurrentUser(userData);
          setIsAuthOpen(false);
          showToast(`Welcome back, ${userData.name}!`);

          // Role-based Auto-Routing
          if (userData.role === 'ROLE_ADMIN') {
            setCurrentView('admin_panel');
          } else if (userData.role === 'ROLE_SELLER') {
            setCurrentView('seller_hub');
          } else {
            setCurrentView('storefront');
          }
        }
      } else {
        const isSeller = authTab === 'seller';
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: isSeller ? 'ROLE_SELLER' : 'ROLE_CUSTOMER',
          storeName: formData.storeName,
          gstNumber: formData.gstNumber
        };
        try {
          const res = await authService.register(payload);
          if (res.success && res.data) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            setCurrentUser(res.data);
            setIsAuthOpen(false);
            showToast(`Registration successful as ${isSeller ? 'Seller' : 'Customer'}!`);
            if (isSeller) {
              setCurrentView('seller_hub');
            } else {
              setCurrentView('storefront');
            }
            return;
          }
        } catch (regErr) {
          const fallbackUser = {
            name: formData.name || (isSeller ? 'Merchant Store' : 'Valued Customer'),
            email: formData.email,
            role: isSeller ? 'ROLE_SELLER' : 'ROLE_CUSTOMER',
            token: 'mock-registered-token'
          };
          localStorage.setItem('token', fallbackUser.token);
          localStorage.setItem('user', JSON.stringify(fallbackUser));
          setCurrentUser(fallbackUser);
          setIsAuthOpen(false);
          showToast(`Account created as ${isSeller ? 'Seller' : 'Customer'}!`);
          if (isSeller) {
            setCurrentView('seller_hub');
          } else {
            setCurrentView('storefront');
          }
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Authentication error.');
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      showToast('Please enter a valid email address.');
      return;
    }
    setIsForgotLoading(true);
    try {
      const res = await authService.forgotPassword(forgotEmail);
      setIsForgotLoading(false);
      const generatedOtp = res.data?.otp || '123456';
      setOtpDebugInfo(generatedOtp);
      setForgotStep('otp');
      showToast(`Verification OTP sent to ${forgotEmail}`);
    } catch (err) {
      console.warn("Backend forgot-password error, using demo OTP:", err);
      setIsForgotLoading(false);
      // Fallback demo OTP for seamless offline testing
      const fallbackOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOtpDebugInfo(fallbackOtp);
      setForgotStep('otp');
      showToast(`Demo OTP generated: ${fallbackOtp}`);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotOtp) {
      showToast('Please enter the 6-digit OTP code.');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match! Please check again.');
      return;
    }
    setIsForgotLoading(true);
    try {
      await authService.resetPassword(forgotEmail, forgotOtp, newPassword);
      setIsForgotLoading(false);
      showToast('🎉 Password reset successful! Sign in with your new password.');
      setFormData(prev => ({ ...prev, email: forgotEmail, password: newPassword }));
      setAuthTab('login');
      setForgotStep('email');
      setForgotOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setOtpDebugInfo('');
    } catch (err) {
      console.warn("Backend reset error, checking fallback:", err);
      setIsForgotLoading(false);
      if (forgotOtp === otpDebugInfo || forgotOtp === '123456') {
        showToast('🎉 Password updated successfully! Please sign in now.');
        setFormData(prev => ({ ...prev, email: forgotEmail, password: newPassword }));
        setAuthTab('login');
        setForgotStep('email');
        setForgotOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setOtpDebugInfo('');
      } else {
        showToast(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
      }
    }
  };

  const handleQuickDemoLogin = (role) => {
    let demoUser = null;
    if (role === 'ADMIN') {
      demoUser = { name: 'Super Admin', email: 'admin@ecommerce.com', role: 'ROLE_ADMIN', token: 'demo-admin-token' };
    } else if (role === 'SELLER') {
      demoUser = { name: 'Krishna Dairy Merchant', email: 'seller@krishnadairy.in', role: 'ROLE_SELLER', token: 'demo-seller-token' };
    } else {
      demoUser = { name: 'Rahul Sharma', email: 'rahul.sharma@example.com', role: 'ROLE_CUSTOMER', token: 'demo-customer-token' };
    }
    localStorage.setItem('token', demoUser.token);
    localStorage.setItem('user', JSON.stringify(demoUser));
    setCurrentUser(demoUser);
    setIsAuthOpen(false);
    showToast(`Logged in as ${demoUser.name} (${demoUser.role.replace('ROLE_', '')})`);
    if (demoUser.role === 'ROLE_ADMIN') {
      setCurrentView('admin_panel');
    } else if (demoUser.role === 'ROLE_SELLER') {
      setCurrentView('seller_hub');
    } else {
      setCurrentView('storefront');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setCurrentView('storefront');
    showToast('Logged out successfully.');
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty!');
      return;
    }
    setCheckoutForm(prev => ({
      ...prev,
      customerName: currentUser?.name || prev.customerName || 'Rahul Sharma',
      customerEmail: currentUser?.email || prev.customerEmail || 'rahul@example.com',
      customerPhone: currentUser?.phone || prev.customerPhone || '9876543210',
      shippingAddress: prev.shippingAddress || 'Flat 402, Green Valley Heights, Andheri West'
    }));
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsSubmittingOrder(true);

    try {
      const itemsPayload = cart.map(item => ({
        productId: item.id > 1000 ? item.id : null,
        variantId: null,
        title: item.title,
        sku: item.sku || `SKU-${item.id}`,
        storeName: item.storeName || 'Verified Merchant',
        price: item.basePrice,
        quantity: item.qty
      }));

      const checkoutPayload = {
        userId: currentUser?.userId || null,
        customerName: checkoutForm.customerName,
        customerEmail: checkoutForm.customerEmail,
        customerPhone: checkoutForm.customerPhone,
        shippingAddress: checkoutForm.shippingAddress,
        city: checkoutForm.city,
        state: checkoutForm.state,
        pincode: checkoutForm.pincode,
        paymentMode: checkoutForm.paymentMode,
        items: itemsPayload
      };

      const res = await orderService.checkout(checkoutPayload);
      if (res.success && res.data) {
        setOrderSuccess(res.data);
        setUserOrders(prev => [res.data, ...prev]);
        
        // Deduct stock in products dynamically
        setProducts(prevProducts => prevProducts.map(p => {
          const cartItem = cart.find(c => c.id === p.id);
          if (cartItem) {
            const currentStock = p.stock !== undefined ? p.stock : 25;
            return { ...p, stock: Math.max(0, currentStock - cartItem.qty) };
          }
          return p;
        }));

        setCart([]);
        setAppliedCoupon(null);
        setIsCheckoutOpen(false);
        showToast(`Order Placed! Order ID: ${res.data.orderNumber}`);
      }
    } catch (err) {
      console.error('Order error:', err);
      const fallbackOrder = {
        orderNumber: `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: checkoutForm.customerName,
        customerEmail: checkoutForm.customerEmail,
        customerPhone: checkoutForm.customerPhone,
        shippingAddress: `${checkoutForm.shippingAddress}, ${checkoutForm.city}, ${checkoutForm.state} - ${checkoutForm.pincode}`,
        totalAmount: cartTotal,
        paymentMode: checkoutForm.paymentMode,
        status: 'PLACED',
        createdAt: new Date().toISOString(),
        items: cart.map(c => ({
          title: c.title,
          storeName: c.storeName,
          price: c.basePrice,
          quantity: c.qty,
          imageUrl: c.imageUrl
        }))
      };
      setOrderSuccess(fallbackOrder);
      setUserOrders(prev => [fallbackOrder, ...prev]);

      // Deduct stock in products dynamically
      setProducts(prevProducts => prevProducts.map(p => {
        const cartItem = cart.find(c => c.id === p.id);
        if (cartItem) {
          const currentStock = p.stock !== undefined ? p.stock : 25;
          return { ...p, stock: Math.max(0, currentStock - cartItem.qty) };
        }
        return p;
      }));

      setCart([]);
      setAppliedCoupon(null);
      setIsCheckoutOpen(false);
      showToast('Order Placed Successfully!');
      triggerSmsAlert(
        `Dear ${checkoutForm.customerName}, your Order #${fallbackOrder.orderNumber} of ₹${cartTotal.toLocaleString()} has been placed successfully! Estimated delivery tomorrow by 6:00 AM.`,
        '📱 Order Confirmation SMS'
      );
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // 🥛 Milk & Dairy Subscription Handlers (Country Delight style)
  const handleStartSubscription = (product) => {
    const discountedPrice = Math.round(product.basePrice * 0.90);
    const newSub = {
      id: `SUB-${product.categoryName?.includes('Dairy') ? 'DAIRY' : 'PROD'}-${Math.floor(1000 + Math.random() * 9000)}`,
      productId: product.id,
      title: product.title,
      brand: product.brand,
      frequency: subFrequency === 'DAILY' ? 'Daily (Every Morning)' : subFrequency === 'ALTERNATE' ? 'Alternate Days' : 'Mon, Wed, Fri',
      slot: subSlot === 'MORNING_6AM' ? 'Early Morning (6:00 AM - 7:30 AM)' : 'Evening (5:00 PM - 7:00 PM)',
      dailyQty: 1,
      bottleDeposit: product.categoryName?.includes('Dairy') ? 20 : 0,
      pricePerDay: discountedPrice,
      status: 'ACTIVE',
      nextDelivery: 'Tomorrow, by 6:30 AM (Cold-chain Chilled)',
      bottlesReturned: 0,
      startDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setSubscriptions(prev => [newSub, ...prev]);
    setSelectedProduct(null);
    setIsSubscriptionsOpen(true);
    showToast(`🎉 Subscription Started! 10% daily discount applied.`);
    triggerSmsAlert(
      `🥛 Daily Subscription Activated! ${newSub.title.slice(0, 32)}... will be delivered tomorrow morning by 6:30 AM.`,
      '📱 Milk Subscription Alert'
    );
  };

  const handleTogglePauseSubscription = (subId) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === subId) {
        const nextStatus = s.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        showToast(nextStatus === 'PAUSED' ? 'Subscription Paused (Vacation Mode)' : 'Subscription Resumed!');
        triggerSmsAlert(
          nextStatus === 'PAUSED' 
            ? `⏸️ Milk delivery paused for ${s.id}. Deliveries suspended until you resume.` 
            : `▶️ Milk delivery resumed for ${s.id}. Delivery scheduled for tomorrow 6:00 AM.`,
          '📱 Subscription Status'
        );
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const handleReturnBottles = (count = 1) => {
    const refund = count * 20;
    setMilkWalletBalance(prev => prev + refund);
    showToast(`🎉 ${count} Glass Bottle(s) Returned! ₹${refund} credited to your Milk Wallet.`);
    triggerSmsAlert(
      `🥛 Eco-Return Confirmed! ₹${refund} credited to your MegaStore Wallet for returning ${count} empty glass bottle(s). Current Wallet Balance: ₹${milkWalletBalance + refund}`,
      '💰 Wallet Cashback Alert'
    );
  };

  const handleCancelSubscription = (subId) => {
    if (!window.confirm('Are you sure you want to cancel this milk subscription?')) return;
    setSubscriptions(prev => prev.filter(s => s.id !== subId));
    showToast('Subscription cancelled.');
    triggerSmsAlert(`Milk subscription ${subId} has been cancelled.`, '🥛 Subscription Cancellation');
  };

  const handleUpdateSubFrequency = (subId, newFrequency) => {
    setSubscriptions(prev => prev.map(s => s.id === subId ? { ...s, frequency: newFrequency } : s));
    showToast(`Delivery frequency updated to ${newFrequency}!`);
  };

  // ⭐ Product Review Submission Handler
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewForm.name || !newReviewForm.comment) {
      showToast('Please fill your name and review comment');
      return;
    }
    const productId = selectedProduct?.id;
    if (!productId) return;

    const reviewObj = {
      id: Date.now(),
      name: newReviewForm.name,
      rating: parseInt(newReviewForm.rating) || 5,
      date: 'Today',
      comment: newReviewForm.comment,
      verified: true
    };

    setProductReviews(prev => ({
      ...prev,
      [productId]: [reviewObj, ...(prev[productId] || [])]
    }));

    setNewReviewForm({ name: '', rating: 5, comment: '' });
    setIsAddingReview(false);
    showToast('⭐ Thank you! Your review has been published.');
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      showToast(exists ? 'Removed from Wishlist' : 'Saved to Wishlist / Saved For Later! ❤️');
      return updated;
    });
  };

  const checkPincodeDelivery = (code) => {
    if (!code || code.trim().length !== 6 || isNaN(code)) {
      showToast('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    const isMetro = ['11', '40', '56', '70', '60', '50'].some(prefix => code.startsWith(prefix));
    const targetDate = new Date(Date.now() + (isMetro ? 86400000 : 172800000));
    const formattedDate = targetDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

    setPincodeStatus({
      checked: true,
      deliveryDate: `${formattedDate}, by 2:00 PM (${isMetro ? 'Express Prime' : 'Standard Courier'})`
    });
    showToast(`Delivery available for PIN ${code}!`);
  };

  const handleBuyNow = (product) => {
    addToCart(product);
    setSelectedProduct(null);
    handleProceedToCheckout();
  };

  const handleOpenOrders = async () => {
    const emailToFetch = currentUser?.email || checkoutForm.customerEmail || 'rahul@example.com';
    setOrderEmailSearch(emailToFetch);
    setIsOrdersOpen(true);
    try {
      const orders = await orderService.getOrdersByEmail(emailToFetch);
      if (orders && orders.length > 0) {
        setUserOrders(orders);
      }
    } catch (err) {
      console.warn('Orders fetch error:', err);
    }
  };

  const handleSearchOrders = async (e) => {
    e.preventDefault();
    if (!orderEmailSearch) return;
    try {
      const orders = await orderService.getOrdersByEmail(orderEmailSearch);
      if (orders && orders.length > 0) {
        setUserOrders(orders);
        showToast(`Found ${orders.length} order(s) for ${orderEmailSearch}`);
      } else {
        showToast('No orders found for this email address.');
      }
    } catch (err) {
      showToast('Error finding orders.');
    }
  };

  const handleCancelOrder = async (orderNumber) => {
    if (!window.confirm(`Are you sure you want to cancel order ${orderNumber}?`)) return;
    
    // Restore inventory stock dynamically
    const orderToCancel = userOrders.find(o => o.orderNumber === orderNumber);
    if (orderToCancel && orderToCancel.items) {
      setProducts(prevProducts => prevProducts.map(p => {
        const matchedItem = orderToCancel.items.find(it => it.title === p.title);
        if (matchedItem) {
          const currentStock = p.stock !== undefined ? p.stock : 25;
          return { ...p, stock: currentStock + (matchedItem.quantity || 1) };
        }
        return p;
      }));
    }

    try {
      const res = await orderService.cancelOrder(orderNumber);
      if (res.success) {
        showToast(`Order ${orderNumber} cancelled successfully!`);
        setUserOrders(prev => prev.map(o => o.orderNumber === orderNumber ? { ...o, status: 'CANCELLED' } : o));
      }
    } catch (err) {
      // If backend mock or error, update local state
      setUserOrders(prev => prev.map(o => o.orderNumber === orderNumber ? { ...o, status: 'CANCELLED' } : o));
      showToast(`Order ${orderNumber} cancelled successfully.`);
    }
  };

  // Render Box 2: Seller / Vendor Hub Portal
  if (currentView === 'seller_hub') {
    // Gatekeeper: If user is not Seller or Admin, require merchant registration / login
    if (!isAdmin && !isSeller) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
          <div className="bg-slate-900 border border-amber-500/30 p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20">
              <Store className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-100">Seller Central Hub</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              This dashboard is restricted to verified marketplace sellers. Customer accounts cannot access merchant inventory controls, pricing edits, or bank payout ledgers.
            </p>
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => { setAuthTab('seller'); setIsAuthOpen(true); setCurrentView('storefront'); }}
                className="w-full bg-[#f08804] hover:bg-[#d87a04] text-white py-3 rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
              >
                🏪 Register as Merchant / Sign In as Seller
              </button>
              <button
                onClick={() => handleQuickDemoLogin('SELLER')}
                className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-[#febd69] border border-amber-500/30 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                ⚡ 1-Click Demo Login as Krishna Dairy Seller
              </button>
              <button
                onClick={() => setCurrentView('storefront')}
                className="w-full text-slate-400 hover:text-white py-1.5 text-xs font-semibold cursor-pointer"
              >
                ← Return to Buyer Storefront
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <SellerHub 
        onBackToStore={() => setCurrentView('storefront')}
        onOpenAdmin={() => setCurrentView('admin_panel')}
        categories={categories}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateStock={handleUpdateStock}
        onDeleteProduct={handleDeleteProduct}
        onEditProduct={handleEditProduct}
        onToggleProductStatus={handleToggleProductStatus}
        orders={userOrders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        commissionRules={commissionRules}
        showToast={showToast}
        currentUser={currentUser}
        isAdmin={isAdmin}
      />
    );
  }

  // Render Box 3: Super Admin Control Tower
  if (currentView === 'admin_panel') {
    // Gatekeeper: Strictly restricted to Super Admin
    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
          <div className="bg-slate-900 border border-purple-500/30 p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-100">Super Admin Control Tower</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Confidential Area. Only platform super administrators have clearance to view financial GMV charts, approve merchant KYC licenses, and disburse vendor escrow settlements.
            </p>
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => handleQuickDemoLogin('ADMIN')}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 rounded-xl font-black text-xs shadow-lg transition cursor-pointer"
              >
                👑 1-Click Authenticate as Super Admin
              </button>
              <button
                onClick={() => setCurrentView('storefront')}
                className="w-full text-slate-400 hover:text-white py-1.5 text-xs font-semibold cursor-pointer"
              >
                ← Return to Buyer Storefront
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <AdminPanel 
        onBackToStore={() => setCurrentView('storefront')}
        onOpenSellerHub={() => setCurrentView('seller_hub')}
        categories={categories}
        onAddCategory={handleCreateCategory}
        onDeleteCategory={handleDeleteCategory}
        onEditCategory={handleEditCategory}
        products={products}
        onDeleteProduct={handleDeleteProduct}
        onEditProduct={handleEditProduct}
        orders={userOrders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        commissionRules={commissionRules}
        onUpdateCommission={handleUpdateCommission}
        coupons={coupons}
        onAddCoupon={handleAddCoupon}
        onToggleCoupon={handleToggleCoupon}
        onDeleteCoupon={handleDeleteCoupon}
        showToast={showToast}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-slate-700 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: Amazon / Flipkart Style Responsive Navigation */}
      <header className="sticky top-0 z-40 bg-[#131921] text-white shadow-md">
        {/* ROW 1: Logo + Desktop Search + Action Icons */}
        <div className="w-full px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 lg:gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0" onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}>
            <div className="bg-[#f08804] text-slate-950 px-2.5 py-1.5 rounded-lg font-black tracking-tighter text-lg sm:text-xl flex items-center gap-1 shadow">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>MEGASTORE</span>
            </div>
            <div className="hidden 2xl:block text-[9px] text-gray-400 font-semibold tracking-wider uppercase leading-tight">
              Multi-Vendor<br/><span className="text-[#febd69]">Marketplace</span>
            </div>
          </div>

          {/* Delivery Location Widget (visible on 2xl+ screens only to keep header spacious) */}
          <div className="hidden 2xl:flex items-center text-xs text-gray-300 hover:text-white cursor-pointer px-2 py-1 rounded border border-transparent hover:border-gray-600 shrink-0">
            <MapPin className="w-4 h-4 mr-1 text-[#f08804]" />
            <div>
              <p className="text-[10px] text-gray-400">Deliver to</p>
              <p className="font-bold text-white whitespace-nowrap">Mumbai 400001</p>
            </div>
          </div>

          {/* DESKTOP SEARCH BAR (visible on tablet/desktop md+, guaranteed generous width) */}
          <div className="hidden md:flex flex-1 min-w-[260px] lg:min-w-[340px] xl:min-w-[420px] max-w-2xl mx-1 sm:mx-2 lg:mx-4 items-center">
            <div className="w-full h-10 flex items-stretch rounded-lg overflow-hidden bg-white shadow-sm border-2 border-transparent focus-within:border-[#febd69] focus-within:ring-2 focus-within:ring-[#febd69]/40 transition">
              <div className="flex-1 relative flex items-center">
                <input 
                  type="text"
                  placeholder="Search products, brands, electronics, milk, fashion..."
                  className="w-full h-full pl-3.5 pr-10 text-xs sm:text-sm text-gray-900 bg-transparent focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 text-gray-400 hover:text-gray-700 p-1 rounded-full cursor-pointer transition"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button 
                type="button"
                className="bg-[#febd69] hover:bg-[#f3a847] text-slate-950 px-4 sm:px-5 flex items-center justify-center transition cursor-pointer font-bold shrink-0"
                title="Search"
              >
                <Search className="w-4.5 h-4.5 font-bold" />
              </button>
            </div>
          </div>

          {/* Right Header Navigation Icons */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 lg:space-x-3 text-sm shrink-0">
            
            {/* Super Admin Control: Admin sees Admin Tower + Seller Hub */}
            {isAdmin && (
              <div className="flex items-center gap-1.5 shrink-0">
                <button 
                  onClick={() => setCurrentView('admin_panel')}
                  className="flex items-center space-x-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold transition shadow-md ring-1 ring-purple-400/50 cursor-pointer active:scale-95 shrink-0"
                  title="Open Super Admin Control Tower"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span className="hidden xl:inline">Admin Tower</span>
                  <span className="xl:hidden">Admin</span>
                  <span>👑</span>
                </button>
                <button 
                  onClick={() => setCurrentView('seller_hub')}
                  className="hidden sm:flex items-center space-x-1 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold transition shadow cursor-pointer active:scale-95 shrink-0"
                  title="Inspect Seller Central Hub"
                >
                  <Store className="w-3.5 h-3.5 text-slate-950" />
                  <span className="hidden xl:inline">Seller Hub</span>
                  <span className="xl:hidden">Seller</span>
                  <span>🏪</span>
                </button>
              </div>
            )}

            {/* Seller Control: Seller only sees Seller Hub */}
            {isSeller && !isAdmin && (
              <button 
                onClick={() => setCurrentView('seller_hub')}
                className="flex items-center space-x-1 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 px-2.5 py-1.5 rounded-lg text-xs font-bold transition shadow cursor-pointer active:scale-95 shrink-0"
                title="Open Seller Central Hub"
              >
                <Store className="w-3.5 h-3.5 text-slate-950" />
                <span className="hidden sm:inline">Seller Hub</span>
                <span>🏪</span>
              </button>
            )}

            {/* Customer & Guest: Flipkart/Amazon style Become a Seller button */}
            {!isAdmin && !isSeller && (
              <button 
                onClick={() => { setAuthTab('seller'); setIsAuthOpen(true); }}
                className="hidden xl:flex items-center space-x-1.5 text-xs text-slate-200 hover:text-[#febd69] px-2.5 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition cursor-pointer shrink-0"
                title="Become a Seller on MegaStore"
              >
                <Store className="w-3.5 h-3.5 text-[#febd69]" />
                <span className="font-semibold text-xs">Become a Seller</span>
              </button>
            )}

            {/* Account / User Menu */}
            {currentUser ? (
              <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
                <div className="text-right text-xs">
                  <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider border ${
                    isAdmin 
                      ? 'bg-purple-950 text-purple-300 border-purple-700' 
                      : isSeller 
                      ? 'bg-amber-950 text-[#febd69] border-amber-700' 
                      : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  }`}>
                    {currentUser.role?.replace('ROLE_', '')}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-[11px] bg-red-900/60 hover:bg-red-800 text-red-200 px-2 py-1 rounded font-semibold cursor-pointer shrink-0"
                  title="Log out"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { setAuthTab('login'); setIsAuthOpen(true); }}
                className="flex items-center space-x-1 hover:text-[#febd69] cursor-pointer px-1 py-1 shrink-0"
                title="Sign in to your account"
              >
                <User className="w-5 h-5 text-gray-300" />
                <div className="text-left hidden sm:block text-xs leading-tight">
                  <p className="text-gray-400 text-[10px]">Hello, Sign in</p>
                  <p className="font-bold">Account</p>
                </div>
              </button>
            )}

            {/* Returns & Orders (Amazon Style) */}
            <button 
              onClick={handleOpenOrders}
              className="hidden 2xl:flex flex-col text-left px-2 py-1 rounded hover:border hover:border-gray-600 text-xs cursor-pointer text-gray-200 hover:text-white leading-tight shrink-0"
            >
              <span className="text-[10px] text-gray-400">Returns</span>
              <span className="font-bold text-white">&amp; Orders</span>
            </button>

            {/* Milk & Dairy Subscriptions Button (Country Delight Model) */}
            <button 
              onClick={() => setIsSubscriptionsOpen(true)}
              className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 text-xs cursor-pointer hover:border-emerald-400 transition active:scale-95 shrink-0"
              title="Manage Daily Milk & Grocery Subscriptions"
            >
              <span className="text-sm">🥛</span>
              <span className="text-emerald-400 font-bold text-xs hidden lg:inline">Subscriptions</span>
              <span className="bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.2 rounded-full ml-0.5">
                {subscriptions.filter(s => s.status === 'ACTIVE').length}
              </span>
            </button>

            {/* Shopping Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center bg-gradient-to-r from-[#ffd814] to-[#febd69] hover:from-[#f7ca00] hover:to-[#f3a847] text-slate-950 font-extrabold px-3 sm:px-4 py-1.5 rounded-lg relative cursor-pointer shadow-md transition transform active:scale-95 border border-amber-400 shrink-0"
            >
              <span className="text-xs sm:text-sm font-black tracking-wide">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-black text-[10px] sm:text-xs w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-[#131921] animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ROW 2: MOBILE FULL-WIDTH SEARCH BAR (visible only on mobile phones) */}
        <div className="md:hidden px-3 pb-2.5 pt-0.5">
          <div className="w-full h-10 flex items-stretch rounded-lg overflow-hidden bg-white shadow-sm border border-amber-300 focus-within:ring-2 focus-within:ring-[#febd69]">
            <div className="flex-1 relative flex items-center">
              <input 
                type="text"
                placeholder="Search products, brands, milk, electronics..."
                className="w-full h-full pl-3.5 pr-8 text-xs text-gray-900 bg-transparent focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-gray-400 hover:text-gray-700 p-1 rounded-full cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button 
              type="button"
              className="bg-[#febd69] hover:bg-[#f3a847] text-slate-950 px-4 flex items-center justify-center font-bold shrink-0 cursor-pointer active:scale-95"
              title="Search"
            >
              <Search className="w-4 h-4 font-bold" />
            </button>
          </div>
        </div>

        {/* CATEGORY RIBBON BAR (Amazon / Flipkart style horizontal row with icons) */}
        <div className="bg-[#232f3e] border-t border-gray-700 text-xs px-4 py-2 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center space-x-6 min-w-max">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`font-semibold hover:text-[#febd69] transition flex items-center gap-1.5 ${!selectedCategory ? 'text-[#febd69] border-b-2 border-[#febd69] pb-0.5' : 'text-gray-200'}`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>All Stores</span>
            </button>
            {categories.map(c => {
              const categoryLogos = {
                "Dairy & Fresh Milk": "🥛",
                "Electronics": "📱",
                "Fashion & Apparel": "👗",
                "Home & Kitchen": "🍳",
                "Beauty & Personal Care": "💄",
                "Books & Stationery": "📚"
              };
              const icon = categoryLogos[c.name] || "📦";
              return (
                <button 
                  key={c.id}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`hover:text-[#febd69] transition font-medium flex items-center gap-1.5 ${selectedCategory === c.name ? 'text-[#febd69] border-b-2 border-[#febd69] pb-0.5' : 'text-gray-300'}`}
                >
                  <span className="text-sm">{icon}</span>
                  <span>{c.name}</span>
                </button>
              );
            })}
            <span className="text-gray-500">|</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Escrow Verified Vendors
            </span>
          </div>
        </div>
      </header>

      {/* HERO BANNER SECTION (Festival Sale Pitch) */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-6 sm:py-10 px-4 shadow-inner relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold mb-3 tracking-wide uppercase">
              <Zap className="w-3.5 h-3.5" /> Great India Freedom Sale Live
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Up to <span className="text-[#febd69]">70% OFF</span> on Top Multi-Vendor Brands
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-300 mt-2">
              Electronics, Fashion, Appliances &amp; Home Essentials shipped directly from verified merchants.
            </p>
            <div className="mt-4 sm:mt-5 flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
              <button 
                onClick={() => setSelectedCategory("Dairy & Fresh Milk")}
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm transition shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
              >
                🥛 Fresh Milk Hub <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setSelectedCategory("Electronics")}
                className="bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm transition shadow-lg flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                Shop Electronics <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {/* Super Admin Control: sees Admin Tower & Seller Hub */}
              {isAdmin && (
                <>
                  <button 
                    onClick={() => setCurrentView('admin_panel')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/50 font-bold px-4 py-2.5 rounded-lg text-sm transition flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95"
                  >
                    <ShieldCheck className="w-4 h-4 text-indigo-200" /> Admin Control Tower 👑
                  </button>
                  <button 
                    onClick={() => setCurrentView('seller_hub')}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-4 py-2.5 rounded-lg text-sm transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Store className="w-4 h-4 text-amber-300" /> Seller Hub 🏪
                  </button>
                </>
              )}

              {/* Seller: only sees Seller Hub */}
              {isSeller && !isAdmin && (
                <button 
                  onClick={() => setCurrentView('seller_hub')}
                  className="bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-bold px-4 py-2.5 rounded-lg text-sm transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
                >
                  <Store className="w-4 h-4 text-slate-950" /> Seller Hub 🏪
                </button>
              )}

              {/* Customer & Guest: Flipkart/Amazon style Become a Seller */}
              {!isAdmin && !isSeller && (
                <button 
                  onClick={() => { setAuthTab('seller'); setIsAuthOpen(true); }}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-4 py-2.5 rounded-lg text-sm transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Store className="w-4 h-4 text-amber-300" /> Become a Seller 🏪
                </button>
              )}
            </div>
          </div>

          {/* Trending Deal Spotlight Card (Amazon / Flipkart Style) */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl max-w-sm w-full text-xs space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="bg-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                Deal of the Day
              </span>
              <span className="text-[11px] text-yellow-300 font-semibold">Ends in 05h : 24m</span>
            </div>
            <div className="bg-black/30 p-3 rounded-xl flex items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&auto=format&fit=crop&q=80" 
                alt="Deal" 
                className="w-16 h-16 object-cover rounded-lg bg-white p-1"
              />
              <div>
                <p className="font-bold text-white text-xs line-clamp-1">OnePlus 12 5G (Flagship)</p>
                <p className="text-yellow-400 font-extrabold text-sm mt-0.5">₹64,999 <span className="text-gray-400 text-xs line-through font-normal">₹69,999</span></p>
                <p className="text-[10px] text-emerald-400 font-semibold">Free Express Delivery Today</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedCategory("Electronics")}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-black py-2 rounded-lg text-xs transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Grab This Deal <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* TRUST BADGES BAR */}
      <div className="bg-white border-b border-gray-200 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center space-x-2 text-gray-700">
            <Truck className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-bold">Free &amp; Fast Delivery</p>
              <p className="text-gray-500 text-[11px]">On orders over ₹499</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-700">
            <RefreshCw className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="font-bold">7-Day Replacement</p>
              <p className="text-gray-500 text-[11px]">Hassle-free return policy</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-700">
            <Lock className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-bold">100% Escrow Protection</p>
              <p className="text-gray-500 text-[11px]">Funds held until delivery</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-700">
            <Store className="w-5 h-5 text-purple-600" />
            <div>
              <p className="font-bold">Verified Independent Sellers</p>
              <p className="text-gray-500 text-[11px]">GST &amp; KYC audited merchants</p>
            </div>
          </div>
        </div>
      </div>

      {/* AMAZON / FLIPKART STYLE CATEGORY LOGOS / ICONS BAR (Touch-scrollable on mobile) */}
      <div className="bg-white border-b border-gray-200 py-2.5 sm:py-3.5 shadow-xs overflow-x-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-start sm:justify-between gap-2 sm:gap-3 min-w-max">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex flex-col items-center gap-1 p-1.5 sm:p-2 rounded-xl transition min-w-[65px] sm:min-w-[76px] cursor-pointer ${!selectedCategory ? 'bg-amber-50 border border-amber-300 shadow-sm' : 'hover:bg-gray-50'}`}
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl shadow-xs ${!selectedCategory ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
              ⚡
            </div>
            <span className={`text-[10px] sm:text-[11px] font-bold text-center ${!selectedCategory ? 'text-amber-800' : 'text-gray-700'}`}>All Stores</span>
          </button>

          {categories.map(c => {
            const categoryLogos = {
              "Dairy & Fresh Milk": { icon: "🥛", bg: "bg-emerald-100 text-emerald-800" },
              "Electronics": { icon: "📱", bg: "bg-blue-100 text-blue-800" },
              "Fashion & Apparel": { icon: "👗", bg: "bg-pink-100 text-pink-800" },
              "Home & Kitchen": { icon: "🍳", bg: "bg-amber-100 text-amber-800" },
              "Beauty & Personal Care": { icon: "💄", bg: "bg-purple-100 text-purple-800" },
              "Books & Stationery": { icon: "📚", bg: "bg-orange-100 text-orange-800" }
            };
            const meta = categoryLogos[c.name] || { icon: "📦", bg: "bg-gray-100 text-gray-800" };
            const isSelected = selectedCategory === c.name;

            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.name)}
                className={`flex flex-col items-center gap-1 p-1.5 sm:p-2 rounded-xl transition min-w-[65px] sm:min-w-[80px] cursor-pointer ${isSelected ? 'bg-blue-50 border border-blue-400 shadow-sm' : 'hover:bg-gray-50'}`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-xs transition transform hover:scale-110 ${meta.bg} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                  {meta.icon}
                </div>
                <span className={`text-[10px] sm:text-[11px] font-bold text-center line-clamp-1 ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                  {c.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN PRODUCT CATALOG GRID */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-5">
        
        {/* Dynamic Faceted Filters & Sorting Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              {searchQuery ? (
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                      Search Results for <span className="text-blue-600 font-extrabold">"{searchQuery}"</span>
                    </h2>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-0.5 rounded-full font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Clear Search"
                    >
                      Clear ✕
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Found <strong>{filteredProducts.length}</strong> product(s) matching your search query
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                    {selectedCategory ? `${selectedCategory}` : "Top Trending Marketplace Catalog"}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Showing <strong>{filteredProducts.length}</strong> live products • Direct merchant escrow warranty
                  </p>
                </div>
              )}
            </div>

            {/* Dynamic Sorting & Filter Controls */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              
              {/* Sort Dropdown */}
              <div className="flex items-center space-x-1">
                <span className="text-gray-500 font-semibold">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 border border-gray-300 font-bold text-gray-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="featured">Featured Deals</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="discount">Biggest Discount %</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="flex items-center space-x-1">
                <span className="text-gray-500 font-semibold">Price:</span>
                <select 
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="bg-gray-50 border border-gray-300 font-bold text-gray-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Price Ranges</option>
                  <option value="UNDER_2000">Under ₹2,000</option>
                  <option value="2000_10000">₹2,000 - ₹10,000</option>
                  <option value="ABOVE_10000">Above ₹10,000</option>
                </select>
              </div>

              {/* In-stock toggle */}
              <label className="flex items-center space-x-1.5 bg-gray-50 border border-gray-300 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-100 font-semibold text-gray-700">
                <input 
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>In-Stock Only</span>
              </label>

              {(selectedCategory || searchQuery || priceRange !== 'ALL' || inStockOnly || selectedBrand !== 'ALL') && (
                <button 
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery('');
                    setPriceRange('ALL');
                    setInStockOnly(false);
                    setSelectedBrand('ALL');
                  }}
                  className="text-xs text-red-600 hover:text-red-700 font-bold bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-lg transition"
                >
                  Reset All Filters ✕
                </button>
              )}

            </div>
          </div>

          {/* Dynamic Brand Filter Pills */}
          <div className="flex items-center space-x-2 pt-2 border-t border-gray-100 overflow-x-auto text-xs">
            <span className="text-gray-400 font-bold text-[11px] whitespace-nowrap">Brands:</span>
            {availableBrands.map(b => (
              <button 
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition whitespace-nowrap ${
                  selectedBrand === b ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {b === 'ALL' ? 'All Brands' : b}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid - 2 columns on phones, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4 shadow-sm my-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Search className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {searchQuery ? `No products found for "${searchQuery}"` : "No products found in this selection"}
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Try checking your spelling, using general terms like "milk", "ghee", "oneplus", "shoes", or clear your active search query.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                    setSelectedBrand('ALL');
                    setPriceRange('ALL');
                    setInStockOnly(false);
                  }}
                  className="bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-sm cursor-pointer"
                >
                  Clear Search &amp; View All Products
                </button>
              </div>
            </div>
          ) : (
            filteredProducts.map(p => {
            const stockUnits = p.stock !== undefined ? p.stock : 25;
            const isOutOfStock = stockUnits <= 0;
            const isLowStock = stockUnits > 0 && stockUnits < 10;

            return (
              <div 
                key={p.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
              >
                {/* Product Image & Badges */}
                <div 
                  className="relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center p-4 cursor-pointer"
                  onClick={() => setSelectedProduct(p)}
                >
                  <img 
                    src={p.imageUrl} 
                    alt={p.title} 
                    className={`w-full h-full object-contain group-hover:scale-105 transition duration-300 ${isOutOfStock ? 'opacity-40 grayscale' : ''}`}
                  />
                  
                  {isOutOfStock ? (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow uppercase">
                      Out of Stock
                    </span>
                  ) : (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                      {p.discount}
                    </span>
                  )}

                  <span 
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                    className={`absolute top-3 right-3 p-1.5 rounded-full shadow-sm transition ${wishlist.includes(p.id) ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-500'}`}
                    title={wishlist.includes(p.id) ? "Saved in Wishlist" : "Save for Later"}
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(p.id) ? 'fill-current text-red-500' : ''}`} />
                  </span>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white text-center opacity-0 group-hover:opacity-100 transition duration-200">
                    <span className="text-[11px] font-bold tracking-wide">Click to View Full Details &amp; Specs 🔍</span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-gray-400 mb-1">
                      <span className="font-semibold text-blue-600 truncate max-w-[80px] sm:max-w-none">{p.brand}</span>
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium truncate max-w-[80px] sm:max-w-[120px]">
                        {p.storeName}
                      </span>
                    </div>

                    <h3 
                      onClick={() => setSelectedProduct(p)}
                      className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2 hover:text-blue-600 transition cursor-pointer leading-snug"
                    >
                      {p.title}
                    </h3>

                    {/* Rating & Live Stock Status */}
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center space-x-1 sm:space-x-1.5">
                        <span className="bg-emerald-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          {p.rating} <Star className="w-2 sm:w-2.5 h-2 sm:h-2.5 fill-current" />
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-gray-400">({p.reviews.toLocaleString()})</span>
                      </div>

                      {isLowStock && (
                        <span className="text-[9px] sm:text-[10px] text-amber-600 font-extrabold animate-pulse">
                          Only {stockUnits} left!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-base sm:text-lg font-black text-gray-900">₹{p.basePrice.toLocaleString()}</span>
                      <span className="text-[10px] sm:text-xs text-gray-400 line-through ml-1">₹{p.mrp.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      {isOutOfStock ? (
                        <button 
                          disabled
                          className="w-full sm:w-auto bg-gray-200 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-bold cursor-not-allowed"
                        >
                          Sold Out
                        </button>
                      ) : (
                        <button 
                          onClick={() => addToCart(p)}
                          className="w-full sm:w-auto bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer text-center"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#131921] text-gray-400 text-xs py-10 mt-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-bold text-sm mb-3">About MegaStore</h4>
            <p className="leading-relaxed">
              India's premier multi-vendor marketplace connecting verified merchants with millions of customers nationwide.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Make Money With Us</h4>
            <ul className="space-y-1.5">
              <li><a href="#" onClick={() => { setAuthTab('seller'); setIsAuthOpen(true); }} className="hover:text-white">Sell on MegaStore</a></li>
              <li><a href="#" className="hover:text-white">Seller Terms &amp; Commission</a></li>
              <li><a href="#" className="hover:text-white">Fulfillment by MegaStore</a></li>
              <li><a href="#" className="hover:text-white">Advertise Your Products</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Customer Support</h4>
            <ul className="space-y-1.5">
              <li><a href="#" className="hover:text-white">Your Orders &amp; Tracking</a></li>
              <li><a href="#" className="hover:text-white">Returns &amp; Refund Policy</a></li>
              <li><a href="#" className="hover:text-white">Escrow Payment Security</a></li>
              <li><a href="#" className="hover:text-white">Help &amp; FAQs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-3">100% Secure Shopping</h4>
            <p className="text-gray-400 leading-relaxed">
              Every transaction is protected with 256-bit bank-grade encryption and customer purchase escrow protection.
            </p>
            <div className="mt-3 text-emerald-400 font-semibold text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> PCI-DSS Compliant Payments
            </div>
          </div>
        </div>
      </footer>

      {/* SLIDING CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              
              {/* Cart Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center">
                  <h2 className="font-bold text-base">Your Shopping Cart ({cartItemCount})</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-semibold">Your cart is empty!</p>
                    <p className="text-xs mt-1">Explore our products and add items to your cart.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-3 border-b border-gray-100 pb-3">
                      <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                      <div className="flex-1">
                        <h4 className="text-xs font-semibold text-gray-900 line-clamp-1">{item.title}</h4>
                        <p className="text-[11px] text-gray-400">Seller: {item.storeName}</p>
                        <p className="text-xs font-bold text-gray-900 mt-1">₹{item.basePrice.toLocaleString()}</p>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 flex items-center justify-center">-</button>
                          <span className="text-xs font-bold px-1">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 flex items-center justify-center">+</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
                  
                  {/* Dynamic Coupon Input Engine */}
                  <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-xs text-emerald-800">
                        <div>
                          <p className="font-bold">🏷️ Coupon {appliedCoupon.code} Applied!</p>
                          <p className="text-[11px] text-emerald-600">You saved ₹{appliedCoupon.calculatedDiscount.toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={handleRemoveCoupon}
                          className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Promo code (e.g. MEGAFREEDOM)"
                            value={couponCodeInput}
                            onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-blue-500"
                          />
                          <button 
                            onClick={() => handleApplyCoupon()}
                            className="bg-gray-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1 text-[10px] text-gray-500">
                          <span>Active vouchers:</span>
                          {coupons.filter(c => c.status === 'ACTIVE').slice(0, 2).map(c => (
                            <span 
                              key={c.id} 
                              onClick={() => handleApplyCoupon(c.code)}
                              className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded cursor-pointer transition"
                            >
                              {c.code}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold text-gray-900">₹{cartSubtotal.toLocaleString()}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-xs text-emerald-700 font-bold">
                      <span>Coupon Discount ({appliedCoupon.code})</span>
                      <span>- ₹{couponDiscountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-emerald-600">
                    <span>Delivery Charges</span>
                    <span className="font-semibold">FREE</span>
                  </div>

                  <div className="flex justify-between text-base font-black border-t border-gray-200 pt-2">
                    <span>Payable Total:</span>
                    <span className="text-blue-600">₹{cartTotal.toLocaleString()}</span>
                  </div>

                  <button 
                    onClick={handleProceedToCheckout}
                    className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 py-3 rounded-xl font-bold text-sm shadow transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    Proceed to Buy ({cartItemCount} items)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AUTHENTICATION & SELLER MODAL */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-[#131921] p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {authTab === 'forgot' ? 'Account Recovery • Reset Password' : authTab === 'login' ? 'Sign In to MegaStore' : authTab === 'register' ? 'Create Customer Account' : 'Merchant / Seller Onboarding'}
              </h3>
              <button onClick={() => { setIsAuthOpen(false); if (authTab === 'forgot') setAuthTab('login'); }} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORGOT PASSWORD VIEW (FLIPKART STYLE OTP FLOW) */}
            {authTab === 'forgot' ? (
              <div className="p-5 space-y-4 text-xs">
                {/* Back to Sign In button */}
                <button
                  type="button"
                  onClick={() => setAuthTab('login')}
                  className="flex items-center text-blue-600 hover:text-blue-800 font-bold gap-1 cursor-pointer transition mb-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </button>

                {forgotStep === 'email' ? (
                  <form onSubmit={handleRequestOtp} className="space-y-3.5">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-blue-900">
                      <div className="flex items-center gap-2 font-bold mb-1">
                        <KeyRound className="w-4 h-4 text-blue-600" />
                        <span>Flipkart-style OTP Password Recovery</span>
                      </div>
                      <p className="text-[11px] text-blue-700">
                        Enter your registered email address. We will generate and send a 6-digit OTP verification code to reset your password.
                      </p>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Registered Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder="e.g. yourname@example.com"
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                        />
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isForgotLoading}
                      className="w-full bg-[#f08804] hover:bg-[#d87a04] text-white py-2.5 rounded-xl font-bold text-sm shadow transition mt-2 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isForgotLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                      Request OTP Verification Code
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-3.5">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-900">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                          <CheckCircle className="w-4 h-4 text-emerald-600" /> OTP Verification Code
                        </span>
                        <button
                          type="button"
                          onClick={() => setForgotStep('email')}
                          className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
                        >
                          Change Email
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-600">
                        Code sent to: <strong className="text-gray-900">{forgotEmail}</strong>
                      </p>
                      {otpDebugInfo && (
                        <div className="mt-2 pt-2 border-t border-emerald-200 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-emerald-800">
                            Verification OTP: <span className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 text-sm font-bold tracking-widest text-emerald-700">{otpDebugInfo}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setForgotOtp(otpDebugInfo)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer"
                          >
                            Auto Fill OTP
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Enter 6-Digit OTP</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="e.g. 123456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono tracking-widest text-center font-bold"
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          placeholder="Minimum 6 characters"
                          className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600 transition cursor-pointer"
                          title={showNewPassword ? "Hide password" : "Show password"}
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        placeholder="Re-type new password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isForgotLoading}
                      className="w-full bg-[#f08804] hover:bg-[#d87a04] text-white py-2.5 rounded-xl font-bold text-sm shadow transition mt-2 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isForgotLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                      Reset Password &amp; Proceed to Login
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="flex border-b border-gray-200 text-xs font-bold text-center">
                  <button 
                    onClick={() => setAuthTab('login')} 
                    className={`flex-1 py-3 ${authTab === 'login' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => setAuthTab('register')} 
                    className={`flex-1 py-3 ${authTab === 'register' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    New Customer
                  </button>
                  <button 
                    onClick={() => setAuthTab('seller')} 
                    className={`flex-1 py-3 ${authTab === 'seller' ? 'border-b-2 border-amber-500 text-amber-600 bg-amber-50/50' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Seller Hub 🏪
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleAuthSubmit} className="p-5 space-y-3.5 text-xs">
                  {authTab !== 'login' && (
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Enter your full name" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="name@example.com" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-gray-700">Password</label>
                      {authTab === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            setAuthTab('forgot');
                            setForgotEmail(formData.email);
                            setForgotStep('email');
                          }}
                          className="text-[11px] text-blue-600 hover:text-blue-800 hover:underline font-semibold cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required 
                        placeholder="Minimum 6 characters" 
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600 transition cursor-pointer"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {authTab === 'seller' && (
                    <>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Store / Business Name</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. Royal Electronics Hub" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          value={formData.storeName}
                          onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">GSTIN Number (Optional)</label>
                        <input 
                          type="text" 
                          placeholder="22AAAAA0000A1Z5" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          value={formData.gstNumber}
                          onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                        />
                      </div>
                    </>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-[#f08804] hover:bg-[#d87a04] text-white py-2.5 rounded-xl font-bold text-sm shadow transition mt-2 cursor-pointer"
                  >
                    {authTab === 'login' ? 'Sign In to Account' : authTab === 'register' ? 'Create Customer Account' : 'Register as Merchant'}
                  </button>

                  {/* 1-Click Role Testing Switcher */}
                  <div className="pt-3 border-t border-gray-100 text-center space-y-2">
                    <p className="text-[11px] text-gray-500 font-bold">1-Click Instant Role Login (For Testing):</p>
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin('CUSTOMER')}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer"
                      >
                        👤 Customer View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin('SELLER')}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer"
                      >
                        🏪 Seller View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin('ADMIN')}
                        className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer"
                      >
                        👑 Admin Tower
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Admin Credentials: <code className="bg-gray-100 px-1 rounded">admin@ecommerce.com</code> / <code className="bg-gray-100 px-1 rounded">Admin@123456</code>
                    </p>
                  </div>

                  <p className="text-[11px] text-gray-500 text-center mt-2">
                    By continuing, you agree to MegaStore's Conditions of Use and Privacy Notice.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#131921] p-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-[#f08804]" />
                <h3 className="font-bold text-sm">Secure Checkout • Delivery Address &amp; Payment</h3>
              </div>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="p-5 space-y-4 overflow-y-auto text-xs">
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-2 pb-1 border-b">1. Delivery Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={checkoutForm.customerName}
                      onChange={(e) => setCheckoutForm({...checkoutForm, customerName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={checkoutForm.customerPhone}
                      onChange={(e) => setCheckoutForm({...checkoutForm, customerPhone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mt-2.5">
                  <label className="block font-semibold text-gray-700 mb-1">Email Address (For Invoice &amp; Tracking)</label>
                  <input 
                    type="email" required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={checkoutForm.customerEmail}
                    onChange={(e) => setCheckoutForm({...checkoutForm, customerEmail: e.target.value})}
                  />
                </div>

                <div className="mt-2.5">
                  <label className="block font-semibold text-gray-700 mb-1">Street / House / Apartment Address</label>
                  <textarea 
                    required rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={checkoutForm.shippingAddress}
                    onChange={(e) => setCheckoutForm({...checkoutForm, shippingAddress: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2.5">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">City</label>
                    <input 
                      type="text" required 
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
                      value={checkoutForm.city}
                      onChange={(e) => setCheckoutForm({...checkoutForm, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">State</label>
                    <input 
                      type="text" required 
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
                      value={checkoutForm.state}
                      onChange={(e) => setCheckoutForm({...checkoutForm, state: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Pincode</label>
                    <input 
                      type="text" required 
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
                      value={checkoutForm.pincode}
                      onChange={(e) => setCheckoutForm({...checkoutForm, pincode: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-2 pb-1 border-b">2. Select Payment Method</h4>
                <div className="space-y-2">
                  <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${checkoutForm.paymentMode === 'COD' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-2.5">
                      <input 
                        type="radio" name="payment" value="COD"
                        checked={checkoutForm.paymentMode === 'COD'}
                        onChange={() => setCheckoutForm({...checkoutForm, paymentMode: 'COD'})}
                      />
                      <div>
                        <p className="font-bold text-gray-900">Cash on Delivery (COD)</p>
                        <p className="text-[11px] text-gray-500">Pay cash or scan QR when delivery partner arrives</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600">Verified</span>
                  </label>

                  <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${checkoutForm.paymentMode === 'UPI' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-2.5">
                      <input 
                        type="radio" name="payment" value="UPI"
                        checked={checkoutForm.paymentMode === 'UPI'}
                        onChange={() => setCheckoutForm({...checkoutForm, paymentMode: 'UPI'})}
                      />
                      <div>
                        <p className="font-bold text-gray-900">UPI / QR (GPay, PhonePe, Paytm)</p>
                        <p className="text-[11px] text-gray-500">Instant contactless payment via UPI app</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-purple-600">Instant</span>
                  </label>

                  {/* Dynamic Interactive UPI QR Code Box */}
                  {checkoutForm.paymentMode === 'UPI' && (
                    <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-3 animate-in fade-in duration-200 text-center">
                      <div className="flex items-center justify-between text-xs font-bold text-purple-900 border-b border-purple-200 pb-2">
                        <span className="flex items-center gap-1.5">
                          <QrCode className="w-4 h-4 text-purple-600" /> Dynamic Escrow UPI QR Code
                        </span>
                        <span className="bg-purple-200 text-purple-900 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                          ⏱️ Valid for 04:59
                        </span>
                      </div>

                      {/* Simulated QR Code Box */}
                      <div className="bg-white p-3 rounded-xl border-2 border-dashed border-purple-300 inline-block shadow-sm">
                        <div className="w-36 h-36 mx-auto bg-slate-900 p-2 rounded-lg flex flex-col items-center justify-center text-white relative">
                          <div className="w-full h-full bg-white p-2 rounded flex flex-col justify-between">
                            <div className="flex justify-between">
                              <div className="w-6 h-6 bg-black rounded-sm border-2 border-white flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-white"></div>
                              </div>
                              <div className="w-6 h-6 bg-black rounded-sm border-2 border-white flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-white"></div>
                              </div>
                            </div>
                            <div className="text-center font-black text-slate-900 text-[11px] tracking-tight py-0.5 font-mono">
                              ₹{cartTotal.toLocaleString()}
                            </div>
                            <div className="flex justify-between items-end">
                              <div className="w-6 h-6 bg-black rounded-sm border-2 border-white flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-white"></div>
                              </div>
                              <div className="text-[8px] font-bold text-purple-700">BHIM UPI</div>
                            </div>
                          </div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-700 mt-2 font-mono">
                          VPA: <span className="text-purple-700">megastore.escrow@icici</span>
                        </p>
                      </div>

                      <div className="flex justify-center gap-2 text-[10px] font-bold text-slate-700">
                        <span className="bg-white px-2 py-1 rounded shadow-xs border">🟢 PhonePe</span>
                        <span className="bg-white px-2 py-1 rounded shadow-xs border">🔵 Google Pay</span>
                        <span className="bg-white px-2 py-1 rounded shadow-xs border">🟣 Paytm</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          showToast('✅ UPI Payment Received! Confirming order...');
                          handlePlaceOrder(e);
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-lg text-xs shadow transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <CheckCircle className="w-4 h-4" /> Simulate 1-Click Successful UPI Payment
                      </button>
                    </div>
                  )}

                  <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${checkoutForm.paymentMode === 'CARD' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-2.5">
                      <input 
                        type="radio" name="payment" value="CARD"
                        checked={checkoutForm.paymentMode === 'CARD'}
                        onChange={() => setCheckoutForm({...checkoutForm, paymentMode: 'CARD'})}
                      />
                      <div>
                        <p className="font-bold text-gray-900">Credit / Debit Card</p>
                        <p className="text-[11px] text-gray-500">Visa, Mastercard, RuPay with 256-bit encryption</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-600">Secure</span>
                  </label>
                </div>
              </div>

              {/* Order Summary in Checkout */}
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Items Total ({cartItemCount} items)</span>
                  <span className="font-semibold text-gray-800">₹{cartSubtotal.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-xs text-emerald-700 font-bold">
                    <span>Coupon Voucher ({appliedCoupon.code})</span>
                    <span>- ₹{couponDiscountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-emerald-600">
                  <span>Shipping &amp; Handling</span>
                  <span className="font-bold">FREE</span>
                </div>
                <div className="flex justify-between font-black text-sm text-gray-900 border-t pt-1.5">
                  <span>Payable Order Total:</span>
                  <span className="text-blue-600 font-black">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmittingOrder}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 py-3 rounded-xl font-black text-sm shadow-md transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isSubmittingOrder ? 'Placing Order in Database...' : `Place Your Order (₹${cartTotal.toLocaleString()})`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ORDER CONFIRMATION / SUCCESS MODAL */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-200 p-6 text-center space-y-4">
            
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-pulse">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Order Confirmed
              </span>
              <h2 className="text-2xl font-black text-gray-900 mt-2">Thank you for your order!</h2>
              <p className="text-xs text-gray-500 mt-1">
                We've received your order and notified the merchant sellers.
              </p>
            </div>

            {/* Order Card details */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left text-xs space-y-2.5">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Order Number</span>
                <span className="font-mono font-bold text-blue-600">{orderSuccess.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Customer Name</span>
                <span className="font-semibold text-gray-800">{orderSuccess.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Mode</span>
                <span className="font-semibold uppercase">{orderSuccess.paymentMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Amount Paid</span>
                <span className="font-bold text-gray-900">₹{orderSuccess.totalAmount?.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 text-[11px] text-gray-600">
                <p className="font-bold text-gray-800">Delivering to:</p>
                <p>{orderSuccess.shippingAddress}</p>
              </div>
            </div>

            {/* Stepper tracking */}
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 text-xs">
              <p className="font-bold text-blue-900 mb-3 text-left">Live Order Progress Status</p>
              <div className="flex items-center justify-between text-[10px] text-gray-600 relative">
                <div className="flex flex-col items-center z-10">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">✓</div>
                  <span className="font-bold text-emerald-700 mt-1">Placed</span>
                </div>
                <div className="flex-1 h-1 bg-emerald-300 -mt-3"></div>
                <div className="flex flex-col items-center z-10">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</div>
                  <span className="font-semibold text-blue-800 mt-1">Confirmed</span>
                </div>
                <div className="flex-1 h-1 bg-gray-200 -mt-3"></div>
                <div className="flex flex-col items-center z-10">
                  <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold">3</div>
                  <span className="text-gray-400 mt-1">Shipped</span>
                </div>
                <div className="flex-1 h-1 bg-gray-200 -mt-3"></div>
                <div className="flex flex-col items-center z-10">
                  <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold">4</div>
                  <span className="text-gray-400 mt-1">Delivered</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setOrderSuccess(null)}
              className="w-full bg-[#131921] hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-sm shadow transition cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* PRODUCT DETAIL MODAL (PDP - Dynamic Product Details & Reviews) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-gray-200 max-h-[92vh] flex flex-col">
            
            {/* Modal Top Breadcrumb Bar */}
            <div className="bg-gray-100 px-6 py-3 border-b border-gray-200 flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center space-x-1.5 truncate">
                <span className="font-semibold text-gray-900 cursor-pointer" onClick={() => setSelectedProduct(null)}>Home</span>
                <span>/</span>
                <span>{selectedProduct.categoryName}</span>
                <span>/</span>
                <span className="text-blue-600 font-semibold">{selectedProduct.brand}</span>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Image Gallery & Badges */}
              <div className="space-y-4">
                <div className="relative aspect-square bg-gray-50 rounded-2xl border border-gray-200 p-6 flex items-center justify-center overflow-hidden group">
                  <img 
                    src={selectedProduct.imageUrl} 
                    alt={selectedProduct.title} 
                    className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded shadow">
                    {selectedProduct.discount}
                  </span>
                  <button 
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`absolute top-4 right-4 p-2 rounded-full shadow transition ${wishlist.includes(selectedProduct.id) ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-red-500'}`}
                  >
                    <Heart className={`w-5 h-5 ${wishlist.includes(selectedProduct.id) ? 'fill-current text-red-500' : ''}`} />
                  </button>
                </div>

                {/* 3 Thumbnail Angles */}
                <div className="grid grid-cols-3 gap-3">
                  {[selectedProduct.imageUrl, selectedProduct.imageUrl, selectedProduct.imageUrl].map((img, i) => (
                    <div key={i} className="border border-blue-500 rounded-xl p-2 bg-gray-50 aspect-square flex items-center justify-center cursor-pointer hover:border-blue-700">
                      <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>

                {/* Assurance Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-2">
                  <div className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-[11px]">100% Genuine Product</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <RefreshCw className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-[11px]">7-Day Easy Returns</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-[11px]">Fast Escrow Delivery</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <Lock className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-[11px]">Secure Checkout</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Details, Pricing, Pincode Estimator & CTAs */}
              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-blue-600 tracking-wide uppercase">{selectedProduct.brand}</span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                      Verified Merchant: {selectedProduct.storeName}
                    </span>
                  </div>

                  <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-snug">
                    {selectedProduct.title}
                  </h1>

                  {/* Rating Block */}
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                      {selectedProduct.rating} <Star className="w-3 h-3 fill-current" />
                    </span>
                    <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">
                      {selectedProduct.reviews?.toLocaleString() || 3412} Ratings &amp; 428 Reviews
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-xs text-gray-500 font-medium">Verified Merchant Fulfilled</span>
                  </div>

                  {/* Price Section */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="flex items-baseline space-x-3">
                      <span className="text-2xl md:text-3xl font-black text-gray-900">
                        ₹{selectedProduct.basePrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ₹{selectedProduct.mrp.toLocaleString()}
                      </span>
                      <span className="text-xs font-extrabold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                        {selectedProduct.discount}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 font-bold mt-1">
                      You save: ₹{(selectedProduct.mrp - selectedProduct.basePrice).toLocaleString()} (Inclusive of all GST taxes)
                    </p>
                  </div>

                  {/* Bank Offers Callout */}
                  <div className="mt-3 p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-1">
                    <p className="font-bold text-blue-900 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-blue-600" /> Available Bank Offers &amp; Discounts:
                    </p>
                    <p className="text-blue-800 text-[11px] leading-relaxed">
                      • <strong>Instant ₹1,500 Discount</strong> on HDFC &amp; ICICI Bank Credit/Debit Cards.<br/>
                      • <strong>No Cost EMI:</strong> Available starting from ₹{Math.round(selectedProduct.basePrice / 6).toLocaleString()}/month.
                    </p>
                  </div>

                  {/* Dairy Special Cold-Chain & Early Morning Slot Callout */}
                  {selectedProduct.categoryName === 'Dairy & Fresh Milk' && (
                    <div className="mt-3 p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs space-y-1.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                          🥛 100% Pure Farm-Fresh &amp; Cold-Chain Sourced
                        </span>
                        <span className="bg-emerald-200 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Certified Pure
                        </span>
                      </div>
                      <p className="text-emerald-800 text-[11px] leading-relaxed">
                        • <strong>Early Morning Delivery (6:00 AM - 8:00 AM):</strong> Chilled at 4°C directly from grass-fed Gir cows &amp; Murrah buffaloes to your doorstep.<br/>
                        • <strong>Zero Preservatives &amp; Chemicals:</strong> Untouched by human hands, packaged in food-grade eco-friendly glass bottles &amp; vacuum sealed pouches.
                      </p>
                    </div>
                  )}

                  {/* Live Pincode Estimator Widget */}
                  <div className="mt-3.5 p-3.5 bg-white border border-gray-200 rounded-xl space-y-2">
                    <label className="block text-xs font-bold text-gray-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#f08804]" /> Check Delivery Date &amp; Cash on Delivery:
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        maxLength={6}
                        value={pdpPincode}
                        onChange={(e) => setPdpPincode(e.target.value)}
                        placeholder="Enter 6-digit Pincode"
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button 
                        onClick={() => checkPincodeDelivery(pdpPincode)}
                        className="bg-gray-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Check PIN
                      </button>
                    </div>
                    {pincodeStatus.checked && (
                      <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1.5 animate-fadeIn">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{pincodeStatus.deliveryDate} | Cash on Delivery (COD) Available</span>
                      </p>
                    )}
                  </div>

                  {/* Highlights & Description */}
                  <div className="mt-3.5 text-xs text-gray-700 space-y-1.5">
                    <p className="font-bold text-gray-900">About this item:</p>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {selectedProduct.description}
                    </p>
                    <ul className="list-disc list-inside text-[11px] text-gray-600 space-y-0.5 pt-1">
                      <li>Official manufacturer warranty included with Tax Invoice.</li>
                      <li>Dispatched directly from verified vendor: <strong>{selectedProduct.storeName}</strong>.</li>
                      <li>Protected with 100% Escrow Buyer Protection.</li>
                    </ul>
                  </div>

                  {/* 🥛 One-Time Buy vs Daily Subscription Toggle (Country Delight Model) */}
                  <div className="mt-3.5 bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                    <div className="flex rounded-lg bg-gray-200 p-0.5 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setPdpPurchaseMode('ONE_TIME')}
                        className={`flex-1 py-1.5 rounded-md transition cursor-pointer ${pdpPurchaseMode === 'ONE_TIME' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'}`}
                      >
                        One-Time Order
                      </button>
                      <button
                        type="button"
                        onClick={() => setPdpPurchaseMode('SUBSCRIBE')}
                        className={`flex-1 py-1.5 rounded-md transition flex items-center justify-center gap-1 cursor-pointer ${pdpPurchaseMode === 'SUBSCRIBE' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 font-extrabold'}`}
                      >
                        🥛 Subscribe &amp; Save 10%
                      </button>
                    </div>

                    {pdpPurchaseMode === 'SUBSCRIBE' && (
                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 text-xs space-y-2.5 animate-in fade-in">
                        <div className="flex items-center justify-between text-emerald-900 font-bold">
                          <span>Repeat Schedule:</span>
                          <span className="text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200 text-[11px] font-mono font-bold">
                            ₹{Math.round(selectedProduct.basePrice * 0.90)} / delivery
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: 'DAILY', label: 'Everyday' },
                            { id: 'ALTERNATE', label: 'Alternate Days' },
                            { id: 'CUSTOM', label: 'Mon, Wed, Fri' }
                          ].map(f => (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => setSubFrequency(f.id)}
                              className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition cursor-pointer ${subFrequency === f.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-emerald-50'}`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-gray-600 pt-1">
                          <span>Early Slot: <strong>6:00 AM - 7:30 AM</strong></span>
                          <span className="text-emerald-800 font-semibold">₹20 Bottle Deposit (Refundable)</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ⭐ Verified Customer Reviews Engine */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-500 fill-current" /> Customer Reviews ({productReviews[selectedProduct.id]?.length || 2})
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsAddingReview(!isAddingReview)}
                        className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
                      >
                        {isAddingReview ? 'Cancel Review' : '+ Write a Review'}
                      </button>
                    </div>

                    {/* Review Form */}
                    {isAddingReview && (
                      <form onSubmit={handleAddReview} className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3 text-xs space-y-2.5 animate-in fade-in">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Your Name (e.g. Rahul)"
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                            value={newReviewForm.name}
                            onChange={(e) => setNewReviewForm({ ...newReviewForm, name: e.target.value })}
                          />
                          <select
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white"
                            value={newReviewForm.rating}
                            onChange={(e) => setNewReviewForm({ ...newReviewForm, rating: e.target.value })}
                          >
                            <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                            <option value={4}>⭐⭐⭐⭐ (4 Stars - Good)</option>
                            <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
                          </select>
                        </div>
                        <textarea
                          required
                          rows={2}
                          placeholder="Write your experience with purity, delivery speed, or packaging..."
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                          value={newReviewForm.comment}
                          onChange={(e) => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                        />
                        <button
                          type="submit"
                          className="bg-gray-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
                        >
                          Submit Verified Review
                        </button>
                      </form>
                    )}

                    {/* Review List */}
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {(productReviews[selectedProduct.id] || [
                        { id: 1, name: 'Verified Customer', rating: 5, date: 'Recent', comment: 'Quality is exactly as described. Packaging arrived intact and well-sealed.', verified: true }
                      ]).map(rev => (
                        <div key={rev.id} className="bg-gray-50/70 p-2.5 rounded-lg border border-gray-100 text-[11px] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-800 flex items-center gap-1">
                              {rev.name}
                              {rev.verified && (
                                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-semibold flex items-center gap-0.5">
                                  <Check className="w-2.5 h-2.5" /> Verified Purchase
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-gray-400">{rev.date}</span>
                          </div>
                          <div className="flex text-amber-500 text-xs">
                            {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                          </div>
                          <p className="text-gray-600 leading-snug">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* PDP Action Buttons with Live Stock Validation */}
                <div className="pt-4 border-t border-gray-200 mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-600">Stock Availability:</span>
                    {(selectedProduct.stock !== undefined ? selectedProduct.stock : 25) <= 0 ? (
                      <span className="bg-red-100 text-red-700 font-extrabold px-2.5 py-0.5 rounded-full">
                        Currently Out of Stock
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> In Stock ({selectedProduct.stock !== undefined ? selectedProduct.stock : 25} units available)
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {(selectedProduct.stock !== undefined ? selectedProduct.stock : 25) <= 0 ? (
                      <button 
                        disabled
                        className="col-span-2 bg-gray-200 text-gray-500 font-bold py-3 rounded-xl text-xs md:text-sm cursor-not-allowed"
                      >
                        Item Currently Sold Out
                      </button>
                    ) : pdpPurchaseMode === 'SUBSCRIBE' ? (
                      <button 
                        onClick={() => handleStartSubscription(selectedProduct)}
                        className="col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl text-xs md:text-sm shadow-md transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                      >
                        <Calendar className="w-4 h-4" /> Start Daily Subscription (From Tomorrow 6:00 AM)
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                          className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold py-3 rounded-xl text-xs md:text-sm shadow transition active:scale-95 cursor-pointer"
                        >
                          Add to Cart
                        </button>
                        <button 
                          onClick={() => handleBuyNow(selectedProduct)}
                          className="w-full bg-[#f08804] hover:bg-[#d87a04] text-white font-bold py-3 rounded-xl text-xs md:text-sm shadow transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                        >
                          <Zap className="w-4 h-4" /> Buy Now
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* MY ORDERS & RETURNS PORTAL MODAL */}
      {isOrdersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="bg-[#131921] p-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-[#f08804]" />
                <div>
                  <h3 className="font-bold text-sm">Your Orders &amp; Returns Portal</h3>
                  <p className="text-[10px] text-gray-400">Track shipments, manage returns &amp; cancel active orders</p>
                </div>
              </div>
              <button onClick={() => setIsOrdersOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Search Bar */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <form onSubmit={handleSearchOrders} className="flex gap-2">
                <div className="relative flex-1">
                  <input 
                    type="email"
                    required
                    placeholder="Enter customer email (e.g. rahul@example.com)"
                    value={orderEmailSearch}
                    onChange={(e) => setOrderEmailSearch(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-bold px-4 py-2 rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" /> Search Orders
                </button>
              </form>
            </div>

            {/* Orders Content List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {userOrders.length === 0 ? (
                <div className="text-center py-16 text-gray-400 space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto opacity-30 text-gray-400" />
                  <p className="text-sm font-bold text-gray-700">No Orders Found</p>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    We couldn't find any orders for "{orderEmailSearch}". Place an order from the store or search with another email address.
                  </p>
                  <button 
                    onClick={() => setIsOrdersOpen(false)}
                    className="mt-2 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 px-4 py-2 rounded-lg text-xs font-bold transition shadow"
                  >
                    Start Shopping Now
                  </button>
                </div>
              ) : (
                userOrders.map((order, idx) => {
                  const isCancelled = order.status === 'CANCELLED';
                  const isDelivered = order.status === 'DELIVERED';
                  const isPlaced = order.status === 'PLACED';
                  const isConfirmed = order.status === 'CONFIRMED';
                  const isShipped = order.status === 'SHIPPED';

                  return (
                    <div key={order.orderNumber || idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
                      
                      {/* Order Card Header */}
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Order Placed</p>
                          <p className="font-bold text-gray-800">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Total Amount</p>
                          <p className="font-extrabold text-gray-900">₹{order.totalAmount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Ship To</p>
                          <p className="font-semibold text-gray-700 truncate max-w-[150px]">{order.customerName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Order Number</p>
                          <p className="font-mono font-bold text-blue-600">{order.orderNumber}</p>
                        </div>
                        <div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isCancelled ? 'bg-red-100 text-red-700 border border-red-200' :
                            isDelivered ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                            isShipped ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                            isConfirmed ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                            'bg-blue-100 text-blue-700 border border-blue-200'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Order Live Tracking Stepper or Cancellation Banner */}
                      <div className="p-4 border-b border-gray-100">
                        {isCancelled ? (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center space-x-2.5 text-xs text-red-700">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <div>
                              <p className="font-bold">This order has been cancelled.</p>
                              <p className="text-[11px] text-red-600">Restoration of merchant stock and zero-charge policy applied.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-gray-200 text-xs">
                            <p className="text-[11px] font-bold text-gray-700 mb-2.5">Live Delivery Progress:</p>
                            <div className="flex items-center justify-between text-[10px] relative">
                              <div className="flex flex-col items-center z-10">
                                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">✓</div>
                                <span className="font-bold text-emerald-700 mt-1">Order Placed</span>
                              </div>
                              <div className={`flex-1 h-1 -mt-3 ${isConfirmed || isShipped || isDelivered ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                              <div className="flex flex-col items-center z-10">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-white ${isConfirmed || isShipped || isDelivered ? 'bg-emerald-600' : 'bg-gray-300'}`}>
                                  {isConfirmed || isShipped || isDelivered ? '✓' : '2'}
                                </div>
                                <span className={`font-semibold mt-1 ${isConfirmed || isShipped || isDelivered ? 'text-emerald-700' : 'text-gray-400'}`}>Confirmed</span>
                              </div>
                              <div className={`flex-1 h-1 -mt-3 ${isShipped || isDelivered ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                              <div className="flex flex-col items-center z-10">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-white ${isShipped || isDelivered ? 'bg-emerald-600' : 'bg-gray-300'}`}>
                                  {isShipped || isDelivered ? '✓' : '3'}
                                </div>
                                <span className={`font-semibold mt-1 ${isShipped || isDelivered ? 'text-emerald-700' : 'text-gray-400'}`}>Shipped</span>
                              </div>
                              <div className={`flex-1 h-1 -mt-3 ${isDelivered ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                              <div className="flex flex-col items-center z-10">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-white ${isDelivered ? 'bg-emerald-600' : 'bg-gray-300'}`}>
                                  {isDelivered ? '✓' : '4'}
                                </div>
                                <span className={`font-semibold mt-1 ${isDelivered ? 'text-emerald-700' : 'text-gray-400'}`}>Delivered</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Delivery Destination */}
                        <div className="mt-3 text-xs text-gray-600 flex items-start gap-1.5">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <p><strong className="text-gray-800">Delivery Address:</strong> {order.shippingAddress}</p>
                        </div>

                        {/* Items in order */}
                        {order.items && order.items.length > 0 && (
                          <div className="mt-3 space-y-2 border-t pt-2.5">
                            {order.items.map((it, itemIdx) => (
                              <div key={itemIdx} className="flex items-center justify-between text-xs py-1">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                                    📦
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900 line-clamp-1">{it.title || 'Marketplace Item'}</p>
                                    <p className="text-[10px] text-gray-400">Qty: {it.quantity} • Seller: {it.storeName || 'Verified Merchant'}</p>
                                  </div>
                                </div>
                                <span className="font-bold text-gray-900">₹{it.price?.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Footer */}
                      <div className="bg-gray-50 px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
                        <button 
                          onClick={() => setSelectedInvoice(order)}
                          className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" /> View Tax Invoice
                        </button>

                        <div className="flex items-center space-x-2">
                          {(isPlaced || isConfirmed) && (
                            <button 
                              onClick={() => handleCancelOrder(order.orderNumber)}
                              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-semibold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
                            >
                              Cancel Order ✕
                            </button>
                          )}
                          {isDelivered && (
                            <button 
                              onClick={() => showToast('Return window open: Return pickup scheduled!')}
                              className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-semibold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
                            >
                              Return / Replace 🔄
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAX INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-200 p-6 text-xs space-y-4">
            
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">TAX INVOICE</h2>
                <p className="text-[11px] text-gray-500 font-semibold">ORIGINAL FOR RECIPIENT</p>
                <p className="font-bold text-gray-800 mt-1">MegaStore Marketplace India Pvt. Ltd.</p>
                <p className="text-gray-500 text-[11px]">GSTIN: 27AABCM9988C1Z2 • CIN: U74999MH2024PTC123456</p>
              </div>
              <div className="text-right">
                <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-gray-800 p-1">
                  <X className="w-5 h-5" />
                </button>
                <p className="font-mono font-bold text-blue-600 mt-2">INV-{selectedInvoice.orderNumber}</p>
                <p className="text-gray-500 text-[11px]">
                  Date: {selectedInvoice.createdAt ? new Date(selectedInvoice.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Customer & Shipping info */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <div>
                <p className="font-bold text-gray-800">Billed &amp; Shipped To:</p>
                <p className="font-semibold text-gray-900">{selectedInvoice.customerName}</p>
                <p className="text-gray-600">{selectedInvoice.shippingAddress}</p>
                <p className="text-gray-600">Email: {selectedInvoice.customerEmail}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">Payment Summary:</p>
                <p className="text-gray-600">Mode: <strong className="uppercase">{selectedInvoice.paymentMode}</strong></p>
                <p className="text-gray-600">Status: <strong className="text-emerald-700">Verified &amp; Paid</strong></p>
                <p className="text-gray-600">Place of Supply: Maharashtra (27)</p>
              </div>
            </div>

            {/* Invoice Line items */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300 text-gray-500 text-[11px]">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">HSN</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Taxable Value</th>
                  <th className="py-2 text-right">GST (18%)</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(selectedInvoice.items && selectedInvoice.items.length > 0) ? (
                  selectedInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-semibold text-gray-900">{item.title}</td>
                      <td className="py-2.5 text-center text-gray-500">8517</td>
                      <td className="py-2.5 text-center">{item.quantity}</td>
                      <td className="py-2.5 text-right">₹{Math.round(item.price / 1.18).toLocaleString()}</td>
                      <td className="py-2.5 text-right text-gray-500">₹{Math.round((item.price / 1.18) * 0.18).toLocaleString()}</td>
                      <td className="py-2.5 text-right font-bold text-gray-900">₹{item.price.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-2.5 font-semibold text-gray-900">Marketplace Merchandise Package</td>
                    <td className="py-2.5 text-center text-gray-500">8517</td>
                    <td className="py-2.5 text-center">1</td>
                    <td className="py-2.5 text-right">₹{Math.round(selectedInvoice.totalAmount / 1.18).toLocaleString()}</td>
                    <td className="py-2.5 text-right text-gray-500">₹{Math.round((selectedInvoice.totalAmount / 1.18) * 0.18).toLocaleString()}</td>
                    <td className="py-2.5 text-right font-bold text-gray-900">₹{selectedInvoice.totalAmount.toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Calculations Total */}
            <div className="border-t border-gray-200 pt-3 space-y-1.5 text-right">
              <div className="flex justify-between text-gray-600">
                <span>Taxable Subtotal:</span>
                <span>₹{Math.round(selectedInvoice.totalAmount / 1.18).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>Integrated GST (IGST @ 18%):</span>
                <span>₹{Math.round((selectedInvoice.totalAmount / 1.18) * 0.18).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-900 border-t pt-2">
                <span>Grand Total:</span>
                <span className="text-blue-600">₹{selectedInvoice.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Invoice Actions */}
            <div className="pt-3 border-t flex items-center justify-between">
              <p className="text-[10px] text-gray-400">
                This is a digitally generated invoice pursuant to the Information Technology Act, 2000.
              </p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => window.print()}
                  className="bg-gray-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 🥛 COUNTRY DELIGHT STYLE: MILK & DAIRY SUBSCRIPTIONS MODAL */}
      {isSubscriptionsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-emerald-950 p-4 text-white flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-base">
                  🥛
                </div>
                <div>
                  <h3 className="font-extrabold text-sm flex items-center gap-2">
                    Country Delight Style • Milk &amp; Dairy Subscriptions
                  </h3>
                  <p className="text-[10px] text-emerald-300">Daily 6:00 AM Cold-Chain Sourced • Pure Gir Cow &amp; Buffalo Milk</p>
                </div>
              </div>
              <button onClick={() => setIsSubscriptionsOpen(false)} className="text-emerald-300 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wallet & Empty Bottle Cashback Banner */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 p-4 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow">
                  ₹{milkWalletBalance}
                </div>
                <div>
                  <p className="font-extrabold text-emerald-950 text-xs">Milk Cashback Wallet Balance</p>
                  <p className="text-[11px] text-emerald-700">₹20 deposit refunded per returned glass bottle</p>
                </div>
              </div>

              {/* Quick Bottle Return Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReturnBottles(1)}
                  className="bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-1.5 rounded-lg text-xs transition shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  🥛 Return 1 Bottle (+₹20)
                </button>
                <button
                  onClick={() => handleReturnBottles(2)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs transition shadow flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  🥛🥛 Return 2 (+₹40)
                </button>
              </div>
            </div>

            {/* Subscriptions List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
                <span>Active Deliveries Schedule ({subscriptions.length})</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                  Guaranteed 6:00 AM - 7:30 AM Slot
                </span>
              </div>

              {subscriptions.length === 0 ? (
                <div className="text-center py-12 text-gray-400 space-y-2">
                  <p className="text-sm font-bold text-gray-600">No Active Milk Subscriptions</p>
                  <p className="text-xs">Browse the Dairy &amp; Fresh Milk catalog and click "Subscribe &amp; Save 10%" to set up repeat morning deliveries.</p>
                </div>
              ) : (
                subscriptions.map(sub => {
                  const isActive = sub.status === 'ACTIVE';
                  return (
                    <div key={sub.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3 hover:border-emerald-300 transition">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-sm">{sub.title}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                              {sub.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            Brand: <strong className="text-blue-600">{sub.brand}</strong> • ID: <span className="font-mono">{sub.id}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-gray-900">₹{sub.pricePerDay}/day</span>
                          <p className="text-[10px] text-emerald-600 font-bold">10% Off Applied</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg text-[11px] text-gray-700">
                        <div>
                          <span className="text-gray-400 block text-[10px]">Repeat Frequency:</span>
                          <select
                            value={sub.frequency}
                            onChange={(e) => handleUpdateSubFrequency(sub.id, e.target.value)}
                            className="bg-white border border-gray-300 rounded px-1.5 py-0.5 text-xs font-bold text-gray-800 mt-0.5 cursor-pointer"
                          >
                            <option value="Daily (Every Morning)">Daily (Every Morning)</option>
                            <option value="Alternate Days">Alternate Days</option>
                            <option value="Mon, Wed, Fri">Mon, Wed, Fri</option>
                          </select>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px]">Morning Slot:</span>
                          <strong className="text-gray-800">{sub.slot}</strong>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px]">Next Doorstep Drop:</span>
                          <strong className="text-emerald-700">{isActive ? sub.nextDelivery : 'Paused by Customer'}</strong>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                        <button
                          onClick={() => handleCancelSubscription(sub.id)}
                          className="text-[11px] text-red-600 hover:text-red-800 font-bold hover:underline cursor-pointer"
                        >
                          Cancel Subscription ✕
                        </button>
                        <button
                          onClick={() => handleTogglePauseSubscription(sub.id)}
                          className={`font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer active:scale-95 ${isActive ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow'}`}
                        >
                          {isActive ? '⏸️ Pause Deliveries' : '▶️ Resume Morning Milk'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex items-center justify-between text-xs">
              <span className="text-gray-500 text-[11px]">
                🌿 100% Recyclable Glass Bottles • Cleaned &amp; Sterilized Daily
              </span>
              <button
                onClick={() => setIsSubscriptionsOpen(false)}
                className="bg-gray-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
              >
                Close Manager
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 📱 FLOATING SMS / WHATSAPP ORDER NOTIFICATION BANNER */}
      {activeAlert && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 p-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                📱
              </div>
              <div>
                <p className="font-extrabold text-xs text-emerald-400">{activeAlert.title}</p>
                <p className="text-[10px] text-slate-400">{activeAlert.time}</p>
              </div>
            </div>
            <button onClick={() => setActiveAlert(null)} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-200 mt-2.5 leading-relaxed bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 font-sans">
            {activeAlert.message}
          </p>
        </div>
      )}

    </div>
  );
}
