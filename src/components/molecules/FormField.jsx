import React from 'react';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';

const FormField = ({ label, id, type, value, onChange, placeholder, options, rows, required, autoFocus, className = '' }) => {
    return (
        <div className={className}>
            <Text as="label" htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && '*'}
            </Text>
            <Input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                options={options}
                rows={rows}
                required={required}
                autoFocus={autoFocus}
            />
        </div>
    );
};

export default FormField;