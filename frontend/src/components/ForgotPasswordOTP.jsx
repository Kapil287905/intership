import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordOTP = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  

  const handleresetpass = async (e) => {
    e.preventDefault();    
    try {
       const response = await axios.post(
            'http://127.0.0.1:8000/api/otp-request/',
            { email },
            { withCredentials: true } // ✅ VERY IMPORTANT for Django session
        );
        navigate('/otpverify');
        //setMessage(response.data.message); 
    } catch (error) {
        setMessage(error.response?.data?.error || 'Something went wrong.');
    }
    };

  return (
    <>
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
        <div className="card">
            <div className="card-body">
                <h3>Forgot Password (OTP)</h3>
                <form onSubmit={handleresetpass}>
                    <div className="mb-3">
                    <label>Enter your email:</label>
                    <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                     </div>
                    <button type="submit" className="btn btn-primary w-100">Send OTP</button>                   
                </form>
                <p>{message}</p>
            </div>
        </div>
    </div>    
    </>
  );
};

export default ForgotPasswordOTP;
