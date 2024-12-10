// 
// import { use } from 'express-parser';
import React, { useState } from 'react'

export const  Practice= () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
   
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
const[data,setData]=useState('')
  

const handleChange=(e)=>{
const{name,value}=e.target;
setFormData({...formData,[name]:value});
setApiError('');
let neweErrors={...errors};
if(name==="email"){
  const trimmedemail= value.trim();
  if(!trimmedemail){
    neweErrors.email="email address is requires"
  }
  else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedemail)){
    neweErrors.email="email is invalid"
  }
  else {
    delete neweErrors.email;
  }
if(name==="password"){
if (!value) {
    errors.password = "Password is required";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData)) {
    errors.password = "Password must be at least 6 characters";
  }

  setErrors(neweErrors)
} }  


  }
  const handleSubmit = async (e) =>{
 e.preventDefault();
 let error={};
 if(!formData.email){
  error.email="email requires"

 } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)){
  error.email="Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one special character"

 }
 if(!formData.password){
  error.password="password required"
 } else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)){
  error.password="Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one special character."

 }
 setErrors(error)
 if (Object.keys(error).length === 0) {
  setData(JSON.stringify(formData));
}
 
}
  
  return (
   <>
<form onSubmit={handleSubmit}>   
   <div>
    <input type="email" onChange={handleChange}name="email" maxLength={30}value={formData.email} placeholder='Enter your email'></input>
    {errors.email && (<span className="error">{errors.email}</span>)}
   </div> 
   <div>
    <input type="password" onChange={handleChange}name="password"value={formData.password} placeholder='Enter your password'></input>
    {errors.password && (<span className="error">{errors.password}</span>)}
   </div>
    <button>Login</button>
   </form>
   {data && <div>Submitted Data: {data}</div>}
   </>
  )
}
export  default Practice;