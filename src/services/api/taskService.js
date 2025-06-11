import tasksData from '../mockData/tasks.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TaskService {
  constructor() {
    this.storageKey = 'taskflow_tasks'
    this.initializeData()
  }

  initializeData() {
    const stored = localStorage.getItem(this.storageKey)
    if (!stored) {
      localStorage.setItem(this.storageKey, JSON.stringify(tasksData))
    }
  }

  getData() {
    const stored = localStorage.getItem(this.storageKey)
    return stored ? JSON.parse(stored) : []
  }

  saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }

  async getAll() {
    await delay(200)
    return [...this.getData()]
  }

  async getById(id) {
    await delay(150)
    const data = this.getData()
    const item = data.find(task => task.id === id)
    return item ? { ...item } : null
  }

  async create(taskData) {
    await delay(300)
    const data = this.getData()
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description || '',
      dueDate: taskData.dueDate || null,
      priority: taskData.priority || 'medium',
      categoryId: taskData.categoryId,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    
    const updatedData = [newTask, ...data]
    this.saveData(updatedData)
    return { ...newTask }
  }

  async update(id, updates) {
    await delay(250)
    const data = this.getData()
    const index = data.findIndex(task => task.id === id)
    
    if (index === -1) {
      throw new Error('Task not found')
    }

    const updatedTask = {
      ...data[index],
      ...updates
    }

    data[index] = updatedTask
    this.saveData(data)
    return { ...updatedTask }
  }

  async delete(id) {
    await delay(200)
    const data = this.getData()
    const filteredData = data.filter(task => task.id !== id)
    
    if (filteredData.length === data.length) {
      throw new Error('Task not found')
    }

    this.saveData(filteredData)
    return true
  }
}

export default new TaskService()