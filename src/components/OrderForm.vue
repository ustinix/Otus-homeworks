<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useField, useForm } from 'vee-validate';
import BaseForm from './BaseForm.vue';
import type { OrderFormValues } from '../types/forms';
import { orderValidationSchema } from '../utils/orderValidation';
import { formatCardNumber } from '../utils/formatCardNumber';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'order-created': [order: OrderFormValues];
}>();

const showForm = ref(props.modelValue);
const isLoading = ref(false);
const showAddressFields = ref(false);

watch(
  () => props.modelValue,
  value => {
    showForm.value = value;
  },
);

watch(showForm, value => {
  emit('update:modelValue', value);
});

const { handleSubmit, handleReset, meta } = useForm<OrderFormValues>({
  validationSchema: orderValidationSchema(showAddressFields),
});

const isFormValid = computed(() => meta.value.valid);

const customerName = useField<string>('customerName');
const email = useField<string>('email');
const phone = useField<string>('phone');
const birthDate = useField<string>('birthDate');
const country = useField<string>('country');
const city = useField<string>('city');
const street = useField<string>('street');
const house = useField<string>('house');
const cardNumber = useField<string>('cardNumber');
const cardExpiry = useField<string>('cardExpiry');
const cardCvv = useField<string>('cardCvv');
const agreeToTerms = useField<boolean>('agreeToTerms');

const countries = ref(['Россия', 'Казахстан']);

const submit = handleSubmit(async values => {
  isLoading.value = true;
  emit('order-created', values);
  emit('update:modelValue', false);

  try {
    const response = await fetch('https://httpbin.org/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order: {
          ...values,
          cardNumber: values.cardNumber,
        },
      }),
    });

    if (response.ok) {
      await response.json();

      emit('order-created', values);
      closeForm();

      alert('Заказ успешно оформлен!');
    } else {
      throw new Error('Ошибка при отправке заказа');
    }
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
  } finally {
    isLoading.value = false;
  }
});

const closeForm = () => {
  emit('update:modelValue', false);
  handleReset();
  showAddressFields.value = false;
};

const onFormSubmit = () => {
  submit();
};

const onFormReset = () => {
  handleReset();
};
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="800"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <BaseForm @submit="onFormSubmit" @reset="onFormReset">
        <template #header>
          <v-card-title class="headline">Оформление заказа</v-card-title>
        </template>

        <template #body>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="customerName.value.value"
                :error-messages="customerName.errorMessage.value"
                label="ФИО"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="birthDate.value.value"
                :error-messages="birthDate.errorMessage.value"
                label="Дата рождения"
                type="date"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="email.value.value"
                :error-messages="email.errorMessage.value"
                label="Email"
                type="email"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="phone.value.value"
                :error-messages="phone.errorMessage.value"
                label="Телефон"
                placeholder="+7 (999) 999-99-99"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-checkbox
            v-model="showAddressFields"
            label="Ввести адрес доставки"
            class="mt-0"
          ></v-checkbox>

          <v-row v-if="showAddressFields">
            <v-col cols="12" md="6">
              <v-select
                v-model="country.value.value"
                :error-messages="country.errorMessage.value"
                :items="countries"
                label="Страна"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="city.value.value"
                :error-messages="city.errorMessage.value"
                label="Город"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="showAddressFields">
            <v-col cols="12" md="8">
              <v-text-field
                v-model="street.value.value"
                :error-messages="street.errorMessage.value"
                label="Улица"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="house.value.value"
                :error-messages="house.errorMessage.value"
                label="Дом"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>
          <h3 class="mb-3">Данные банковской карты</h3>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="cardNumber.value.value"
                :error-messages="cardNumber.errorMessage.value"
                label="Номер карты"
                placeholder="0000 0000 0000 0000"
                required
                @input="cardNumber.value.value = formatCardNumber($event.target.value)"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="cardExpiry.value.value"
                :error-messages="cardExpiry.errorMessage.value"
                label="Срок действия (ММ/ГГ)"
                placeholder="12/25"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="cardCvv.value.value"
                :error-messages="cardCvv.errorMessage.value"
                label="CVV"
                placeholder="123"
                type="password"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-checkbox
            v-model="agreeToTerms.value.value"
            :error-messages="agreeToTerms.errorMessage.value"
            label="Я согласен с правилами обработки персональных данных"
            required
          ></v-checkbox>
        </template>

        <template #actions>
          <v-btn color="error" :disabled="isLoading" @click="closeForm"> Отмена </v-btn>
          <v-btn
            color="primary"
            type="submit"
            :loading="isLoading"
            :disabled="isLoading || !isFormValid"
          >
            {{ isLoading ? 'Оформление...' : 'Оформить заказ' }}
          </v-btn>
        </template>
      </BaseForm>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.headline {
  background: linear-gradient(45deg, #1976d2, #2196f3);
  color: white;
}
</style>
