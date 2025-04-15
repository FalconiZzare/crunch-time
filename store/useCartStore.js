import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: [],

  addToCart: (item, quantity) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
        return { items: updatedItems };
      } else {
        // Item doesn't exist, add new item
        return { items: [...state.items, { ...item, quantity }] };
      }
    });
  },

  removeFromCart: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId)
    }));
  },

  updateQuantity: (itemId, quantity) => {
    set((state) => {
      // If quantity is 0 or less, remove the item
      if (quantity <= 0) {
        return {
          items: state.items.filter((item) => item.id !== itemId)
        };
      }

      // Otherwise update the quantity
      return {
        items: state.items.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      };
    });
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  clearCart: () => {
    set({ items: [] });
  }
}));
