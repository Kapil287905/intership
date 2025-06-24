import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/role/'

const RoleFormPage = () => {
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // id is present if it's edit

  const ROLE_CHOICES = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'team_leader', label: 'Team-Leader' },
    { value: 'employee', label: 'Employee' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('access');
    
    if (id) {
      axios.get(`${API_URL}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setRole(res.data.role);
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

      if (id) {        
        // Edit mode
        await axios.put(`${API_URL}${id}/`, {
          role
        }, config);
      } else {
        // Create mode
        await axios.post(`${API_URL}`, {
          role
        }, config);
      }

      navigate('/role');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Unauthorized or submission error. Check token and permissions.');
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
          <div className="form-group mb-3">
            <label>Select Role:</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">-- Select Role --</option>
              {ROLE_CHOICES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
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


