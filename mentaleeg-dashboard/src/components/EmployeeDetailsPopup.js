import React, { useState } from 'react';
import dummyImage from '../assets/icons/pp.png';

const EmployeeDetailsPopup = ({ employee, onClose, onUpdate, onDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(employee);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee({ ...editedEmployee, [name]: value });
  };

  const handleUpdate = () => {
    onUpdate(employee.id, editedEmployee);
    setEditMode(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      onDelete(employee.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-lg bg-white">
        <div className="mt-3">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Employee Details</h3>
          <div className="flex justify-center mb-4">
            <img src={employee.image || dummyImage} alt={employee.name} className="w-24 h-24 rounded-full"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {editMode ? (
              // Edit form
              <>
                <input name="employee_id" value={editedEmployee.employee_id} onChange={handleInputChange} className="border p-2" />
                <input name="name" value={editedEmployee.name} onChange={handleInputChange} className="border p-2" />
                <input name="department" value={editedEmployee.department} onChange={handleInputChange} className="border p-2" />
                <input name="role" value={editedEmployee.role} onChange={handleInputChange} className="border p-2" />
                <input name="current_project" value={editedEmployee.current_project} onChange={handleInputChange} className="border p-2" />
                <input name="workload_level" type="number" value={editedEmployee.workload_level} onChange={handleInputChange} className="border p-2" />
                <input name="email" value={editedEmployee.email} onChange={handleInputChange} className="border p-2" />
              </>
            ) : (
              // Display mode
              <>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Employee ID</p>
                  <p className="text-sm font-medium">{employee.employee_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Employee Name</p>
                  <p className="text-sm font-medium">{employee.name}</p>
                </div>
                {/* Add other fields here */}
              </>
            )}
          </div>
          <div className="flex justify-between mt-6">
            {editMode ? (
              <>
                <button onClick={handleUpdate} className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md">
                  Save Changes
                </button>
                <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-md">
                  Edit
                </button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md">
                  Delete
                </button>
                <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md">
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsPopup;