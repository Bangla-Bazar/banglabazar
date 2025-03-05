import React, { useState } from 'react';
import { Product, CreateProductData } from '../utils/products';
import Input from './Input';
import Textarea from './Textarea';
import FileUpload from './FileUpload';
import Button from './Button';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: CreateProductData) => Promise<void>;
  isLoading?: boolean;
}

export default function ProductForm({
  initialData,
  onSubmit,
  isLoading = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState<CreateProductData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    imageUrl: initialData?.imageUrl || '',
    tags: initialData?.tags || [],
    isHotProduct: initialData?.isHotProduct || false,
    isSeasonal: initialData?.isSeasonal || false,
    seasonalEndDate: initialData?.seasonalEndDate ? new Date(initialData.seasonalEndDate).toISOString().split('T')[0] : '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateProductData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CreateProductData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.imageUrl && !imageFile) {
      newErrors.imageUrl = 'Image is required';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Name"
        value={formData.name}
        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
        error={errors.name}
      />

      <Textarea
        label="Description"
        value={formData.description}
        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
        error={errors.description}
      />

      <Input
        label="Price"
        type="number"
        min="0"
        step="0.01"
        value={formData.price}
        onChange={e => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
        error={errors.price}
      />

      <FileUpload
        label="Product Image"
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
        maxSize={5 * 1024 * 1024} // 5MB
        onChange={files => {
          if (files[0]) {
            setImageFile(files[0]);
            // You would typically upload the image here and get the URL
            // For now, we'll just use a fake URL
            setFormData(prev => ({ ...prev, imageUrl: URL.createObjectURL(files[0]) }));
          }
        }}
        error={errors.imageUrl}
      />

      <Input
        label="Tags (comma-separated)"
        value={formData.tags.join(', ')}
        onChange={handleTagsChange}
        error={errors.tags}
        helperText="Example: Rice, Indian, Essential"
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isHotProduct"
          checked={formData.isHotProduct}
          onChange={e => setFormData(prev => ({ ...prev, isHotProduct: e.target.checked }))}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="isHotProduct" className="ml-2 block text-sm text-gray-900">
          Mark as Hot Product
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isSeasonal"
          checked={formData.isSeasonal}
          onChange={e => setFormData(prev => ({ ...prev, isSeasonal: e.target.checked }))}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="isSeasonal" className="ml-2 block text-sm text-gray-900">
          Mark as Seasonal Product
        </label>
      </div>

      {formData.isSeasonal && (
        <Input
          label="Seasonal End Date"
          type="date"
          value={formData.seasonalEndDate ? new Date(formData.seasonalEndDate).toISOString().split('T')[0] : ''}
          onChange={e => setFormData(prev => ({ ...prev, seasonalEndDate: new Date(e.target.value) }))}
          error={errors.seasonalEndDate}
        />
      )}

      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
} 