<script setup lang="ts">
import { useProductStore } from '../stores/product';
import { useRouter } from 'vue-router';
import AppButton from '../components/AppButton.vue';
import { useCartStore } from '../stores/cart';
import { onMounted, watch } from 'vue';
import LoadingCircle from '../components/LoadingCircle.vue';
import { storeToRefs } from 'pinia';
import ErrorTemplate from '../components/ErrorTemplate.vue';

const props = defineProps<{
  id: string;
}>();

const router = useRouter();
const cartStore = useCartStore();
const productStore = useProductStore();
const { product, isLoading, error } = storeToRefs(productStore);
const { getProduct } = productStore;

onMounted(() => {
  if (props.id) {
    getProduct(props.id);
  }
});

watch(
  () => props.id,
  newId => {
    if (newId) {
      getProduct(newId);
    }
  },
);

const addToCart = () => {
  if (product.value) {
    cartStore.addToCart(product.value);
  }
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="product-page">
    <v-container>
      <app-button class="mb-4" variant="outlined" @click="goBack"> ← Назад к каталогу </app-button>

      <loading-circle v-if="isLoading" type="card, article, actions"></loading-circle>
      <error-template v-else-if="error" :error="error" :event="() => getProduct(id)" />

      <v-card v-else-if="product" elevation="2">
        <v-row no-gutters>
          <v-col class="image-col" cols="12" md="6">
            <div class="image-container">
              <v-img
                :src="product.images"
                :alt="product.title"
                width="400"
                cover
                class="product-image"
              ></v-img>
            </div>
          </v-col>

          <v-col cols="12" md="6" class="pa-4">
            <v-card-title class="text-h5 mb-2">{{ product.title }}</v-card-title>

            <div class="mb-3">
              <v-chip color="primary" size="small">{{ product.category }}</v-chip>
            </div>

            <v-card-text class="pa-0">
              <p class="text-body-1 mb-4">{{ product.description }}</p>

              <div class="text-h4 text-primary mb-4">{{ product.price.toFixed(2) }} руб</div>
            </v-card-text>

            <v-card-actions>
              <app-button color="primary" variant="tonal" size="large" @click="addToCart">
                Добавить в корзину
              </app-button>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
.product-page {
  padding: 20px 0;
}

.image-col {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  min-height: 400px;
}

.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 40px;
}

.product-image {
  object-fit: contain;
  max-width: 80%;
  width: auto;
  height: auto;
}

.v-card {
  border-radius: 12px;
}
</style>
