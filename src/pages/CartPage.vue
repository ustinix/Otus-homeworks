<script setup lang="ts">
import DividerLine from '../components/DividerLine.vue';
import { useCartStore } from '../stores/cart';

const cartStore = useCartStore();
</script>

<template>
  <div class="cart-container">
    <h2 class="text-h4 font-weight-bold mb-6">Корзина</h2>
    <div v-if="cartStore.totalItems === 0" class="empty-cart">
      <p>Ваша корзина пуста</p>
    </div>
    <v-list v-else class="cart-list">
      <v-list-item v-for="item in cartStore.items" :key="item.product.id" class="cart-item">
        <div class="item-content">
          <div class="image-container">
            <v-img
              :src="item.product.image"
              :aspect-ratio="1"
              width="80"
              contain
              class="item-image"
            ></v-img>
          </div>
          <div class="item-details">
            <h3 class="text-h6 font-weight-medium item-title">{{ item.product.title }}</h3>
            <p class="text-caption text-grey item-category">{{ item.product.category }}</p>
          </div>
          <div class="item-price-section">
            <span class="text-h6 font-weight-bold primary--text">
              {{ item.product.price.toFixed(2) }} руб.
            </span>
          </div>
          <v-btn
            icon
            variant="text"
            color="error"
            size="small"
            @click="cartStore.removeFromCart(item.product.id)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
        <divider-line />
      </v-list-item>
    </v-list>
    <div v-if="cartStore.totalItems > 0" class="checkout-section">
      <div class="total-price">
        <h3 class="text-h5">Итого: {{ cartStore.totalPrice.toFixed(2) }} руб.</h3>
      </div>
      <v-btn to="/checkout" color="primary" size="large" class="checkout-btn">
        <v-icon start>mdi-cart-arrow-right</v-icon>
        Оформить заказ
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.cart-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.cart-list {
  background: transparent;
}
.item-content {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 12px 0;
}

.image-container {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
}

.item-image {
  border-radius: 6px;
  object-fit: contain;
  max-height: 100%;
  max-width: 100%;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-title {
  margin-bottom: 4px;
  color: #333;
}

.item-category {
  text-transform: capitalize;
  margin-bottom: 4px;
}

.item-price-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.checkout-section {
  margin-top: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  text-align: center;
}

.total-price {
  margin-bottom: 16px;
}

.checkout-btn {
  min-width: 200px;
}

.empty-cart {
  text-align: center;
  padding: 40px;
  color: #999;
}

@media (max-width: 768px) {
  .item-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .item-price-section {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .cart-container {
    padding: 16px;
  }
}
</style>
