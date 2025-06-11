import React from 'react';
import Text from '@/components/atoms/Text';

const CategoryBadge = ({ category }) => {
    if (!category) return null;
    return (
        <Text
            as="span"
            className="px-2 py-1 text-xs font-medium rounded-full text-gray-700"
            style={{
                backgroundColor: `${category.color}20`,
                color: category.color
            }}
        >
            {category.name}
        </Text>
    );
};

export default CategoryBadge;