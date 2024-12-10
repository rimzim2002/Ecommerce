import Product from "../Model/Products.js";
import User from "../Model/User.js";
import Cart from "../Model/Cart.js";
import Order from "../Model/Order.js";
const addCart = async (req, res) => {
    try {
        const userId = req.user._id
        const { productId, product_quantity } = req.body
        let data;
        const isProductExist = await Cart.findOne({ userId, productId })
        if (!isProductExist) {
            data = await Cart.create({
                productId,
                userId,
                product_quantity
            })
        }
        else {
            isProductExist.product_quantity = product_quantity;
            data = await isProductExist.save();
        }
        return res.status(200).json({ status: 200, message: "Product added to cart sucessfully", data: data })

    } catch (err) {
        return res.status(200).json({ status: 500, message: "Something went wrong", data: err.message })

    }
}
const deleteCart = async (req, res) => {
    try {
        const { _id } = req.params;
        const isProductExist = await Cart.findByIdAndDelete(_id);

        if (!isProductExist) {
            return res.status(404).json({ status: 200, message: "Product not found in cart" });
        }

        return res.status(200).json({ status: 200, message: "Product deleted successfully", data: isProductExist });
    } catch (err) {
        return res.status(500).json({ status: 500, message: "Something went wrong", data: err.message });
    }
};

const myCart = async (req, res) => {
    try {
        const userId = req.user?._id;
       let price = 0, total = 0, gst = 0;
        if (!userId) {
            return res.status(400).json({status: 400,message: "User does not exist",});
        }
        const userCart = await Cart.find({ userId }).populate({
            path: "productId", 
            select: "product_name product_size product_price product_rating product_image product_description", 
        });
        for(let cart of userCart){
            price += cart?.productId?.product_price * cart?.product_quantity
        }
        gst = price * 0.18;
        total =price + gst;
        const response = {
            cart: userCart,
            price,
            gst,
            total
        }
        return res.status(200).json({
            status: 200,
            message: "User Cart retrieved successfully",
            data: userCart,
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Something went wrong",
            error: err.message,
        });
    }
};

const updateCart = async (req, res) => {
    try {
        const { _id } = req.params
        const isCartExist = await Cart.findByIdAndUpdate(_id, { $set: { ...req.body } }, { new: true })
        if (!isCartExist) {
            return res.status(200).json({ status: 401, message: "Cart item  does't exist" })
        }
        return res.status(200).json({status: 200, message: "Cart updated successfully", data: isCartExist})
    } catch (err) {
        return res.status(200).json({ status: 500, message: "Something went wrong", data: err.message })

    }
}
const placeOrder = async (req, res) => {
    try {
      const userId = req.user._id;
      let productId = [];
      let price = 0, total = 0, gst = 0;
  
      const userCart = await Cart.find({ userId }).populate({
        path: "productId",
        select: "product_name product_size product_price product_image",
      });
  
      if (!userCart || userCart.length === 0) {
        return res.status(400).json({ message: "Cart is empty. Cannot place order." });
      }
  
      for (let cart of userCart) {
        productId.push(cart.productId);
        price += cart?.productId?.product_price * cart?.product_quantity;
      }
  
      gst = price * 0.18;
      total = price + gst;
  
      const saveOrderDetails = await Order.create({
        productId,
        price,
        gst,
        grand_total: total,
        userId,
        providerId: userCart[0]?.productId?.userId,
      }).then((order) =>
        order.populate('productId', 'product_name product_price product_image')
      );
  
      await Cart.deleteMany({ userId });
  
      return res.status(200).json({ message: "Order Placed", data: saveOrderDetails });
    } catch (err) {
      console.error("Error placing order:", err);
      return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
  };
  

const getMyAllOrders= async(req,res)=>{
    try{
 const userId= req.user._id
const orderList= await Order.find({userId})

return res.status(200).json({status: 200,message: "My Orders", data:orderList })

    }catch(err){
        return res.status(200).json({ status: 500, message: "Something went wrong", data: err.message })

    }
}
const getOrder= async(req,res)=>{
    try{
 const {_id}= req.params
const isOrderExist= await Order.findById(_id)
if(!isOrderExist){
   return res.status(200).json({status: 200,message: "order doesn't Exist"})

}
return res.status(200).json({status: 200,message: " Order", data:isOrderExist })

    }catch(err){
        return res.status(200).json({ status: 500, message: "Something went wrong", data: err.message })

    }
}
 const cancelOrder=async(req,res)=>{
    try{
        const {id}= req.params
      const cancelOdr= await Order.findByIdAndUpdate( id, 
        { $set: { is_order_cancel: 1 } }, { new: true })
      return res.status(200).json({status: 200,message: " Order Cancel",})

    }catch(err){
        return res.status(200).json({ status: 500, message: "Something went wrong", data: err.message })

    }
 }

export { addCart, deleteCart, updateCart, myCart, placeOrder,getMyAllOrders,getOrder,cancelOrder };