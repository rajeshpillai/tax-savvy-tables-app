
import { useReducer, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SmartTable, { TableColumn } from '../components/SmartTable';
import { Item, Tax, ItemTax } from '../types/tables';

// Action types
type Action = 
  | { type: 'UPDATE_ITEM'; payload: { id: number; updates: Partial<Item> } }
  | { type: 'UPDATE_TAX'; payload: { id: number; updates: Partial<Tax> } }
  | { type: 'UPDATE_ITEM_TAX'; payload: { id: number; updates: Partial<ItemTax> } }
  | { type: 'ADD_ITEM' }
  | { type: 'ADD_TAX' }
  | { type: 'ADD_ITEM_TAX' };

// State interface
interface State {
  items: Item[];
  taxes: Tax[];
  itemTaxes: ItemTax[];
}

// Initial state
const initialState: State = {
  items: [
    { id: 1, product: 'Pen', quantity: 2, rate: 10, amount: 20 },
    { id: 2, product: 'Book', quantity: 1, rate: 100, amount: 100 }
  ],
  taxes: [
    { id: 1, tax: 'GST', type: 'Percentage', taxOn: 'On Item', charge: 18 },
    { id: 2, tax: 'CESS', type: 'Amount', taxOn: 'On Order', charge: 5 }
  ],
  itemTaxes: [
    { id: 1, itemId: 1, taxId: 1, total: 3.60 },
    { id: 2, itemId: 2, taxId: 2, total: 5.00 }
  ]
};

// Helper function to calculate item tax total
const calculateItemTaxTotal = (item: Item, tax: Tax): number => {
  if (tax.type === 'Percentage') {
    return parseFloat(((item.amount * tax.charge) / 100).toFixed(2));
  } else {
    return tax.charge;
  }
};

// Reducer function
const dataReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'UPDATE_ITEM': {
      const { id, updates } = action.payload;
      console.log(`⚡ updateItem called for item ${id}:`, updates);
      
      const updatedItems = state.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates };
          if ('quantity' in updates || 'rate' in updates) {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
            console.log(`🧮 Amount recalculated for item ${id}: ${updatedItem.amount}`);
          }
          return updatedItem;
        }
        return item;
      });

      return { ...state, items: updatedItems };
    }

    case 'UPDATE_TAX': {
      const { id, updates } = action.payload;
      console.log(`⚡ updateTax called for tax ${id}:`, updates);
      
      const updatedTaxes = state.taxes.map(tax => 
        tax.id === id ? { ...tax, ...updates } : tax
      );

      return { ...state, taxes: updatedTaxes };
    }

    case 'UPDATE_ITEM_TAX': {
      const { id, updates } = action.payload;
      console.log(`⚡ updateItemTax called for itemTax ${id}:`, updates);
      
      const updatedItemTaxes = state.itemTaxes.map(itemTax => {
        if (itemTax.id === id) {
          const updatedItemTax = { ...itemTax, ...updates };
          
          // Convert string values to numbers for itemId and taxId
          if ('itemId' in updates) {
            updatedItemTax.itemId = typeof updates.itemId === 'string' ? parseInt(updates.itemId) : updates.itemId!;
          }
          if ('taxId' in updates) {
            updatedItemTax.taxId = typeof updates.taxId === 'string' ? parseInt(updates.taxId) : updates.taxId!;
          }
          
          // Recalculate total when itemId or taxId changes
          const item = state.items.find(i => i.id === updatedItemTax.itemId);
          const tax = state.taxes.find(t => t.id === updatedItemTax.taxId);
          
          if (item && tax) {
            updatedItemTax.total = calculateItemTaxTotal(item, tax);
            console.log(`🧮 Total recalculated for itemTax ${id}: ${updatedItemTax.total}`);
          }
          
          return updatedItemTax;
        }
        return itemTax;
      });

      return { ...state, itemTaxes: updatedItemTaxes };
    }

    case 'ADD_ITEM': {
      const newId = Math.max(...state.items.map(i => i.id), 0) + 1;
      console.log(`➕ Adding new item with ID: ${newId}`);
      
      return {
        ...state,
        items: [...state.items, { 
          id: newId, 
          product: '', 
          quantity: 1, 
          rate: 0, 
          amount: 0 
        }]
      };
    }

    case 'ADD_TAX': {
      const newId = Math.max(...state.taxes.map(t => t.id), 0) + 1;
      console.log(`➕ Adding new tax with ID: ${newId}`);
      
      return {
        ...state,
        taxes: [...state.taxes, { 
          id: newId, 
          tax: '', 
          type: 'Percentage', 
          taxOn: 'On Item', 
          charge: 0 
        }]
      };
    }

    case 'ADD_ITEM_TAX': {
      const newId = Math.max(...state.itemTaxes.map(it => it.id), 0) + 1;
      const defaultItemId = state.items[0]?.id || 1;
      const defaultTaxId = state.taxes[0]?.id || 1;
      
      console.log(`➕ Adding new item tax with ID: ${newId}`);
      
      // Calculate initial total
      const item = state.items.find(i => i.id === defaultItemId);
      const tax = state.taxes.find(t => t.id === defaultTaxId);
      let initialTotal = 0;
      
      if (item && tax) {
        initialTotal = calculateItemTaxTotal(item, tax);
      }
      
      return {
        ...state,
        itemTaxes: [...state.itemTaxes, { 
          id: newId, 
          itemId: defaultItemId, 
          taxId: defaultTaxId, 
          total: initialTotal
        }]
      };
    }

    default:
      return state;
  }
};

