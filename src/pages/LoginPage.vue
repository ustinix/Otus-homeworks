<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import BaseForm from '../components/BaseForm.vue';
import { loginValidationSchema } from '../utils/loginValidationSchema';
import type { LoginFormType } from '../types/login';
import { useRouter } from 'vue-router';

const router = useRouter();

const customerName = useField<string>('customerName');
const email = useField<string>('email');
const password = useField<string>('password');

const { handleSubmit, resetForm } = useForm<LoginFormType>({
  validationSchema: loginValidationSchema(),
});

const submit = handleSubmit(async values => {
  alert(`Добро пожаловать ${values.customerName}.`);
  router.push('/');
});

const onFormReset = () => {
  resetForm();
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
            v-model="customerName.value.value"
            :error-messages="customerName.errorMessage.value"
            label="Login"
            required
          ></v-text-field>

          <v-text-field
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
            label="Email"
            type="email"
            required
          ></v-text-field>

          <v-text-field
            v-model="password.value.value"
            :error-messages="password.errorMessage.value"
            label="Password"
            type="password"
            required
          ></v-text-field>
        </template>

        <template #actions>
          <v-btn color="error" @click="onFormReset">Очистить</v-btn>
          <v-btn color="primary" type="submit"> Создать </v-btn>
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
