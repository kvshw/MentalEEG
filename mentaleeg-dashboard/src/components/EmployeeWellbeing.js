import React, { useState, useEffect } from 'react';
import EmployeeDetailsPopup from './EmployeeDetailsPopup';
import { FaSearch } from 'react-icons/fa';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../api/employeeApi';

const EmployeeWellbeing = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      console.log('Fetching employees...');
      const response = await getEmployees();
      console.log('API Response:', response);
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to fetch employees: ' + err.message);
      setLoading(false);
    }
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const closePopup = () => {
    setSelectedEmployee(null);
  };

  const handleAddEmployee = async (newEmployeeData) => {
    try {
      const response = await createEmployee(newEmployeeData);
      setEmployees([...employees, response.data]);
    } catch (err) {
      setError('Failed to add employee');
    }
  };

  const handleUpdateEmployee = async (id, updatedData) => {
    try {
      const response = await updateEmployee(id, updatedData);
      setEmployees(employees.map(emp => emp.id === id ? response.data : emp));
    } catch (err) {
      setError('Failed to update employee');
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await deleteEmployee(id);
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (err) {
      setError('Failed to delete employee');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Employee Well-being</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300">
          (+) Add to Project
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Project</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workload Level</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {employees.map((employee) => (
            <tr key={employee.id} onClick={() => handleEmployeeClick(employee)} className="cursor-pointer hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-full" src={employee.image} alt="" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    <div className="text-sm text-gray-500">{employee.role}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.employee_id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.current_project || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  employee.workload_level >= 4 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {employee.workload_level}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedEmployee && (
        <EmployeeDetailsPopup 
          employee={selectedEmployee} 
          onClose={closePopup}
          onUpdate={handleUpdateEmployee}
          onDelete={handleDeleteEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeWellbeing;
