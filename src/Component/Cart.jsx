import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';
import dltimg from './images/delete.png';
import { useNavigate } from 'react-router';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5000/api/myCart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const cartData = response.data.data || [];
        setCartItems(cartData);

        // Calculate totals
        let subtotalValue = cartData.reduce(
          (total, item) =>
            item.productId
              ? total + item.productId.product_price * item.product_quantity
              : total,
          0
        );
        const gstValue = subtotalValue * 0.18; // 18% GST
        const grandTotalValue = subtotalValue + gstValue;

        setSubtotal(subtotalValue);
        setGst(gstValue);
        setGrandTotal(grandTotalValue);
      } catch (error) {
        console.error('Error fetching cart data:', error.message);
      }
    };

    fetchCart();
  }, []);

  const handleDelete = async (cartItemId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5000/api/deletecartItem/${cartItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems((prevItems) => prevItems.filter((item) => item._id !== cartItemId));

      const updatedItems = cartItems.filter((item) => item._id !== cartItemId);
      const subtotalValue = updatedItems.reduce(
        (total, item) =>
          item.productId
            ? total + item.productId.product_price * item.product_quantity
            : total,
        0
      );
      const gstValue = subtotalValue * 0.18;
      const grandTotalValue = subtotalValue + gstValue;

      setSubtotal(subtotalValue);
      setGst(gstValue);
      setGrandTotal(grandTotalValue);
    } catch (error) {
      console.error('Error deleting item:', error.message);
    }
  };

  const buyNow = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const data = cartItems.map((item) => ({
        productId: item.productId._id,
        product_quantity: item.product_quantity,
      }));

      const response = await axios.post('http://localhost:5000/api/placeOrder', { products: data }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        alert('Order placed successfully!');
        navigate('/order-summary', { state: { orderDetails: response.data.data } });
      }
    } catch (error) {
      console.error('Error placing order:', error.response?.data || error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container shadow-lg p-3 mb-5 bg-body-dark rounded product-section mt-5">
        <div className="row">
          <div className="col-md-9">
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ? (
              <p className="text-warning">Your cart is empty.</p>
            ) : (
              cartItems.map((item) =>
                item.productId ? (
                  <div
                    key={item._id}
                    className="border-bottom border-5 p-5 m-5 d-flex align-items-center"
                  >
                    <img
                      src={`http://localhost:5000/${item.productId.product_image}`}
                      alt="Product"
                      style={{ height: '150px', width: '150px', marginRight: '15px' }}
                    />
                    <div>
                      <h4 className="cart-product-name">{item.productId.product_name}</h4>
                      <p className="product-description">{item.productId.product_description}</p>
                      <h5 className="cart-product-quantity">
                        Quantity: {item.product_quantity}
                      </h5>
                      <h5 className="cart-product-price">
                        Price: ₹{item.productId.product_price}
                      </h5>
                    </div>
                    <img
                      src={dltimg}
                      alt="delete-icon"
                      className="delete-icon"
                      style={{ height: '20px', width: '20px', cursor: 'pointer' }}
                      onClick={() => handleDelete(item._id)}
                    />
                  </div>
                ) : (
                  <div
                    key={item._id}
                    className="border-bottom border-5 m-5 d-flex align-items-center"
                  >
                    <h4 className="cart-product-name text-danger">
                      Product details are unavailable
                    </h4>
                  </div>
                )
              )
            )}
          </div>

          <div className="col-md-3">
            <div className="bg-dark text-light p-3" style={{ height: '500px' }}>
              <h3>Cart Summary</h3>
              <p>Total Items: {cartItems.length}</p>
              <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
              <p>GST (18%): ₹{gst.toFixed(2)}</p>
              <p>Grand Total: ₹{grandTotal.toFixed(2)}</p>
              {cartItems.length > 0 && (
                <button className="btn btn-primary mt-3" onClick={buyNow}>
                  Buy Now
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

export default Cart;
