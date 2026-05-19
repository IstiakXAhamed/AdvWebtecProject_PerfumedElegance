'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/authStore';

export default function CustomerProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const displayName = user ? user.email.split('@')[0] : 'Guest';

  useEffect(() => {
    setMounted(true);
    if (mounted) {
      if (!user) {
        router.push('/auth/login'); // Redirect to login if user isn't logged in
      } else {
        loadMyOrders();
      }
    }
  }, [mounted, user, router]);

  const loadMyOrders = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/orders/customer/${user.email}`);
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to load customer orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !user) {
    return <div className="min-h-screen bg-base-100"></div>; // Loading wrapper
  }

  // Calculate order item total pricing helper
  const calculateOrderTotal = (items: any[]) => {
    return items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  };

  // Helper for status badge styling
  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-warning/10 border-warning text-warning';
      case 'confirmed':
        return 'bg-info/10 border-info text-info';
      case 'shipped':
        return 'bg-secondary/10 border-secondary text-secondary';
      case 'delivered':
        return 'bg-success/10 border-success text-success';
      default:
        return 'bg-neutral/10 border-neutral text-neutral-content/70';
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Profile Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* COLUMN 1: Personal Customer Profile Summary */}
          <div className="bg-base-200 border border-base-300 p-8 h-fit text-center flex flex-col items-center">
            
            {/* Elegant luxury circular avatar icon */}
            <div className="w-20 h-20 bg-neutral text-neutral-content rounded-full flex items-center justify-center text-2xl font-light mb-6 tracking-widest border border-white/10 uppercase">
              {displayName.slice(0, 2)}
            </div>

            <h2 className="text-xl font-light tracking-wide uppercase mb-1">
              {displayName}
            </h2>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-base-content/50 mb-6">
              Exclusive Member
            </span>

            {/* Profile detail list */}
            <div className="w-full border-t border-base-300 pt-6 space-y-3 text-xs text-left tracking-wide font-light">
              <div className="flex justify-between border-b border-base-300/40 pb-2">
                <span className="text-base-content/60 uppercase">Email</span>
                <span className="font-semibold">{user.email}</span>
              </div>
              <div className="flex justify-between border-b border-base-300/40 pb-2">
                <span className="text-base-content/60 uppercase">Status</span>
                <span className="font-semibold uppercase tracking-wider text-success">Active</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-base-content/60 uppercase">Privilege</span>
                <span className="font-semibold uppercase tracking-wider text-neutral/80">{user.role}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/')}
              className="btn btn-neutral btn-sm rounded-none w-full tracking-wider uppercase font-medium mt-8"
            >
              Browse Gallery
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => router.push('/admin')}
                className="btn btn-outline btn-sm rounded-none w-full tracking-wider uppercase font-medium mt-3"
              >
                Admin Center
              </button>
            )}
          </div>

          {/* COLUMN 2 & 3: Personal Order Registry */}
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-2xl font-light tracking-widest uppercase border-b border-base-300 pb-3 mb-6">
              My Order History
            </h1>

            {loading ? (
              <p className="text-xs uppercase tracking-widest text-base-content/60 py-8">
                Fetching past order records...
              </p>
            ) : orders.length === 0 ? (
              <div className="border border-dashed border-base-300 p-12 text-center bg-base-200/40">
                <p className="text-xs uppercase tracking-widest text-base-content/60 mb-4">
                  You haven't placed any perfume orders yet!
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="text-xs uppercase font-bold tracking-widest border border-base-content/20 px-6 py-3 hover:bg-base-200"
                >
                  Find My Signature Scent
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-base-300 bg-base-100 p-6 flex flex-col space-y-4">
                    
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-base-300/60 pb-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-base-content/50">
                          Order Reference
                        </span>
                        <span className="text-xs font-mono font-semibold">
                          {order.id}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase tracking-wider text-base-content/50 mb-1">
                          Shipping Status
                        </span>
                        <span className={`text-[10px] uppercase tracking-widest font-semibold px-3 py-1 border rounded-full ${getStatusBadgeStyle(order.status)}`}>
                          {order.status}
                        </span>
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
                          Shipping Destination
                        </h4>
                        <div className="space-y-1">
                          <p><strong className="font-medium">Receiver:</strong> {order.customerName}</p>
                          <p><strong className="font-medium">Phone:</strong> {order.customerPhone}</p>
                          <p><strong className="font-medium">Address:</strong> {order.shippingAddress}</p>
                          <p><strong className="font-medium">Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Row: Sum Total */}
                    <div className="border-t border-base-300/60 pt-4 flex justify-between items-center bg-base-200/30 -mx-6 -mb-6 p-4 px-6 mt-2">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-base-content/70">
                        Total Invoice Cost
                      </span>
                      <span className="text-base sm:text-lg font-bold text-neutral">
                        ৳{calculateOrderTotal(order.items).toFixed(2)}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
