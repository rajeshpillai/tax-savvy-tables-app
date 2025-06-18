
import React, { memo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Item } from '../types/tables';

interface ItemDetailsTableProps {
  items: Item[];
  onUpdateItem: (id: number, updates: Partial<Item>) => void;
  onAddItem: () => void;
}

const ItemRow = memo(({ item, onUpdate }: { item: Item; onUpdate: (id: number, updates: Partial<Item>) => void }) => {
  const handleProductChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(item.id, { product: e.target.value });
  }, [item.id, onUpdate]);

  const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value) || 0;
    onUpdate(item.id, { quantity });
  }, [item.id, onUpdate]);

  const handleRateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value) || 0;
    onUpdate(item.id, { rate });
  }, [item.id, onUpdate]);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <input
          type="text"
          value={item.product}
          onChange={handleProductChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter product name"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          value={item.quantity}
          onChange={handleQuantityChange}
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          value={item.rate}
          onChange={handleRateChange}
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </td>
      <td className="px-4 py-3">
        <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700 font-medium">
          {item.amount.toFixed(2)}
        </div>
      </td>
    </tr>
  );
});

ItemRow.displayName = 'ItemRow';

const ItemDetailsTable = memo(({ items, onUpdateItem, onAddItem }: ItemDetailsTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Item Details</h2>
        <button
          onClick={onAddItem}
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
                Product
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Rate
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <ItemRow key={item.id} item={item} onUpdate={onUpdateItem} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

ItemDetailsTable.displayName = 'ItemDetailsTable';

export default ItemDetailsTable;
