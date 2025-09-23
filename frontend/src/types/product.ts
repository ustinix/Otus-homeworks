interface Category {
  id: number;
  name: string;
  image: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  images: string;
  category: string;
}

export interface ApiProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: Category;
}

export interface ProductFormData {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface CreateProductDto {
  title: string;
  price: number;
  description: string;
  categoryId: string;
  images: string[];
}
