import type { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { createWebHistory, createRouter } from 'vue-router';
import MainPage from '../pages/MainPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import ErrorPage from '../pages/ErrorPage.vue';
import CheckoutPage from '../pages/CheckoutPage.vue';
import UserPage from '../pages/UserPage.vue';
import ProductPage from '../pages/ProductPage.vue';
import CartPage from '../pages/CartPage.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'main', component: MainPage },
  { path: '/checkout', name: 'checkout', component: CheckoutPage, meta: { requiresAuth: true } },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/admin', name: 'admin', component: UserPage, meta: { requiresAdmin: true } },
  { path: '/cart', name: 'cart', component: CartPage },
  { path: '/product/:id', name: 'product', component: ProductPage, props: true },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: ErrorPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({
    top: 0,
  }),
});

const isAuthenticated = (): boolean => {
  const userData = localStorage.getItem('user');
  if (!userData) return false;

  try {
    const user = JSON.parse(userData);
    return user.isLoggedIn === true;
  } catch {
    return false;
  }
};

const isAdmin = (): boolean => {
  const userData = localStorage.getItem('user');
  if (!userData) return false;

  try {
    const user = JSON.parse(userData);
    return user.isLoggedIn === true && user.isAdmin === true;
  } catch {
    return false;
  }
};

router.beforeEach(
  (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (to.name === 'login' && isAuthenticated()) {
      next({ name: 'main' });
      return;
    }

    if (to.meta.requiresAuth) {
      if (!isAuthenticated()) {
        next({
          name: 'login',
          query: { redirect: to.fullPath },
        });
        return;
      }
    }

    if (to.meta.requiresAdmin) {
      if (!isAdmin()) {
        next({ name: 'main' });
        return;
      }
    }

    next();
  },
);

export default router;
