'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  // 1. Hook up to stores
  const { items, getTotalPrice, clearCart } = useCartStore();
    const { user } = useAuthStore();
     const router = useRouter();

  // 2. Local Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Order status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderReceipt, setOrderReceipt] = useState<any>(null); // Stores successful order response

  // 3. Hydration & Auth Route Guard
    const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // If the component mounted and no user exists, redirect instantly
    if (mounted && !user && !orderReceipt) {
      router.push('/'); // Redirects to Homepage
    }

    if (user) {
      setName(user.email.split('@')[0]);
    }
  }, [mounted, user, router, orderReceipt]);

  // While checking mount & redirecting, show a clean background state
  if (!mounted || (!user && !orderReceipt)) {
    return <div className="min-h-screen bg-base-100"></div>;
  }



  // 4. Form Submit Handler (Placing the Order!)
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Basic Form validation check
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setErrorMessage('Please fill in all shipping details.');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Your shopping cart is empty.');
      return;
    }

    setIsLoading(true);

    try {
      // Structure the payload exactly how NestJS DTO expects it
      const orderPayload = {
        customerName: name,
        customerEmail: user?.email || 'guest@perfumed-elegance.com',
        customerPhone: phone,
        shippingAddress: address,
        // Map our cart items array to match OrderItemDto
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
        })),
      };

      // Send the POST request to the NestJS backend
      const response = await api.post('/orders', orderPayload);

      // Save the returned order details (including order ID!) to local state
      setOrderReceipt(response.data);
      
      // Empty out the persistent shopping cart
      clearCart();
    } catch (error: any) {
      console.error('Error placing order:', error);
      setErrorMessage(
        error.response?.data?.message || 'Failed to place order. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  //  STATE A: RENDER SUCCESS INVOICE RECEIPT 
  if (orderReceipt) {
    return (
      <div className="min-h-screen bg-base-100 py-16 px-6 flex items-center justify-center">
        <div className="max-w-2xl w-full border border-base-300 p-8 bg-base-200 relative overflow-hidden">
          
          {/* Subtle design watermark */}
          <div className="absolute top-0 left-0 w-full h-1 bg-neutral"></div>

          {/* Success Title */}
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-success font-bold block mb-2">
              Purchase Confirmed
            </span>
            <h1 className="text-2xl font-light tracking-widest uppercase mb-1">
              Thank You For Your Order
            </h1>
            <p className="text-xs text-base-content/60 font-light mt-1">
              Order ID: <span className="font-mono select-all text-neutral font-semibold">{orderReceipt.id}</span>
            </p>
          </div>

          {/* Delivery & Shipping Info */}
          <div className="border-t border-b border-base-300 py-6 mb-6 grid grid-cols-2 gap-4 text-xs font-light tracking-wide uppercase">
            <div>
              <span className="text-base-content/60 block mb-1">Deliver To</span>
              <strong className="text-sm font-medium text-base-content block">{orderReceipt.customerName}</strong>
              <span className="text-base-content/75 block mt-1">{orderReceipt.customerPhone}</span>
            </div>
            <div>
              <span className="text-base-content/60 block mb-1">Shipping Address</span>
              <p className="text-xs font-medium text-base-content normal-case leading-relaxed">
                {orderReceipt.shippingAddress}
              </p>
            </div>
          </div>

          {/* Receipt Items list */}
          <div className="space-y-4 mb-6">
            <span className="text-xs uppercase tracking-widest text-base-content/60 block mb-2 font-medium">
              Purchased Fragrances
            </span>
            {orderReceipt.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center text-xs tracking-wide font-light">
                <span>
                  {item.name} <strong className="font-medium">x {item.quantity}</strong>
                </span>
                <span className="font-medium">
                  ৳{Number(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Grand Total */}
          <div className="border-t border-base-300 pt-6 flex justify-between items-baseline mb-8">
            <span className="text-xs uppercase tracking-widest font-semibold text-base-content/80">
              Grand Total
            </span>
            <span className="text-2xl font-bold tracking-wide">
              ৳{Number(orderReceipt.price || getTotalPrice()).toFixed(2)}
            </span>
          </div>

          {/* Confirmation Notice and Back Button */}
          <div className="text-center space-y-4">
            <p className="text-[10px] text-base-content/60 uppercase tracking-widest leading-relaxed">
              Payment Method: Cash on Delivery (COD) <br />
              A delivery agent will contact you shortly to coordinate arrival.
            </p>
            <Link href="/" className="btn btn-neutral btn-sm rounded-none tracking-wider uppercase font-medium px-8">
              Continue Shopping
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // STATE B: RENDER CHECKOUT FORM 
  return (
    <div className="min-h-screen bg-base-100 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <h1 className="text-3xl font-light tracking-widest uppercase mb-12 border-b border-base-300 pb-4">
          Boutique Checkout
        </h1>

        {/* Error message bubble */}
        {errorMessage && (
          <div className="bg-error/15 border border-error text-error text-xs uppercase tracking-wider font-semibold p-4 rounded-none mb-8 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* COLUMN 1: Shipping Details Form (Takes up 3/5 of space) */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-xl font-medium tracking-wider uppercase border-b border-base-300 pb-2 mb-6">
              Shipping Address Details
            </h2>

            {/* Input 1: Customer Name */}
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-base-content/70">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter recipient's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered rounded-none border-base-300 bg-base-100 focus:outline-none focus:border-neutral w-full tracking-wide text-sm"
                required
              />
            </div>

            {/* Input 2: Phone Number */}
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-base-content/70">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="e.g. +8801700000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input input-bordered rounded-none border-base-300 bg-base-100 focus:outline-none focus:border-neutral w-full tracking-wide text-sm"
                required
              />
            </div>

            {/* Input 3: Shipping Address */}
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest font-semibold mb-2 text-base-content/70">
                Full Shipping Address
              </label>
              <textarea
                placeholder="Apartment, Street Name, City, Postcode"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                className="textarea textarea-bordered rounded-none border-base-300 bg-base-100 focus:outline-none focus:border-neutral w-full tracking-wide text-sm p-4"
                required
              ></textarea>
            </div>
          </div>

          {/* COLUMN 2: Sidebar Order Review (Takes up 2/5 of space) */}
          <div className="lg:col-span-2 bg-base-200 border border-base-300 p-8 h-fit flex flex-col justify-between">
            <h2 className="text-xl font-medium tracking-wider uppercase border-b border-base-300 pb-2 mb-6">
              Review Bag Items
            </h2>

            {/* Items List snippet */}
            <div className="space-y-4 mb-6 max-h-[220px] overflow-y-auto pr-2 border-b border-base-300 pb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-baseline text-xs tracking-wide">
                  <span className="font-light truncate max-w-[160px]">
                    {item.name} <strong className="font-medium">x {item.quantity}</strong>
                  </span>
                  <span className="font-semibold text-base-content">
                    ৳{Number(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Total */}
            <div className="flex justify-between items-baseline mb-8">
              <span className="text-xs uppercase tracking-widest font-semibold text-base-content/80">
                Total to Pay (COD)
              </span>
              <span className="text-2xl font-bold tracking-wide">
                ৳{getTotalPrice().toFixed(2)}
              </span>
            </div>

            {/* Submit Trigger Button */}
            <button
              type="submit"
              disabled={isLoading || items.length === 0}
              className={`btn btn-neutral rounded-none w-full tracking-wider uppercase font-medium ${
                isLoading ? 'loading' : ''
              }`}
            >
              {isLoading ? 'Processing Order...' : 'Place Order (Cash on Delivery)'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
