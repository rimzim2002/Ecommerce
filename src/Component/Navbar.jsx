import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../Component/images/1293324.png';
import profile from './images/profile.png';
import cart from './images/cart Image.png';
import { useUser } from '../UserContext';

const Navbar = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); 
    setUser(null); 
    navigate('/'); 
  };

  const handleLogin = () => {
    navigate('/login'); 
  };

  return (
    <div className="container-fluid bg-dark text-light">
      <div className="row">
        <div className="col-md-3">
          <img className="watch-logo" src={logo} alt="Logo" />
        </div>
        <div className="col-md-9">
          <nav className="shadow-lg p-3 mb-5 bg-body-dark rounded">
            <div className="nav-buttons d-grid gap-2 d-md-flex justify-content-md-end">
              <h1 className="user-name">Welcome, {user ? user.username : "Guest"}</h1>
              {!user && <Link to="/signup" className="nav-links">Signup</Link>}
              <Link to="/" className="nav-links">Home</Link>
              {user ? (
                <Link className="nav-links" onClick={handleLogout}>Logout</Link>
              ) : (
                <Link to='/login' className="nav-links" onClick={handleLogin}>Login</Link>
              )}
               <Link to="/provider" className="nav-links">Provider</Link>
              {user && (
                <Link to="/profile">
                  <img src={profile} alt="Profile" className="profile-img" style={{ cursor: "pointer" }} />
                </Link>
              )}
              {user?.role===0 &&(  
                <Link to="/cart">
                <img src={cart} alt="Cart" className="profile-img" style={{ cursor: "pointer" }} />
              </Link>
              )}

            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
