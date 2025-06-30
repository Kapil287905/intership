import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TaskDetailsPage = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem('access');
      const response = await axios.get(`https://intership.pythonanywhere.com/api/tasks/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTask(response.data);
    };
    fetchTask();
  }, [id]);

  if (!task) return <div>Loading...</div>;

  return (
    <>
    <div className='row' style={{marginBottom:'20px',marginTop:'10px'}}>
      <div className='col-xl-6'>
        <div className="title">
            <i className="uil uil-building"></i>
            <span className="text">Task Details</span>
        </div>
      </div>
      <div className='col-xl-6'>
       
      </div>
    </div>
    <div className="container mt-4">
        <div className="card">
        <div className="card-body">
        <p><strong>Title:</strong> {task.task_title}</p>
        <p><strong>Description:</strong> {task.task_description}</p>
        <p><strong>Priority:</strong> {task.task_priority}</p>
        <p><strong>Type:</strong> {task.task_type}</p>
        <p><strong>Start Date:</strong> {task.start_date}</p>
        <p><strong>End Date:</strong> {task.end_date}</p>

        <h4>Assignments:</h4>
        {task.assignment && task.assignment.map((a, i) => (
            <div key={i} className="border p-2 mb-2">
            <p><strong>Assigned To:</strong> {a.employee.first_name} {a.employee.last_name}</p>
            <p><strong>Assigned By:</strong> {a.assigned_by.first_name}</p>
            <p><strong>Status:</strong> {a.status}</p>
            <p><strong>Assigned Date:</strong> {new Date(a.assigned_date).toLocaleString()}</p>
            </div>
        ))}
        </div>
        </div>
    </div>
    </>
  );
};

export default TaskDetailsPage;
