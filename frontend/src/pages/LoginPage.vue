<script setup lang="ts">
import { useField } from 'vee-validate';
import BaseForm from '../components/BaseForm.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useUserStore } from '../stores/user';
import type { User } from '../types/user';

const userStore = useUserStore();
const router = useRouter();
const isAdmin = ref(false);

const validateLogin = (value: string) => {
  if (!value) return 'Логин обязателен';
  if (value.length < 3) return 'Логин должен содержать минимум 3 символа';
  if (value.length > 20) return 'Логин не должен превышать 20 символов';
  return true;
};

const validateEmail = (value: string) => {
  if (!value) return 'Email обязателен';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return 'Введите корректный email';
  return true;
};

const validatePassword = (value: string) => {
  if (!value) return 'Пароль обязателен';
  if (value.length < 6) return 'Пароль должен содержать минимум 6 символов';
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
    return 'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру';
  }
  return true;
};

const {
  value: loginValue,
  errorMessage: loginError,
  handleBlur: loginValidate,
} = useField('login', validateLogin);

const {
  value: emailValue,
  errorMessage: emailError,
  handleBlur: emailValidate,
} = useField('email', validateEmail);

const {
  value: passwordValue,
  errorMessage: passwordError,
  handleBlur: passwordValidate,
} = useField('password', validatePassword);

const submit = () => {
  loginValidate();
  emailValidate();
  passwordValidate();

  if (!loginError.value && !emailError.value && !passwordError.value) {
    const formData: User = {
      login: String(loginValue.value),
      email: String(emailValue.value),
      isAdmin: isAdmin.value,
      isLoggedIn: true,
    };
    userStore.setUser(formData);

    alert(
      `Добро пожаловать ${formData.login}. ${formData.isAdmin ? 'Вы вошли как администратор.' : ''}`,
    );

    if (formData.isAdmin) {
      router.push('/admin');
    } else {
      router.push('/');
    }
  }
};

const onFormReset = () => {
  loginValue.value = '';
  emailValue.value = '';
  passwordValue.value = '';
  isAdmin.value = false;
  loginError.value = '';
  emailError.value = '';
  passwordError.value = '';
};
</script>

<template>
  <div>
    <v-card class="form-container pa-6">
      <base-form @send="submit" @reset="onFormReset">
        <template #header>
          <v-card-title class="headline">Войти:</v-card-title>
        </template>

        <template #body>
          <v-text-field
            v-model="loginValue"
            data-test="username"
            :error-messages="loginError"
            label="Login"
            required
            @blur="loginValidate"
          ></v-text-field>

          <v-text-field
            v-model="emailValue"
            data-test="email"
            :error-messages="emailError"
            label="Email"
            type="email"
            required
            @blur="emailValidate"
          ></v-text-field>

          <v-text-field
            v-model="passwordValue"
            data-test="password"
            :error-messages="passwordError"
            label="Password"
            type="password"
            required
            @blur="passwordValidate"
          ></v-text-field>

          <v-checkbox
            v-model="isAdmin"
            label="Я админ"
            color="primary"
            data-test="admin"
          ></v-checkbox>
        </template>

        <template #actions>
          <v-btn data-test="reset-btn" color="error" @click="onFormReset">Очистить</v-btn>
          <v-btn data-test="submit-btn" color="primary" type="submit"> Войти </v-btn>
        </template>
      </base-form>
    </v-card>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 0 auto;
}
</style>
