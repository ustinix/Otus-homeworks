<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import dividerLine from './DividerLine.vue';
import HeaderSearch from './HeaderSearch.vue';
import type { Product } from '../types/product';
import type { User } from '../types/user';
import type { NavLink } from '../types/navlink';
import { useCartStore } from '../stores/cart';

const cartStore = useCartStore();

const props = defineProps<{
  products: Product[];
}>();

const user = ref<User | null>(null);

const loadUserData = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      user.value = JSON.parse(userData);
    } catch (error) {
      console.error('Ошибка при чтении данных пользователя:', error);
      user.value = null;
    }
  } else {
    user.value = null;
  }
};

onMounted(() => {
  loadUserData();
  window.addEventListener('storage', loadUserData);
});

onUnmounted(() => {
  window.removeEventListener('storage', loadUserData);
});

const navLinks = computed<NavLink[]>(() => {
  const links: NavLink[] = [{ to: '/', text: 'Каталог' }];

  if (!user.value?.isLoggedIn) {
    links.push({ to: '/login', text: 'Войти' });
  } else {
    links.push({ to: '/logout', text: 'Выйти', action: 'logout' });
  }

  if (user.value?.isLoggedIn) {
    links.push({ to: '/checkout', text: 'Оформить заказ' });
  }

  return links;
});

const logout = () => {
  localStorage.removeItem('user');
  user.value = null;
  if (window.location.pathname !== '/') {
    window.location.href = '/';
  }
};

const handleLinkClick = (link: NavLink) => {
  if (link.action === 'logout') {
    logout();
  }
};

const emit = defineEmits<{
  (e: 'search-update', products: Product[]): void;
}>();

const handleSearchUpdate = (filteredProducts: Product[]) => {
  emit('search-update', filteredProducts);
};

defineExpose({
  updateUser: loadUserData,
});
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
        <div>
          <div v-if="user?.isLoggedIn" class="user-info">
            <span class="user-login">Пользователь: {{ user.login }}</span>
          </div>
          <header-search :products="props.products" @update:filtered="handleSearchUpdate" />
        </div>
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
      <RouterLink
        v-for="link in navLinks"
        :key="link.to + link.text"
        :to="link.action ? '' : link.to"
        :class="{ 'logout-link': link.action === 'logout' }"
        @click="handleLinkClick(link)"
      >
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
      .user-info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        font-size: 14px;

        .user-login {
          font-weight: 500;
          color: rgb(var(--v-theme-primary));
        }

        .admin-badge {
          font-size: 12px;
          color: #ff6b6b;
          font-weight: bold;
        }
      }
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
