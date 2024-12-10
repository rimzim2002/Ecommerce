import React, { useState } from 'react';
import image1 from '../Component/images/draw1.webp';
import axios from 'axios'
import Navbar from './Navbar';
import Footer from './Footer';
const Signuppage = () => {
  const [formdata, setFormdata] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const reset=()=>{
    setFormdata({
      username: "",
      phoneNumber: "",
      email: "",
      password: ""
    })
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    setFormdata({ ...formdata, [name]: value });

    if (name === 'username') {
      if (!value.trim()) {
        newErrors.username = "Name is required";
      } else if (!/^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$/.test(value)) {
        newErrors.username = "Name is invalid";
      } else {
        delete newErrors.username;
      }
    }

    if (name === 'email') {
      const trimmedEmail = value.trim();
      if (!trimmedEmail) {
        newErrors.email = "Email address is required";
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
        newErrors.email = "Email is invalid";
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'password') {
      if (!value) {
        newErrors.password = "Password is required";
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
        newErrors.password = "Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one special character.";
      } else {
        delete newErrors.password;
      }
    }

    if (name === 'phoneNumber') {
      if (!value.trim()) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (!/^((\+91|91|0)?[6-9]\d{9})$/.test(value)) {
        newErrors.phoneNumber = "Phone number is invalid";
      } else {
        delete newErrors.phoneNumber;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    let error = {};

    if (!formdata.username) {
      error.username = "Name is required";
    }

    if (!formdata.email) {
      error.email = "Email is required";
    }

    if (!formdata.password) {
      error.password = "Password is required";
    }
    if (!formdata.phoneNumber) {
      error.password = "Phone Number is required";
    }

    setErrors(error);

    if (Object.keys(error).length === 0) {
try{
   const response=await axios.post(`http://localhost:5000/api/signup`,formdata) 
   console.log(response,"data")
 reset();
alert("signup sucessfuly")
}catch(err){

  console.log( "Login failed",err)
}
      
      }
  };

  return (
    <>
        <Navbar/>
      <div className="container-fluid m-5">
        <div className="row shadow p-3 mb-5 bg-body-tertiary rounded">
          <div className="col-md-5">
            <h2 className="text-secondary fw-5 fs-1 text-center">Sign up</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" name="username" maxLength={30} value={formdata.username} onChange={handleChange} />
                {errors.username && (<span className="error">{errors.username}</span>)}
              </div>
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input type="text" className="form-control" name="phoneNumber" value={formdata.phoneNumber} onChange={handleChange} />
                {errors.phoneNumber && (<span className="error">{errors.phoneNumber}</span>)}
              </div>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input type="email" name="email" value={formdata.email} onChange={handleChange} className="form-control" />
                {errors.email && (<span className="error">{errors.email}</span>)}
                <div className="form-text">We'll never share your email with anyone else.</div>
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" name="password" value={formdata.password} onChange={handleChange} className="form-control" />
                {errors.password && (<span className="error">{errors.password}</span>)}
              </div>
              
              <button type="submit" onSubmit={handleSubmit} className="btn btn-primary ml-3">Save</button>
              <a href="/login" className="btn btn-primary login ">Login</a>
            </form>
          </div>
          <div className="col-md-5">
            <img src={image1} alt="img" className="img-fluid" />
          </div>
        </div>
      </div>
      < Footer/>
    </>
  );
};

export default Signuppage;
