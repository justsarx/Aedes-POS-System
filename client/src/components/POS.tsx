import React, { useEffect, useMemo, useState } from 'react';
import { Search, ShoppingCart, Trash2, Plus, IndianRupee } from 'lucide-react';
import { useStore, type Product } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Loading } from './Loading';

const ProductCard = ({ product, addToCart }: { product: Product; addToCart: (p: Product, q: number) => void }) => {
  const [quantity, setQuantity] = useState<number | string>(1);

  if (!product) return null;

  const isOutOfStock = (product.STOCK || 0) <= 0;
  const isLowStock = (product.STOCK || 0) < 10;

  const handleAdd = () => {
    const qty = typeof quantity === 'string' ? parseInt(quantity) : quantity;
    if (qty > 0 && qty <= (product.STOCK || 0)) {
      addToCart(product, qty);
      setQuantity(1); // Reset after adding
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setQuantity('');
      return;
    }
    const parsed = parseInt(val);
    if (!isNaN(parsed)) {
      // Only clamp max, allow 0 or negative temporarily while typing (though min="1" prevents negative in UI usually)
      // Actually, better to just let them type and clamp on blur, but clamping max immediately is usually fine/helpful.
      // Let's just update state and clamp max if needed.
      if (parsed > (product.STOCK || 0)) {
        setQuantity(product.STOCK || 0);
      } else {
        setQuantity(parsed);
      }
    }
  };

  const handleBlur = () => {
    let qty = typeof quantity === 'string' ? parseInt(quantity) : quantity;
    if (isNaN(qty) || qty < 1) qty = 1;
    if (qty > (product.STOCK || 0)) qty = product.STOCK || 0;
    setQuantity(qty);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all group flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <div className="bg-slate-900/50 px-2 py-1 rounded text-xs font-mono text-slate-400">
            {product.SKU || 'N/A'}
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            isOutOfStock ? 'bg-red-500/20 text-red-400' : 
            isLowStock ? 'bg-yellow-500/20 text-yellow-400' : 
            'bg-green-500/20 text-green-400'
          }`}>
            {isOutOfStock ? 'Out of Stock' : `${product.STOCK} in stock`}
          </span>
        </div>
        
        <h3 className="font-bold text-lg text-slate-100 mb-1 truncate" title={product.NAME}>{product.NAME || 'Unknown Product'}</h3>
        <p className="text-sm text-slate-400 mb-3">{product.CATEGORY || 'Uncategorized'}</p>
      </div>

      <div className="mt-auto">
        {(product.TREND_SCORE || 0) > 80 && (
          <div className="mb-2">
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded inline-flex items-center gap-1">
              Trending <span className="animate-pulse">🔥</span>
            </span>
          </div>
        )}
        <div className="flex items-end justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white flex items-center">
                <IndianRupee size={16} />
                {(product.CURRENT_PRICE || 0).toFixed(2)}
              </span>
              {product.BASE_PRICE > product.CURRENT_PRICE && (
                <span className="text-sm text-slate-500 line-through flex items-center">
                  <IndianRupee size={12} />
                  {(product.BASE_PRICE || 0).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <input 
            type="number" 
            min="1" 
            max={product.STOCK}
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleBlur}
            className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 text-center focus:outline-none focus:border-blue-500"
            disabled={isOutOfStock}
          />
          <button 
            onClick={handleAdd}
            disabled={isOutOfStock}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const POS: React.FC = () => {
  const { products, cart, addToCart, removeFromCart, checkout, fetchProducts, isLoading } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) {
      console.error("Products is not an array:", products);
      return [];
    }
    return products.filter(p => {
      const matchesSearch = (p.NAME?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                            (p.SKU?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.CATEGORY === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.CATEGORY).filter(Boolean)))];

  const cartTotal = cart.reduce((sum, item) => sum + (item.CURRENT_PRICE * item.quantity), 0);

  if (isLoading && products.length === 0) {
    return <Loading />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex h-full gap-6"
    >
      {/* Product Grid Section */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* Search and Filter Bar */}
        <div className="flex gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search products by name or SKU..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto pr-2">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.ID || index} product={product} addToCart={addToCart} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Search size={48} className="mb-4 opacity-50" />
              <p className="text-lg">No products found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-slate-800 rounded-xl border border-slate-700 flex flex-col shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur">
          <div className="flex items-center gap-2 text-xl font-bold text-slate-100">
            <ShoppingCart className="text-blue-500" />
            <h2>Current Order</h2>
            <span className="ml-auto bg-blue-600 text-xs px-2 py-1 rounded-full">{cart.reduce((acc, item) => acc + item.quantity, 0)} items</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 opacity-60">
              <ShoppingCart size={64} />
              <p>Cart is empty</p>
            </div>
          ) : (
            <AnimatePresence>
              {cart.map(item => (
                <motion.div 
                  key={item.ID}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-slate-900 p-3 rounded-lg border border-slate-700 flex justify-between items-center group hover:border-slate-600 transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <h4 className="font-medium text-slate-200 truncate">{item.NAME}</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="text-blue-400 font-mono">x{item.quantity}</span>
                      <span>@ ₹{item.CURRENT_PRICE.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-200">₹{(item.CURRENT_PRICE * item.quantity).toFixed(2)}</span>
                    <button 
                      onClick={() => removeFromCart(item.ID)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded-md hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-700 space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-slate-400">Total Amount</span>
            <span className="text-3xl font-bold text-white flex items-center">
              <IndianRupee size={24} className="mr-1" />
              {cartTotal.toFixed(2)}
            </span>
          </div>
          <button 
            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            disabled={cart.length === 0}
            onClick={checkout}
          >
            <IndianRupee size={20} /> Checkout
          </button>
        </div>
      </div>
    </motion.div>
  );
};
