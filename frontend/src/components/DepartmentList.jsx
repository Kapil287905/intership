import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API_URL = 'https://intership.pythonanywhere.com/api/departments/'

const DepartmentListPage = () => {
  const [departments, setDepartments] = useState([])
  const userRole = localStorage.getItem("role");

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('access'); // Get token from storage
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`, // 🔐 Include the token here
        },
      });
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleDelete = async (id) => {
    const token = localStorage.getItem('access');
    try {
      if (window.confirm("Are you sure you want to delete this role?")) {
        await axios.delete(`${API_URL}${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }
      fetchDepartments()
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
            <i className="uil uil-building"></i>
            <span className="text">Department Management</span>
        </div>
      </div>
      <div className='col-xl-6'>
        {userRole === "Admin" && (
        <a href="/add"><button className='btn btn-success' style={{marginTop:'2px',float:'right'}}><i className="uil uil-plus fs-5"></i> Create Department</button></a>
        )}
      </div>
    </div>
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th style={{width:'5%'}}>Sr.No</th>
            <th style={{width:'40%'}}>Department Name</th>
            <th style={{width:'45%'}}>Description</th>
            {userRole === "Admin" && (
              <>
                <th style={{ width: '5%' }}>Edit</th>
                <th style={{ width: '5%' }}>Delete</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {departments.map((dept, index) => (
            <tr key={dept.dept_id}>
              <td>{index + 1}</td>
              <td>{dept.dept_name}</td>
              <td>{dept.description}</td>
              {userRole === "Admin" && (
                <>
                  <td>
                    <Link to={`/edit/${dept.dept_id}`} className="btn btn-warning btn-sm me-2"><i className="uil uil-edit-alt"></i></Link>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(dept.dept_id)} className="btn btn-danger btn-sm"><i className="uil uil-trash-alt"></i></button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}

export default DepartmentListPage
