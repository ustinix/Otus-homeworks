<template>
  <v-dialog
    max-width="600"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card v-if="selectedProduct">
      <v-card-title>{{ selectedProduct.title }}</v-card-title>
      <v-card-subtitle>${{ selectedProduct.price }}</v-card-subtitle>

      <v-img :src="selectedProduct.image" :alt="selectedProduct.title" height="300" cover></v-img>

      <v-card-text>
        <div class="my-2">
          <v-chip>{{ selectedProduct.category }}</v-chip>
        </div>
        <p>{{ selectedProduct.description }}</p>
        <div class="d-flex align-center mt-2">
          <v-rating
            :model-value="selectedProduct.rating.rate"
            color="amber"
            density="compact"
            half-increments
            readonly
          ></v-rating>
          <span class="text-caption text-grey ms-2">
            ({{ selectedProduct.rating.count }} отзывов)
          </span>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="close">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Product } from '../types/product';
interface DialogProps {
  selectedProduct: Product | null;
  modelValue: boolean;
}

defineProps<DialogProps>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}>();

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};
</script>

<style scoped></style>
