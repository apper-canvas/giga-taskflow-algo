import React from 'react';
import Text from '@/components/atoms/Text';

const FilterButtonGroup = ({ filters, currentFilter, onFilterChange, className = '' }) => {
    return (
        <div className={`flex bg-gray-100 rounded-lg p-1 ${className}`}>
            {filters.map(item => (
                <button
                    key={item.key}
                    onClick={() => onFilterChange(item.key)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                        currentFilter === item.key
                            ? 'bg-white text-primary shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
};

export default FilterButtonGroup;