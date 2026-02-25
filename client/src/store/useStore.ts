import { create } from "zustand";
import axios from "axios";
import { toast } from "./toastStore";

// Configure API base URL based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export interface Product {
  ID: number;
  SKU: string;
  NAME: string;
  CATEGORY?: string;
  BASE_PRICE: number;
  CURRENT_PRICE: number;
  STOCK: number;
  EXPIRY_DATE: string | null;
  TREND_SCORE: number;
  LAST_UPDATED?: string;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  type: "TRIGGER" | "PROCEDURE" | "SYSTEM";
  message: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  products: Product[];
  cart: CartItem[];
  logs: LogEntry[];
  isLoading: boolean;

  fetchProducts: () => Promise<void>;
  addProduct: (
    product: Omit<Product, "ID" | "CURRENT_PRICE" | "LAST_UPDATED">
  ) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
  runEngine: () => Promise<void>;
  trainAI: () => Promise<void>;
  addLog: (type: "TRIGGER" | "PROCEDURE" | "SYSTEM", message: string) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  cart: [],
  logs: [],
  isLoading: false,

  addLog: (type, message) => {
    const newLog: LogEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    };
    set((state) => ({ logs: [newLog, ...state.logs] }));
  },

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      set({ products: response.data });
    } catch (error) {
      console.error("Failed to fetch products", error);
      get().addLog("SYSTEM", "Failed to fetch products from backend.");
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: async (product) => {
    set({ isLoading: true });
    try {
      await axios.post(`${API_BASE_URL}/api/products`, product);
      await get().fetchProducts();
      get().addLog("SYSTEM", `Product ${product.NAME} added successfully.`);
    } catch (error) {
      console.error("Failed to add product", error);
      get().addLog("SYSTEM", "Failed to add product.");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProduct: async (id, product) => {
    set({ isLoading: true });
    try {
      await axios.put(`${API_BASE_URL}/api/products/${id}`, product);
      await get().fetchProducts();
      get().addLog("SYSTEM", `Product ${id} updated successfully.`);
    } catch (error) {
      console.error("Failed to update product", error);
      get().addLog("SYSTEM", `Failed to update product ${id}.`);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true });
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`);
      await get().fetchProducts();
      get().addLog("SYSTEM", `Product ${id} deleted successfully.`);
    } catch (error) {
      console.error("Failed to delete product", error);
      get().addLog("SYSTEM", `Failed to delete product ${id}.`);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: (product, quantity = 1) => {
    const { cart } = get();
    const existing = cart.find((item) => item.ID === product.ID);
    const currentQty = existing ? existing.quantity : 0;

    if (currentQty + quantity > product.STOCK) {
      toast.error("Cannot add more items than available stock!");
      return;
    }

    if (existing) {
      set({
        cart: cart.map((item) =>
          item.ID === product.ID
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      });
      toast.success(`Added ${quantity} ${product.NAME} to cart`);
    } else {
      set({ cart: [...cart, { ...product, quantity }] });
      toast.success(`Added ${quantity} ${product.NAME} to cart`);
    }
  },

  removeFromCart: (productId) => {
    set({ cart: get().cart.filter((item) => item.ID !== productId) });
    toast.info("Item removed from cart");
  },

  clearCart: () => set({ cart: [] }),

  checkout: async () => {
    const { cart, clearCart, fetchProducts, addLog } = get();
    if (cart.length === 0) return;

    addLog("SYSTEM", `Initiating Checkout for ${cart.length} items...`);

    try {
      for (const item of cart) {
        await axios.post("/api/transactions", {
            await axios.post(`${API_BASE_URL}/api/transactions`, {
          productId: item.ID,
          quantity: item.quantity,
          soldPrice: item.CURRENT_PRICE,
        });
        addLog(
          "TRIGGER",
          `TRG_UPDATE_STOCK fired for SKU: ${item.SKU}. Stock reduced by ${item.quantity}.`
        );
      }
      clearCart();
      await fetchProducts();
      addLog("SYSTEM", "Transaction Committed Successfully.");
      toast.success("Transaction completed successfully! 🎉");
    } catch (error) {
      console.error("Checkout failed", error);
      addLog("SYSTEM", "Checkout failed. Transaction rolled back.");
      toast.error("Checkout failed. Please try again.");
    }
  },

  runEngine: async () => {
    set({ isLoading: true });
    const { addLog } = get();
    addLog("PROCEDURE", "EXEC PRC_AEDES_PRICING(); Started...");

    try {
      await axios.post("/api/engine/run");
      await get().fetchProducts();
      addLog(
        "PROCEDURE",
        "Aedes Engine cycle complete. Inventory prices updated."
      );
      toast.success("Aedes Engine executed successfully! 🚀");
    } catch (error) {
      console.error("Engine run failed", error);
      addLog("SYSTEM", "Failed to execute Aedes Engine.");
      toast.error("Failed to run Aedes Engine");
    } finally {
      set({ isLoading: false });
    }
  },

  trainAI: async () => {
    set({ isLoading: true });
    try {
      await axios.post("/api/products/train");
      await get().fetchProducts();
      get().addLog("SYSTEM", "AI Training Complete: Trend Scores Updated");
      toast.success("AI Training Complete! Trend scores updated. 🧠");
    } catch (error) {
      console.error("AI Training failed:", error);
      get().addLog("SYSTEM", "AI Training Failed");
      toast.error("AI Training Failed");
    } finally {
      set({ isLoading: false });
    }
  },
}));
