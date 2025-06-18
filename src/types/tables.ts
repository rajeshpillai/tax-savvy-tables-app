
export interface Item {
  id: number;
  product: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Tax {
  id: number;
  tax: string;
  type: 'Percentage' | 'Amount';
  taxOn: 'On Item' | 'On Order';
  charge: number;
}

export interface ItemTax {
  id: number;
  itemId: number;
  taxId: number;
  total: number;
}
