import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isPast } from 'date-fns'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import taskService from '../services/api/taskService'
import categoryService from '../services/api/categoryService'

export default function Home() {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // all, active, completed
  const [priorityFilter, setPriorityFilter] = useState('all') // all, high, medium, low
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      setTasks(tasksData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  // Filter tasks based on active filters
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active' && task.completed) return false
    if (filter === 'completed' && !task.completed) return false
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false
    if (categoryFilter !== 'all' && task.categoryId !== categoryFilter) return false
    return true
  })

  // Get category by ID
  const getCategoryById = (id) => {
    return categories.find(cat => cat.id === id)
  }

  // Handle task completion toggle
  const handleToggleComplete = async (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    try {
      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      })
      
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t))
      
      if (updatedTask.completed) {
        toast.success('Task completed! 🎉')
      } else {
        toast.info('Task marked as active')
      }
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  // Handle task creation
  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData)
      setTasks(prev => [newTask, ...prev])
      setShowTaskForm(false)
      toast.success('Task created successfully')
    } catch (err) {
      toast.error('Failed to create task')
    }
  }

  // Handle task update
  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const updatedTask = await taskService.update(taskId, taskData)
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t))
      setEditingTask(null)
      toast.success('Task updated successfully')
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(t => t.id !== taskId))
      setDeleteConfirm(null)
      toast.success('Task deleted')
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error text-white'
      case 'medium': return 'bg-warning text-white'
      case 'low': return 'bg-success text-white'
      default: return 'bg-gray-200 text-gray-800'
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">
              TaskFlow
            </h1>
            <p className="text-gray-500">
              {tasks.filter(t => !t.completed).length} active tasks
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTaskForm(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={20} />
            Add Task
          </motion.button>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-4">
          {/* Status Filter */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'active', label: 'Active' },
              { key: 'completed', label: 'Completed' }
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  filter === item.key
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Priority Filter */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'All Priority' },
              { key: 'high', label: 'High' },
              { key: 'medium', label: 'Medium' },
              { key: 'low', label: 'Low' }
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setPriorityFilter(item.key)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  priorityFilter === item.key
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Category Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-heading font-semibold text-gray-900 mb-3">Categories</h3>
              
              <div className="space-y-1">
                <button
                  onClick={() => setCategoryFilter('all')}
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
                  const categoryTasks = tasks.filter(t => t.categoryId === category.id)
                  return (
                    <button
                      key={category.id}
                      onClick={() => setCategoryFilter(category.id)}
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
                  )
                })}
              </div>
            </div>
          </aside>

          {/* Task List */}
          <main className="flex-1 overflow-y-auto p-6">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-16">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-6"
                >
                  <ApperIcon name="CheckSquare" className="w-16 h-16 text-gray-300 mx-auto" />
                </motion.div>
                <h3 className="text-lg font-heading font-medium text-gray-900 mb-2">
                  {tasks.length === 0 ? "No tasks yet" : "No tasks match your filters"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {tasks.length === 0 
                    ? "Create your first task to get started with TaskFlow"
                    : "Try adjusting your filters or create a new task"
                  }
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTaskForm(true)}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors"
                >
                  Create Your First Task
                </motion.button>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredTasks.map((task, index) => {
                    const category = getCategoryById(task.categoryId)
                    const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !task.completed
                    
                    return (
                      <motion.div
                        key={task.id}
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
                            onClick={() => handleToggleComplete(task.id)}
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
                                <h4 className={`font-medium break-words ${
                                  task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                                }`}>
                                  {task.title}
                                </h4>
                                
                                {task.description && (
                                  <p className={`text-sm mt-1 break-words ${
                                    task.completed ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    {task.description}
                                  </p>
                                )}

                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  {/* Priority Badge */}
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                  </span>

                                  {/* Category Badge */}
                                  {category && (
                                    <span 
                                      className="px-2 py-1 text-xs font-medium rounded-full text-gray-700"
                                      style={{ 
                                        backgroundColor: `${category.color}20`,
                                        color: category.color 
                                      }}
                                    >
                                      {category.name}
                                    </span>
                                  )}

                                  {/* Due Date */}
                                  {task.dueDate && (
                                    <span className={`text-xs flex items-center gap-1 ${
                                      isOverdue ? 'text-error' : 
                                      isToday(new Date(task.dueDate)) ? 'text-warning' : 
                                      'text-gray-500'
                                    }`}>
                                      <ApperIcon name="Calendar" size={12} />
                                      {format(new Date(task.dueDate), 'MMM d')}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setEditingTask(task)}
                                  className="p-1 text-gray-400 hover:text-primary transition-colors"
                                >
                                  <ApperIcon name="Edit2" size={16} />
                                </motion.button>
                                
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setDeleteConfirm(task)}
                                  className="p-1 text-gray-400 hover:text-error transition-colors"
                                >
                                  <ApperIcon name="Trash2" size={16} />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Task Form Modal */}
      <MainFeature
        isOpen={showTaskForm || editingTask}
        onClose={() => {
          setShowTaskForm(false)
          setEditingTask(null)
        }}
        task={editingTask}
        categories={categories}
        onSave={editingTask ? handleUpdateTask : handleCreateTask}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="AlertTriangle" className="w-5 h-5 text-error" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-gray-900">Delete Task</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{deleteConfirm.title}"?
                </p>
                
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteTask(deleteConfirm.id)}
                    className="px-4 py-2 bg-error text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}