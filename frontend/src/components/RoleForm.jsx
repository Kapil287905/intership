import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/role/'

const RoleFormPage = () => {  
  const navigate = useNavigate();
  const { id } = useParams(); // id is present if it's edit

  const [role, setRole] = useState({
    role_name: '',
    description: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('access');
    
    if (id) {
      axios.get(`${API_URL}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setRole(res.data);
      })
      .catch((err) => {
        console.error('Error fetching role:', err);
        alert('Unauthorized - Please login again');
        navigate('/login');
      });
    }
  }, [id, navigate]); 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const data = {
        role_name: role.role_name,
        description: role.description,
      };

      if (id) {
        // Edit mode
        await axios.put(`${API_URL}${id}/`, data, config);
      } else {
        // Create mode
        await axios.post(`${API_URL}`, data, config);
      }

      navigate('/role');
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      alert('Submission failed. Check token, form data, or permissions.');
    }
  };

  return (
    <>
    <div className="title">
      <i className={id ? "uil uil-edit" : "uil uil-plus"}></i>
      <span className="text">{id ? "Update" : "Add"} Role</span>
    </div>
    <div className="card">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Role Name</label>
            <input
            type="text"
            name="role_name"
            className="form-control"
            value={role.role_name}
            onChange={(e) => setRole({ ...role, role_name: e.target.value })}
            required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <input
            type="text"
            name="description"
            className="form-control"
            value={role.description}
            onChange={(e) => setRole({ ...role, description: e.target.value })}
            required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {id ? 'Update' : 'Add'} Role
          </button>
        </form>
      </div>
    </div>
    </>   
  );
};

export default RoleFormPage;


