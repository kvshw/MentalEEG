import { create } from 'zustand';
import { Employee, employeeApi } from '@/lib/api/employee';

interface EmployeeState {
    employees: Employee[];
    isLoading: boolean;
    error: string | null;
    selectedEmployee: Employee | null;
    fetchEmployees: () => Promise<void>;
    addEmployee: (employee: Employee) => Promise<void>;
    updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>;
    deleteEmployee: (id: string) => Promise<void>;
    setSelectedEmployee: (employee: Employee | null) => void;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
    employees: [],
    isLoading: false,
    error: null,
    selectedEmployee: null,

    fetchEmployees: async () => {
        try {
            set({ isLoading: true, error: null });
            const data = await employeeApi.getEmployees();
            set({ employees: data });
        } catch (error) {
            set({ error: 'Failed to fetch employees' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    addEmployee: async (employeeData) => {
        try {
            set({ isLoading: true, error: null });
            const newEmployee = await employeeApi.createEmployee(employeeData);
            set(state => ({
                employees: [...state.employees, newEmployee]
            }));
        } catch (error) {
            set({ error: 'Failed to add employee' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateEmployee: async (id, employeeData) => {
        try {
            set({ isLoading: true, error: null });
            const updatedEmployee = await employeeApi.updateEmployee(id, employeeData);
            set(state => ({
                employees: state.employees.map(emp =>
                    emp.id === id ? updatedEmployee : emp
                )
            }));
        } catch (error) {
            set({ error: 'Failed to update employee' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteEmployee: async (id) => {
        try {
            set({ isLoading: true, error: null });
            await employeeApi.deleteEmployee(id);
            set(state => ({
                employees: state.employees.filter(emp => emp.id !== id)
            }));
        } catch (error) {
            set({ error: 'Failed to delete employee' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    setSelectedEmployee: (employee) => {
        set({ selectedEmployee: employee });
    }
})); 