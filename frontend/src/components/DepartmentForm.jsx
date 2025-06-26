import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'https://intership.pythonanywhere.com/api/departments/'

const DepartmentFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    dept_name: '',
    description: '',
    status: true,
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
        setForm(res.data);
      })
      .catch((err) => {
        console.error('Error fetching department:', err);
        alert('Unauthorized - Please login again');
        navigate('/login');
      });
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access'); 
    const { dept_name, description, status } = form; 
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (id) {        
        // Edit mode
        await axios.put(`${API_URL}${id}/`, {
          dept_name,
          description,
          status
        }, config);
      } else {
        // Create mode
        await axios.post(`${API_URL}`, {
          dept_name,
          description,
          status
        }, config);
      }

      navigate('/department');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Unauthorized or submission error. Check token and permissions.');
    }
  };

  return (
    <>
    <div className="title">
      <i className={id ? "uil uil-edit" : "uil uil-plus"}></i>
      <span className="text">{id ? "Update" : "Add"} Department</span>
    </div>
    <div className="card">
    <div className="card-body">
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
      <label className="form-label">Department Name</label>
      <input
      type="text"
      name="dept_name"
      className="form-control"
      value={form.dept_name}
      onChange={handleChange}
      required
      />
      </div>
      <div className="mb-3">
      <label className="form-label">Description</label>
      <input
      type="text"
      name="description"
      className="form-control"
      value={form.description}
      onChange={handleChange}
      required
      />
      </div>
      <div className="form-check mb-3">
      <input
      type="checkbox"
      className="form-check-input"
      id="status"
      name="status"
      checked={form.status}
      onChange={handleChange}
      />
      <label className="form-check-label" htmlFor="status">Active</label>
      </div>
      <button type="submit" className="btn btn-success">{id ? "Update" : "Add"} Department</button>
      </form>
    </div>
    </div>
    </>
  )
}

export default DepartmentFormPage
