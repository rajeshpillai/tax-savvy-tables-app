
import React, { memo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Item, Tax, ItemTax } from '../types/tables';

interface ItemTaxTableProps {
  itemTaxes: ItemTax[];
  items: Item[];
  taxes: Tax[];
  onUpdateItemTax: (id: number, itemId: number, taxId: number) => void;
  onAddItemTax: () => void;
}

const ItemTaxRow = memo(({ 
  itemTax, 
  items, 
  taxes, 
  onUpdate 
}: { 
  itemTax: ItemTax; 
  items: Item[]; 
  taxes: Tax[]; 
  onUpdate: (id: number, itemId: number, taxId: number) => void;
}) => {
  console.log(`🔗 ItemTaxRow ${itemTax.id} rendering - ItemID: ${itemTax.itemId}, TaxID: ${itemTax.taxId}, Total: ${itemTax.total}`);

  const handleItemChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const itemId = parseInt(e.target.value);
    console.log(`📦 Item selection change for itemTax ${itemTax.id}: ${itemId}`);
    onUpdate(itemTax.id, itemId, itemTax.taxId);
  }, [itemTax.id, itemTax.taxId, onUpdate]);

  const handleTaxChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const taxId = parseInt(e.target.value);
    console.log(`🏷️ Tax selection change for itemTax ${itemTax.id}: ${taxId}`);
    onUpdate(itemTax.id, itemTax.itemId, taxId);
  }, [itemTax.id, itemTax.itemId, onUpdate]);

  const selectedItem = items.find(item => item.id === itemTax.itemId);
  const selectedTax = taxes.find(tax => tax.id === itemTax.taxId);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <select
          value={itemTax.itemId}
          onChange={handleItemChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.product || `Item ${item.id}`}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        <select
          value={itemTax.taxId}
          onChange={handleTaxChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          {taxes.map((tax) => (
            <option key={tax.id} value={tax.id}>
              {tax.tax || `Tax ${tax.id}`}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700 font-medium">
          {itemTax.total.toFixed(2)}
        </div>
      </td>
    </tr>
  );
});

ItemTaxRow.displayName = 'ItemTaxRow';

const ItemTaxTable = memo(({ 
  itemTaxes, 
  items, 
  taxes, 
  onUpdateItemTax, 
  onAddItemTax 
}: ItemTaxTableProps) => {
  console.log('🔗 ItemTaxTable rendering with', itemTaxes.length, 'item taxes');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Item Tax</h2>
        <button
          onClick={onAddItemTax}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus size={16} />
          Add Row
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Item
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Tax
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {itemTaxes.map((itemTax) => (
              <ItemTaxRow 
                key={itemTax.id} 
                itemTax={itemTax} 
                items={items}
                taxes={taxes}
                onUpdate={onUpdateItemTax} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

ItemTaxTable.displayName = 'ItemTaxTable';

export default ItemTaxTable;
