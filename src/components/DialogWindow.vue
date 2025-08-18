<script setup lang="ts">
import type { DialogProps } from '../types/dialogProps';
import AppButton from './AppButton.vue';

defineProps<DialogProps>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const close = () => {
  emit('update:modelValue', false);
};
</script>
<template>
  <v-dialog
    max-width="600"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card v-if="selectedProduct">
      <v-card-title>{{ selectedProduct.title }}</v-card-title>

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
      <v-card-subtitle class="ms-2 text-h6">${{ selectedProduct.price }}</v-card-subtitle>
      <v-card-actions>
        <v-spacer></v-spacer>
        <app-button color="primary" @click="close">Закрыть</app-button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
