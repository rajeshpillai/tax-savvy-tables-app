
import React, { memo, useCallback } from 'react';
import { Plus } from 'lucide-react';

const SmartTableRowComponent = ({
  item,
  columns,
  onUpdate,
  idKey
}) => {
  console.log(`🔄 SmartTableRow ${item[idKey]} rendering`);

  const handleInputChange = useCallback((columnKey, value) => {
    console.log(`📝 ${String(columnKey)} change for item ${item[idKey]}: ${value}`);
    onUpdate(item[idKey], { [columnKey]: value });
  }, [item, onUpdate, idKey]);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {columns.map((column) => (
        <td key={String(column.key)} className="px-4 py-3">
          {column.type === 'readonly' ? (
            <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700 font-medium">
              {column.render ? column.render(item[column.key], item) : String(item[column.key])}
            </div>
          ) : column.type === 'select' ? (
            <select
              value={item[column.key]}
              onChange={(e) => handleInputChange(column.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {column.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={column.type}
              value={item[column.key]}
              onChange={(e) => {
                const value = column.type === 'number' 
                  ? (parseFloat(e.target.value) || 0)
                  : e.target.value;
                handleInputChange(column.key, value);
              }}
              min={column.type === 'number' ? "0" : undefined}
              step={column.type === 'number' ? "0.01" : undefined}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Enter ${column.header.toLowerCase()}`}
            />
          )}
        </td>
      ))}
    </tr>
  );
};

// Memo with custom comparison function
const SmartTableRow = memo(SmartTableRowComponent, (prevProps, nextProps) => {
  // Custom comparison function for better memoization
  const prevItem = prevProps.item;
  const nextItem = nextProps.item;
  
  // Check if the item data has changed
  for (const column of prevProps.columns) {
    if (prevItem[column.key] !== nextItem[column.key]) {
      return false; // Re-render if any column value changed
    }
  }
  
  // Check if columns themselves changed (important for select options)
  if (prevProps.columns.length !== nextProps.columns.length) {
    return false;
  }
  
  // Check if column options changed (for select fields)
  for (let i = 0; i < prevProps.columns.length; i++) {
    const prevCol = prevProps.columns[i];
    const nextCol = nextProps.columns[i];
    
    if (prevCol.key !== nextCol.key || 
        prevCol.type !== nextCol.type ||
        JSON.stringify(prevCol.options) !== JSON.stringify(nextCol.options)) {
      return false;
    }
  }
  
  return true; // Don't re-render if nothing changed
});

SmartTableRow.displayName = 'SmartTableRow';

function SmartTable({
  data,
  columns,
  title,
  onUpdate,
  onAdd,
  idKey
}) {
  console.log(`🏢 SmartTable "${title}" rendering with ${data.length} items`);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <button
          onClick={onAdd}
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
              {columns.map((column) => (
                <th 
                  key={String(column.key)} 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <SmartTableRow
                key={String(item[idKey])}
                item={item}
                columns={columns}
                onUpdate={onUpdate}
                idKey={idKey}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SmartTable;
