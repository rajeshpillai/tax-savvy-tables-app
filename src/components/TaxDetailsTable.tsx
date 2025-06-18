
import React, { memo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Tax } from '../types/tables';

interface TaxDetailsTableProps {
  taxes: Tax[];
  onUpdateTax: (id: number, updates: Partial<Tax>) => void;
  onAddTax: () => void;
}

const TaxRow = memo(({ tax, onUpdate }: { tax: Tax; onUpdate: (id: number, updates: Partial<Tax>) => void }) => {
  const handleTaxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(tax.id, { tax: e.target.value });
  }, [tax.id, onUpdate]);

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(tax.id, { type: e.target.value as 'Percentage' | 'Amount' });
  }, [tax.id, onUpdate]);

  const handleTaxOnChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(tax.id, { taxOn: e.target.value as 'On Item' | 'On Order' });
  }, [tax.id, onUpdate]);

  const handleChargeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const charge = parseFloat(e.target.value) || 0;
    onUpdate(tax.id, { charge });
  }, [tax.id, onUpdate]);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <input
          type="text"
          value={tax.tax}
          onChange={handleTaxChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter tax name"
        />
      </td>
      <td className="px-4 py-3">
        <select
          value={tax.type}
          onChange={handleTypeChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="Percentage">Percentage</option>
          <option value="Amount">Amount</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <select
          value={tax.taxOn}
          onChange={handleTaxOnChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="On Item">On Item</option>
          <option value="On Order">On Order</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          value={tax.charge}
          onChange={handleChargeChange}
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </td>
    </tr>
  );
});

TaxRow.displayName = 'TaxRow';

const TaxDetailsTable = memo(({ taxes, onUpdateTax, onAddTax }: TaxDetailsTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Tax Details</h2>
        <button
          onClick={onAddTax}
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
                Tax
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Tax on
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Charge
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {taxes.map((tax) => (
              <TaxRow key={tax.id} tax={tax} onUpdate={onUpdateTax} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

TaxDetailsTable.displayName = 'TaxDetailsTable';

export default TaxDetailsTable;
