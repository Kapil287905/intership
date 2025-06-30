import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const TaskForm = ({ onSuccess }) => {
  const [employees, setEmployees] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
      task_title: '',
      task_description: '',
      task_priority: '',
      assigned_to: '',
      task_type: '',
      start_date: '',
      end_date: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const token = localStorage.getItem('access');
    
    if (id) {
      axios.get(`http://127.0.0.1:8000/api/tasks/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        const data = res.data;

      // Safely get the first assigned employee ID
      const assignedToId = data.assignment?.[0]?.employee?.id || '';

      setForm({
        task_title: data.task_title,
        task_description: data.task_description,
        task_priority: data.task_priority,
        assigned_to: assignedToId, // ✅ prefill
        task_type: data.task_type,
        start_date: data.start_date,
        end_date: data.end_date,
      });

      })
      .catch((err) => {
        console.error('Error fetching department:', err);
        alert('Unauthorized - Please login again');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('username');
        navigate('/');
        window.location.reload();
      });
    }
  }, [id, navigate]);

  useEffect(() => {
    const fetchEmployees = async () => {
    const token = localStorage.getItem('access'); // or use your auth context
    const loggedInUserId = localStorage.getItem('employee_id');
    
    try {      
      const response = await axios.get('http://127.0.0.1:8000/api/users/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Replace with actual logged-in user's ID
      const loggedInUserId = localStorage.getItem('employee_id');

      const filtered = response.data.filter(emp => emp.employee_id !== parseInt(loggedInUserId));
      setEmployees(filtered);
      console.log(response.data)
    } catch (err) {
      console.error('Error fetching employees', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('username');
        window.location.href = '/';
      }
    }
  };

  fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();    
    try {
        const token = localStorage.getItem('access'); // assuming you store it here
        if (isEdit) {
            await axios.put(`http://127.0.0.1:8000/api/tasks/${id}/`, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        }else{
            await axios.post('http://127.0.0.1:8000/api/tasks/', form, {
            headers: {
                'Authorization': `Bearer ${token}`
            }        
            });
        }        
      navigate('/task');
    } catch (err) {
      console.error('Task creation failed:', err.response?.data || err.message);
    }
  };

  return (
    <>
    <div className="title">
      <i className={id ? "uil uil-edit" : "uil uil-plus"}></i>
      <span className="text">{isEdit ? 'Update' : 'Create'} Task</span>
    </div>
    <div className="card">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
            <div className='row'>
              <div className="mb-3">
                  <label className="form-label">Task Title</label>
                  <input type="text" name='task_title' value={form.task_title} onChange={handleChange} className="form-control" required />                  
              </div>
              <div className="mb-3">
                  <label className="form-label">Task Description</label>
                  <textarea type="text" name='task_description' value={form.task_description} onChange={handleChange} className="form-control" required />                  
              </div>
              <div className="mb-3 col-xl-6">
                  <label className="form-label">Select priority</label>
                  <select name="task_priority" value={form.task_priority} className="form-control" onChange={handleChange}>
                      <option value="">Select priority</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                  </select>
              </div>
              <div className="mb-3 col-xl-6">
                  <label className="form-label">Assigned To</label>
                  <select name="assigned_to" value={form.assigned_to} className="form-control" onChange={handleChange}>
                      <option value="">Assigned To</option>
                      {employees.map(emp => (
                        <option key={emp.employee_id} value={emp.employee_id}>{emp.first_name} {emp.last_name}</option>
                      ))}
                  </select>
              </div>
              <div className="mb-3">
                  <label className="form-label">Task Type</label>
                  <select name="task_type" value={form.task_type} className="form-control" onChange={handleChange}>
                      <option value="">Select Type</option>
                      <option value="Individual">Individual</option>
                      <option value="Team">Team</option>
                  </select>
              </div>
              <div className="mb-3 col-xl-6">
                  <label className="form-label">Start Date</label>
                  <input type="date" name='start_date' value={form.start_date} onChange={handleChange} className="form-control" required />                  
              </div>
              <div className="mb-3 col-xl-6">
                  <label className="form-label">End Date</label>
                  <input type="date" name='end_date' value={form.end_date} onChange={handleChange} className="form-control" required />                  
              </div>
            
            </div>
            <button type="submit" className="btn btn-primary">
                {isEdit ? 'Update' : 'Create'} Task
            </button>
        </form>
      </div>
    </div>    
    </>
    
  );
};

export default TaskForm;
