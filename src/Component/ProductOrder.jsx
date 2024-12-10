import React, { useEffect } from 'react'
import axios from 'axios'

export const ProductOrder = () => {
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const response = await axios.get(`http://localhost:5000/api/getMyAllOrders`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        })
        console.log(response.data, "response")
      } catch (err) {
        console.log(err.message, "error")
      }
    }
    fetchOrders() 
  }, [])

  return (
    <>
      <div className='container-fluid shadow-lg'>
      </div>
    </>
  )
}

export default ProductOrder
