import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import image1 from '../Component/images/draw1.webp';

export const Loginpage = () => {
  const [formdata, setFormdata] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formdata.email || !formdata.password) {
      setErrors({
        email: formdata.email ? "" : "Email is required",
        password: formdata.password ? "" : "Password is required",
      });
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/login`, formdata);
      const token = response.data.token;
      localStorage.setItem("authToken", token);
      alert("Login successful");
      navigate("/");
    } catch (error) {
      setErrors({ email: "Invalid credentials" });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid m-5">
        <div className="row shadow p-3 mb-5 bg-body-tertiary rounded">
          <div className="col-md-6">
            <h2 className="text-secondary fw-5 fs-1 text-center">Login</h2>
            <form onSubmit={submitHandle}>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input
                  type="email"
                  value={formdata.email}
                  onChange={handleChange}
                  name="email"
                  className="form-control"
                  id="exampleInputEmail1"
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input
                  type="password"
                  value={formdata.password}
                  onChange={handleChange}
                  name="password"
                  className="form-control"
                  id="exampleInputPassword1"
                />
                {errors.password && <small className="text-danger">{errors.password}</small>}
              </div>
              <button type="submit" className="btn btn-primary">Login</button>
              <p className="mt-3">
                <a href="#" onClick={() => navigate("/forgot-password")}>Forgot Password?</a>
              </p>
            </form>
          </div>
          <div className="col-md-6">
            <img src={image1} alt="img" className="img-fluid" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Loginpage;
