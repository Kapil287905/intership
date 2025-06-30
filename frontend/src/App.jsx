import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import DepartmentList from './components/DepartmentList';
import DepartmentForm from './components/DepartmentForm';
import './index.css';
import RoleListPage from './components/RoleList';
import RoleFormPage from './components/RoleForm';
import Login from './components/login';

import UserListPage from './components/UserList';
import UserForm from './components/UserForm';
import ForgotPasswordOTP from './components/ForgotPasswordOTP';
import OTPSubmit from './components/OTPSubmit';
import ResetPass from './components/ResetPassword'
import TaskListPage from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskDetailsPage from './components/TaskDetailsPage';

import axios from 'axios';
axios.defaults.withCredentials = true; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access'));
  const username = localStorage.getItem('username');
  console.log(username)

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('access'));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    window.location.href = '/'; // Redirect to login or home
  };


  return (
    <>    
    <div className="container">
      {isAuthenticated && <Sidebar />}
      {username ? (
          <div style={{width:"100%",position:"absolute",backgroundColor:'#212529',color:"#fff",left:'0',textAlign:'right',padding:'10px 20px'}}>
            <span>Welcome, {username}</span> | 
            <a onClick={handleLogout} style={{cursor:'pointer'}}> Logout</a>
          </div>
        ) : (
          <div></div>
        )}   
      <div className="content flex-grow-1" style={{
        marginLeft: isAuthenticated && window.innerWidth >= 768 ? '160px' : '0px',
        textAlign: 'left'
      }}>        
        {/* Your main page content goes here */}
        <div className="container-fluid p-3 pt-5">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/department" element={<DepartmentList />} />
            <Route path="/add" element={<DepartmentForm />} />
            <Route path="/edit/:id" element={<DepartmentForm />} />
            <Route path="/role" element={<RoleListPage />} />
            <Route path="/roleadd" element={<RoleFormPage />} />
            <Route path="/editrole/:id" element={<RoleFormPage />} />
            <Route path="/user" element={<UserListPage />} />
            <Route path="/usersadd" element={<UserForm />} />
            <Route path="/usersedit/:id" element={<UserForm />} />
            <Route path="/Forgotpass" element={<ForgotPasswordOTP />} />
            <Route path="/otpverify" element={<OTPSubmit />} />
            <Route path="/Resetpass" element={<ResetPass />} />
            <Route path="/task" element={<TaskListPage />} />
            <Route path="/taskadd" element={<TaskForm />} />
            <Route path="/taskedit/:id" element={<TaskForm />} />
            <Route path="/taskdetails/:id" element={<TaskDetailsPage />} />
          </Routes>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;