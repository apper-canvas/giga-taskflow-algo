import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ onClick, children, className = '', animate = true, ...props }) => {
    const Component = animate ? motion.button : 'button';

    return (
        <Component
            onClick={onClick}
            className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${className}`}
            {...(animate && { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } })}
            {...props}
        >
            {children}
        </Component>
    );
};

export default Button;