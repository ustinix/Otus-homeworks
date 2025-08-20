import type { Ref } from 'vue';

export const orderValidationSchema = (showAddressFields: Ref<boolean>) => {
  return {
    customerName(value: string) {
      if (value?.length >= 2) return true;
      return 'Имя должно содержать минимум две буквы';
    },
    email(value: string) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return true;
      return 'Введите корректный email';
    },
    phone(value: string) {
      if (/^\+?[\d\s\-()]{10,}$/.test(value)) return true;
      return 'Введите корректный телефон';
    },
    birthDate(value: string) {
      if (value) return true;
      return 'Введите дату рождения';
    },
    country(value: string) {
      if (!showAddressFields.value || value?.length >= 2) return true;
      return 'Введите страну';
    },
    city(value: string) {
      if (!showAddressFields.value || value?.length >= 2) return true;
      return 'Введите город';
    },
    street(value: string) {
      if (!showAddressFields.value || value?.length >= 2) return true;
      return 'Введите улицу';
    },
    house(value: string) {
      if (!showAddressFields.value || value?.length >= 1) return true;
      return 'Введите дом';
    },
    cardNumber(value: string) {
      if (/^\d{16}$/.test(value?.replace(/\s/g, ''))) return true;
      return 'Номер карты должен содержать 16 цифр';
    },
    cardExpiry(value: string) {
      if (/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value)) return true;
      return 'Формат: ММ/ГГ';
    },
    cardCvv(value: string) {
      if (/^\d{3,4}$/.test(value)) return true;
      return 'CVV должен содержать 3-4 цифры';
    },
    agreeToTerms(value: boolean) {
      if (value) return true;
      return 'Необходимо согласие с обработкой данных';
    },
  };
};
