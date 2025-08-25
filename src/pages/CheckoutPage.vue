<script setup lang="ts">
import { ref } from 'vue';
import OrderForm from '../components/OrderForm.vue';
import type { OrderFormType } from '../types/order';
import { useRouter } from 'vue-router';

const router = useRouter();

const notification = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'info',
});

const handleOrderCreated = (orderData: OrderFormType) => {
  console.log('Заказ создан:', orderData);
  showNotification('Заказ успешно оформлен!', 'success');

  setTimeout(() => {
    router.push('/');
  }, 2000);
};

const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
  notification.value = {
    show: true,
    message,
    type,
  };

  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};
</script>

<template>
  <div class="order-page">
    <v-snackbar v-model="notification.show" :color="notification.type" timeout="3000">
      {{ notification.message }}
    </v-snackbar>

    <OrderForm @order-created="handleOrderCreated" />
  </div>
</template>

<style scoped>
.order-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
