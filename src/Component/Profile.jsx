import React from 'react';
import { useUser } from '../UserContext';
import profileimage from '../Component/images/profileimage.png';
import Navbar from './Navbar';
import Footer from './Footer';
import { useEffect,useState } from 'react';
import axios from 'axios';
export const Profile = () => {
  const [orders,setOrders]=useState([])
  const { user } = useUser();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5000/api/getMyAllOrders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data, "orders");
        setOrders(response.data.data);
      } catch (err) {
        console.error(err.message, "Something went wrong");
      }
    };
  
    fetchOrders();
  }, []);
  
  return (
    <>
      <Navbar />
      <div
        className="container-fluid min-vh-100 p-5"
        style={{
          backgroundColor: '#000',
          color: '#fff',
        }}
      >
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center align-items-center mb-4">
            <div
              className="card shadow-lg border-0 rounded-4 text-white"
              style={{
                width: '28rem',
                backgroundColor: '#1a1a1a',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
            >
              <img
                src={profileimage}
                className="card-img-top rounded-top"
                alt="Profile"
                style={{ borderBottom: '2px solid #fff' }}
              />
              <div className="card-body text-center">
                <h3 className="card-title text-info fw-bold">My Profile</h3>
              </div>
              <div className="profile-details px-4 pb-4">
                <div className="d-flex justify-content-between border-bottom border-light py-2">
                  <span className="fw-bold text-dark">Name:</span>
                  <span className='text-dark'>{user?.username || 'N/A'}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom border-light py-2">
                  <span className="fw-bold text-dark">Email:</span>
                  <span className='text-dark'>{user?.email || 'N/A'}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom border-light py-2">
                  <span className="fw-bold text-dark">Phone:</span>
                  <span className='text-dark'>{user?.phoneNumber || 'N/A'}</span>
                </div>
              </div>
              <div className="text-center mb-3">
                <button className="btn btn-outline-info px-4">Back</button>
              </div>
            </div>
          </div>

          <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
            <div
              className="card shadow-lg rounded-4 mb-4 text-white"
              style={{
                width: '24rem',
                backgroundColor: '#2a2a2a',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
            >
<div className="container-fluid">
  <h4 className="text-info fw-bold">Orders</h4>
  <p className="text-dark">Total Orders: {orders.length}</p>
  {orders.length > 0 ? (
    orders.map((order, id) => (
      <div key={order._id} className="card mb-3 text-dark" style={{ backgroundColor: '#e0e0e0' }}>
        <div className="card-body">
          <h5 className="card-title text-info">Order #{id + 1}</h5>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Total Products:</strong> {order.productId.length}</p>
          <p><strong>GST:</strong> ₹{order.gst.toFixed(2)}</p>
          <p><strong>Grand Total:</strong> ₹{order.grand_total.toFixed(2)}</p>
        </div>
      </div>
    ))
  ) : (
    <p className="text-light">No orders found.</p>
  )}
</div>

            </div>

            <div
              className="card shadow-lg rounded-4 text-white"
              style={{
                width: '24rem',
                backgroundColor: '#2a2a2a',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
            >
              <div className="card-body text-center">
                <h4 className="text-info fw-bold">Cart</h4>
                <p className="text-dark">Check your cart items</p>
                <a href="/cart" className="btn btn-outline-info mt-3 px-4">
                  Go to Cart
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style>
        {`
          .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
          }
        `}
      </style>
    </>
  );
};

export default Profile;