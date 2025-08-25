<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue';
import BaseForm from './BaseForm.vue';
import { useProducts } from '../services/use-product';
import type { Product } from '../types/product';
import type { ProductFormValues } from '../types/forms';
import { productValidationSchema } from '../utils/productValidation';

const emit = defineEmits<{
  created: [product: Product];
}>();

const { handleReset } = useForm<ProductFormValues>({
  validationSchema: productValidationSchema,
});

const name = useField<string>('name');
const price = useField<string>('price');
const description = useField<string>('description');
const category = useField<string>('category');
const imageURL = useField<string>('imageURL');
const ratingCount = useField<string>('ratingCount');
const rating = useField<string>('select');

const items = ref<string[]>(['0', '1', '2', '3', '4', '5']);
const isLoading = ref(false);

const submit = async () => {
  isLoading.value = true;
  const productData: Omit<Product, 'id'> = {
    title: name.value.value,
    price: parseFloat(price.value.value),
    description: description.value.value,
    category: category.value.value,
    image: imageURL.value.value,
    rating: {
      rate: parseFloat(rating.value.value),
      count: parseInt(ratingCount.value.value),
    },
  };
  try {
    const newProduct = await useProducts().addProduct(productData);

    if (newProduct) {
      emit('created', newProduct);
      handleReset();
    }
  } catch (error) {
    console.error('Ошибка при создании товара:', error);
  } finally {
    isLoading.value = false;
  }
};

const onFormReset = () => {
  handleReset();
};
</script>

<template>
  <div>
    <v-card class="form-container pa-6">
      <v-card>
        <base-form @send="submit" @reset="onFormReset">
          <template #header>
            <v-card-title class="headline">Создание нового товара</v-card-title>
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

            <v-text-field
              v-model="category.value.value"
              :error-messages="category.errorMessage.value"
              label="Категория"
              required
              :disabled="isLoading"
            ></v-text-field>

            <v-text-field
              v-model="imageURL.value.value"
              :error-messages="imageURL.errorMessage.value"
              label="URL изображения"
              required
              :disabled="isLoading"
            ></v-text-field>

            <v-text-field
              v-model="ratingCount.value.value"
              :error-messages="ratingCount.errorMessage.value"
              label="Количество оценок"
              type="number"
              min="0"
              required
              :disabled="isLoading"
            ></v-text-field>

            <v-select
              v-model="rating.value.value"
              :error-messages="rating.errorMessage.value"
              :items="items"
              label="Рейтинг"
              required
              :disabled="isLoading"
            ></v-select>
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
