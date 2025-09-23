<script setup lang="ts">
import { storeToRefs } from 'pinia';
import DividerLine from '../components/DividerLine.vue';
import { useCartStore } from '../stores/cart';
import LoadingCircle from '../components/LoadingCircle.vue';
import ErrorTemplate from '../components/ErrorTemplate.vue';

const cartStore = useCartStore();
const { items, totalItems, totalPrice, isLoading, error } = storeToRefs(cartStore);
const { decrementQuantity, incrementQuantity, removeFromCart, clearCart } = cartStore;

const reloadCart = async () => {
  cartStore.error = null;
};
</script>

<template>
  <div class="cart-container">
    <loading-circle v-if="isLoading" />
    <error-template v-else-if="error" :error="error" :event="reloadCart" />
    <template v-else>
      <h2 class="text-h4 font-weight-bold mb-6">Корзина</h2>
      <div v-if="totalItems === 0" class="empty-cart">
        <p data-test="emptyCartMess">Ваша корзина пуста</p>
        <v-btn to="/" color="primary" size="large"> Начать покупки </v-btn>
      </div>
      <v-list v-else class="cart-list">
        <v-list-item v-for="item in items" :key="item.product.id" class="cart-item">
          <div class="item-content">
            <div class="image-container">
              <v-img
                :src="item.product.images"
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
            <div class="item-quantity-section">
              <v-btn
                icon
                variant="text"
                color="error"
                size="small"
                data-test="minusBtn"
                @click="decrementQuantity(item.product.id)"
              >
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <span data-test="quantity" class="text-h6 font-weight-bold primary--text">
                {{ item.quantity }}
              </span>
              <v-btn
                icon
                variant="text"
                color="green"
                size="small"
                data-test="plusBtn"
                @click="incrementQuantity(item.product.id)"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
            <div class="item-price-section">
              <span class="text-h6 font-weight-bold primary--text">
                {{ (item.product.price * item.quantity).toFixed(2) }} руб.
              </span>
            </div>
            <v-btn
              icon
              variant="text"
              color="error"
              size="small"
              data-test="deleteBtn"
              @click="removeFromCart(item.product.id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
          <divider-line />
        </v-list-item>
      </v-list>
      <div v-if="totalItems > 0" class="checkout-section">
        <v-btn color="error" size="large" class="checkout-btn" @click="clearCart()">
          <v-icon start>mdi-delete</v-icon>
          Очистить корзину
        </v-btn>
        <div class="total-price">
          <h3 class="text-h5">Итого: {{ totalPrice.toFixed(2) }} руб.</h3>
        </div>
        <v-btn to="/checkout" color="primary" size="large" class="checkout-btn">
          <v-icon start>mdi-cart-arrow-right</v-icon>
          Оформить заказ
        </v-btn>
      </div>
    </template>
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
  text-align: right;
}

.total-price {
  margin: 16px 0;
}

.checkout-btn {
  min-width: 200px;
}

.empty-cart {
  margin: 0 auto;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 5rem;
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
