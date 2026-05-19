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

  // 2. Brand Form state
  const [brandName, setBrandName] = useState('');

  // 3. Product Form states
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('10'); 
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodBrandId, setProdBrandId] = useState('');
  const [prodDescription, setProdDescription] = useState('');

  // Status & loading indicators
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 4. Hydration & Strict Admin Route Guard
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Strict Guard: Redirect to homepage if user is logged out or NOT an admin
    if (mounted && (!user || user.role !== 'admin')) {
      router.push('/');
    } else if (mounted && user?.role === 'admin') {
      // If valid admin, load active database catalogs
      loadCatalogData();
    }
  }, [mounted, user, router]);

  // Load brands and products from NestJS backend
  const loadCatalogData = async () => {
    try {
      const [brandsRes, productsRes] = await Promise.all([
        api.get('/brands'),
        api.get('/products'),
      ]);
      setBrands(brandsRes.data);
      setProducts(productsRes.data);
      if (brandsRes.data.length > 0) {
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

  return (
    <div className="min-h-screen bg-base-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Main Dashboard Header */}
        <h1 className="text-3xl font-light tracking-widest uppercase mb-12 border-b border-base-300 pb-4">
          Admin Catalog Management
        </h1>

        {/* Global Notification Banner */}
        {successMsg && (
          <div className="bg-success/15 border border-success text-success text-xs uppercase tracking-wider font-semibold p-4 rounded-none mb-8 text-center">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-error/15 border border-error text-error text-xs uppercase tracking-wider font-semibold p-4 rounded-none mb-8 text-center">
            {errorMsg}
          </div>
        )}

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          
          {/* COLUMN 1: Brand Creator Form (Takes up 1/3 space) */}
          <div className="bg-base-200 border border-base-300 p-8 h-fit">
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

          {/* COLUMN 2 & 3: Product Creator Form (Takes up 2/3 space) */}
          <div className="lg:col-span-2 bg-base-200 border border-base-300 p-8">
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

              {/* Image URL (Optional) */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-base-content/75">
                  Product Image URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://images.unsplash.com/photo-perfume..."
                  value={prodImageUrl}
                  onChange={(e) => setProdImageUrl(e.target.value)}
                  className="input input-bordered rounded-none border-base-300 bg-base-100 focus:outline-none focus:border-neutral text-sm w-full tracking-wide"
                />
              </div>

              {/* Description (Optional) */}
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
                  className="btn btn-neutral rounded-none w-full tracking-wider uppercase font-medium"
                >
                  {isLoading ? 'Adding Fragrance...' : 'Upload Fragrance Product'}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Existing Products list summary table */}
        <div className="border border-base-300 p-8 bg-base-100">
          <h2 className="text-xl font-medium tracking-wider uppercase border-b border-base-300 pb-3 mb-6">
            Current Inventory catalog
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
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-base-300/60 hover:bg-base-200/50">
                      <td className="py-3 font-semibold uppercase">{p.brand?.name || 'Luxury'}</td>
                      <td className="py-3 font-medium">{p.name}</td>
                      <td className="py-3 text-right font-semibold">৳{Number(p.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
