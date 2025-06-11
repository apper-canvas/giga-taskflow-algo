import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import PriorityBadge from '@/components/molecules/PriorityBadge';
import CategoryBadge from '@/components/molecules/CategoryBadge';
import DueDateBadge from '@/components/molecules/DueDateBadge';
import Text from '@/components/atoms/Text';

const TaskCard = ({ task, category, onToggleComplete, onEdit, onDelete, index }) => {
    const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${
                task.completed
                    ? 'border-l-success opacity-75'
                    : isOverdue
                        ? 'border-l-error'
                        : 'border-l-primary'
            }`}
        >
            <div className="flex items-start gap-3">
                {/* Checkbox */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onToggleComplete(task.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        task.completed
                            ? 'bg-primary border-primary'
                            : 'border-gray-300 hover:border-primary'
                    }`}
                >
                    {task.completed && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                            <ApperIcon name="Check" size={12} className="text-white" />
                        </motion.div>
                    )}
                </motion.button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <Text as="h4" className={`font-medium break-words ${
                                task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}>
                                {task.title}
                            </Text>

                            {task.description && (
                                <Text className={`text-sm mt-1 break-words ${
                                    task.completed ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {task.description}
                                </Text>
                            )}

                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                <PriorityBadge priority={task.priority} />
                                <CategoryBadge category={category} />
                                <DueDateBadge dueDate={task.dueDate} completed={task.completed} />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onEdit(task)}
                                className="p-1 text-gray-400 hover:text-primary transition-colors"
                            >
                                <ApperIcon name="Edit2" size={16} />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onDelete(task)}
                                className="p-1 text-gray-400 hover:text-error transition-colors"
                            >
                                <ApperIcon name="Trash2" size={16} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TaskCard;