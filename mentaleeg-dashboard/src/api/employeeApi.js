import axios from 'axios';

const API_URL = 'http://localhost:8000/api/employees/';

export const getEmployees = () => {
    console.log('Fetching employees from:', API_URL);
    return axios.get(API_URL);
};

export const createEmployee = (employeeData) => {
    return axios.post(API_URL, employeeData);
};

export const updateEmployee = (id, employeeData) => {
    return axios.put(`${API_URL}${id}/`, employeeData);
};

export const deleteEmployee = (id) => {
    return axios.delete(`${API_URL}${id}/`);
};
