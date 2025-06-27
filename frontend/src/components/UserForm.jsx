import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API = 'https://intership.pythonanywhere.com/api/users/'; // Adjust if needed
const DEPARTMENTS_API = 'https://intership.pythonanywhere.com/api/departments/';
const ROLES_API = 'https://intership.pythonanywhere.com/api/role/';

const UserForm = () => {
  const { id } = useParams(); // for edit mode
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    department: '',
    role: '',
    reporting_manager: '',
    date_of_joining: '',
  });

  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    // Load dropdown data
    const token = localStorage.getItem('access'); // Get token from storage
      
    axios.get(DEPARTMENTS_API, {
        headers: {
            Authorization: `Bearer ${token}`, // 🔐 Include the token here
        }
    }).then(res => setDepartments(res.data));

    axios.get(ROLES_API, {
        headers: {
            Authorization: `Bearer ${token}`, // 🔐 Include the token here
        }
    }).then(res => setRoles(res.data));

    axios.get(API, {
        headers: {
            Authorization: `Bearer ${token}`, // 🔐 Include the token here
        }
    }).then(res => setManagers(res.data));

    if (isEdit) {     

      axios.get(`${API}${id}/`, {
        headers: {
            Authorization: `Bearer ${token}`, // 🔐 Include the token here
        }
    }).then(res => setForm({ ...res.data }));

      
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    try {
      if (isEdit) {
        await axios.put(`${API}${id}/`, form, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
        });
      } else {
        await axios.post(API, form, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
        });
      }
      navigate('/user');
    } catch (error) {
      alert('Failed to save user. Check console.');
      console.error(error.response?.data || error);
    }
  };

  return (
    <>
    <div className="title">
      <i className={id ? "uil uil-edit" : "uil uil-plus"}></i>
      <span className="text">{isEdit ? 'Update' : 'Create'} User</span>
    </div>
    <div className="card">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">First Name</label>
                <input
                type="text"
                name="first_name"
                className="form-control"
                value={form.first_name || ''}
                onChange={handleChange}
                required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input
                type="text"
                name="last_name"
                className="form-control"
                value={form.last_name || ''}
                onChange={handleChange}
                required
                />
            </div>             
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                type="email"
                name="email"
                className="form-control"
                value={form.email || ''}
                onChange={handleChange}
                required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Mobile</label>
                <input
                type="text"
                name="phone"
                className="form-control"
                value={form.phone || ''}
                onChange={handleChange}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Department</label>
                <select name="department" value={form.department || ''} className="form-control" onChange={handleChange}>
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                        <option key={dept.dept_id} value={dept.dept_id}>{dept.dept_name}</option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Role</label>
                <select name="role" value={form.role || ''} className="form-control" onChange={handleChange}>
                    <option value="">Select Role</option>
                    {roles.map(role => (
                        <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Reporting Manager</label>
                <select name="reporting_manager" value={form.reporting_manager || ''} className="form-control" onChange={handleChange}>
                    <option value="">Select Reporting Manager</option>
                    {managers.map(managers => (
                        <option key={managers.employee_id} value={managers.employee_id}>{managers.first_name}</option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Date Of Joining</label>
                <input
                type="date"
                name="date_of_joining"
                className="form-control"
                value={form.date_of_joining || ''}
                onChange={handleChange}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                type="text"
                name="username"
                className="form-control"
                value={form.username || ''}
                onChange={handleChange}
                required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                type="password"
                name="password"
                className="form-control"
                value={form.password || ''}
                onChange={handleChange}
                required
                />
            </div>
            <button type="submit" className="btn btn-primary">
                {isEdit ? 'Update' : 'Create'} User
            </button>
        </form>
      </div>
    </div>    
    </>
  );
};

export default UserForm;
