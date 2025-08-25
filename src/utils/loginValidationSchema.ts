export const loginValidationSchema = () => {
  return {
    customerName(value: string) {
      if (value?.length >= 2) return true;
      return 'Имя должно содержать минимум две буквы';
    },
    email(value: string) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return true;
      return 'Введите корректный email';
    },
    password(value: string) {
      if (/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)) return true;
      return 'Пароль должен содержать не менее 8 символов, как минимум 1 цифру и 1 букву в верхнем регистре';
    },
  };
};
