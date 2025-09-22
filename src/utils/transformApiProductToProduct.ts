import type { Product, ApiProduct } from '../types/product';

export const transformApiProductToProduct = (apiProduct: ApiProduct): Product => {
  return {
    id: apiProduct.id,
    title: apiProduct.title,
    price: apiProduct.price,
    images: apiProduct.images[0] || '',
    description: apiProduct.description,
    category: apiProduct.category.name,
  };
};
