import React from 'react';
import Input from '@/components/atoms/Input';

const CategorySelect = ({ categories, currentFilter, onFilterChange, className = '' }) => {
    const options = [{ value: 'all', label: 'All Categories' }, ...categories.map(c => ({ value: c.id, label: c.name }))];

    return (
        <Input
            type="select"
            value={currentFilter}
            onChange={onFilterChange}
            options={options}
            className={`px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        />
    );
};

export default CategorySelect;