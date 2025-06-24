import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Sidebar from './sidebar';
import DepartmentList from './components/DepartmentList';
import DepartmentForm from './components/DepartmentForm';
import './index.css';
import RoleListPage from './components/RoleList';
import RoleFormPage from './components/RoleForm';
import Login from './components/login';

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
          </Routes>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;