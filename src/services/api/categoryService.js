import categoriesData from '../mockData/categories.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class CategoryService {
  constructor() {
    this.storageKey = 'taskflow_categories'
    this.initializeData()
  }

  initializeData() {
    const stored = localStorage.getItem(this.storageKey)
    if (!stored) {
      localStorage.setItem(this.storageKey, JSON.stringify(categoriesData))
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
    await delay(150)
    return [...this.getData()]
  }

  async getById(id) {
    await delay(100)
    const data = this.getData()
    const item = data.find(category => category.id === id)
    return item ? { ...item } : null
  }

  async create(categoryData) {
    await delay(200)
    const data = this.getData()
    const newCategory = {
      id: Date.now().toString(),
      name: categoryData.name,
      color: categoryData.color || '#5B4FE5',
      taskCount: 0
    }
    
    const updatedData = [...data, newCategory]
    this.saveData(updatedData)
    return { ...newCategory }
  }

  async update(id, updates) {
    await delay(200)
    const data = this.getData()
    const index = data.findIndex(category => category.id === id)
    
    if (index === -1) {
      throw new Error('Category not found')
    }

    const updatedCategory = {
      ...data[index],
      ...updates
    }

    data[index] = updatedCategory
    this.saveData(data)
    return { ...updatedCategory }
  }

  async delete(id) {
    await delay(150)
    const data = this.getData()
    const filteredData = data.filter(category => category.id !== id)
    
    if (filteredData.length === data.length) {
      throw new Error('Category not found')
    }

    this.saveData(filteredData)
    return true
  }
}

export default new CategoryService()