const SmartDataTableReducer = () => {
  console.log('🏠 SmartDataTableReducer component rendering');

  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Item table configuration
  const itemColumns: TableColumn<Item>[] = [
    { key: 'product', header: 'Product', type: 'text' },
    { key: 'quantity', header: 'Quantity', type: 'number' },
    { key: 'rate', header: 'Rate', type: 'number' },
    { 
      key: 'amount', 
      header: 'Amount', 
      type: 'readonly',
      render: (value) => (value as number).toFixed(2)
    }
  ];

  // Tax table configuration
  const taxColumns: TableColumn<Tax>[] = [
    { key: 'tax', header: 'Tax', type: 'text' },
    { 
      key: 'type', 
      header: 'Type', 
      type: 'select',
      options: [
        { value: 'Percentage', label: 'Percentage' },
        { value: 'Amount', label: 'Amount' }
      ]
    },
    { 
      key: 'taxOn', 
      header: 'Tax on', 
      type: 'select',
      options: [
        { value: 'On Item', label: 'On Item' },
        { value: 'On Order', label: 'On Order' }
      ]
    },
    { key: 'charge', header: 'Charge', type: 'number' }
  ];

  // Item Tax table configuration
  const itemTaxColumns: TableColumn<ItemTax>[] = [
    {
      key: 'itemId',
      header: 'Item',
      type: 'select',
      options: state.items.map(item => ({ 
        value: item.id, 
        label: item.product || `Item ${item.id}` 
      }))
    },
    {
      key: 'taxId',
      header: 'Tax',
      type: 'select',
      options: state.taxes.map(tax => ({ 
        value: tax.id, 
        label: tax.tax || `Tax ${tax.id}` 
      }))
    },
    {
      key: 'total',
      header: 'Total',
      type: 'readonly',
      render: (value) => (value as number).toFixed(2)
    }
  ];

  // Action handlers
  const updateItem = useCallback((id: number, updates: Partial<Item>) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { id, updates } });
  }, []);

  const updateTax = useCallback((id: number, updates: Partial<Tax>) => {
    dispatch({ type: 'UPDATE_TAX', payload: { id, updates } });
  }, []);

  const updateItemTax = useCallback((id: number, updates: Partial<ItemTax>) => {
    dispatch({ type: 'UPDATE_ITEM_TAX', payload: { id, updates } });
  }, []);

  const addItem = useCallback(() => {
    dispatch({ type: 'ADD_ITEM' });
  }, []);

  const addTax = useCallback(() => {
    dispatch({ type: 'ADD_TAX' });
  }, []);

  const addItemTax = useCallback(() => {
    dispatch({ type: 'ADD_ITEM_TAX' });
  }, []);

  // Recalculate item taxes when items or taxes change
  const recalculatedItemTaxes = useMemo(() => {
    console.log('🔄 Recalculating all item taxes due to items or taxes change');
    return state.itemTaxes.map(itemTax => {
      const item = state.items.find(i => i.id === itemTax.itemId);
      const tax = state.taxes.find(t => t.id === itemTax.taxId);
      
      if (item && tax) {
        const newTotal = calculateItemTaxTotal(item, tax);
        if (newTotal !== itemTax.total) {
          console.log(`🔄 ItemTax ${itemTax.id} total updated: ${itemTax.total} → ${newTotal}`);
        }
        return { ...itemTax, total: newTotal };
      }
      return itemTax;
    });
  }, [state.itemTaxes, state.items, state.taxes]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Smart Table with useReducer</h1>
            <p className="text-gray-600">Same functionality using useReducer for better state management</p>
          </div>
        </div>

        <div className="space-y-8">
          <SmartTable
            data={state.items}
            columns={itemColumns}
            title="Item Details"
            onUpdate={updateItem}
            onAdd={addItem}
            idKey="id"
          />
          
          <SmartTable
            data={state.taxes}
            columns={taxColumns}
            title="Tax Details"
            onUpdate={updateTax}
            onAdd={addTax}
            idKey="id"
          />
          
          <SmartTable
            data={recalculatedItemTaxes}
            columns={itemTaxColumns}
            title="Item Tax"
            onUpdate={updateItemTax}
            onAdd={addItemTax}
            idKey="id"
          />
        </div>
      </div>
    </div>
  );
};

export default SmartDataTableReducer;
