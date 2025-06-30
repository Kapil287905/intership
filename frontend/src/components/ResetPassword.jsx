import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ResetPass() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const username = localStorage.getItem("username");

      const res = await axios.post('https://intership.pythonanywhere.com/api/reset-password/', {
        username,
        password,
        confirm_password: confirm
      });
      navigate('/');
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Reset failed.");
    }
  };

  return (
    <>
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
        <div className="card">
            <div className="card-body">
                <h3>Reset Password</h3>
                <form onSubmit={handleReset}>
                    <div className="mb-3">
                      <label>New Password:</label>
                      <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      />
                    </div>
                    <div className="mb-3">
                      <label>Confirm Password:</label>
                      <input
                      type="password"
                      className="form-control"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Reset Password</button>                   
                </form>
                <p>{message}</p>
            </div>
        </div>
    </div>
    </>
    
  );
}

export default ResetPass;