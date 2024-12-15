import api from './index';

export interface Employee {
    id: string;
    name: string;
    department: string;
    currentWorkloadLevel: number;
    previousWorkloadLevel: number;
    currentProject?: string;
    email: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateEmployeeDto {
    name: string;
    department: string;
    currentWorkloadLevel: number;
    previousWorkloadLevel: number;
    currentProject?: string;
    email: string;
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {}

class EmployeeApi {
    private transformToSnakeCase(data: CreateEmployeeDto | UpdateEmployeeDto) {
        return {
            name: data.name,
            email: data.email,
            department: data.department,
            current_project: data.currentProject,
            current_workload_level: data.currentWorkloadLevel,
            previous_workload_level: data.previousWorkloadLevel,
        };
    }

    private transformToCamelCase(data: any): Employee {
        return {
            id: data.id,
            name: data.name,
            email: data.email,
            department: data.department,
            currentProject: data.current_project,
            currentWorkloadLevel: data.current_workload_level,
            previousWorkloadLevel: data.previous_workload_level,
            created_at: data.created_at,
            updated_at: data.updated_at,
        };
    }

    async getEmployees() {
        try {
            console.log('Fetching employees...');
            const response = await api.get('/employees/');
            
            console.log('API Response:', {
                status: response.status,
                data: response.data,
                isArray: Array.isArray(response.data),
                type: typeof response.data
            });
            
            if (!response.data) {
                throw new Error('No data received from API');
            }

            // Handle paginated response
            const results = Array.isArray(response.data) ? response.data : 
                           response.data.results ? response.data.results : 
                           null;

            if (!results) {
                throw new Error(`Invalid API response format: ${JSON.stringify(response.data)}`);
            }

            return results.map(this.transformToCamelCase);
        } catch (error: any) {
            console.error('Error fetching employees:', {
                message: error.message,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers,
                } : 'No response',
                request: error.request ? 'Request was made but no response received' : 'Request setup failed'
            });
            throw error;
        }
    }

    async getEmployee(id: string) {
        try {
            const response = await api.get<any>(`/employees/${id}/`);
            return this.transformToCamelCase(response.data);
        } catch (error: any) {
            console.error(`Error fetching employee ${id}:`, {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
            throw error;
        }
    }

    async createEmployee(data: CreateEmployeeDto) {
        try {
            const response = await api.post<any>('/employees/', this.transformToSnakeCase(data));
            return this.transformToCamelCase(response.data);
        } catch (error: any) {
            console.error('Error creating employee:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
            throw error;
        }
    }

    async updateEmployee(id: string, data: UpdateEmployeeDto) {
        try {
            const response = await api.patch<any>(`/employees/${id}/`, this.transformToSnakeCase(data));
            return this.transformToCamelCase(response.data);
        } catch (error: any) {
            console.error(`Error updating employee ${id}:`, {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
            throw error;
        }
    }

    async deleteEmployee(id: string) {
        try {
            await api.delete(`/employees/${id}/`);
        } catch (error: any) {
            console.error(`Error deleting employee ${id}:`, {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
            throw error;
        }
    }
}

export const employeeApi = new EmployeeApi(); 