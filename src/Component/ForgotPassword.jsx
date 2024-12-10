import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import Footer from './Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/forgotpassword`, { email });
      console.log('response', response);

      window.alert("OTP has been sent to your email");
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 0);  
    } catch (err) {
      setError("Email does not exist");
    }
  };

  return ( 
    <>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="card p-4" style={{ width: '400px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <h2 className="text-center mb-4">Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Send OTP</button>
            {error && <p className="text-danger mt-2">{error}</p>}
          </form>
          <button className="btn btn-secondary w-100 mt-3" onClick={() => navigate("/login")}>Back to Login</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
