'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import {
  getAllProducts,
  getAllBanners,
  addProduct,
  updateProduct,
  deleteProduct,
  addBanner,
  deleteBanner,
} from '@/lib/firestore';
import { Product, Banner } from '@/types';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { adminData, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    tags: '',
    isHotProduct: false,
    imageFile: null as File | null,
  });

  const [bannerForm, setBannerForm] = useState({
    title: '',
    description: '',
    link: '',
    imageFile: null as File | null,
  });

  useEffect(() => {
    if (!loading && !adminData) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [productsData, bannersData] = await Promise.all([
          getAllProducts(),
          getAllBanners(),
        ]);
        setProducts(productsData);
        setBanners(bannersData);
      } catch (error) {
        toast.error('Error fetching data');
      }
    };

    fetchData();
  }, [adminData, loading, router]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.imageFile) {
      toast.error('Please select an image');
      return;
    }

    try {
      const newProduct = await addProduct(
        {
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          tags: productForm.tags.split(',').map((tag) => tag.trim()),
          isHotProduct: productForm.isHotProduct,
        },
        productForm.imageFile
      );

      setProducts([...products, newProduct]);
      setIsAddingProduct(false);
      setProductForm({
        name: '',
        description: '',
        price: '',
        tags: '',
        isHotProduct: false,
        imageFile: null,
      });
      toast.success('Product added successfully');
    } catch (error) {
      toast.error('Error adding product');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const updatedProduct = await updateProduct(
        editingProduct.id,
        {
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          tags: productForm.tags.split(',').map((tag) => tag.trim()),
          isHotProduct: productForm.isHotProduct,
        },
        productForm.imageFile || undefined
      );

      setProducts(
        products.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
      );
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        tags: '',
        isHotProduct: false,
        imageFile: null,
      });
      toast.success('Product updated successfully');
    } catch (error) {
      toast.error('Error updating product');
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(product.id, product.imageUrl);
      setProducts(products.filter((p) => p.id !== product.id));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.imageFile) {
      toast.error('Please select an image');
      return;
    }

    if (banners.length >= 5) {
      toast.error('Maximum 5 banners allowed. Please delete existing banners first.');
      return;
    }

    try {
      const newBanner = await addBanner(
        {
          title: bannerForm.title,
          description: bannerForm.description,
          link: bannerForm.link,
        },
        bannerForm.imageFile
      );

      setBanners([...banners, newBanner]);
      setIsAddingBanner(false);
      setBannerForm({
        title: '',
        description: '',
        link: '',
        imageFile: null,
      });
      toast.success('Banner added successfully');
    } catch (error) {
      toast.error('Error adding banner');
    }
  };

  const handleDeleteBanner = async (banner: Banner) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      await deleteBanner(banner.id, banner.imageUrl);
      setBanners(banners.filter((b) => b.id !== banner.id));
      toast.success('Banner deleted successfully');
    } catch (error) {
      toast.error('Error deleting banner');
    }
  };

  if (loading || !adminData) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Total Products</h3>
          <p className="text-3xl font-bold text-green-600">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Active Banners</h3>
          <p className="text-3xl font-bold text-green-600">{banners.length}/5</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Featured Products</h3>
          <p className="text-3xl font-bold text-green-600">
            {products.filter((p) => p.isHotProduct).length}
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <button
            onClick={() => setIsAddingProduct(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Product
          </button>
        </div>

        {/* Product Form */}
        {(isAddingProduct || editingProduct) && (
          <form
            onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
            className="bg-white p-6 rounded-lg shadow-sm mb-6"
          >
            <h3 className="text-xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={productForm.tags}
                  onChange={(e) =>
                    setProductForm({ ...productForm, tags: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      imageFile: e.target.files?.[0] || null,
                    })
                  }
                  className="w-full"
                  required={!editingProduct}
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={productForm.isHotProduct}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        isHotProduct: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Feature this product (Hot Product)
                  </span>
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsAddingProduct(false);
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    description: '',
                    price: '',
                    tags: '',
                    isHotProduct: false,
                    imageFile: null,
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 relative flex-shrink-0">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.description.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${product.price.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.isHotProduct
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.isHotProduct ? 'Featured' : 'Regular'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setProductForm({
                          name: product.name,
                          description: product.description,
                          price: product.price.toString(),
                          tags: product.tags.join(', '),
                          isHotProduct: product.isHotProduct,
                          imageFile: null,
                        });
                      }}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Banners Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Banners</h2>
          <button
            onClick={() => setIsAddingBanner(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            disabled={banners.length >= 5}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Banner
          </button>
        </div>

        {/* Banner Form */}
        {isAddingBanner && (
          <form
            onSubmit={handleAddBanner}
            className="bg-white p-6 rounded-lg shadow-sm mb-6"
          >
            <h3 className="text-xl font-bold mb-4">Add New Banner</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={bannerForm.title}
                  onChange={(e) =>
                    setBannerForm({ ...bannerForm, title: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link (optional)
                </label>
                <input
                  type="text"
                  value={bannerForm.link}
                  onChange={(e) =>
                    setBannerForm({ ...bannerForm, link: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={bannerForm.description}
                  onChange={(e) =>
                    setBannerForm({ ...bannerForm, description: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setBannerForm({
                      ...bannerForm,
                      imageFile: e.target.files?.[0] || null,
                    })
                  }
                  required
                  className="w-full"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsAddingBanner(false);
                  setBannerForm({
                    title: '',
                    description: '',
                    link: '',
                    imageFile: null,
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Banner
              </button>
            </div>
          </form>
        )}

        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {banner.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{banner.description}</p>
                {banner.link && (
                  <p className="text-sm text-gray-500 mb-4">
                    Link: {banner.link}
                  </p>
                )}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDeleteBanner(banner)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 