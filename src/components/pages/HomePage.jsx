import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import taskService from '@/services/api/taskService';
import categoryService from '@/services/api/categoryService';
import PageHeader from '@/components/organisms/PageHeader';
import CategorySidebar from '@/components/organisms/CategorySidebar';
import TaskList from '@/components/organisms/TaskList';
import TaskFormModal from '@/components/organisms/TaskFormModal';
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal';
import LoadingSpinner from '@/components/molecules/LoadingSpinner';
import ErrorMessage from '@/components/molecules/ErrorMessage';

export default function HomePage() {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, active, completed
    const [priorityFilter, setPriorityFilter] = useState('all'); // all, high, medium, low
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [tasksData, categoriesData] = await Promise.all([
                taskService.getAll(),
                categoryService.getAll()
            ]);
            setTasks(tasksData);
            setCategories(categoriesData);
        } catch (err) {
            setError(err.message || 'Failed to load data');
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredTasks = tasks.filter(task => {
        if (filter === 'active' && task.completed) return false;
        if (filter === 'completed' && !task.completed) return false;
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
        if (categoryFilter !== 'all' && task.categoryId !== categoryFilter) return false;
        return true;
    });

    const handleToggleComplete = async (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        try {
            const updatedTask = await taskService.update(taskId, {
                completed: !task.completed,
                completedAt: !task.completed ? new Date().toISOString() : null
            });

            setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));

            if (updatedTask.completed) {
                toast.success('Task completed! 🎉');
            } else {
                toast.info('Task marked as active');
            }
        } catch (err) {
            toast.error('Failed to update task');
        }
    };

    const handleCreateTask = async (taskData) => {
        try {
            const newTask = await taskService.create(taskData);
            setTasks(prev => [newTask, ...prev]);
            setShowTaskForm(false);
            toast.success('Task created successfully');
        } catch (err) {
            toast.error('Failed to create task');
        }
    };

    const handleUpdateTask = async (taskId, taskData) => {
        try {
            const updatedTask = await taskService.update(taskId, taskData);
            setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
            setEditingTask(null);
            toast.success('Task updated successfully');
        } catch (err) {
            toast.error('Failed to update task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await taskService.delete(taskId);
            setTasks(prev => prev.filter(t => t.id !== taskId));
            setDeleteConfirm(null);
            toast.success('Task deleted');
        } catch (err) {
            toast.error('Failed to delete task');
        }
    };

    const emptyStateMessageProps = {
        icon: "CheckSquare",
        title: tasks.length === 0 ? "No tasks yet" : "No tasks match your filters",
        description: tasks.length === 0
            ? "Create your first task to get started with TaskFlow"
            : "Try adjusting your filters or create a new task",
        buttonText: "Create Your First Task",
        onButtonClick: () => setShowTaskForm(true),
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={loadData} />;
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <PageHeader
                totalTasks={tasks.length}
                activeTasksCount={tasks.filter(t => !t.completed).length}
                onAddTask={() => setShowTaskForm(true)}
                filter={filter}
                onFilterChange={setFilter}
                priorityFilter={priorityFilter}
                onPriorityFilterChange={setPriorityFilter}
                categories={categories}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
            />

            <div className="flex-1 overflow-hidden">
                <div className="h-full flex">
                    <CategorySidebar
                        categories={categories}
                        tasks={tasks}
                        categoryFilter={categoryFilter}
                        onCategoryFilterChange={setCategoryFilter}
                    />

                    <main className="flex-1 overflow-y-auto p-6">
                        <TaskList
                            tasks={filteredTasks}
                            categories={categories}
                            onToggleComplete={handleToggleComplete}
                            onEditTask={setEditingTask}
                            onDeleteTask={setDeleteConfirm}
                            emptyStateProps={emptyStateMessageProps}
                        />
                    </main>
                </div>
            </div>

            <TaskFormModal
                isOpen={showTaskForm || !!editingTask}
                onClose={() => {
                    setShowTaskForm(false);
                    setEditingTask(null);
                }}
                task={editingTask}
                categories={categories}
                onSave={editingTask ? handleUpdateTask : handleCreateTask}
            />

            <DeleteConfirmationModal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                itemTitle={deleteConfirm?.title || ''}
                onConfirm={() => handleDeleteTask(deleteConfirm.id)}
            />
        </div>
    );
}