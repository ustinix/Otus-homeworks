import type { Product } from './product';

export interface DialogProps {
  selectedProduct: Product | null;
  isOpen: boolean;
}
