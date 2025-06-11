import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className = '', options, rows, ...props }) => {
    let Component;
    let baseClassName = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors";

    switch (type) {
        case 'textarea':
            Component = 'textarea';
            return (
                <textarea
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={rows}
                    className={`${baseClassName} resize-none ${className}`}
                    {...props}
                />
            );
        case 'select':
            Component = 'select';
            return (
                <select
                    value={value}
                    onChange={onChange}
                    className={`${baseClassName} ${className}`}
                    {...props}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        default:
            Component = 'input';
            return (
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`${baseClassName} ${className}`}
                    {...props}
                />
            );
    }
};

export default Input;