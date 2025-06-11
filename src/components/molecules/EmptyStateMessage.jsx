import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const EmptyStateMessage = ({ icon, title, description, buttonText, onButtonClick, className = '' }) => {
    return (
        <div className={`text-center py-16 ${className}`}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-6"
            >
                <ApperIcon name={icon} className="w-16 h-16 text-gray-300 mx-auto" />
            </motion.div>
            <Text as="h3" className="text-lg font-heading font-medium text-gray-900 mb-2">
                {title}
            </Text>
            <Text className="text-gray-500 mb-6">
                {description}
            </Text>
            {onButtonClick && (
                <Button
                    onClick={onButtonClick}
                    className="bg-primary hover:bg-secondary"
                >
                    {buttonText}
                </Button>
            )}
        </div>
    );
};

export default EmptyStateMessage;