import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API_URL = 'https://intership.pythonanywhere.com/api/tasks/'

const TaskListPage = () => {
  const [Task, setTask] = useState([])
  const userRole = localStorage.getItem("role");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = Task.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(Task.length / recordsPerPage);
  const goToPage = (number) => setCurrentPage(number);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchTask = async (employeeId = '', status = '') => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let filteredTasks = response.data;

      // Filter by employee ID
      if (employeeId) {
        filteredTasks = filteredTasks.filter(task =>
          task.assignment.some(a => a.employee.id.toString() === employeeId.toString())
        );
      }

      // ✅ Correct status check
      if (status) {
        filteredTasks = filteredTasks.filter(task =>
          task.assignment.some(a => a.status.toLowerCase() === status.toLowerCase())
        );
      }

      setTask(filteredTasks);
      console.log(filteredTasks)
    } catch (error) {
      console.error('Error fetching task:', error.response?.data || error.message);
    }
  };


  const fetchEmployees = async () => {
    const token = localStorage.getItem('access');
    const loggedInUserId = localStorage.getItem('employee_id');
    const res = await axios.get('https://intership.pythonanywhere.com/api/users/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const filtered = res.data.filter(emp => emp.employee_id !== parseInt(loggedInUserId));
    setEmployees(filtered);
  };

  useEffect(() => {
    fetchTask()
    fetchEmployees();
  }, [])

  const handleDelete = async (id) => {
    alert(id)
    // const token = localStorage.getItem('access');
    // try {
    //   if (window.confirm("Are you sure you want to delete this task?")) {
    //     await axios.delete(`${API_URL}${id}/`, {
    //       headers: {
    //         Authorization: `Bearer ${token}`
    //       }
    //     })
    //   }
    //   fetchTask()
    // } catch (error) {
    //   console.error('Delete failed:', error.response || error.message)
    //   alert('Failed to delete. Check console.')
    // }
  }

  const handleMarkComplete = async (id) => {
    try {
      const token = localStorage.getItem('access');
      await axios.patch(
        `https://intership.pythonanywhere.com/api/task-assignments/${id}/complete/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Marked as completed!");
      fetchTask(); // Refresh task list
    } catch (error) {
      console.error("Failed to mark complete:", error);
      alert("Failed to update status");
    }
  };

  return (
    <>
    <div className='row' style={{marginBottom:'20px',marginTop:'10px'}}>
      <div className='col-xl-6'>
        <div className="title">
            <i className="uil uil-building"></i>
            <span className="text">Task Management</span>
        </div>
      </div>
      <div className='col-xl-6'>
        {userRole === "Admin" && (
        <a href="/taskadd"><button className='btn btn-success' style={{marginTop:'2px',float:'right'}}><i className="uil uil-plus fs-5"></i> Create Task</button></a>
        )}
      </div>
    </div>    
    <div className='row'>
      <div className="mb-3 col-xl-3">
        <label>Filter by Employee: </label>
        <select
          className="form-select"
          value={selectedEmployee}
          onChange={(e) => {
            setSelectedEmployee(e.target.value);
            fetchTask(e.target.value); // fetch with filter
          }}
        >
          <option value="">All</option>
          {employees.map((emp) => (
            <option key={emp.employee_id} value={emp.employee_id}>
              {emp.first_name} {emp.last_name}
            </option>
          ))}
        </select>
      </div>    
      <div className="mb-3 col-xl-3">
        <label>Filter by Status: </label>
        <select className="form-select" value={statusFilter} onChange={(e) => {
          setStatusFilter(e.target.value);
          fetchTask(selectedEmployee, e.target.value); // Update this function
        }}>
          <option value="">Filter by Status</option>
          <option value="Pending">Pending</option>
          <option value="In progress">In progress</option>
          <option value="Completed">Completed</option>
        </select>     
      </div>
    </div>
    <div className="pagination">
      <button
        className="page-btn"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {'<'}
      </button>

      {[...Array(totalPages).keys()].map((num) => (
        <button
          key={num + 1}
          onClick={() => goToPage(num + 1)}
          className={`page-btn ${currentPage === num + 1 ? 'active' : ''}`}
        >
          {num + 1}
        </button>
      ))}

      <button
        className="page-btn"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {'>'}
      </button>
    </div>
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th style={{width:'5%'}}>Sr.No</th>
            <th style={{width:'10%'}}>Employee Name</th>
            <th style={{width:'10%'}}>Task Title</th>
            <th style={{width:'10%'}}>Start Date</th>
            <th style={{width:'10%'}}>End Date</th>
            <th style={{width:'10%'}}>See Detail</th>
            <th style={{width:'10%'}}>Status</th>
            <th style={{width:'10%'}}>Action</th>
            {userRole === "Admin" && (
              <>           
                <th style={{width:'5%'}}>Edit</th>
                <th style={{width:'5%'}}>Delete</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((task, index) => (
            <tr key={task.id}>
              <td>{indexOfFirstRecord + index + 1}</td>
              <td>{task.assignment?.map((a, i) => (
                  <div key={i}>
                    {a.employee.first_name} {a.employee.last_name}
                  </div>
                )) || "N/A"}
              </td>
              <td>{task.task_title}</td>
              <td>{task.end_date}</td>
              <td>{task.start_date}</td>
              <td>
                <Link to={`/taskdetails/${task.id}`} className="btn btn-info btn-sm">
                  <i className="uil uil-eye"></i> Details
                </Link>
              </td>
              <td>
                  {task.assignment?.map((a, i) => (
                    <div key={i}>
                      {a.status}
                    </div>
                  )) || "N/A"}
              </td>
              <td>
                {task.assignment?.map((a, i) => (
                  <div key={i}>
                    {a.status !== 'Completed' && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleMarkComplete(task.id)}
                      >
                        ✅ Mark Complete
                      </button>
                    )}
                  </div>
                ))}
              </td>
              
              {userRole === "Admin" && (
                <> 
                  <td>
                    <Link to={`/taskedit/${task.id}`} className="btn btn-warning btn-sm me-2"><i className="uil uil-edit-alt"></i></Link>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(task.id)} className="btn btn-danger btn-sm"><i className="uil uil-trash-alt"></i></button>
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

export default TaskListPage
