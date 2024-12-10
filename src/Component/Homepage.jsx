// 
import { useState, useEffect } from "react";
import axios from "axios";
import watch1 from "../Component/images/watches_PNG9863.png";
import watch2 from "../Component/images/Smart_CrownCollection_D.webp";
import watch3 from "../Component/images/Oct_NewArrivals_D.webp";
import watch4 from '../Component/images/Smart_CrownCollection_D.webp';
import watersplash from "../Component/images/watersplash.png";
import { useUser } from '../UserContext';
import Navbar from "./Navbar";
import Footer from './Footer';
import ImageSlider from "./ImageSlider";



const Homepage = () => {
  const { user } = useUser();
  const images = [watch2, watch3, watch4];
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(6);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productRating, setProductRating] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState(null);

  const fetchProducts = async (page = 1 ) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`http://localhost:5000/api/getallproducts?limit=${limit}&page=${page}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data?.data) {
        setProducts(response.data.data);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const addProduct = async () => {
    const formData = new FormData();
    formData.append('product_name', productName);
    formData.append('product_price', productPrice);
    formData.append('product_rating', productRating);
    formData.append('product_description', productDescription);
    if (productImage) {
      formData.append('product_image', productImage);
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://localhost:5000/api/addproducts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setProducts([...products, response.data.data]);
    } catch (err) {
      console.error("Error adding product:", err.message);
      alert("Fill all the sections to add the product ")
    }
  };

  const deleteHandle = async (_id) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error("No token found. Please login again.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/deleteproduct/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== _id)
      );
    } catch (err) {
      console.error("Error deleting product:", err.response ? err.response.data : err.message);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="bg-dark text-light">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <h1 className="main-heading">Custom Watches</h1>
              <p className="sub-heading">for any occasion</p>
              <button className="button-shop-now">Shop Now</button>
            </div>
            <div className="col-md-4">
              <img className="img-fluid watch" src={watch1} alt="watch" />
              <div>
                <img className="watersplash" src={watersplash} alt="splash" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Slider */}
      <div className="container-fluid">
        <div className="row bg-black">
          <ImageSlider images={images} />
        </div>
      </div>

      {/* Add Product Form */}
      {user?.role === 1 && (
        <div className="container mt-5">
          <h3>Add a New Product</h3>
          <div className="row">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <input
                type="number"
                className="form-control"
                placeholder="Product Price"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-4">
              <input
                type="number"
                className="form-control"
                placeholder="Product Rating"
                value={productRating}
                onChange={(e) => setProductRating(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <textarea
                className="form-control"
                placeholder="Product Description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <input
                type="file"
                className="form-control"
                onChange={(e) => setProductImage(e.target.files[0])}
              />
            </div>
          </div>
          <button className="Button-addProduct" onClick={addProduct}>Add Product</button>
        </div>
      )}

      {/* Products Section */}
      <div className="container-fluid w-auto bg-dark">
        <h3 className="text-light">Available Products</h3>
        <div className="row">
          {products.map((product, index) => (
            <div className="col-md-4 d-flex justify-content-center mb-4" key={index}>
              <div className="card" style={{ width: "18rem" }}>
                <img
                  src={`http://localhost:5000/${product.product_image || "default.png"}`}
                  className="card-img-top img-fluid"
                  alt={product.product_name || "Default Product"}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.product_name || "No Name"}</h5>
                  <p className="card-text">{product.product_description || "No Description"}</p>
                  <p className="fw-bold">Rating: {product.product_rating || "N/A"}</p>
                  <p className="fw-bold">Price: ₹{product.product_price || "N/A"}</p>
                  <a href={`/productreview/${product._id}`} className="btn btn-primary">

                    Show     </a>
                  {user?.role === 1 && (
                    <>
                      <button
                        className="btn btn-danger m-2"
                        onClick={() => deleteHandle(product._id)}
                      >
                        Delete
                      </button>
                      {/* <a href={`/editproduct/${product._id}`} className="btn btn-warning">
          Edit
        </a> */}
                    </>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
        <div className="pagination mt-4">
          <button className="btn btn-secondary me-2" onClick={goToPreviousPage} disabled={currentPage === 1} > Previous</button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button key={index} className={`btn ${currentPage === index + 1 ? 'btn-warning' : 'btn-light'} me-2`} onClick={() => setCurrentPage(index + 1)}>
              {index + 1}
            </button>
          ))}
          <button
            className="btn btn-secondary"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Homepage;
