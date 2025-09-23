import type { ApiProduct } from './product';
import type { Category } from './category';

export interface CategoriesQueryResponse {
  categories: Category[];
}

export interface ProductsQueryResponse {
  products: ApiProduct[];
}

export interface ProductQueryResponse {
  product: ApiProduct | null;
}

export interface AddCategoryMutationResponse {
  addCategory: Category;
}

export interface AddProductMutationResponse {
  addProduct: {
    id: string;
    title: string;
    price: number;
  };
}
