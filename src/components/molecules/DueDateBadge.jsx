import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import { format, isToday, isPast } from 'date-fns';

const DueDateBadge = ({ dueDate, completed }) => {
    if (!dueDate) return null;

    const date = new Date(dueDate);
    const isOverdue = isPast(date) && !completed;
    const isDueToday = isToday(date);

    const className = `text-xs flex items-center gap-1 ${
        isOverdue ? 'text-error' :
        isDueToday ? 'text-warning' :
        'text-gray-500'
    }`;

    return (
        <Text as="span" className={className}>
            <ApperIcon name="Calendar" size={12} />
            {format(date, 'MMM d')}
        </Text>
    );
};

export default DueDateBadge;