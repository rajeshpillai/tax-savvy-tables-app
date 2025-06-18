
import { useState, useCallback, useMemo } from 'react';
import ItemDetailsTable from '../components/ItemDetailsTable';
import TaxDetailsTable from '../components/TaxDetailsTable';
import ItemTaxTable from '../components/ItemTaxTable';
import { Item, Tax, ItemTax } from '../types/tables';

const Index = () => {
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

  const updateItem = useCallback((id: number, updates: Partial<Item>) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, ...updates };
        // Auto-calculate amount when quantity or rate changes
        if ('quantity' in updates || 'rate' in updates) {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    }));
  }, []);

  const updateTax = useCallback((id: number, updates: Partial<Tax>) => {
    setTaxes(prev => prev.map(tax => 
      tax.id === id ? { ...tax, ...updates } : tax
    ));
  }, []);

  const updateItemTax = useCallback((id: number, itemId: number, taxId: number) => {
    const item = items.find(i => i.id === itemId);
    const tax = taxes.find(t => t.id === taxId);
    
    if (item && tax) {
      let total = 0;
      if (tax.type === 'Percentage') {
        total = (item.amount * tax.charge) / 100;
      } else {
        total = tax.charge;
      }
      
      setItemTaxes(prev => prev.map(itemTax =>
        itemTax.id === id 
          ? { ...itemTax, itemId, taxId, total: parseFloat(total.toFixed(2)) }
          : itemTax
      ));
    }
  }, [items, taxes]);

  const addItem = useCallback(() => {
    const newId = Math.max(...items.map(i => i.id), 0) + 1;
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
    setItemTaxes(prev => [...prev, { 
      id: newId, 
      itemId: items[0]?.id || 1, 
      taxId: taxes[0]?.id || 1, 
      total: 0 
    }]);
  }, [itemTaxes, items, taxes]);

  // Recalculate item taxes when items or taxes change
  const recalculatedItemTaxes = useMemo(() => {
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
        return { ...itemTax, total: parseFloat(total.toFixed(2)) };
      }
      return itemTax;
    });
  }, [itemTaxes, items, taxes]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tax Management System</h1>
          <p className="text-gray-600">Manage items, taxes, and calculations efficiently</p>
        </div>

        <div className="space-y-8">
          <ItemDetailsTable 
            items={items} 
            onUpdateItem={updateItem} 
            onAddItem={addItem}
          />
          
          <TaxDetailsTable 
            taxes={taxes} 
            onUpdateTax={updateTax} 
            onAddTax={addTax}
          />
          
          <ItemTaxTable 
            itemTaxes={recalculatedItemTaxes}
            items={items}
            taxes={taxes}
            onUpdateItemTax={updateItemTax}
            onAddItemTax={addItemTax}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
