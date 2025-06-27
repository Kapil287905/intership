import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api/role/'

const RoleListPage = () => {
  const [Roles, setRoles] = useState([])

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('access'); // Get token from storage
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`, // 🔐 Include the token here
        },
      });
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching role:', error);
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const handleDelete = async (id) => {
    const token = localStorage.getItem('access');
    try {
      if (window.confirm("Are you sure you want to delete this department?")) {
        await axios.delete(`${API_URL}${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }
      fetchRoles()
    } catch (error) {
      console.error('Delete failed:', error.response || error.message)
      alert('Failed to delete. Check console.')
    }
  }

  return (
    <>
    <div className='row' style={{marginBottom:'20px',marginTop:'10px'}}>
      <div className='col-xl-6'>
        <div className="title">
            <i className="uil uil-users-alt"></i>
            <span className="text">Role Management</span>
        </div>
      </div>
      <div className='col-xl-6'>
        <a href="/roleadd"><button className='btn btn-success' style={{marginTop:'2px',float:'right'}}><i className="uil uil-plus fs-5"></i> Create Role</button></a>
      </div>
    </div>        
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th style={{width:'5%'}}>Sr.No</th>
            <th style={{width:'40%'}}>Role Name</th>
            <th style={{width:'45%'}}>Description</th>        
            <th style={{width:'5%'}}>Edit</th>
            <th style={{width:'5%'}}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {Roles.map((role, index) => (
            <tr key={role.role_id}>
              <td>{index + 1}</td>
              <td>{role.role_name}</td>
              <td>{role.description}</td>
              <td>
                <Link to={`/editrole/${role.role_id}`} className="btn btn-warning btn-sm me-2"><i className="uil uil-edit-alt"></i></Link>
              </td>
              <td>
                <button onClick={() => handleDelete(role.role_id)} className="btn btn-danger btn-sm"><i className="uil uil-trash-alt"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}

export default RoleListPage
