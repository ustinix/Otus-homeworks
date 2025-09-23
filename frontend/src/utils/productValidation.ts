export const productValidationSchema = {
  name(value: string) {
    if (value?.length >= 2) return true;

    return 'Имя должно содержать минимум две буквы.';
  },
  price(value: number) {
    if (value >= 0) return true;

    return 'Цена должна быть больше 0.';
  },
  description(value: string) {
    if (value?.length >= 2) return true;

    return 'Описание должно содержать минимум две буквы.';
  },
  category(value: string) {
    if (value?.length >= 2) return true;

    return 'Имя категории должно содержать минимум две буквы.';
  },
  imageURL(value: string) {
    if (/^https?:\/\/.+\..+/.test(value)) return true;
    return 'Пожалуйста введите URL.';
  },
  ratingCount(value: string) {
    if (Number(value) >= 0) {
      return true;
    }
    return 'Количество оценок должно быть целым неотрицательным числом';
  },
  rating(value: string) {
    if (value) return true;
    return 'Пожалуйста выберите рейтинг.';
  },
};
