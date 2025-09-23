import { apolloClient, gql } from '../lib/apollo-client.js';
import { demoProducts, demoCategories } from '../assets/constants.js';
import type { ApiProduct } from '../types/product.js';
import type { Category } from '../types/category.js';
import type {
  CategoriesQueryResponse,
  ProductsQueryResponse,
  AddCategoryMutationResponse,
  AddProductMutationResponse,
} from '../types/apiResponses';

interface CreateProductDto {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
}

export const checkAndInitializeAPI = async (): Promise<boolean> => {
  console.log('Проверяем состояние API...');

  try {
    const existingCategories = await getAllCategories();
    const ourCategoryNames = demoCategories.map(cat => cat.toLowerCase());
    const existingCategoryNames = existingCategories.map(cat => cat.name.toLowerCase());

    const missingCategories = ourCategoryNames.filter(
      categoryName => !existingCategoryNames.includes(categoryName),
    );

    let finalCategories = existingCategories;

    if (missingCategories.length > 0) {
      console.log('Отсутствуют категории:', missingCategories);
      await createCategories(missingCategories);

      finalCategories = await getAllCategories();
    } else {
      console.log('Все наши категории уже есть в API');
    }

    const existingProducts: ApiProduct[] = await getAllProducts();
    await createMissingProducts(finalCategories, existingProducts);

    return true;
  } catch (error) {
    console.error('Ошибка при инициализации API:', error);
    return false;
  }
};

const getAllProducts = async (): Promise<ApiProduct[]> => {
  try {
    const result = await apolloClient.query<ProductsQueryResponse>({
      query: gql`
        query GetAllProducts {
          products(limit: 100) {
            id
            title
            price
            description
            images
            category {
              id
              name
            }
          }
        }
      `,
    });
    return result.data?.products || [];
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    return [];
  }
};

const createCategories = async (categoryNames: string[]): Promise<void> => {
  try {
    console.log('Создаем отсутствующие категории...');

    for (const categoryName of categoryNames) {
      try {
        const result = await apolloClient.mutate<AddCategoryMutationResponse>({
          mutation: gql`
            mutation AddCategory($data: CreateCategoryDto!) {
              addCategory(data: $data) {
                id
                name
                image
              }
            }
          `,
          variables: {
            data: {
              name: categoryName,
              image: 'https://placeimg.com/640/480/any',
            },
          },
        });

        if (result.data?.addCategory) {
          console.log(`Создана категория: ${categoryName}`);
        }
      } catch (categoryError) {
        console.error(`Ошибка при создании категории ${categoryName}:`, categoryError);
      }
    }
  } catch (error) {
    console.error('Общая ошибка при создании категорий:', error);
  }
};

const createMissingProducts = async (
  categories: Category[],
  existingProducts: ApiProduct[],
): Promise<void> => {
  try {
    console.log('Проверяем отсутствующие товары...');

    const categoryMap = new Map<string, number>();
    categories.forEach(category => {
      categoryMap.set(category.name.toLowerCase(), category.id);
    });

    const existingProductTitles = existingProducts.map(p => p.title?.toLowerCase());

    for (const product of demoProducts) {
      if (existingProductTitles.includes(product.title.toLowerCase())) {
        console.log(`Пропускаем существующий товар: ${product.title}`);
        continue;
      }

      const categoryId = categoryMap.get(product.category.toLowerCase());

      if (!categoryId) {
        console.warn(`Категория "${product.category}" не найдена для товара: ${product.title}`);
        continue;
      }

      const productData: CreateProductDto = {
        title: product.title,
        price: product.price,
        description: product.description,
        categoryId: Number(categoryId),
        images: [product.image],
      };

      try {
        const result = await apolloClient.mutate<AddProductMutationResponse>({
          mutation: gql`
            mutation CreateProduct($data: CreateProductDto!) {
              addProduct(data: $data) {
                id
                title
                price
                description
                images
                category {
                  id
                  name
                }
              }
            }
          `,
          variables: {
            data: productData,
          },
        });

        if (result.data?.addProduct) {
          console.log(`Добавлен товар: ${product.title}`);
        }
      } catch (productError) {
        console.error(`Ошибка при создании товара ${product.title}:`, productError);
      }
    }
  } catch (error) {
    console.error('Ошибка при создании товаров:', error);
  }
};

const getAllCategories = async (): Promise<Category[]> => {
  try {
    const result = await apolloClient.query<CategoriesQueryResponse>({
      query: gql`
        query GetAllCategories {
          categories {
            id
            name
            image
          }
        }
      `,
    });
    return result.data?.categories || [];
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    return [];
  }
};
