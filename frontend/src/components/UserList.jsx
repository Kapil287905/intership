import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API_URL = 'intership.pythonanywhere.comapi/users/'

const UserListPage = () => {
  const [User, setUser] = useState([])
  const userRole = localStorage.getItem("role");
  

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('access'); // Get token from storage
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`, // 🔐 Include the token here
        },
      });
      setUser(response.data);
      console.log(response)
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const handleDelete = async (id) => {
    const token = localStorage.getItem('access');
    try {
      if (window.confirm("Are you sure you want to delete this user?")) {
        await axios.delete(`${API_URL}${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }
      fetchUser()
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
            <span className="text">Employee Management</span>
        </div>
      </div>
      <div className='col-xl-6'>
        {userRole === "Admin" && (
        <a href="/usersadd"><button className='btn btn-success' style={{marginTop:'2px',float:'right'}}><i className="uil uil-plus fs-5"></i> Create Employee</button></a>
        )}
      </div>
    </div>
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th style={{width:'5%'}}>Sr.No</th>
            <th style={{width:'10%'}}>First Name</th>
            <th style={{width:'10%'}}>Last Name</th>
            <th style={{width:'10%'}}>Email</th>
            <th style={{width:'10%'}}>Mobile</th>
            <th style={{width:'10%'}}>Depaetment</th>
            <th style={{width:'10%'}}>Role</th>
            <th style={{width:'15%'}}>Reporting manager</th>
            <th style={{width:'10%'}}>Username</th>
            {userRole === "Admin" && (
              <>           
                <th style={{width:'5%'}}>Edit</th>
                <th style={{width:'5%'}}>Delete</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {User.map((user, index) => (
            <tr key={user.employee_id}>
              <td>{index + 1}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.department_name}</td>
              <td>{user.role_name}</td>
              <td>{user.reporting_manager_name}</td>
              <td>{user.username}</td>
              {userRole === "Admin" && (
                <> 
                  <td>
                    <Link to={`/usersedit/${user.employee_id}`} className="btn btn-warning btn-sm me-2"><i className="uil uil-edit-alt"></i></Link>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(user.employee_id)} className="btn btn-danger btn-sm"><i className="uil uil-trash-alt"></i></button>
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

export default UserListPage
