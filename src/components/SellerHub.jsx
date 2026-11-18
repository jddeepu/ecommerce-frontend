import React, { useState } from 'react';
import { 
  Store, Package, ShoppingCart, TrendingUp, DollarSign, 
  AlertCircle, CheckCircle, Plus, Upload, Printer, 
  Search, Filter, ExternalLink, ShieldCheck, ArrowLeft, 
  Truck, Clock, RefreshCw, X, ChevronRight, FileText, 
  Settings, HelpCircle, Check, Eye, Trash2, Edit2
} from 'lucide-react';

export default function SellerHub({ 
  onBackToStore, 
  onOpenAdmin,
  categories = [],
  products, 
  onAddProduct, 
  onUpdateStock,
  onDeleteProduct,
  onEditProduct,
  onToggleProductStatus,
  orders,
  onUpdateOrderStatus,
  commissionRules = [],
  showToast,
  currentUser,
  isAdmin = false
}) {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders' | 'payouts' | 'returns' | 'settings'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedAwbOrder, setSelectedAwbOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState('ALL'); // 'ALL' | 'Krishna Dairy Farms' | 'SuperRetail Mobiles & Tech'

  // New Product Form State - Defaulted to Dairy & Fresh Milk
  const [newProduct, setNewProduct] = useState({
    title: '',
    categoryName: 'Dairy & Fresh Milk',
    brand: '',
    basePrice: '',
    mrp: '',
    stock: 25,
    sku: '',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
    description: ''
  });

  // Seller Store KYC Details
  const [storeInfo, setStoreInfo] = useState({
    storeName: 'Krishna Dairy Farms & SuperRetail',
    ownerName: 'Vikram Malhotra',
    email: 'contact@krishnadairy.in',
    phone: '+91 98201 54321',
    gstin: '27AABCS1429B1Z8',
    panNumber: 'AABCS1429B',
    bankName: 'HDFC Bank Ltd',
    accountNumber: '50200038921849',
    ifscCode: 'HDFC0000060',
    pickupAddress: 'Farm Gate 3, Rural Milk Collection Center, Bhiwandi Highway, Thane - 421302',
    kycVerified: true
  });

  // Filter Seller's Products - Shows All or Filter by Merchant Store
  const sellerProducts = products.filter(p => {
    if (selectedStoreFilter === 'ALL') return true;
    return p.storeName === selectedStoreFilter;
  });

  const displayProducts = sellerProducts.filter(p => {
    return p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Calculate Metrics
  const totalSkus = sellerProducts.length;
  const lowStockCount = sellerProducts.filter(p => (p.stock !== undefined ? p.stock : 15) < 10).length;
  
  // Calculate Gross & Net Payouts from Orders with Dynamic Commission Rules
  const grossSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) + 148500; // Baseline mock + live
  const matchedRule = commissionRules?.find(r => r.categoryName === 'Electronics');
  const platformCommissionRate = matchedRule ? (matchedRule.defaultRate / 100) : 0.08;
  const platformFee = Math.round(grossSales * platformCommissionRate);
  const gstOnFee = Math.round(platformFee * 0.18);
  const netPayout = grossSales - (platformFee + gstOnFee);

  // Handle Add Product Submission
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.basePrice) {
      showToast('Please enter title and price');
      return;
    }

    const price = parseFloat(newProduct.basePrice);
    const mrp = newProduct.mrp ? parseFloat(newProduct.mrp) : Math.round(price * 1.15);
    const discountPercent = Math.round(((mrp - price) / mrp) * 100);

    const created = {
      id: Date.now(),
      title: newProduct.title,
      description: newProduct.description || `${newProduct.brand} verified high-quality retail product.`,
      brand: newProduct.brand || 'Generic',
      categoryName: newProduct.categoryName,
      storeName: storeInfo.storeName,
      basePrice: price,
      mrp: mrp,
      discount: `${discountPercent}% off`,
      rating: 4.8,
      reviews: 1,
      stock: parseInt(newProduct.stock) || 20,
      sku: newProduct.sku || `SKU-${Date.now().toString().slice(-5)}`,
      imageUrl: newProduct.imageUrl || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
      active: true
    };

    onAddProduct(created);
    setIsAddModalOpen(false);
    showToast(`Product "${created.title.slice(0, 20)}..." listed live in store!`);
    
    // Reset form
    setNewProduct({
      title: '',
      categoryName: 'Electronics',
      brand: '',
      basePrice: '',
      mrp: '',
      stock: 25,
      sku: '',
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
      description: ''
    });
  };

  // Bulk CSV Simulation
  const handleBulkUploadSimulate = () => {
    const bulkItems = [
      {
        id: Date.now() + 1,
        title: "Apple 20W USB-C Power Adapter (Quick Charge)",
        brand: "Apple",
        categoryName: "Electronics",
        storeName: storeInfo.storeName,
        basePrice: 1699,
        mrp: 1900,
        discount: "11% off",
        rating: 4.7,
        reviews: 1540,
        stock: 50,
        sku: "SKU-APL-20W",
        imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
        active: true
      },
      {
        id: Date.now() + 2,
        title: "Logitech MX Master 3S Wireless Performance Mouse",
        brand: "Logitech",
        categoryName: "Electronics",
        storeName: storeInfo.storeName,
        basePrice: 8995,
        mrp: 10995,
        discount: "18% off",
        rating: 4.9,
        reviews: 3200,
        stock: 18,
        sku: "SKU-LOGI-MX3S",
        imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
        active: true
      },
      {
        id: Date.now() + 3,
        title: "Boat Airdopes 141 Bluetooth True Wireless Earbuds",
        brand: "boAt",
        categoryName: "Electronics",
        storeName: storeInfo.storeName,
        basePrice: 1299,
        mrp: 4490,
        discount: "71% off",
        rating: 4.2,
        reviews: 9540,
        stock: 120,
        sku: "SKU-BOAT-141",
        imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
        active: true
      }
    ];

    bulkItems.forEach(item => onAddProduct(item));
    setIsBulkModalOpen(false);
    showToast(`Bulk CSV Upload Successful: 3 Products listed live!`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* SELLER HUB TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Logo & Seller Identity */}
          <div className="flex items-center space-x-3">
            <div className="bg-[#febd69] text-slate-950 p-2 rounded-xl font-black text-lg flex items-center gap-1.5 shadow">
              <Store className="w-5 h-5 text-slate-950" />
              <span>SELLER CENTRAL</span>
            </div>
            <div className="hidden sm:block border-l border-slate-800 pl-3">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-slate-200">{storeInfo.storeName}</span>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> KYC Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400">GSTIN: {storeInfo.gstin} • Escrow Settlement Active</p>
            </div>
          </div>

          {/* Quick Actions & Storefront Switcher */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#f08804] hover:bg-[#d87a04] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <button 
              onClick={() => setIsBulkModalOpen(true)}
              className="hidden md:flex bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold items-center gap-1.5 transition"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" /> Bulk CSV
            </button>
            <button 
              onClick={onBackToStore}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Buyer Store
            </button>
            {/* Only Super Admin has access to jump to Admin Tower from Seller Central */}
            {(isAdmin || currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN') && (
              <button 
                onClick={onOpenAdmin}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                title="Super Admin Control Tower"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Tower 👑
              </button>
            )}
          </div>

        </div>

        {/* SELLER PORTAL HORIZONTAL NAVIGATION TABS */}
        <div className="bg-slate-900 border-t border-slate-800 text-xs px-4 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center space-x-1 min-w-max py-1">
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 font-bold rounded-lg transition flex items-center gap-2 ${
                activeTab === 'inventory' ? 'bg-[#febd69] text-slate-950 shadow' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Catalog &amp; Inventory</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'inventory' ? 'bg-slate-950 text-white' : 'bg-slate-800 text-slate-300'}`}>
                {totalSkus}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 font-bold rounded-lg transition flex items-center gap-2 ${
                activeTab === 'orders' ? 'bg-[#febd69] text-slate-950 shadow' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Orders &amp; AWB Dispatch</span>
              {orders.length > 0 && (
                <span className="bg-red-500 text-white px-1.5 py-0.2 rounded-full text-[10px] font-black animate-pulse">
                  {orders.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('payouts')}
              className={`px-4 py-2 font-bold rounded-lg transition flex items-center gap-2 ${
                activeTab === 'payouts' ? 'bg-[#febd69] text-slate-950 shadow' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Payouts &amp; Escrow Ledger</span>
            </button>

            <button 
              onClick={() => setActiveTab('returns')}
              className={`px-4 py-2 font-bold rounded-lg transition flex items-center gap-2 ${
                activeTab === 'returns' ? 'bg-[#febd69] text-slate-950 shadow' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Return Requests</span>
            </button>

            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 font-bold rounded-lg transition flex items-center gap-2 ${
                activeTab === 'settings' ? 'bg-[#febd69] text-slate-950 shadow' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Store Profile &amp; KYC</span>
            </button>
          </div>
        </div>
      </header>

      {/* METRIC KPI SUMMARY BAR (Amazon Seller Style) */}
      <div className="bg-slate-950 border-b border-slate-800/80 py-5 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Gross Sales (GMV)</p>
              <h3 className="text-xl md:text-2xl font-black text-white mt-1">₹{grossSales.toLocaleString()}</h3>
              <p className="text-[10px] text-emerald-400 font-bold mt-0.5 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +14.2% this week
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Orders to Dispatch</p>
              <h3 className="text-xl md:text-2xl font-black text-white mt-1">{orders.length > 0 ? orders.length : 3} Pending</h3>
              <p className="text-[10px] text-blue-400 font-bold mt-0.5">Ready for AWB label print</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Live Catalog SKUs</p>
              <h3 className="text-xl md:text-2xl font-black text-white mt-1">{totalSkus} Products</h3>
              <p className={`text-[10px] font-bold mt-0.5 ${lowStockCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {lowStockCount > 0 ? `${lowStockCount} SKUs low stock` : 'Healthy stock level'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Net Escrow Settlement</p>
              <h3 className="text-xl md:text-2xl font-black text-emerald-400 mt-1">₹{netPayout.toLocaleString()}</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Next payout cycle: Tuesday</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

        </div>
      </div>

      {/* MAIN SELLER HUB CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full space-y-6">

        {/* ========================================================================= */}
        {/* TAB 1: CATALOG & INVENTORY MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            
            {/* Low Stock Alert Banner */}
            {lowStockCount > 0 && (
              <div className="bg-amber-950/40 border border-amber-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-300 animate-in fade-in">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white">Low Stock Warning: </span>
                    <span>{lowStockCount} items have less than 10 units left. Replenish inventory to prevent order delays.</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sellerProducts.filter(p => (p.stock !== undefined ? p.stock : 15) < 10).forEach(p => {
                      onUpdateStock(p.id, (p.stock || 0) + 25);
                    });
                    showToast('📦 All low-stock products replenished by +25 units!');
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer active:scale-95 shadow"
                >
                  ⚡ Restock Low Inventory (+25 Units)
                </button>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-xl">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search products by title, brand, or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 pl-9 pr-4 py-2 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Store Filter Dropdown */}
                <select
                  value={selectedStoreFilter}
                  onChange={(e) => setSelectedStoreFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-xs text-white font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="ALL">🏪 All Stores ({products.length} Products)</option>
                  <option value="Krishna Dairy Farms">🥛 Krishna Dairy Farms</option>
                  <option value="Shreeji Dairy Network">🥛 Shreeji Dairy Network</option>
                  <option value="SuperRetail Mobiles">📱 SuperRetail Mobiles</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsBulkModalOpen(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bulk Upload CSV</span>
                </button>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-[#f08804] hover:bg-[#d87a04] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>List New Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider font-bold">
                      <th className="py-3 px-4">Product Details</th>
                      <th className="py-3 px-3">SKU</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Selling Price</th>
                      <th className="py-3 px-3">MRP</th>
                      <th className="py-3 px-3 text-center">Live Stock</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Actions &amp; Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {displayProducts.map(p => {
                      const stockVal = p.stock !== undefined ? p.stock : 25;
                      const isLowStock = stockVal < 10;
                      const isInactive = p.status === 'INACTIVE';

                      return (
                        <tr key={p.id} className="hover:bg-slate-900/50 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={p.imageUrl} 
                                alt={p.title} 
                                className="w-12 h-12 object-contain bg-slate-900 rounded-lg p-1 border border-slate-800 flex-shrink-0"
                              />
                              <div>
                                <h4 className="font-bold text-white text-xs line-clamp-1 max-w-xs">{p.title}</h4>
                                <p className="text-[11px] text-slate-400 font-semibold">{p.brand} • ★ {p.rating}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-amber-400">
                            {p.sku || `SKU-${p.id}`}
                          </td>
                          <td className="py-3 px-3 text-slate-300 font-medium">
                            {p.categoryName}
                          </td>
                          <td className="py-3 px-3 font-bold text-white text-sm">
                            ₹{p.basePrice?.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-slate-500 line-through">
                            ₹{p.mrp?.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                              isLowStock ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            }`}>
                              {stockVal} in stock
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => onToggleProductStatus && onToggleProductStatus(p.id)}
                              title="Click to Toggle Active / Inactive"
                              className={`border text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-max cursor-pointer transition ${
                                isInactive 
                                  ? 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200' 
                                  : 'bg-emerald-950 text-emerald-400 border-emerald-800 hover:bg-emerald-900'
                              }`}
                            >
                              <CheckCircle className="w-2.5 h-2.5" />
                              {isInactive ? 'Hidden / Paused' : 'Active in Store'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center space-x-1.5">
                              {/* Stock Adjuster */}
                              <div className="inline-flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
                                <button 
                                  onClick={() => onUpdateStock(p.id, Math.max(0, stockVal - 5))}
                                  title="Reduce stock by 5"
                                  className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="px-1.5 font-mono font-bold text-white text-xs">{stockVal}</span>
                                <button 
                                  onClick={() => onUpdateStock(p.id, stockVal + 10)}
                                  title="Add 10 more stock"
                                  className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                                >
                                  +
                                </button>
                              </div>

                              {/* Edit Product Button */}
                              <button
                                onClick={() => setEditingProduct({ ...p })}
                                title="Edit Product Details"
                                className="p-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-800 transition cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Product Button */}
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete "${p.title}"?`)) {
                                    onDeleteProduct && onDeleteProduct(p.id);
                                  }
                                }}
                                title="Delete Product"
                                className="p-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ORDERS & AWB PACKAGING / SHIPPING DISPATCH */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <h3 className="font-bold text-sm text-white">Merchant Order Fulfillment Queue</h3>
                <p className="text-slate-400 text-[11px]">Pack shipments, generate AWB shipping slips &amp; hand over to Delhivery logistics</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 font-semibold">Filter:</span>
                {['ALL', 'PLACED', 'CONFIRMED', 'SHIPPED'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                      statusFilter === f ? 'bg-[#febd69] text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-12 text-center text-slate-400 space-y-2">
                  <Truck className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                  <p className="font-bold text-white text-sm">No new orders waiting for dispatch!</p>
                  <p className="text-xs text-slate-400">
                    Switch to the Buyer Storefront to place a live test order, and it will immediately show up here.
                  </p>
                  <button 
                    onClick={onBackToStore}
                    className="mt-3 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition"
                  >
                    Go Place a Test Order →
                  </button>
                </div>
              ) : (
                orders
                  .filter(o => statusFilter === 'ALL' || o.status === statusFilter)
                  .map(order => {
                    const isShipped = order.status === 'SHIPPED';
                    const isConfirmed = order.status === 'CONFIRMED';
                    const isCancelled = order.status === 'CANCELLED';

                    return (
                      <div key={order.orderNumber} className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3 shadow-md hover:border-slate-700 transition">
                        
                        {/* Order Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-blue-400 text-sm">{order.orderNumber}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isCancelled ? 'bg-red-950 text-red-400 border border-red-800' :
                              isShipped ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                              isConfirmed ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                              'bg-blue-950 text-blue-400 border border-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          
                          <div className="text-right flex items-center space-x-3">
                            <span className="text-slate-400 text-[11px]">Payment Mode: <strong className="text-white uppercase">{order.paymentMode || 'COD'}</strong></span>
                            <span className="text-sm font-black text-amber-400">₹{order.totalAmount?.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Order Details Body */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <div>
                            <p className="text-slate-400 text-[10px] uppercase font-bold">Buyer Delivery Address</p>
                            <p className="font-semibold text-white mt-0.5">{order.customerName}</p>
                            <p className="text-slate-400 text-[11px]">{order.shippingAddress}</p>
                            <p className="text-slate-500 text-[11px]">Phone: {order.customerPhone || '9876543210'}</p>
                          </div>

                          <div>
                            <p className="text-slate-400 text-[10px] uppercase font-bold">Ordered Items</p>
                            <div className="mt-0.5 space-y-1">
                              {order.items && order.items.length > 0 ? (
                                order.items.map((it, idx) => (
                                  <p key={idx} className="text-slate-200 text-[11px] font-medium line-clamp-1">
                                    • {it.quantity}x {it.title} (₹{it.price?.toLocaleString()})
                                  </p>
                                ))
                              ) : (
                                <p className="text-slate-300 text-[11px]">• Marketplace Packaged Merchandise</p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col justify-between items-start md:items-end">
                            <p className="text-slate-400 text-[10px] uppercase font-bold">Fulfillment Partner</p>
                            <p className="text-emerald-400 font-bold text-xs flex items-center gap-1 mt-0.5">
                              <Truck className="w-3.5 h-3.5" /> Delhivery Surface Express
                            </p>
                            
                            {/* Actions & Dynamic Lifecycle Progress */}
                            <div className="flex flex-wrap items-center gap-1.5 mt-3 justify-start md:justify-end">
                              <button 
                                onClick={() => setSelectedAwbOrder(order)}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5 text-amber-400" /> AWB Label
                              </button>
                              
                              {order.status === 'PLACED' && (
                                <button 
                                  onClick={() => onUpdateOrderStatus(order.orderNumber, 'CONFIRMED')}
                                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer active:scale-95 shadow"
                                >
                                  1. Pack &amp; Confirm 📦
                                </button>
                              )}

                              {order.status === 'CONFIRMED' && (
                                <button 
                                  onClick={() => onUpdateOrderStatus(order.orderNumber, 'SHIPPED')}
                                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer active:scale-95 shadow"
                                >
                                  2. Dispatch &amp; Ship 🚚
                                </button>
                              )}

                              {order.status === 'SHIPPED' && (
                                <button 
                                  onClick={() => onUpdateOrderStatus(order.orderNumber, 'OUT_FOR_DELIVERY')}
                                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer active:scale-95 shadow"
                                >
                                  3. Out for Delivery 🛵
                                </button>
                              )}

                              {order.status === 'OUT_FOR_DELIVERY' && (
                                <button 
                                  onClick={() => onUpdateOrderStatus(order.orderNumber, 'DELIVERED')}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer active:scale-95 shadow"
                                >
                                  4. Mark Delivered ✅
                                </button>
                              )}

                              {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                                <button 
                                  onClick={() => {
                                    if (window.confirm(`Cancel order ${order.orderNumber}?`)) {
                                      onUpdateOrderStatus(order.orderNumber, 'CANCELLED');
                                    }
                                  }}
                                  className="bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-800 font-bold px-2 py-1.5 rounded-lg text-xs transition cursor-pointer"
                                >
                                  Cancel ✕
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PAYOUTS & ESCROW LEDGER */}
        {/* ========================================================================= */}
        {activeTab === 'payouts' && (
          <div className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Gross Merchandise Value (GMV)</p>
                <h3 className="text-2xl font-black text-white">₹{grossSales.toLocaleString()}</h3>
                <p className="text-[11px] text-slate-400">Total customer order payments collected via escrow</p>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Platform Fee Deduction</p>
                <h3 className="text-2xl font-black text-amber-400">- ₹{(platformFee + gstOnFee).toLocaleString()}</h3>
                <p className="text-[11px] text-slate-400">10% Platform Commission (₹{platformFee.toLocaleString()}) + 18% GST (₹{gstOnFee.toLocaleString()})</p>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Net Vendor Payout (To Bank)</p>
                <h3 className="text-2xl font-black text-emerald-400">₹{netPayout.toLocaleString()}</h3>
                <p className="text-[11px] text-emerald-300 font-semibold">T+3 Escrow Release: Every Tuesday</p>
              </div>

            </div>

            {/* Bank Account Settlement Card */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-white text-sm">Designated Bank Account for Automated NEFT / RTGS Payout</h4>
                  <p className="text-slate-400 text-xs">Funds are released automatically once order passes 7-day return window</p>
                </div>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Active &amp; Verified
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px]">Bank Name</span>
                  <p className="font-bold text-white mt-0.5">{storeInfo.bankName}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Account Number</span>
                  <p className="font-mono font-bold text-white mt-0.5">{storeInfo.accountNumber}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">IFSC Code</span>
                  <p className="font-mono font-bold text-amber-400 mt-0.5">{storeInfo.ifscCode}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Account Holder</span>
                  <p className="font-bold text-white mt-0.5">{storeInfo.ownerName}</p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 justify-end">
                <button 
                  onClick={() => showToast('Payout statement downloaded (PDF)!')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-amber-400" /> Download Statement
                </button>
                <button 
                  onClick={() => showToast(`💸 Escrow settlement of ₹${netPayout.toLocaleString()} transferred to ${storeInfo.bankName} (${storeInfo.accountNumber.slice(-4)})!`)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition cursor-pointer active:scale-95 shadow"
                >
                  <DollarSign className="w-4 h-4" /> Request Immediate Bank Payout
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: RETURN REQUESTS & DISPUTES */}
        {/* ========================================================================= */}
        {activeTab === 'returns' && (
          <div className="space-y-4">
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <h3 className="font-bold text-sm text-white">Customer Return Dispute &amp; Replacement Queue</h3>
                <p className="text-slate-400 text-[11px]">Manage customer return requests within 7-day replacement window</p>
              </div>
              <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg text-slate-300 font-semibold text-xs">
                1 Pending Ticket
              </span>
            </div>

            {/* Mock Return Ticket */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                <div>
                  <span className="font-bold text-white">Ticket #RET-9821</span>
                  <span className="text-slate-400 ml-2">• Ref Order: <strong className="text-blue-400 font-mono">ORD-89210-4491</strong></span>
                </div>
                <span className="bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Under Review
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Item to Return</p>
                  <p className="font-semibold text-white mt-0.5">Sony WH-1000XM5 Wireless Headphones</p>
                  <p className="text-slate-400 text-[11px]">SKU: SKU-SONY-XM5 • Qty: 1</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Customer Claim</p>
                  <p className="text-slate-200 text-xs mt-0.5">"Outer retail box was unsealed on delivery. Requesting replacement."</p>
                </div>
                <div className="flex items-center justify-start md:justify-end space-x-2">
                  <button 
                    onClick={() => showToast('Return Approved: Pickup courier assigned!')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition"
                  >
                    Accept &amp; Replace
                  </button>
                  <button 
                    onClick={() => showToast('Dispute filed with Marketplace Admin!')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition"
                  >
                    Dispute Claim
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: STORE PROFILE & KYC VERIFICATION */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-6 text-xs max-w-3xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-base text-white">Merchant Business Profile &amp; Legal Entity</h3>
                <p className="text-slate-400 text-xs mt-0.5">Official information registered for tax invoicing and escrow compliance</p>
              </div>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> 100% KYC Approved
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Store / Brand Name</label>
                <input 
                  type="text" 
                  value={storeInfo.storeName}
                  onChange={(e) => setStoreInfo({...storeInfo, storeName: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Owner / Authorized Signatory</label>
                <input 
                  type="text" 
                  value={storeInfo.ownerName}
                  onChange={(e) => setStoreInfo({...storeInfo, ownerName: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Registered GSTIN Number</label>
                <input 
                  type="text" 
                  value={storeInfo.gstin}
                  onChange={(e) => setStoreInfo({...storeInfo, gstin: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg font-mono text-amber-400 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">PAN Card Number</label>
                <input 
                  type="text" 
                  value={storeInfo.panNumber}
                  onChange={(e) => setStoreInfo({...storeInfo, panNumber: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg font-mono text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Registered Logistics Pickup Warehouse Address</label>
              <textarea 
                rows={2}
                value={storeInfo.pickupAddress}
                onChange={(e) => setStoreInfo({...storeInfo, pickupAddress: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="pt-2">
              <button 
                onClick={() => showToast('Store settings saved successfully!')}
                className="bg-[#f08804] hover:bg-[#d87a04] text-white font-bold px-5 py-2.5 rounded-lg text-xs shadow transition cursor-pointer"
              >
                Save Store Profile
              </button>
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW PRODUCT MODAL */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-950 rounded-2xl max-w-xl w-full border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-slate-900 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">List New Product on Marketplace Storefront</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-5 space-y-4 overflow-y-auto text-xs flex-1">
              
              <div>
                <label className="block text-slate-300 font-bold mb-1">Product Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Organic A2 Gir Cow Milk (1 Litre Glass Bottle) or Fresh Malai Paneer"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category *</label>
                  <select 
                    value={newProduct.categoryName}
                    onChange={(e) => setNewProduct({...newProduct, categoryName: e.target.value})}
                    className="w-full bg-slate-900 border border-amber-500/70 px-3 py-2 rounded-lg text-white font-bold text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Dairy & Fresh Milk">🥛 Dairy & Fresh Milk (दूध, दही, पनीर, घी)</option>
                    <option value="Electronics">📱 Electronics & Mobiles</option>
                    <option value="Fashion & Apparel">👕 Fashion & Apparel</option>
                    <option value="Home & Kitchen">🍳 Home & Kitchen</option>
                    <option value="Beauty & Personal Care">💄 Beauty & Personal Care</option>
                    <option value="Books & Stationery">📚 Books & Stationery</option>
                  </select>

                  {/* 1-Click Category Selection Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => setNewProduct({...newProduct, categoryName: 'Dairy & Fresh Milk'})}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-black transition cursor-pointer ${newProduct.categoryName === 'Dairy & Fresh Milk' ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-300' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                    >
                      🥛 Milk & Dairy
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewProduct({...newProduct, categoryName: 'Electronics'})}
                      className={`px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${newProduct.categoryName === 'Electronics' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                    >
                      📱 Electronics
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewProduct({...newProduct, categoryName: 'Fashion & Apparel'})}
                      className={`px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${newProduct.categoryName === 'Fashion & Apparel' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                    >
                      👕 Fashion
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Brand Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Krishna Dairy Farms / Amrit A2"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Selling Price (₹) *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 49999"
                    value={newProduct.basePrice}
                    onChange={(e) => setNewProduct({...newProduct, basePrice: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">MRP Price (₹)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 59999"
                    value={newProduct.mrp}
                    onChange={(e) => setNewProduct({...newProduct, mrp: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Initial Stock Units</label>
                  <input 
                    type="number" 
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Product SKU Code</label>
                  <input 
                    type="text" 
                    placeholder="Auto-generated if empty"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg font-mono text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Image URL</label>
                  <input 
                    type="url" 
                    placeholder="https://..."
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Product Description &amp; Highlights</label>
                <textarea 
                  rows={3}
                  placeholder="Key features, specifications, and warranty details..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-[#f08804] hover:bg-[#d87a04] text-white font-bold py-3 rounded-xl text-sm shadow transition cursor-pointer"
                >
                  Publish Product to Storefront 🚀
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BULK CSV UPLOAD SIMULATOR */}
      {/* ========================================================================= */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-950 rounded-2xl max-w-lg w-full border border-slate-800 shadow-2xl p-6 space-y-4 text-xs">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Bulk CSV Product Catalog Import</h3>
              </div>
              <button onClick={() => setIsBulkModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-300 leading-relaxed">
              Upload multiple product SKUs at once using our Excel/CSV template. Includes title, brand, category, base price, MRP, and initial stock quantities.
            </p>

            <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center space-y-2 bg-slate-900/60 hover:border-amber-500 transition cursor-pointer">
              <FileText className="w-10 h-10 mx-auto text-amber-400" />
              <p className="font-bold text-white text-xs">products_catalog_batch_nov2026.csv (4.8 KB)</p>
              <p className="text-[11px] text-slate-400">Click to upload or drag &amp; drop CSV file</p>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <p className="font-bold text-white">Previewing batch items in file:</p>
              <p>• Apple 20W USB-C Adapter (50 units @ ₹1,699)</p>
              <p>• Logitech MX Master 3S Mouse (18 units @ ₹8,995)</p>
              <p>• boAt Airdopes 141 TWS Earbuds (120 units @ ₹1,299)</p>
            </div>

            <div className="flex space-x-2 pt-2">
              <button 
                onClick={handleBulkUploadSimulate}
                className="flex-1 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black py-2.5 rounded-xl transition shadow cursor-pointer"
              >
                Execute Bulk Import Now (3 SKUs)
              </button>
              <button 
                onClick={() => setIsBulkModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl transition"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: OFFICIAL AIR WAYBILL (AWB) SHIPPING LABEL */}
      {/* ========================================================================= */}
      {selectedAwbOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full border-2 border-slate-900 shadow-2xl p-6 space-y-4 text-xs font-mono">
            
            {/* Shipping Label Top Bar */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <div>
                <h2 className="text-xl font-black tracking-tighter">DELHIVERY EXPRESS</h2>
                <p className="text-[10px] font-bold text-slate-600">AIR WAYBILL (AWB) SHIPPING LABEL</p>
              </div>
              <div className="text-right">
                <button onClick={() => setSelectedAwbOrder(null)} className="text-slate-400 hover:text-slate-800 p-1 font-sans">
                  <X className="w-5 h-5" />
                </button>
                <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded">
                  PRIORITY SURFACE
                </span>
              </div>
            </div>

            {/* Barcode Mock Simulation */}
            <div className="bg-slate-50 border border-slate-300 p-3 rounded-lg text-center space-y-1">
              <div className="text-2xl tracking-[0.3em] font-black select-none text-slate-900">
                ||| | ||||| ||| |||| || ||||| | |||
              </div>
              <p className="font-bold text-sm tracking-widest text-slate-900">
                AWB: DEL-EXP-{(selectedAwbOrder.orderNumber || '84920').replace(/[^0-9]/g, '') || '98421039'}
              </p>
              <p className="text-[10px] text-slate-500">ROUTING CODE: DEL/MUM-HUB-04B • SORT GATE 12</p>
            </div>

            {/* Shipper & Consignee Columns */}
            <div className="grid grid-cols-2 gap-4 border-y border-slate-300 py-3 text-[11px]">
              <div>
                <p className="font-black text-slate-900 uppercase">SHIP FROM (VENDOR):</p>
                <p className="font-bold text-slate-800">{storeInfo.storeName}</p>
                <p className="text-slate-600 text-[10px]">{storeInfo.pickupAddress}</p>
                <p className="text-slate-600">GST: {storeInfo.gstin}</p>
              </div>

              <div>
                <p className="font-black text-slate-900 uppercase">SHIP TO (BUYER):</p>
                <p className="font-bold text-slate-800">{selectedAwbOrder.customerName}</p>
                <p className="text-slate-600 text-[10px]">{selectedAwbOrder.shippingAddress}</p>
                <p className="text-slate-800 font-bold">PIN: {selectedAwbOrder.pincode || '400001'}</p>
                <p className="text-slate-600">Phone: {selectedAwbOrder.customerPhone || '9876543210'}</p>
              </div>
            </div>

            {/* Package Contents & Collectible Amount */}
            <div className="flex items-center justify-between bg-slate-100 p-3 rounded-lg border border-slate-200">
              <div>
                <p className="font-bold text-[11px]">PAYMENT: <span className="uppercase text-blue-700">{selectedAwbOrder.paymentMode || 'COD'}</span></p>
                <p className="text-[10px] text-slate-500">Weight: 0.85 KG • Box Size: Standard</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500">COLLECTIBLE AMOUNT</p>
                <p className="text-base font-black text-slate-900">₹{selectedAwbOrder.totalAmount?.toLocaleString()}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-[10px] text-slate-500 font-sans">
                Affix securely on merchant packaging box before carrier pickup.
              </p>
              <div className="flex space-x-2 font-sans">
                <button 
                  onClick={() => window.print()}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print AWB Label
                </button>
                <button 
                  onClick={() => setSelectedAwbOrder(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: EDIT PRODUCT MODAL */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-950 rounded-2xl max-w-xl w-full border border-slate-800 shadow-2xl p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Edit2 className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm text-white">Edit Product SKU Details</h3>
              </div>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              onEditProduct && onEditProduct(editingProduct);
              setEditingProduct(null);
            }} className="space-y-3.5">
              
              <div>
                <label className="block text-slate-300 font-bold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={editingProduct.categoryName}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.basePrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.mrp}
                    onChange={(e) => setEditingProduct({ ...editingProduct, mrp: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-white"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-2.5 rounded-xl transition cursor-pointer shadow"
                >
                  Save Product Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
