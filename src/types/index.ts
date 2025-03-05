export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  tags: string[];
  isHotProduct: boolean;
  isSeasonal: boolean;
  seasonalEndDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  link?: string;
  createdAt: Date;
}

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin';
}

export interface Analytics {
  totalProducts: number;
  totalBanners: number;
  hotProducts: number;
} 