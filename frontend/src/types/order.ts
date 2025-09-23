export interface OrderFormType {
  customerName: string;
  email: string;
  phone: string;
  birthDate: string;
  country?: string;
  city?: string;
  street?: string;
  house?: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  agreeToTerms: boolean;
}
