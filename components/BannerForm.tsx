import React, { useState } from 'react';
import { Banner, CreateBannerData } from '../utils/banners';
import Input from './Input';
import Textarea from './Textarea';
import FileUpload from './FileUpload';
import Button from './Button';

interface BannerFormProps {
  initialData?: Banner;
  onSubmit: (data: CreateBannerData) => Promise<void>;
  isLoading?: boolean;
}

export default function BannerForm({
  initialData,
  onSubmit,
  isLoading = false,
}: BannerFormProps) {
  const [formData, setFormData] = useState<CreateBannerData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
    link: initialData?.link || '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateBannerData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CreateBannerData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.imageUrl && !imageFile) {
      newErrors.imageUrl = 'Image is required';
    }

    if (!formData.link.trim()) {
      newErrors.link = 'Link is required';
    } else if (!/^\/[\w-/]*$/.test(formData.link)) {
      newErrors.link = 'Link must be a valid internal path (e.g., /products/rice)';
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        value={formData.title}
        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
        error={errors.title}
      />

      <Textarea
        label="Description"
        value={formData.description}
        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
        error={errors.description}
      />

      <FileUpload
        label="Banner Image"
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
        maxSize={10 * 1024 * 1024} // 10MB
        onChange={files => {
          if (files[0]) {
            setImageFile(files[0]);
            // You would typically upload the image here and get the URL
            // For now, we'll just use a fake URL
            setFormData(prev => ({ ...prev, imageUrl: URL.createObjectURL(files[0]) }));
          }
        }}
        error={errors.imageUrl}
        helperText="Recommended size: 1920x600 pixels"
      />

      <Input
        label="Link"
        value={formData.link}
        onChange={e => setFormData(prev => ({ ...prev, link: e.target.value }))}
        error={errors.link}
        helperText="Internal path (e.g., /products/rice)"
      />

      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Banner' : 'Create Banner'}
        </Button>
      </div>
    </form>
  );
} 