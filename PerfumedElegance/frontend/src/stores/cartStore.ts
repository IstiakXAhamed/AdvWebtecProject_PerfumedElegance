import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Define the structures matching our data model
interface Brand {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  brand?: Brand;
}

export interface CartItem extends Product {
  quantity: number;
}

// 2. Define what actions our Cart Store can perform
interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

// 3. Create the persistent store using Zustand's persist middleware
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Add a product to the cart
      addItem: (product) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex((item) => item.id === product.id);

        if (existingItemIndex > -1) {
          // If the perfume is already in the cart, increase its quantity by 1
          const updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += 1;
          set({ items: updatedItems });
        } else {
          // If it is a new perfume, add it to the list with quantity 1
          set({ items: [...currentItems, { ...product, quantity: 1 }] });
        }
      },

      // Remove a product entirely from the cart
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },

      // Update the quantity of a specific item (e.g. clicking + or - in cart drawer)
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          // If the quantity drops to 0 or less, remove the item completely
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      // Completely empty out the cart (useful after a successful checkout order)
      clearCart: () => set({ items: [] }),

      // Helper function to calculate the grand total price of all items in the cart
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          return total + Number(item.price) * item.quantity;
        }, 0);
      },

      // Helper function to calculate total quantity (for our Navbar bag badge!)
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'perfumed-elegance-cart', // The unique key name inside localStorage

      // FIX: Strip the imageUrl Base64 string before saving to localStorage.
      // Base64 images can be several MB each. localStorage has a strict 5MB limit.
      // We only save lightweight data: id, name, price, brand name, and quantity.
      // The image is re-fetched from the API when needed (e.g. on the cart page).
      partialize: (state) => ({
        items: state.items.map(({ imageUrl, ...rest }) => rest),
      }),
    }
  )
);
