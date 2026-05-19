'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/authStore';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  // 1. Database State lists
  const [brands, setBrands] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // 2. Brand Form state
  const [brandName, setBrandName] = useState('');

  // 3. Product Form states
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('10'); 
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodBrandId, setProdBrandId] = useState('');
  const [prodDescription, setProdDescription] = useState('');

  // 4. Product Editing States (Floating Brand Panel)
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editBrandId, setEditBrandId] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  // Status & loading indicators
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Hydration & Strict Admin Route Guard
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Strict Guard: Redirect to homepage if user is logged out or NOT an admin
    if (mounted && (!user || user.role !== 'admin')) {
      router.push('/');
    } else if (mounted && user?.role === 'admin') {
      // If valid admin, load active database catalogs and orders
      loadCatalogData();
    }
  }, [mounted, user, router]);

  // Load brands, products, and orders from NestJS backend
  const loadCatalogData = async () => {
    try {
      const [brandsRes, productsRes, ordersRes] = await Promise.all([
        api.get('/brands'),
        api.get('/products'),
        api.get('/orders'),
      ]);
      setBrands(brandsRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      if (brandsRes.data.length > 0 && !prodBrandId) {
        setProdBrandId(brandsRes.data[0].id); // Pre-select first brand in list
      }
    } catch (error) {
      console.error('Failed to load catalog data:', error);
    }
  };

  if (!mounted || !user || user.role !== 'admin') {
    return <div className="min-h-screen bg-base-100"></div>; // Blank load state during redirect
  }

  // 5. Submit Action: Create a New Brand
  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!brandName.trim()) {
      setErrorMsg('Brand name cannot be empty.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/brands', { name: brandName });
      setSuccessMsg(`Brand "${brandName}" created successfully!`);
      setBrandName('');
      await loadCatalogData(); // Refresh dropdown list and tables
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Failed to create brand.');
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Submit Action: Create a New Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!prodName.trim() || !prodPrice.trim() || !prodBrandId) {
      setErrorMsg('Product name, price, and brand are required.');
      return;
    }

    setIsLoading(true);
    try {
      const productPayload = {
        name: prodName,
        price: Number(prodPrice),
        stock: Number(prodStock),
        imageUrl: prodImageUrl || undefined,
        description: prodDescription || undefined,
        brandId: prodBrandId,
      };

      await api.post('/products', productPayload);
      setSuccessMsg(`Perfume "${prodName}" added successfully!`);
      
      // Reset Product form
      setProdName('');
      setProdPrice('');
      setProdImageUrl('');
      setProdDescription('');
      
      await loadCatalogData(); // Refresh tables
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Failed to add product.');
    } finally {
      setIsLoading(false);
    }
  };

  // Convert uploaded local file to Base64 URL string (supports both creation and edit mode)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEditMode = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setErrorMsg('Selected image is too large. Please select a file under 8MB.');
        return;
      }
      setErrorMsg('');
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEditMode) {
          setEditImageUrl(reader.result as string);
        } else {
          setProdImageUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 8. Delete Action: Remove Product Listing
  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}" from the catalog?`)) {
      return;
    }

    setSuccessMsg('');
    setErrorMsg('');
    setIsLoading(true);

    try {
      await api.delete(`/products/${productId}`);
      setSuccessMsg(`Perfume "${productName}" has been successfully deleted.`);
      await loadCatalogData(); // Refresh list immediately
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Failed to delete product.');
    } finally {
      setIsLoading(false);
    }
  };

  // 9. Start Edit Mode: Populates the Floating Product Panel
  const startEditProduct = (product: any) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(String(product.price));
    setEditBrandId(product.brand?.id || '');
    setEditDescription(product.description || '');
    setEditImageUrl(product.imageUrl || '');
  };

  // 10. Submit Action: Save Changes to an Existing Product
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSuccessMsg('');
    setErrorMsg('');
    setIsLoading(true);

    try {
      const editPayload = {
        name: editName,
        price: Number(editPrice),
        brandId: editBrandId,
        description: editDescription || undefined,
        imageUrl: editImageUrl || undefined,
      };

      await api.patch(`/products/${editingProduct.id}`, editPayload);
      setSuccessMsg(`Perfume "${editName}" updated successfully!`);
      setEditingProduct(null); // Close Edit Panel
      await loadCatalogData(); // Refresh tables
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Failed to update product.');
    } finally {
      setIsLoading(false);
    }
  };

  // 11. Submit Action: Update Customer Order Shipping Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await api.patch(`/orders/${orderId}`, { status: newStatus });
      setSuccessMsg(`Order status updated to "${newStatus}" successfully!`);
      await loadCatalogData(); // Refresh metrics instantly
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Failed to update order status.');
    }
  };

  // 12. Submit Action: Cancel and Delete Customer Order
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel and delete this customer order?')) {
      return;
    }
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await api.delete(`/orders/${orderId}`);
      setSuccessMsg('Order has been cancelled and deleted.');
      await loadCatalogData(); // Refresh metrics instantly
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Failed to delete order.');
    }
  };

  // Metric calculation helpers
  const calculateTotalSales = () => {
    return orders.reduce((sum, order) => {
      const orderTotal = order.items.reduce((itemSum: number, item: any) => {
        return itemSum + Number(item.price) * item.quantity;
      }, 0);
      return sum + orderTotal;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-base-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Main Dashboard Header */}
        <h1 className="text-3xl font-light tracking-widest uppercase mb-8 border-b border-base-300 pb-4">
          Admin Catalog Management
        </h1>

        {/* Global Sales & Catalog Metrics Analytics Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: Total Revenue/Sales */}
          <div className="bg-neutral text-neutral-content border border-white/5 p-6 flex flex-col justify-between shadow-sm">
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-content/60 font-semibold mb-2">
              Total Revenue / Sells
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-light tracking-wide text-white">
                ৳{calculateTotalSales().toFixed(2)}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-success bg-success/10 border border-success/20 px-2.5 py-0.5 font-bold rounded-full">
                Active
              </span>
            </div>
          </div>

          {/* Card 2: Total Orders */}
          <div className="bg-base-200 border border-base-300 p-6 flex flex-col justify-between shadow-sm">
            <span className="text-[10px] uppercase tracking-[0.2em] text-base-content/50 font-semibold mb-2">
              Transactions & Orders
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-light tracking-wide text-base-content">
                {orders.length}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-info bg-info/10 border border-info/20 px-2.5 py-0.5 font-bold rounded-full">
                Invoices
              </span>
            </div>
          </div>

          {/* Card 3: Total Fragrances */}
          <div className="bg-base-200 border border-base-300 p-6 flex flex-col justify-between shadow-sm">
            <span className="text-[10px] uppercase tracking-[0.2em] text-base-content/50 font-semibold mb-2">
              Fragrance Inventory
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-light tracking-wide text-base-content">
                {products.length}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-warning bg-warning/10 border border-warning/20 px-2.5 py-0.5 font-bold rounded-full">
                Catalog
              </span>
            </div>
          </div>

        </div>

        {/* Global Notification Banner */}
        {successMsg && (
          <div className="bg-success/15 border border-success text-success text-xs uppercase tracking-wider font-semibold p-4 rounded-none mb-8 text-center animate-fade-in">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-error/15 border border-error text-error text-xs uppercase tracking-wider font-semibold p-4 rounded-none mb-8 text-center animate-fade-in">
            {errorMsg}
          </div>
        )}

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          
          {/* COLUMN 1: Brand Creator Form */}
          <div className="bg-base-200 border border-base-300 p-8 h-fit shadow-sm">
            <h2 className="text-lg font-medium tracking-wider uppercase border-b border-base-300 pb-3 mb-6">
              Create Brand
            </h2>
            <form onSubmit={handleCreateBrand} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-base-content/75">
                  Brand Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dior"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="input input-bordered rounded-none border-base-300 bg-base-100 focus:outline-none focus:border-neutral text-sm tracking-wide"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-neutral rounded-none w-full tracking-wider uppercase font-medium mt-4"
              >
                {isLoading ? 'Creating...' : 'Add Brand'}
              </button>
            </form>
          </div>

          {/* COLUMN 2 & 3: Product Creator Form */}
          <div className="lg:col-span-2 bg-base-200 border border-base-300 p-8 shadow-sm">
            <h2 className="text-lg font-medium tracking-wider uppercase border-b border-base-300 pb-3 mb-6">
              Add New Fragrance Product
            </h2>
            <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Product Name */}
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-base-content/75">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sauvage Elixir"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="input input-bordered rounded-none border-base-300 bg-base-100 focus:outline-none focus:border-neutral text-sm tracking-wide"
                  required
                />
              </div>

              {/* Linked Brand Selector Dropdown */}
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-base-content/75">
                  Select Brand
                </label>
                <select
                  value={prodBrandId}
                  onChange={(e) => setProdBrandId(e.target.value)}
                  className="select select-bordered rounded-none border-base-300 bg-base-100 focus:outline-none focus:border-neutral text-sm tracking-wide"
                  required
                >
                  {brands.length === 0 ? (
                    <option value="">No brands available (create one first!)</option>
                  ) : (
                    brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Price (In Taka) */}
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-base-content/75">
                  Price (৳)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 12500"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                  className="input input-bordered rounded-none border-base-300 bg-base-100 focus:outline-none focus:border-neutral text-sm tracking-wide"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Stock */}
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-base-content/75">
                  Initial Stock
                </label>
                <input
                  type="number"
                  placeholder="e.g. 10"
                  value={prodStock}
                  onChange={(e) => setProdStock(e.target.value)}
                  className="input input-bordered rounded-none border-base-300 bg-base-100 focus:outline-none focus:border-neutral text-sm tracking-wide"
                  min="0"
                  required
                />
              </div>

              {/* Dual-Mode Image Uploader & URL Input with Live Preview */}
              <div className="flex flex-col md:col-span-2 bg-base-100 border border-base-300 p-4 space-y-4 shadow-sm">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* File Upload Selector */}
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-neutral/80">
                      Upload Local Image File
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, false)}
                      className="file-input file-input-bordered rounded-none text-xs border-base-300 bg-base-200 cursor-pointer focus:outline-none"
                    />
                    <span className="text-[10px] text-base-content/50 tracking-wider mt-1">
                      Max size: 8MB (Formats: PNG, JPG, WEBP)
                    </span>
                  </div>

                  {/* Direct URL Input */}
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-neutral/80">
                      Or Paste Direct Image URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://example.com/perfume.png"
                      value={prodImageUrl}
                      onChange={(e) => setProdImageUrl(e.target.value)}
                      className="input input-bordered rounded-none border-base-300 bg-base-200 focus:outline-none focus:border-neutral text-xs tracking-wide"
                    />
                  </div>

                </div>

                {/* Live Image Preview Thumbnail */}
                {prodImageUrl && (
                  <div className="border border-base-300 p-3 bg-base-200 flex items-center gap-4 animate-fade-in">
                    <div className="relative w-16 h-16 bg-neutral/10 border border-base-300 overflow-hidden flex items-center justify-center">
                      <img
                        src={prodImageUrl}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wider text-success">
                        Image Linked Successfully
                      </span>
                      <span className="text-[10px] text-base-content/60 tracking-widest truncate max-w-sm">
                        {prodImageUrl.startsWith('data:') ? 'Local Base64 File Encoded' : prodImageUrl}
                      </span>
                      <button
                        type="button"
                        onClick={() => setProdImageUrl('')}
                        className="text-[10px] uppercase font-bold text-error tracking-wider hover:underline text-left mt-1"
                      >
                        Clear Image
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Description */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-base-content/75">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Enter detailed olfactory notes (e.g. Bergamot, Lavender, Sandalwood...)"
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  rows={3}
                  className="textarea textarea-bordered rounded-none border-base-300 bg-base-100 focus:outline-none focus:border-neutral text-sm w-full tracking-wide p-4"
                ></textarea>
              </div>

              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={isLoading || brands.length === 0}
                  className="btn btn-neutral rounded-none w-full tracking-wider uppercase font-medium shadow-sm"
                >
                  {isLoading ? 'Adding Fragrance...' : 'Upload Fragrance Product'}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* SECTION 1: Inventory Catalog */}
        <div className="border border-base-300 p-8 bg-base-100 shadow-sm mb-16">
          <h2 className="text-xl font-medium tracking-wider uppercase border-b border-base-300 pb-3 mb-6">
            Current Inventory Catalog
          </h2>
          {products.length === 0 ? (
            <p className="text-xs uppercase tracking-wider text-base-content/60 text-center py-8">
              No fragrances in the database yet. Use the form above to add some!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full text-xs tracking-wide font-light">
                <thead>
                  <tr className="border-b border-base-300 uppercase tracking-widest text-base-content/70">
                    <th className="py-3 text-left">Brand</th>
                    <th className="py-3 text-left">Name</th>
                    <th className="py-3 text-right">Price</th>
                    <th className="py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-base-300/60 hover:bg-base-200/50">
                      <td className="py-3 font-semibold uppercase">{p.brand?.name || 'Luxury'}</td>
                      <td className="py-3 font-medium">{p.name}</td>
                      <td className="py-3 text-right font-semibold">৳{Number(p.price).toFixed(2)}</td>
                      <td className="py-3 text-right space-x-4">
                        <button
                          onClick={() => startEditProduct(p)}
                          className="text-xs uppercase font-bold text-info hover:underline tracking-wider cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="text-xs uppercase font-bold text-error hover:underline tracking-wider cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SECTION 2: Customer Orders & Sales Registry */}
        <div className="border border-base-300 p-8 bg-base-100 shadow-sm">
          <h2 className="text-xl font-medium tracking-wider uppercase border-b border-base-300 pb-3 mb-6">
            Customer Orders & Sales Registry
          </h2>
          {orders.length === 0 ? (
            <p className="text-xs uppercase tracking-wider text-base-content/60 text-center py-8">
              No customer transactions have been recorded in the database yet.
            </p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const orderTotal = order.items.reduce(
                  (sum: number, item: any) => sum + Number(item.price) * item.quantity,
                  0
                );
                return (
                  <div key={order.id} className="border border-base-300 bg-base-200/35 p-6 flex flex-col space-y-4 shadow-sm">
                    
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-base-300/80 pb-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-base-content/50">Order Reference</span>
                        <span className="text-xs font-mono font-semibold">{order.id}</span>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        
                        {/* Status Select Modifier */}
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-wider text-base-content/50 mb-1">Status Modifier</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="select select-bordered select-xs rounded-none border-base-300 bg-base-100 text-[10px] tracking-wide uppercase font-semibold cursor-pointer focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </div>

                        {/* Order Cancellation */}
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="btn btn-outline btn-error btn-xs rounded-none uppercase tracking-wider text-[9px] mt-4 cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>

                    {/* Order Details Body */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-light tracking-wide">
                      
                      {/* Left: Items Purchased */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] uppercase tracking-wider font-semibold text-base-content/70">
                          Items Purchased
                        </h4>
                        <ul className="space-y-2">
                          {order.items.map((item: any, index: number) => (
                            <li key={index} className="flex justify-between">
                              <span className="font-medium text-base-content/90">
                                {item.name} <span className="text-base-content/50">x{item.quantity}</span>
                              </span>
                              <span className="font-semibold text-base-content/85">
                                ৳{(Number(item.price) * item.quantity).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right: Shipping Address & Phone */}
                      <div className="space-y-2 border-t md:border-t-0 md:border-l border-base-300/60 pt-4 md:pt-0 md:pl-6">
                        <h4 className="text-[10px] uppercase tracking-wider font-semibold text-base-content/70 mb-2">
                          Customer & Delivery Details
                        </h4>
                        <div className="space-y-1">
                          <p><strong className="font-medium">Receiver:</strong> {order.customerName}</p>
                          <p><strong className="font-medium">Email:</strong> {order.customerEmail}</p>
                          <p><strong className="font-medium">Phone:</strong> {order.customerPhone}</p>
                          <p><strong className="font-medium">Address:</strong> {order.shippingAddress}</p>
                          <p><strong className="font-medium">Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Row: Sum Total */}
                    <div className="border-t border-base-300/60 pt-4 flex justify-between items-center bg-base-200/50 -mx-6 -mb-6 p-4 px-6 mt-2">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-base-content/70">
                        Total Transaction
                      </span>
                      <span className="text-base sm:text-lg font-bold text-neutral">
                        ৳{orderTotal.toFixed(2)}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* FLOATING EDIT PRODUCT POPUP (Frosted Luxury Panel Overlay) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-base-200 border border-base-300 max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 text-base-content/60 hover:text-base-content font-bold uppercase tracking-widest text-xs cursor-pointer"
            >
              ✕ Close
            </button>

            <h3 className="text-xl font-light tracking-widest uppercase border-b border-base-300 pb-3 mb-6">
              Edit Fragrance: {editingProduct.name}
            </h3>

            <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Edit Name */}
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-base-content/75">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input input-bordered rounded-none border-base-300 bg-base-100 focus:outline-none focus:border-neutral text-sm tracking-wide"
                  required
                />
              </div>

              {/* Edit Brand */}
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-base-content/75">
                  Brand
                </label>
                <select
                  value={editBrandId}
                  onChange={(e) => setEditBrandId(e.target.value)}
                  className="select select-bordered rounded-none border-base-300 bg-base-100 focus:outline-none focus:border-neutral text-sm tracking-wide"
                  required
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Edit Price */}
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-base-content/75">
                  Price (৳)
                </label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="input input-bordered rounded-none border-base-300 bg-base-100 focus:outline-none focus:border-neutral text-sm tracking-wide"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Edit Description */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-base-content/75">
                  Olfactory Notes & Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="textarea textarea-bordered rounded-none border-base-300 bg-base-100 focus:outline-none focus:border-neutral text-sm w-full tracking-wide p-4"
                ></textarea>
              </div>

              {/* Edit Image Dual Mode Uploader */}
              <div className="flex flex-col md:col-span-2 bg-base-100 border border-base-300 p-4 space-y-4 shadow-sm">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* File Upload Selector */}
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-neutral/80">
                      Upload New Image File
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, true)}
                      className="file-input file-input-bordered rounded-none text-xs border-base-300 bg-base-200 cursor-pointer focus:outline-none"
                    />
                  </div>

                  {/* Direct URL Input */}
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-neutral/80">
                      Or Paste Direct Image URL
                    </label>
                    <input
                      type="text"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      className="input input-bordered rounded-none border-base-300 bg-base-200 focus:outline-none focus:border-neutral text-xs tracking-wide"
                    />
                  </div>

                </div>

                {/* Live Image Preview Thumbnail */}
                {editImageUrl && (
                  <div className="border border-base-300 p-3 bg-base-200 flex items-center gap-4 animate-fade-in">
                    <div className="relative w-16 h-16 bg-neutral/10 border border-base-300 overflow-hidden flex items-center justify-center">
                      <img
                        src={editImageUrl}
                        alt="Edit preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wider text-success">
                        Image Linked Successfully
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditImageUrl('')}
                        className="text-[10px] uppercase font-bold text-error tracking-wider hover:underline text-left mt-1"
                      >
                        Clear Image
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Submit Buttons */}
              <div className="md:col-span-2 flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="btn btn-outline rounded-none flex-1 tracking-wider uppercase font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-neutral rounded-none flex-1 tracking-wider uppercase font-medium cursor-pointer"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
