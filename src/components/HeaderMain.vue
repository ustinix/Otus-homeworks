<script setup lang="ts">
import { computed } from 'vue';
import dividerLine from './DividerLine.vue';
import HeaderSearch from './HeaderSearch.vue';
import type { Product } from '../types/product';
import { useCartStore } from '../stores/cart';

const cartStore = useCartStore();

const props = defineProps<{
  products: Product[];
}>();

const navLinks = computed(() => [
  { to: '/', text: 'Главная' },
  { to: '/login', text: 'Войти' },
  { to: '/checkout', text: 'Оформить заказ' },
]);

const emit = defineEmits<{
  (e: 'search-update', products: Product[]): void;
}>();

const handleSearchUpdate = (filteredProducts: Product[]) => {
  emit('search-update', filteredProducts);
};
</script>
<template>
  <div class="header">
    <div class="header-title">
      <div class="app-logo">
        <RouterLink to="/" title="Main" class="main-link">
          <h2>Магазин</h2>
        </RouterLink>
      </div>
      <div class="tools">
        <header-search :products="props.products" @update:filtered="handleSearchUpdate" />
        <RouterLink to="/user" title="Admin profile">
          <img src="../assets/images/user.png" alt="user" width="15" height="15" />
        </RouterLink>
        <RouterLink to="/cart" title="Cart" class="cart-link">
          <img
            src="../assets/images/shopping-cart.png"
            alt="shopping-cart"
            width="15"
            height="15"
            class="cart-img"
          />
          <span class="cart-count" data-test="cart-counter">
            {{ cartStore.totalItems }}
          </span>
        </RouterLink>
      </div>
    </div>
    <divider-line />
    <nav class="nav">
      <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to">
        {{ link.text }}
      </RouterLink>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.header {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &-title {
    padding-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tools {
      display: flex;
      justify-content: center;
      align-items: end;
      gap: 15px;
      img {
        filter: brightness(0);
        opacity: 0.8;
        transition: filter 0.3s ease;
      }
      .cart-link {
        position: relative;
        display: inline-block;

        .cart-count {
          position: absolute;
          top: -8px;
          right: -8px;
          background: red;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
  .main-link {
    display: flex;
    justify-content: center;
    gap: 1vh;
    cursor: pointer;
    color: rgb(var(--v-theme-primary));
  }
  .nav {
    display: flex;
    justify-content: center;
    gap: 5vw;
    padding: 1rem;

    a {
      color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }

      &.router-link-active {
        font-weight: bold;
        color: rgb(var(--v-theme-primary));
      }
    }
  }
}
</style>
