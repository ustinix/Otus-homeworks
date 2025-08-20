import type { RouteRecordRaw } from 'vue-router';
import { createWebHistory, createRouter } from 'vue-router';
import MainPage from '../pages/MainPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import ErrorPage from '../pages/ErrorPage.vue';
import CheckoutPage from '../pages/CheckoutPage.vue';
import UserPage from '../pages/UserPage.vue';
import ProductPage from '../pages/ProductPage.vue';
import CartPage from '../pages/CartPage.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: MainPage }, //Главная страница
  { path: '/about', component: CheckoutPage }, //страница чекаута(форма заказа)
  { path: '/login', component: LoginPage }, //форма логина
  { path: '/user', component: UserPage }, //страница добавления товара (простой аналог админки)
  { path: '/cart', component: CartPage }, //список товаров в корзине
  { path: '/product/:id', component: ProductPage, props: true }, //страница товара
  { path: '/:pathMatch(.*)*', component: ErrorPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
