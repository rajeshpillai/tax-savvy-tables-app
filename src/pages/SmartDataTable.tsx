
import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SmartTable, { TableColumn } from '../components/SmartTable';
import { Item, Tax, ItemTax } from '../types/tables';

const SmartDataTable = () => {
  console.log('🏠 SmartDataTable component rendering');

  const [items, setItems] = useState<Item[]>([
    { id: 1, product: 'Pen', quantity: 2, rate: 10, amount: 20 },
    { id: 2, product: 'Book', quantity: 1, rate: 100, amount: 100 }
  ]);

  const [taxes, setTaxes] = useState<Tax[]>([
    { id: 1, tax: 'GST', type: 'Percentage', taxOn: 'On Item', charge: 18 },
    { id: 2, tax: 'CESS', type: 'Amount', taxOn: 'On Order', charge: 5 }
  ]);

  const [itemTaxes, setItemTaxes] = useState<ItemTax[]>([
    { id: 1, itemId: 1, taxId: 1, total: 3.60 },
    { id: 2, itemId: 2, taxId: 2, total: 5.00 }
  ]);

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
  const itemTaxColumns: TableColumn<ItemTax & { itemName?: string; taxName?: string }>[] = [
    {
      key: 'itemId',
      header: 'Item',
      type: 'select',
      options: items.map(item => ({ 
        value: item.id, 
        label: item.product || `Item ${item.id}` 
      }))
    },
    {
      key: 'taxId',
      header: 'Tax',
      type: 'select',
      options: taxes.map(tax => ({ 
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

  const updateItem = useCallback((id: number, updates: Partial<Item>) => {
    console.log(`⚡ updateItem called for item ${id}:`, updates);
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, ...updates };
        if ('quantity' in updates || 'rate' in updates) {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          console.log(`🧮 Amount recalculated for item ${id}: ${updatedItem.amount}`);
        }
        return updatedItem;
      }
      return item;
    }));
  }, []);

  const updateTax = useCallback((id: number, updates: Partial<Tax>) => {
    console.log(`⚡ updateTax called for tax ${id}:`, updates);
    setTaxes(prev => prev.map(tax => 
      tax.id === id ? { ...tax, ...updates } : tax
    ));
  }, []);

  const updateItemTax = useCallback((id: number, updates: Partial<ItemTax>) => {
    console.log(`⚡ updateItemTax called for itemTax ${id}:`, updates);
    
    setItemTaxes(prev => prev.map(itemTax => {
      if (itemTax.id === id) {
        const updatedItemTax = { ...itemTax, ...updates };
        
        // Recalculate total if itemId or taxId changed
        if ('itemId' in updates || 'taxId' in updates) {
          const item = items.find(i => i.id === updatedItemTax.itemId);
          const tax = taxes.find(t => t.id === updatedItemTax.taxId);
          
          if (item && tax) {
            let total = 0;
            if (tax.type === 'Percentage') {
              total = (item.amount * tax.charge) / 100;
            } else {
              total = tax.charge;
            }
            updatedItemTax.total = parseFloat(total.toFixed(2));
            console.log(`🧮 Total recalculated for itemTax ${id}: ${updatedItemTax.total}`);
          }
        }
        
        return updatedItemTax;
      }
      return itemTax;
    }));
  }, [items, taxes]);

  const addItem = useCallback(() => {
    const newId = Math.max(...items.map(i => i.id), 0) + 1;
    console.log(`➕ Adding new item with ID: ${newId}`);
    setItems(prev => [...prev, { 
      id: newId, 
      product: '', 
      quantity: 1, 
      rate: 0, 
      amount: 0 
    }]);
  }, [items]);

  const addTax = useCallback(() => {
    const newId = Math.max(...taxes.map(t => t.id), 0) + 1;
    console.log(`➕ Adding new tax with ID: ${newId}`);
    setTaxes(prev => [...prev, { 
      id: newId, 
      tax: '', 
      type: 'Percentage', 
      taxOn: 'On Item', 
      charge: 0 
    }]);
  }, [taxes]);

  const addItemTax = useCallback(() => {
    const newId = Math.max(...itemTaxes.map(it => it.id), 0) + 1;
    console.log(`➕ Adding new item tax with ID: ${newId}`);
    setItemTaxes(prev => [...prev, { 
      id: newId, 
      itemId: items[0]?.id || 1, 
      taxId: taxes[0]?.id || 1, 
      total: 0 
    }]);
  }, [itemTaxes, items, taxes]);

  // Recalculate item taxes when items or taxes change
  const recalculatedItemTaxes = useMemo(() => {
    console.log('🔄 Recalculating all item taxes due to items or taxes change');
    return itemTaxes.map(itemTax => {
      const item = items.find(i => i.id === itemTax.itemId);
      const tax = taxes.find(t => t.id === itemTax.taxId);
      
      if (item && tax) {
        let total = 0;
        if (tax.type === 'Percentage') {
          total = (item.amount * tax.charge) / 100;
        } else {
          total = tax.charge;
        }
        const newTotal = parseFloat(total.toFixed(2));
        if (newTotal !== itemTax.total) {
          console.log(`🔄 ItemTax ${itemTax.id} total updated: ${itemTax.total} → ${newTotal}`);
        }
        return { ...itemTax, total: newTotal };
      }
      return itemTax;
    });
  }, [itemTaxes, items, taxes]);

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
            <h1 className="text-3xl font-bold text-gray-900">Smart Reusable Table Demo</h1>
            <p className="text-gray-600">Powered by the new SmartTable component</p>
          </div>
        </div>

        <div className="space-y-8">
          <SmartTable
            data={items}
            columns={itemColumns}
            title="Item Details"
            onUpdate={updateItem}
            onAdd={addItem}
            idKey="id"
          />
          
          <SmartTable
            data={taxes}
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

export default SmartDataTable;
