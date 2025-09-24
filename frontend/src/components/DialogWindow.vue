<script setup lang="ts">
import type { Product } from '../types/product';
import AppButton from './AppButton.vue';

defineProps<{
  selectedProduct: Product | null;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void;
}>();

const close = () => {
  emit('update:isOpen', false);
};
</script>
<template>
  <v-dialog
    max-width="600"
    :model-value="isOpen"
    @update:model-value="emit('update:isOpen', $event)"
  >
    <v-card v-if="selectedProduct">
      <v-card-title>{{ selectedProduct.title }}</v-card-title>

      <v-img :src="selectedProduct.images" :alt="selectedProduct.title" height="300" cover></v-img>

      <v-card-text>
        <div class="my-2">
          <v-chip>{{ selectedProduct.category }}</v-chip>
        </div>
        <p>{{ selectedProduct.description }}</p>
      </v-card-text>
      <v-card-subtitle class="ms-2 text-h6">${{ selectedProduct.price }}</v-card-subtitle>
      <v-card-actions>
        <v-spacer></v-spacer>
        <app-button color="primary" @click="close">Закрыть</app-button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
