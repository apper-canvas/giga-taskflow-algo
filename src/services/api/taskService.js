class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
          'ModifiedOn', 'ModifiedBy', 'title', 'description', 'due_date', 
          'priority', 'category_id', 'completed', 'created_at', 'completed_at'
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
          'ModifiedOn', 'ModifiedBy', 'title', 'description', 'due_date', 
          'priority', 'category_id', 'completed', 'created_at', 'completed_at'
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      // Only include Updateable fields for create operation
      const params = {
        records: [{
          Name: taskData.title,
          Tags: taskData.tags || '',
          Owner: taskData.owner,
          title: taskData.title,
          description: taskData.description || '',
          due_date: taskData.dueDate,
          priority: taskData.priority || 'medium',
          category_id: parseInt(taskData.categoryId),
          completed: false,
          created_at: new Date().toISOString(),
          completed_at: null
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
          throw new Error(failedRecords[0].message || 'Failed to create task');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Only include Updateable fields for update operation
      const updateData = {
        Id: parseInt(id)
      };
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.categoryId !== undefined) updateData.category_id = parseInt(updates.categoryId);
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.completedAt !== undefined) updateData.completed_at = updates.completedAt;
      
      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${failedRecords}`);
          throw new Error(failedRecords[0].message || 'Failed to update task');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${failedRecords}`);
          throw new Error(failedRecords[0].message || 'Failed to delete task');
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
}

export default new TaskService();