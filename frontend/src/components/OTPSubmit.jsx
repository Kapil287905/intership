// OTPSubmit.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'

function OTPSubmit() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://intership.pythonanywhere.com/api/otp-verify/', {
        otp
      });

      const { message, username } = response.data;
      setMessage(`${message} Welcome ${username}`);
      localStorage.setItem('username', username);
      navigate('/Resetpass');
    } catch (err) {
      console.error("OTP Verify Error:", err);
      setMessage(err.response?.data?.error || "Verification failed.");
    }
  };

  return (
    <>
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
        <div className="card">
            <div className="card-body">
                <h3>Verify OTP</h3>
                <form onSubmit={verifyOTP}>
                    <div className="mb-3">
                    <label>Enter OTP:</label>
                    <input type="text" className="form-control" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Verify OTP</button>                    
                    <p>{message}</p>
                </form>                
            </div>
        </div>
    </div>    
    </>
    
  );
}

export default OTPSubmit;
