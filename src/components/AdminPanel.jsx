import React, { useState } from 'react';
import { 
  ShieldCheck, Users, Percent, Tag, AlertTriangle, 
  TrendingUp, DollarSign, Store, ShoppingBag, ArrowLeft, 
  CheckCircle, XCircle, Plus, Edit2, Trash2, Download, 
  Search, Filter, Lock, Check, Clock, Eye, Layers, 
  HelpCircle, Sparkles, RefreshCw, ChevronRight, FileText
} from 'lucide-react';

export default function AdminPanel({ 
  onBackToStore, 
  onOpenSellerHub,
  categories, 
  onAddCategory, 
  onDeleteCategory,
  onEditCategory,
  products, 
  onDeleteProduct,
  onEditProduct,
  orders, 
  onUpdateOrderStatus,
  commissionRules: propCommissionRules,
  onUpdateCommission,
  coupons: propCoupons,
  onAddCoupon,
  onToggleCoupon,
  onDeleteCoupon,
  showToast 
}) {
  const [activeTab, setActiveTab] = useState('sellers'); // 'sellers' | 'analytics' | 'commission' | 'categories' | 'coupons' | 'disputes' | 'ledger'
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');

  // Seller Onboarding Applications Queue
  const [sellersQueue, setSellersQueue] = useState([
    {
      id: 1,
      storeName: 'SuperRetail Mobiles & Tech',
      ownerName: 'Vikram Malhotra',
      email: 'vikram.malhotra@superretail.in',
      phone: '+91 98201 54321',
      gstin: '27AABCS1429B1Z8',
      pan: 'AABCS1429B',
      bankName: 'HDFC Bank',
      accountNo: '50200038921849',
      status: 'APPROVED',
      appliedDate: '10 Nov 2026',
      productsListed: 6,
      gmvGenerated: 148500
    },
    {
      id: 2,
      storeName: 'Trendz Apparel & Footwear',
      ownerName: 'Ananya Sharma',
      email: 'contact@trendzfashion.com',
      phone: '+91 97112 88412',
      gstin: '07AAACT2910G1ZV',
      pan: 'AAACT2910G',
      bankName: 'ICICI Bank',
      accountNo: '001205018294',
      status: 'PENDING',
      appliedDate: '14 Nov 2026',
      productsListed: 2,
      gmvGenerated: 9994
    },
    {
      id: 3,
      storeName: 'KitchenKraft Culinary Solutions',
      ownerName: 'Ramesh Patel',
      email: 'seller@kitchenkraft.in',
      phone: '+91 98980 12345',
      gstin: '24AAECK8821M1ZX',
      pan: 'AAECK8821M',
      bankName: 'State Bank of India',
      accountNo: '30918293849',
      status: 'PENDING',
      appliedDate: '13 Nov 2026',
      productsListed: 1,
      gmvGenerated: 8999
    }
  ]);

  // Use Dynamic Commission Rules & Coupons from Global State if available
  const commissionRules = propCommissionRules || [
    { id: 0, categoryName: 'Dairy & Fresh Milk', defaultRate: 6, activeSellers: 8, lastUpdated: 'Today' },
    { id: 1, categoryName: 'Electronics', defaultRate: 8, activeSellers: 14, lastUpdated: '12 Nov 2026' },
    { id: 2, categoryName: 'Fashion & Apparel', defaultRate: 15, activeSellers: 28, lastUpdated: '10 Nov 2026' },
    { id: 3, categoryName: 'Home & Kitchen', defaultRate: 12, activeSellers: 19, lastUpdated: '08 Nov 2026' },
    { id: 4, categoryName: 'Beauty & Personal Care', defaultRate: 10, activeSellers: 12, lastUpdated: '11 Nov 2026' },
    { id: 5, categoryName: 'Books & Stationery', defaultRate: 5, activeSellers: 9, lastUpdated: '05 Nov 2026' }
  ];

  const coupons = propCoupons || [
    {
      id: 1,
      code: 'MEGAFREEDOM',
      discountType: 'PERCENT',
      discountValue: 20,
      maxDiscount: 1500,
      minOrderAmount: 2499,
      validUntil: '30 Nov 2026',
      timesUsed: 428,
      status: 'ACTIVE'
    },
    {
      id: 2,
      code: 'WELCOME500',
      discountType: 'FLAT',
      discountValue: 500,
      maxDiscount: 500,
      minOrderAmount: 1999,
      validUntil: '31 Dec 2026',
      timesUsed: 1205,
      status: 'ACTIVE'
    },
    {
      id: 3,
      code: 'FESTIVESALE',
      discountType: 'PERCENT',
      discountValue: 15,
      maxDiscount: 3000,
      minOrderAmount: 4999,
      validUntil: '15 Dec 2026',
      timesUsed: 890,
      status: 'ACTIVE'
    }
  ];

  // New Coupon Form State
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'PERCENT',
    discountValue: 10,
    maxDiscount: 1000,
    minOrderAmount: 999,
    validUntil: '31 Dec 2026'
  });

  // Customer Return Disputes Queue
  const [disputes, setDisputes] = useState([
    {
      id: 101,
      orderNumber: 'ORD-89210-4491',
      customerName: 'Rahul Sharma',
      sellerName: 'SuperRetail Mobiles & Tech',
      itemTitle: 'Sony WH-1000XM5 Wireless Headphones',
      amount: 28990,
      issueReason: 'Outer seal broken upon courier receipt',
      customerProof: 'Unboxing video submitted',
      status: 'OPEN_DISPUTE',
      escrowAction: 'FUNDS_HELD'
    },
    {
      id: 102,
      orderNumber: 'ORD-74129-1982',
      customerName: 'Priya Verma',
      sellerName: 'Trendz Apparel & Footwear',
      itemTitle: "Men's Slim Fit Casual Denim Jacket",
      amount: 1499,
      issueReason: 'Size received is L instead of ordered M',
      customerProof: 'Label photos verified',
      status: 'RESOLVED_REFUNDED',
      escrowAction: 'BUYER_REFUNDED'
    }
  ]);

  // Calculate High-Level Platform Financial KPIs
  const liveOrderSum = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalMarketplaceGmv = liveOrderSum + 1845200; // Baseline GMV + live orders
  const avgCommissionRate = 0.105; // 10.5% average
  const netPlatformCommission = Math.round(totalMarketplaceGmv * avgCommissionRate);
  const pendingEscrowBalance = Math.round(totalMarketplaceGmv * 0.22); // 22% in active delivery escrow

  // Seller Approval Handlers
  const handleApproveSeller = (sellerId) => {
    setSellersQueue(prev => prev.map(s => s.id === sellerId ? { ...s, status: 'APPROVED' } : s));
    showToast('Merchant KYC Approved! Store activated on Marketplace.');
  };

  const handleRejectSeller = (sellerId) => {
    setSellersQueue(prev => prev.map(s => s.id === sellerId ? { ...s, status: 'REJECTED' } : s));
    showToast('Merchant KYC Rejected. Notification email dispatched.');
  };

  // Commission Rule Updater
  const handleUpdateCommission = (ruleId, newRate) => {
    if (onUpdateCommission) {
      onUpdateCommission(ruleId, newRate);
    }
  };

  // Add Category Handler
  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName) return;
    const cat = {
      id: Date.now(),
      name: newCatName,
      slug: newCatSlug || newCatName.toLowerCase().replace(/[^a-z0-9]/g, '-')
    };
    onAddCategory(cat);
    setIsCategoryModalOpen(false);
    setNewCatName('');
    setNewCatSlug('');
    showToast(`Master Category "${cat.name}" added to platform!`);
  };

  // Add Coupon Handler
  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    const createdCoupon = {
      id: Date.now(),
      code: newCoupon.code.trim().toUpperCase(),
      discountType: newCoupon.discountType,
      discountValue: parseInt(newCoupon.discountValue) || 10,
      maxDiscount: parseInt(newCoupon.maxDiscount) || 500,
      minOrderAmount: parseInt(newCoupon.minOrderAmount) || 999,
      validUntil: newCoupon.validUntil,
      timesUsed: 0,
      status: 'ACTIVE'
    };
    onAddCoupon(createdCoupon);
    setIsCouponModalOpen(false);
    setNewCoupon({
      code: '',
      discountType: 'PERCENT',
      discountValue: 10,
      maxDiscount: 1000,
      minOrderAmount: 999,
      validUntil: '31 Dec 2026'
    });
    showToast(`Coupon "${createdCoupon.code}" published live!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* SUPER ADMIN HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-indigo-900/60 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Logo & Platform Role */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-2.5 rounded-xl text-white font-black text-xl flex items-center gap-1.5 shadow-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
              <span className="tracking-tight">CONTROL TOWER</span>
            </div>
            <div className="hidden sm:block border-l border-slate-800 pl-3">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm text-white">Super Admin Console</span>
                <span className="bg-indigo-950 text-indigo-400 border border-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Root Authority
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Cloud DB: Supabase PostgreSQL (Port 5432) • SSL Active</p>
            </div>
          </div>

          {/* Quick Ecosystem Jump Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
            <button 
              onClick={onOpenSellerHub}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Store className="w-4 h-4 text-slate-950" />
              <span className="hidden md:inline">Open Seller Hub</span>
            </button>
            <button 
              onClick={onBackToStore}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-1.5 rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buyer Storefront</span>
            </button>
          </div>

        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-slate-950/80 border-t border-slate-800 text-xs px-4 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center space-x-1 min-w-max py-1.5">
            
            <button 
              onClick={() => setActiveTab('sellers')}
              className={`px-4 py-2 font-bold rounded-lg transition flex items-center gap-2 ${
                activeTab === 'sellers' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Seller KYC Onboarding</span>
              <span className="bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full text-[10px]">
                {sellersQueue.filter(s => s.status === 'PENDING').length} Pending
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 font-bold rounded-lg transition flex items-center gap-2 ${
                activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Sales &amp; GMV Analytics</span>
            </button>

            <button 
              onClick={() => setActiveTab('commission')}
              className={`px-4 py-2 font-bold rounded-lg transition flex items-center gap-2 ${
                activeTab === 'commission' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Percent className="w-4 h-4" />
              <span>Commission Rules (5%-15%)</span>
            </button>

            <button 
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 font-bold rounded-lg transition flex items-center gap-2 ${
                activeTab === 'categories' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Category Schema</span>
            </button>

            <button 
              onClick={() => setActiveTab('coupons')}
              className={`px-4 py-2 font-bold rounded-lg transition flex items-center gap-2 ${
                activeTab === 'coupons' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Coupons &amp; Promo Engine</span>
            </button>

            <button 
              onClick={() => setActiveTab('disputes')}
              className={`px-4 py-2 font-bold rounded-lg transition flex items-center gap-2 ${
                activeTab === 'disputes' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Disputes &amp; Escrow Anti-Fraud</span>
              <span className="bg-red-500 text-white font-black px-1.5 py-0.2 rounded-full text-[10px]">
                {disputes.filter(d => d.status === 'OPEN_DISPUTE').length}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('ledger')}
              className={`px-4 py-2 font-bold rounded-lg transition flex items-center gap-2 ${
                activeTab === 'ledger' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Financial Escrow Ledger</span>
            </button>

          </div>
        </div>
      </header>

      {/* TOP KPI PLATFORM STATS STRIP */}
      <div className="bg-slate-900 border-b border-slate-800 py-4">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Gross Platform GMV</p>
              <h3 className="text-xl md:text-2xl font-black text-white mt-1">₹{totalMarketplaceGmv.toLocaleString()}</h3>
              <p className="text-[10px] text-emerald-400 font-bold mt-0.5">+24.8% from last month</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Net Commission Earned</p>
              <h3 className="text-xl md:text-2xl font-black text-emerald-400 mt-1">₹{netPlatformCommission.toLocaleString()}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Average Take Rate: ~10.5%</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Escrow Reserve</p>
              <h3 className="text-xl md:text-2xl font-black text-amber-400 mt-1">₹{pendingEscrowBalance.toLocaleString()}</h3>
              <p className="text-[10px] text-amber-500/80 font-bold mt-0.5">Held safely till delivery + 7 days</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Audited Merchants</p>
              <h3 className="text-xl md:text-2xl font-black text-purple-400 mt-1">3 Sellers Live</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">100% GST &amp; PAN verified</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
          </div>

        </div>
      </div>

      {/* MAIN ADMIN WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full space-y-6">

        {/* ========================================================================= */}
        {/* MODULE 1: SELLER KYC ONBOARDING & AUDIT */}
        {/* ========================================================================= */}
        {activeTab === 'sellers' && (
          <div className="space-y-4">
            
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-white">Merchant KYC Onboarding Verification Queue</h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Verify GSTIN, PAN Card, Bank Accounts, and FSSAI Dairy licenses before stores can accept buyer payments.
                </p>
              </div>
              <span className="bg-indigo-950 text-indigo-400 border border-indigo-800 px-3 py-1 rounded-lg text-xs font-bold">
                Automated Government API Link: Active
              </span>
            </div>

            {/* Sellers Applications Table */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider font-bold">
                      <th className="py-3 px-4">Merchant Store &amp; Owner</th>
                      <th className="py-3 px-3">Tax Identifiers (GST/PAN)</th>
                      <th className="py-3 px-3">Settlement Bank</th>
                      <th className="py-3 px-3">Catalog Size &amp; Sales</th>
                      <th className="py-3 px-3 text-center">KYC Audit Status</th>
                      <th className="py-3 px-4 text-right">Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {sellersQueue.map(seller => {
                      const isApproved = seller.status === 'APPROVED';
                      const isPending = seller.status === 'PENDING';

                      return (
                        <tr key={seller.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-4 px-4">
                            <p className="font-bold text-white text-sm">{seller.storeName}</p>
                            <p className="text-slate-400 text-[11px]">{seller.ownerName} • {seller.phone}</p>
                            <p className="text-slate-500 font-mono text-[10px]">{seller.email}</p>
                          </td>
                          <td className="py-4 px-3 font-mono">
                            <span className="text-amber-400 font-bold block">{seller.gstin}</span>
                            <span className="text-slate-400 text-[11px]">PAN: {seller.pan}</span>
                          </td>
                          <td className="py-4 px-3">
                            <p className="font-bold text-white">{seller.bankName}</p>
                            <p className="font-mono text-slate-400 text-[11px]">A/C: {seller.accountNo}</p>
                          </td>
                          <td className="py-4 px-3 font-medium">
                            <span className="text-white font-bold">{seller.productsListed} Live SKUs</span>
                            <span className="text-slate-400 block text-[11px]">GMV: ₹{seller.gmvGenerated?.toLocaleString()}</span>
                          </td>
                          <td className="py-4 px-3 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isApproved ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                              isPending ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                              'bg-red-950 text-red-400 border border-red-800'
                            }`}>
                              {seller.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {isPending ? (
                              <div className="inline-flex space-x-2">
                                <button 
                                  onClick={() => handleApproveSeller(seller.id)}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shadow"
                                >
                                  Approve KYC ✓
                                </button>
                                <button 
                                  onClick={() => handleRejectSeller(seller.id)}
                                  className="bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer"
                                >
                                  Reject ✕
                                </button>
                              </div>
                            ) : (
                              <span className="text-emerald-400 text-xs font-bold inline-flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> Live Merchant
                              </span>
                            )}
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
        {/* MODULE 1.5: VISUAL SALES & GMV ANALYTICS */}
        {/* ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" /> Executive Platform Revenue &amp; GMV Growth
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Real-time analytics across all multi-vendor storefronts, escrow settlements, and cold-chain dairy operations.
                </p>
              </div>
              <button
                onClick={() => showToast('Disbursed ₹405,944 settlement to 18 verified merchants!')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow"
              >
                <DollarSign className="w-4 h-4" /> Disburse Vendor Settlements
              </button>
            </div>

            {/* 7-Day Revenue Growth Chart (Pure CSS/SVG Bars) */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">7-Day Gross Marketplace Sales (GMV)</h4>
                  <p className="text-slate-400 text-xs">Peak volume driven by Dairy early morning milk subscriptions &amp; festive electronics.</p>
                </div>
                <span className="text-emerald-400 font-extrabold text-xs bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                  +34.8% Week-over-Week
                </span>
              </div>

              {/* Bar Chart Graphic */}
              <div className="pt-6 pb-2">
                <div className="flex items-end justify-between gap-3 h-48 border-b border-slate-800 px-4">
                  {[
                    { day: 'Mon', gmv: '₹1.8L', height: '42%' },
                    { day: 'Tue', gmv: '₹2.1L', height: '50%' },
                    { day: 'Wed', gmv: '₹2.5L', height: '58%' },
                    { day: 'Thu', gmv: '₹3.0L', height: '68%' },
                    { day: 'Fri', gmv: '₹3.9L', height: '82%' },
                    { day: 'Sat', gmv: '₹4.5L', height: '90%' },
                    { day: 'Sun (Today)', gmv: '₹5.2L', height: '100%', highlight: true }
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-white transition">
                        {bar.gmv}
                      </span>
                      <div className="w-full max-w-[42px] bg-slate-800 rounded-t-lg overflow-hidden flex items-end justify-center transition group-hover:opacity-90">
                        <div 
                          style={{ height: bar.height }}
                          className={`w-full rounded-t-md transition-all duration-500 ${
                            bar.highlight 
                              ? 'bg-gradient-to-t from-indigo-600 via-purple-500 to-pink-500' 
                              : 'bg-gradient-to-t from-slate-700 to-indigo-500'
                          }`}
                        />
                      </div>
                      <span className={`text-[11px] font-bold ${bar.highlight ? 'text-indigo-400' : 'text-slate-400'}`}>
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Performance Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">🥛 Dairy &amp; Fresh Milk</span>
                  <span className="text-emerald-400 font-extrabold">38% Share</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[38%] rounded-full"></div>
                </div>
                <p className="text-[11px] text-slate-400">High retention rate via daily early morning subscriptions.</p>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">📱 Electronics &amp; Gadgets</span>
                  <span className="text-blue-400 font-extrabold">32% Share</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[32%] rounded-full"></div>
                </div>
                <p className="text-[11px] text-slate-400">Largest ticket size per order; 8% platform fee rate.</p>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">👗 Fashion, Home &amp; Beauty</span>
                  <span className="text-purple-400 font-extrabold">30% Share</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-[30%] rounded-full"></div>
                </div>
                <p className="text-[11px] text-slate-400">Highest margin category with 12%-15% commission fee.</p>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 2: CATEGORY COMMISSION RULES MATRIX */}
        {/* ========================================================================= */}
        {activeTab === 'commission' && (
          <div className="space-y-4">
            
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Platform Commission Structure (5% - 15%)</h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Automated commission deducted from merchant payouts on every successfully delivered order
                </p>
              </div>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-lg text-xs font-bold">
                Tax: 18% GST Applicable on Fee
              </span>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider font-bold">
                    <th className="py-3 px-4">Marketplace Category</th>
                    <th className="py-3 px-3">Active Vendors</th>
                    <th className="py-3 px-3">Current Platform Fee</th>
                    <th className="py-3 px-3">GST Surcharge</th>
                    <th className="py-3 px-4 text-right">Update Fee Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {commissionRules.map(rule => (
                    <tr key={rule.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-bold text-white text-sm">
                        {rule.categoryName}
                      </td>
                      <td className="py-3.5 px-3 text-slate-300">
                        {rule.activeSellers} Registered Merchants
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-amber-400 text-sm">
                        {rule.defaultRate}%
                      </td>
                      <td className="py-3.5 px-3 text-slate-400">
                        +18% GST ({(rule.defaultRate * 0.18).toFixed(2)}%)
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <select 
                          value={rule.defaultRate}
                          onChange={(e) => handleUpdateCommission(rule.id, e.target.value)}
                          className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="5">5% (Low Margin)</option>
                          <option value="6">6% (Dairy Fresh Rate)</option>
                          <option value="8">8% (Consumer Tech)</option>
                          <option value="10">10% (General Retail)</option>
                          <option value="12">12% (Home &amp; Kitchen)</option>
                          <option value="15">15% (Fashion Premium)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 3: MASTER CATEGORY SCHEMA TAXONOMY */}
        {/* ========================================================================= */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Master Category Schema Taxonomy</h3>
                <p className="text-slate-400 text-xs mt-0.5">Define platform taxonomy, slug routes, and catalog organization</p>
              </div>
              <button 
                onClick={() => setIsCategoryModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
              >
                <Plus className="w-4 h-4" /> Add Master Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((cat, idx) => (
                <div key={cat.id || idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 hover:border-indigo-500/50 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{cat.name}</span>
                    <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded font-mono text-indigo-400 border border-slate-800">
                      ID: {cat.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400 text-xs font-mono">slug: /{cat.slug || cat.name.toLowerCase()}</span>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete category "${cat.name}"?`)) {
                          onDeleteCategory && onDeleteCategory(cat.id);
                        }
                      }}
                      className="p-1 rounded text-red-400 hover:bg-red-950/60 transition cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 4: PROMOTIONAL COUPONS & MARKETING ENGINE */}
        {/* ========================================================================= */}
        {activeTab === 'coupons' && (
          <div className="space-y-4">
            
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Promotional Discount Engine &amp; Vouchers</h3>
                <p className="text-slate-400 text-xs mt-0.5">Control site-wide festive coupons, minimum cart requirements &amp; limits</p>
              </div>
              <button 
                onClick={() => setIsCouponModalOpen(true)}
                className="bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
              >
                <Plus className="w-4 h-4 text-slate-950" /> Create Promo Voucher
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map(coupon => (
                <div key={coupon.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2.5 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-amber-400 text-base tracking-wider bg-slate-950 px-2.5 py-1 rounded border border-amber-500/30">
                      {coupon.code}
                    </span>
                    <span className="bg-emerald-950 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-800">
                      {coupon.status}
                    </span>
                  </div>
                  <div className="text-xs space-y-1 text-slate-300">
                    <p>Benefit: <strong>{coupon.discountType === 'PERCENT' ? `${coupon.discountValue}% Off` : `₹${coupon.discountValue} Flat Discount`}</strong></p>
                    <p className="text-slate-400 text-[11px]">Min Order: ₹{coupon.minOrderAmount.toLocaleString()} • Max Cap: ₹{coupon.maxDiscount.toLocaleString()}</p>
                    <p className="text-slate-400 text-[11px]">Redemptions: <strong className="text-indigo-400">{coupon.timesUsed} orders</strong></p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => onToggleCoupon && onToggleCoupon(coupon.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded transition cursor-pointer ${
                        coupon.status === 'ACTIVE' 
                          ? 'bg-amber-950 text-amber-300 hover:bg-amber-900 border border-amber-800' 
                          : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800'
                      }`}
                    >
                      {coupon.status === 'ACTIVE' ? 'Pause Voucher' : 'Activate Voucher'}
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete coupon "${coupon.code}"?`)) {
                          onDeleteCoupon && onDeleteCoupon(coupon.id);
                        }
                      }}
                      className="p-1 rounded text-red-400 hover:bg-red-950/60 transition cursor-pointer"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 5: RETURN DISPUTES & ESCROW INTERVENTION */}
        {/* ========================================================================= */}
        {activeTab === 'disputes' && (
          <div className="space-y-4">
            
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Customer Return Disputes &amp; Escrow Intervention</h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Arbitrate claims where buyer rejects delivery or seller disputes returned condition
                </p>
              </div>
              <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1 rounded-lg text-xs font-bold">
                Escrow Freeze Authority
              </span>
            </div>

            <div className="space-y-3">
              {disputes.map(dispute => (
                <div key={dispute.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                    <div>
                      <span className="font-bold text-white">Dispute #{dispute.id}</span>
                      <span className="text-slate-400 ml-2">Order: <strong className="text-indigo-400 font-mono">{dispute.orderNumber}</strong></span>
                    </div>
                    <span className="bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {dispute.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Buyer Details</p>
                      <p className="font-semibold text-white">{dispute.customerName}</p>
                      <p className="text-slate-400 text-[11px]">{dispute.customerProof}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Merchant Store</p>
                      <p className="font-semibold text-white">{dispute.sellerName}</p>
                      <p className="text-slate-400 text-[11px]">Value: ₹{dispute.amount.toLocaleString()}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Issue Claim</p>
                      <p className="text-slate-200 text-xs mt-0.5">{dispute.issueReason}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <span className="text-[11px] text-amber-400 font-mono">
                      Current Escrow Action: {dispute.escrowAction}
                    </span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => showToast(`Escrow of ₹${dispute.amount.toLocaleString()} refunded to Buyer!`)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
                      >
                        Refund Customer ✓
                      </button>
                      <button 
                        onClick={() => showToast(`Escrow of ₹${dispute.amount.toLocaleString()} released to Seller!`)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
                      >
                        Release to Vendor
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 6: FINANCIAL ESCROW LEDGER AUDIT */}
        {/* ========================================================================= */}
        {activeTab === 'ledger' && (
          <div className="space-y-4">
            
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Platform Financial Escrow Ledger Audit</h3>
                <p className="text-slate-400 text-xs mt-0.5">Real-time ledger audit reconciling customer inflow with merchant settlements</p>
              </div>
              <button 
                onClick={() => showToast('Full financial audit exported to CSV!')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-indigo-400" /> Export Ledger CSV
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-1">
                <p className="text-slate-400 text-xs font-bold uppercase">Customer Inflows (Escrow)</p>
                <h4 className="text-2xl font-black text-white">₹{totalMarketplaceGmv.toLocaleString()}</h4>
                <p className="text-[11px] text-emerald-400">100% verified digital &amp; COD collection</p>
              </div>
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-1">
                <p className="text-slate-400 text-xs font-bold uppercase">Merchant Disbursals</p>
                <h4 className="text-2xl font-black text-blue-400">₹{(totalMarketplaceGmv - netPlatformCommission - pendingEscrowBalance).toLocaleString()}</h4>
                <p className="text-[11px] text-slate-400">Settled to merchant verified bank accounts</p>
              </div>
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-1">
                <p className="text-slate-400 text-xs font-bold uppercase">Platform Net Profit Reserve</p>
                <h4 className="text-2xl font-black text-emerald-400">₹{netPlatformCommission.toLocaleString()}</h4>
                <p className="text-[11px] text-slate-400">After 18% GST tax liability provision</p>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD CATEGORY SCHEMA MODAL */}
      {/* ========================================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full border border-slate-800 shadow-2xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-white">Create New Master Category</h3>
            
            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Category Display Name *</label>
                <input 
                  type="text" required
                  placeholder="e.g. Sports &amp; Fitness"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">URL Slug (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g. sports-fitness"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl transition cursor-pointer"
                >
                  Save Category
                </button>
                <button 
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD COUPON MODAL */}
      {/* ========================================================================= */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full border border-slate-800 shadow-2xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-white">Create Promotional Discount Voucher</h3>
            
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Coupon Promo Code *</label>
                <input 
                  type="text" required
                  placeholder="e.g. DIWALI50"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-amber-400 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Discount Type</label>
                  <select 
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white"
                  >
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Discount Value *</label>
                  <input 
                    type="number" required
                    placeholder="e.g. 15"
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({...newCoupon, discountValue: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Min Cart Order (₹)</label>
                  <input 
                    type="number"
                    value={newCoupon.minOrderAmount}
                    onChange={(e) => setNewCoupon({...newCoupon, minOrderAmount: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Max Cap Discount (₹)</label>
                  <input 
                    type="number"
                    value={newCoupon.maxDiscount}
                    onChange={(e) => setNewCoupon({...newCoupon, maxDiscount: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button 
                  type="submit"
                  className="flex-1 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black py-2 rounded-xl transition cursor-pointer"
                >
                  Publish Coupon Live
                </button>
                <button 
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
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
