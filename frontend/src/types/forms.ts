export interface ProductFormValues {
  name: string;
  price: number;
  description: string;
  category: string;
  imageURL: string;
  ratingCount: number;
  rating: string;
}

export interface OrderFormValues {
  customerName: string;
  email: string;
  phone: string;
  birthDate: string;
  country: string;
  city: string;
  street: string;
  house: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  agreeToTerms: boolean;
}
