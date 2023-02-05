import express from 'express';
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
import cartRoute from "./routes/cart.js";
import cors from "cors";
import stripeRoute from "./routes/stripe.js";
import categories from "./routes/category.js";
import likes from "./routes/like.js";
import ratingRoute from "./routes/rating.js";
import addressRoute from "./routes/address.js";
import orderDetailRoute from "./routes/orderdetail.js";
import recommendRoute from "./routes/recommend.js";

dotenv.config();


mongoose.connect(process.env.MON_URÍ)
.then(() => console.log("DE Successfull"))
.catch((err) => {
    console.log(err);
});
app.use(cors())
app.use(express.json())
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/products",productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);
app.use("/api/categories", categories);
app.use("/api/like", likes);
app.use("/api/rating", ratingRoute);
app.use("/api/address", addressRoute);
app.use("/api/orderdetails", orderDetailRoute);
app.use("/api/orderdetails", orderDetailRoute);
app.use("/api/recommend", recommendRoute)

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is rungning")
})

export default app