class CategoryService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'category';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
          'ModifiedOn', 'ModifiedBy', 'color', 'task_count'
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
          'ModifiedOn', 'ModifiedBy', 'color', 'task_count'
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  }

  async create(categoryData) {
    try {
      // Only include Updateable fields for create operation
      const params = {
        records: [{
          Name: categoryData.name,
          Tags: categoryData.tags || '',
          Owner: categoryData.owner,
          color: categoryData.color || '#5B4FE5',
          task_count: 0
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
          throw new Error(failedRecords[0].message || 'Failed to create category');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Only include Updateable fields for update operation
      const updateData = {
        Id: parseInt(id)
      };
      
      if (updates.name !== undefined) updateData.Name = updates.name;
      if (updates.color !== undefined) updateData.color = updates.color;
      if (updates.task_count !== undefined) updateData.task_count = updates.task_count;
      
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
          throw new Error(failedRecords[0].message || 'Failed to update category');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error updating category:", error);
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
          throw new Error(failedRecords[0].message || 'Failed to delete category');
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
}

export default new CategoryService();