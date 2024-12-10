import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const OrderSummary = () => {
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;

  if (!orderDetails) {
    return <div className="text-center mt-5 text-danger fs-4">No order details found!</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="text-center mb-4 text-primary">Order Summary</h2>
        <div className="card shadow-lg p-4 rounded border-0 bg-light">
          <div className="card-body">
            <h5 className="fw-bold text-dark">Order Details</h5>
            <hr />
            <p className="mb-2"><strong>Order ID:</strong> {orderDetails._id}</p>
            <p className="mb-2"><strong>Total Price:</strong> ₹{orderDetails.price}</p>
            <p className="mb-2"><strong>GST:</strong> ₹{orderDetails.gst}</p>
            <p className="mb-2"><strong>Grand Total:</strong> ₹{orderDetails.grand_total}</p>
          </div>
          <div className="card-body">
            <h5 className="fw-bold text-dark">Products</h5>
            <hr />
            <ul className="list-group">
              {orderDetails.productId.map((product) => (
                <li
                  key={product._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{product.product_name}</strong>
                  </div>
                  <span className="badge bg-primary rounded-pill">₹{product.product_price}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-body">
            <h5 className="fw-bold text-dark">Order Status</h5>
            <hr />
            <p
              className={`fs-5 fw-bold ${
                orderDetails.order_status === 0 ? 'text-warning' : 'text-success'
              }`}
            >
              {orderDetails.order_status === 0 ? 'Pending' : 'Completed'}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderSummary;
