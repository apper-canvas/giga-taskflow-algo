import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import FilterButtonGroup from '@/components/molecules/FilterButtonGroup';
import CategorySelect from '@/components/molecules/CategorySelect';

const statusFilters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' }
];

const priorityFilters = [
    { key: 'all', label: 'All Priority' },
    { key: 'high', label: 'High' },
    { key: 'medium', label: 'Medium' },
    { key: 'low', label: 'Low' }
];

const PageHeader = ({
    totalTasks,
    activeTasksCount,
    onAddTask,
    filter,
    onFilterChange,
    priorityFilter,
    onPriorityFilterChange,
    categories,
    categoryFilter,
    onCategoryFilterChange
}) => {
    return (
        <header className="flex-shrink-0 bg-white border-b border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Text as="h1" className="text-2xl font-heading font-bold text-gray-900">
                        TaskFlow
                    </Text>
                    <Text className="text-gray-500">
                        {activeTasksCount} active tasks
                    </Text>
                </div>

                <Button
                    onClick={onAddTask}
                    className="bg-primary hover:bg-secondary flex items-center gap-2"
                >
                    <ApperIcon name="Plus" size={20} />
                    Add Task
                </Button>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-wrap gap-4">
                <FilterButtonGroup
                    filters={statusFilters}
                    currentFilter={filter}
                    onFilterChange={onFilterChange}
                />
                <FilterButtonGroup
                    filters={priorityFilters}
                    currentFilter={priorityFilter}
                    onFilterChange={onPriorityFilterChange}
                />
                {categories.length > 0 && (
                    <CategorySelect
                        categories={categories}
                        currentFilter={categoryFilter}
                        onFilterChange={(value) => onCategoryFilterChange(value)}
                    />
                )}
            </div>
        </header>
    );
};

export default PageHeader;