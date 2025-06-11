import React from 'react';
import Text from '@/components/atoms/Text';

const getPriorityColorClass = (priority) => {
    switch (priority) {
        case 'high': return 'bg-error text-white';
        case 'medium': return 'bg-warning text-white';
        case 'low': return 'bg-success text-white';
        default: return 'bg-gray-200 text-gray-800';
    }
};

const PriorityBadge = ({ priority }) => {
    if (!priority) return null;
    return (
        <Text as="span" className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColorClass(priority)}`}>
            {priority}
        </Text>
    );
};

export default PriorityBadge;