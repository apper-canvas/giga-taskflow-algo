import React from 'react';
import Text from '@/components/atoms/Text';

const CategorySidebar = ({ categories, tasks, categoryFilter, onCategoryFilterChange }) => {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
                <Text as="h3" className="font-heading font-semibold text-gray-900 mb-3">Categories</Text>

                <div className="space-y-1">
                    <button
                        onClick={() => onCategoryFilterChange('all')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            categoryFilter === 'all'
                                ? 'bg-primary text-white'
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span>All Tasks</span>
                            <span className="text-xs">{tasks.length}</span>
                        </div>
                    </button>

                    {categories.map(category => {
                        const categoryTasks = tasks.filter(t => t.categoryId === category.id);
                        return (
                            <button
                                key={category.id}
                                onClick={() => onCategoryFilterChange(category.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    categoryFilter === category.id
                                        ? 'bg-primary text-white'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: category.color }}
                                        />
                                        <span>{category.name}</span>
                                    </div>
                                    <span className="text-xs">{categoryTasks.length}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};

export default CategorySidebar;