import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="p-6">
            <div className="text-center py-12">
                <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
                <Text as="h3" className="text-lg font-medium text-gray-900 mb-2">Something went wrong</Text>
                <Text className="text-gray-500 mb-4">{message}</Text>
                <Button
                    onClick={onRetry}
                    className="bg-primary hover:bg-secondary"
                >
                    Try Again
                </Button>
            </div>
        </div>
    );
};

export default ErrorMessage;