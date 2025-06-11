import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Text from '@/components/atoms/Text';

const TaskFormModal = ({ isOpen, onClose, task, categories, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        categoryId: ''
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
                priority: task.priority || 'medium',
                categoryId: task.categoryId || ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                dueDate: '',
                priority: 'medium',
                categoryId: categories.length > 0 ? categories[0].id : ''
            });
        }
    }, [task, isOpen, categories]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            return;
        }

        const taskData = {
            ...formData,
            dueDate: formData.dueDate || null,
            categoryId: formData.categoryId || (categories.length > 0 ? categories[0].id : '')
        };

        if (task) {
            onSave(task.id, taskData);
        } else {
            onSave(taskData);
        }
        onClose(); // Close after save
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (!isOpen) return null;

    const priorityOptions = [
        { value: 'low', label: 'Low', color: 'bg-success' },
        { value: 'medium', label: 'Medium', color: 'bg-warning' },
        { value: 'high', label: 'High', color: 'bg-error' }
    ];

    const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <form onSubmit={handleSubmit}>
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <Text as="h2" className="text-lg font-heading font-semibold text-gray-900">
                                {task ? 'Edit Task' : 'Create New Task'}
                            </Text>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <ApperIcon name="X" size={20} />
                            </motion.button>
                        </div>

                        {/* Form Fields */}
                        <div className="p-6 space-y-4">
                            <FormField
                                label="Task Title"
                                id="title"
                                value={formData.title}
                                onChange={(val) => handleChange('title', val)}
                                placeholder="Enter task title..."
                                required
                                autoFocus
                            />

                            <FormField
                                label="Description"
                                id="description"
                                type="textarea"
                                value={formData.description}
                                onChange={(val) => handleChange('description', val)}
                                placeholder="Add task description..."
                                rows={3}
                            />

                            <FormField
                                label="Due Date"
                                id="dueDate"
                                type="date"
                                value={formData.dueDate}
                                onChange={(val) => handleChange('dueDate', val)}
                            />

                            <div>
                                <Text as="label" htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority
                                </Text>
                                <div className="flex gap-2">
                                    {priorityOptions.map(priority => (
                                        <motion.button
                                            key={priority.value}
                                            type="button"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleChange('priority', priority.value)}
                                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                                formData.priority === priority.value
                                                    ? `${priority.color} text-white`
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {priority.label}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {categories.length > 0 && (
                                <FormField
                                    label="Category"
                                    id="categoryId"
                                    type="select"
                                    value={formData.categoryId}
                                    onChange={(val) => handleChange('categoryId', val)}
                                    options={categoryOptions}
                                />
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 p-6 border-t border-gray-200">
                            <Button
                                type="button"
                                onClick={onClose}
                                className="flex-1 text-gray-600 hover:text-gray-800 bg-transparent hover:bg-transparent" // Override default button styles
                                animate={false} // Disable motion for cancel button
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!formData.title.trim()}
                                className="flex-1 bg-primary hover:bg-secondary disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {task ? 'Update Task' : 'Create Task'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TaskFormModal;