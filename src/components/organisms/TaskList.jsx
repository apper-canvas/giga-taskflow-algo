import React from 'react';
import { AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/molecules/TaskCard';
import EmptyStateMessage from '@/components/molecules/EmptyStateMessage';

const TaskList = ({
    tasks,
    categories,
    onToggleComplete,
    onEditTask,
    onDeleteTask,
    emptyStateProps
}) => {
    const getCategoryById = (id) => {
        return categories.find(cat => cat.id === id);
    };

    if (tasks.length === 0) {
        return <EmptyStateMessage {...emptyStateProps} />;
    }

    return (
        <div className="space-y-3">
            <AnimatePresence>
                {tasks.map((task, index) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        category={getCategoryById(task.categoryId)}
                        onToggleComplete={onToggleComplete}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                        index={index}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default TaskList;