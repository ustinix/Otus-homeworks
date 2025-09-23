<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { onMounted, ref } from 'vue';
import BaseForm from './BaseForm.vue';
import type { Product } from '../types/product';
import type { ProductFormValues } from '../types/forms';
import { productValidationSchema } from '../utils/productValidation';
import { apolloClient } from '../lib/apollo-client';
import { gql } from '@apollo/client/core';
import type { AddProductMutationResponse, CategoriesQueryResponse } from '../types/apiResponses';

const categories = ref<{ id: number; name: string }[]>([]);
const isLoadingCategories = ref(false);

const loadCategories = async () => {
  isLoadingCategories.value = true;
  try {
    const result = await apolloClient.query<CategoriesQueryResponse>({
      query: gql`
        query GetCategories {
          categories {
            id
            name
          }
        }
      `,
    });

    categories.value = result.data?.categories || [];
  } catch (error) {
    console.error('Ошибка загрузки категорий:', error);
  } finally {
    isLoadingCategories.value = false;
  }
};

const { handleReset } = useForm<ProductFormValues>({
  validationSchema: productValidationSchema,
});

const name = useField<string>('name');
const price = useField<string>('price');
const description = useField<string>('description');
const category = useField<string>('category');
const imageURL = useField<string>('imageURL');
const isLoading = ref(false);

const onFormReset = () => {
  handleReset();
};

const addProduct = async (productData: {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
}): Promise<Product | null> => {
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
              image
            }
          }
        }
      `,
      variables: {
        data: productData,
      },
    });

    if (result.data?.addProduct) {
      const apiProduct = result.data.addProduct;

      const newProduct: Product = {
        id: apiProduct.id,
        title: apiProduct.title,
        price: apiProduct.price,
        description: apiProduct.description,
        category: apiProduct.category.name,
        images: apiProduct.images[0] || '',
      };

      alert('Товар успешно создан');
      return newProduct;
    }
    return null;
  } catch (error) {
    alert(' Ошибка при создании товара');
    throw error;
  }
};

const submit = async () => {
  isLoading.value = true;

  try {
    const productData = {
      title: name.value.value,
      price: parseFloat(price.value.value),
      description: description.value.value,
      categoryId: parseInt(category.value.value),
      images: [imageURL.value.value],
    };

    console.log('Отправка данных товара:', productData);

    const newProduct = await addProduct(productData);

    if (newProduct) {
      handleReset();
    }
  } catch (error) {
    console.error('Ошибка при создании товара:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadCategories();
});
</script>

<template>
  <div>
    <v-card class="form-container pa-6">
      <v-card>
        <base-form @send="submit" @reset="onFormReset">
          <template #header>
            <v-card-title class="headline">Создание нового товара</v-card-title>
            <v-card-subtitle v-if="isLoadingCategories"> Загрузка категорий... </v-card-subtitle>
            <v-card-subtitle v-else-if="categories.length === 0" class="error--text">
              Не удалось загрузить категории
            </v-card-subtitle>
          </template>

          <template #body>
            <v-text-field
              v-model="name.value.value"
              :error-messages="name.errorMessage.value"
              label="Название товара"
              required
              :disabled="isLoading"
            ></v-text-field>

            <v-text-field
              v-model="price.value.value"
              :error-messages="price.errorMessage.value"
              label="Цена"
              type="number"
              min="0"
              required
              :disabled="isLoading"
            ></v-text-field>

            <v-textarea
              v-model="description.value.value"
              :error-messages="description.errorMessage.value"
              label="Описание"
              required
              :disabled="isLoading"
            ></v-textarea>

            <v-select
              v-model="category.value.value"
              :error-messages="category.errorMessage.value"
              :items="categories"
              item-title="name"
              item-value="id"
              label="Категория"
              :loading="isLoadingCategories"
              :disabled="isLoading || isLoadingCategories"
              required
            ></v-select>

            <v-text-field
              v-model="imageURL.value.value"
              :error-messages="imageURL.errorMessage.value"
              label="URL изображения"
              required
              :disabled="isLoading"
            ></v-text-field>
          </template>

          <template #actions>
            <v-btn color="error" :disabled="isLoading" @click="onFormReset">Отмена</v-btn>
            <v-btn color="primary" type="submit" :loading="isLoading" :disabled="isLoading">
              Создать
            </v-btn>
          </template>
        </base-form>
      </v-card>
    </v-card>
  </div>
</template>

<style scoped>
.form-container {
  margin: 0 auto;
  max-width: 700px;
}
.product-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.headline {
  background-color: #f5f5f5;
  padding: 16px;
}
</style>
