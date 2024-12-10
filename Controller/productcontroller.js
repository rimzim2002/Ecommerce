import Product from "../Model/Products.js";
import User from "../Model/User.js";


const addProduct = async (req, res) => {
    try {
        const userId = req.user._id
        const isUserExist = await User.findById(userId)

        if (!isUserExist) {
            return res.status(400).json({ status: 400, message: "User does't Exist" });
        }
        const {
            product_name,
            product_price,
            product_rating,
            product_description
        } = req.body;

        let image;
        if (req.file) {
            image = `public/${req.file.filename}`;
        }
        // console.log(file)
        // const userId = req.user?._id;

        const createdProduct = await Product.create({
            product_name,
            product_price,
            product_rating,
            product_image: image,
            product_description,
            userId
        });

        return res.status(201).json({ status: 201, message: "Product created", data: createdProduct });

    } catch (err) {
        return res.status(500).json({ status: 500, message: "Something went wrong", data: err.message });
    }
};
const updateProduct = async (req, res) => {
    try {
        const userId = req.user._id
        const isProductExist = await Product.findById(userId);
        if (req.file) {
            req.body.image = `public/${req.file.filename}`;
        }
        if (!isProductExist) {
            return res.status(404).json({ status: 404, message: "Product does not exist" });
        }
        const updatedProduct = await Product.findByIdAndUpdate(userId, { $set: { ...req.body } }, { new: true });

        return res.status(200).json({ status: 200, message: "Product updated successfully", data: updatedProduct });

    } catch (err) {
        return res.status(500).json({
            status: 500, message: "Something went wrong", error: err.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { _id } = req.params;
        const isProductExist = await Product.findByIdAndDelete(_id);
        if (!isProductExist) {
            return res.status(404).json({ status: 200, message: "Product not found" });
        }
        return res.status(200).json({ status: 200, message: "Product deleted successfully" });
    } catch (err) {
        return res.status(500).json({ status: 500, message: "Something went wrong", error: err.message });
    }
};

const getMyProducts = async (req, res) => {
    try {
        const userId = req.user._id;
        const products = await Product.find({ userId });

        if (!products.length) {
            return res.status(200).json({ status: 200, message: "No products found" });
        }

        return res.status(200).json({ status: 200, message: "My products retrieved", data: products });
    } catch (err) {
        return res.status(500).json({ status: 500, message: "Something went wrong", error: err.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const { page, limit } = req.params
        console.log(req.query.page, req.query.limit, req.query,'limit');

        const products = await Product.find().limit(req.query.limit * 1).skip((req.query.page - 1) * req.query.limit).exec();
        const count = await Product.countDocuments();

        if (!products.length) {
            return res.status(200).json({ status: 200, message: "No products found" });
        }

        return res.status(200).json({
            status: 200, message: "All products retrieved", data: products, totalPages: Math.ceil(count /req.query.limit), Count: count,
            currentPage: page
        });
    } catch (err) {
        return res.status(500).json({ status: 500, message: "Something went wrong", error: err.message });
    }
};

const getProduct = async (req, res) => {
    try {
        const { _id } = req.params;
        const product = await Product.findById(_id);

        if (!product) {
            return res.status(404).json({ status: 404, message: "Product not found" });
        }

        return res.status(200).json({ status: 200, message: "Product retrieved", data: product });
    } catch (err) {
        return res.status(500).json({ status: 500, message: "Something went wrong", error: err.message });
    }
};


export { addProduct, updateProduct, deleteProduct, getMyProducts, getAllProducts, getProduct };
