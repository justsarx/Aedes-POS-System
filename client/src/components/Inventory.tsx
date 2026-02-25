import React, { useEffect, useState } from 'react';
import { useStore, type Product } from '../store/useStore';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { toast } from '../store/toastStore';
import { motion } from 'framer-motion';
import { Loading } from './Loading';

export const Inventory: React.FC = () => {
  const { products, fetchProducts, addProduct, updateProduct, deleteProduct, isLoading } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    basePrice: 0,
    stock: 0,
    expiryDate: ''
  });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        sku: product.SKU || '',
        name: product.NAME || '',
        category: product.CATEGORY || '',
        basePrice: product.BASE_PRICE || 0,
        stock: product.STOCK || 0,
        expiryDate: product.EXPIRY_DATE ? product.EXPIRY_DATE.split('T')[0] : ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        sku: '',
        name: '',
        category: '',
        basePrice: 0,
        stock: 0,
        expiryDate: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.ID, {
          NAME: formData.name,
          CATEGORY: formData.category,
          BASE_PRICE: formData.basePrice,
          STOCK: formData.stock,
          EXPIRY_DATE: formData.expiryDate || null
        });
      } else {
        await addProduct({
          SKU: formData.sku,
          NAME: formData.name,
          CATEGORY: formData.category,
          BASE_PRICE: formData.basePrice,
          STOCK: formData.stock,
          EXPIRY_DATE: formData.expiryDate || null,
          TREND_SCORE: 50 // Default initial score
        });
      }
      setIsModalOpen(false);
      toast.success(editingProduct ? 'Product updated successfully' : 'Product added successfully');
    } catch {
      toast.error('Failed to save product');
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
  };

  const executeDelete = async () => {
    if (deleteId) {
      await deleteProduct(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading && products.length === 0) {
    return <Loading />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 h-full"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-100">Inventory Management</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex-1 overflow-y-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-slate-400 border-b border-slate-700 sticky top-0">
            <tr>
              <th className="p-4">SKU</th>
              <th className="p-4">Product Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Expiry</th>
              <th className="p-4">Base Price</th>
              <th className="p-4">Trend Score</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {products.map(item => (
              <tr key={item.ID} className="hover:bg-slate-700/50 transition-colors">
                <td className="p-4 font-mono text-slate-300">{item.SKU || 'N/A'}</td>
                <td className="p-4 font-medium text-slate-100">{item.NAME || 'Unknown'}</td>
                <td className="p-4 text-slate-400">{item.CATEGORY || '-'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${(item.STOCK || 0) < 10 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {item.STOCK || 0}
                  </span>
                </td>
                <td className="p-4 text-slate-300">{item.EXPIRY_DATE ? new Date(item.EXPIRY_DATE).toLocaleDateString() : '-'}</td>
                <td className="p-4 text-slate-300">₹{(item.BASE_PRICE || 0).toFixed(2)}</td>
                <td className="p-4 text-slate-300">{item.TREND_SCORE || 0}</td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button 
                    onClick={() => handleOpenModal(item)}
                    className="text-blue-400 hover:text-blue-300 p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => confirmDelete(item.ID)}
                    className="text-red-400 hover:text-red-300 p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">SKU</label>
                <input 
                  type="text" 
                  required
                  disabled={!!editingProduct}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                  value={formData.sku}
                  onChange={e => setFormData({...formData, sku: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Base Price (₹)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.basePrice}
                    onChange={e => setFormData({...formData, basePrice: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Stock</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Expiry Date (Optional)</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.expiryDate}
                  onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold mt-4 flex items-center justify-center gap-2 transition-colors"
              >
                <Save size={18} /> Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-sm shadow-2xl text-center">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
            <p className="text-slate-300 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setDeleteId(null)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
