import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

export const Productreview = () => {
  const { _id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const navigate = useNavigate(); 
  const token = localStorage.getItem('authToken'); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/getproduct/${_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(response.data.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProduct();
  }, [_id, token]);

  // Add to Cart Functionality
  const addToCart = async () => {
    try {
      if (token) {
        const data = { productId: _id, product_quantity: productQuantity };
        await axios.post('http://localhost:5000/api/addtocart', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Product added to cart successfully!");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error.response?.data || error.message);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className='container shadow-lg p-3 mb-5 bg-body-dark rounded product-section mt-5 '>
        <div className='row bg-black' style={{ height: '50px' }}></div>
        <div className='row'>
          <div className='col-md-7'>
            <img src={`http://localhost:5000/${product.product_image}`} alt="Product" className='product-view' />
          </div>
          <div className='col-md-5 mt-5'>
            <h1>{product.product_name}</h1>
            <h6>{product.product_description}</h6>
            <h3>Price: ₹{product.product_price}</h3>
            <h5>Quantity</h5>
            <input
              type="number"
              min="1"
              value={productQuantity}
              onChange={(e) => setProductQuantity(Number(e.target.value))}
            />
            <div className='product-buttons mt-4'>
              {token ? (
                <button className='btn btn-secondary' onClick={addToCart}>
                  Add to Cart
                </button>
              ) : (
                <button className='btn btn-primary' onClick={handleLoginRedirect}>
                  Login to Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Productreview;
