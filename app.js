import env from 'dotenv';
env.config();
import connect from './config/database.js';
connect();
import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
import cartRoute from "./routes/cart.js";
import stripeRoute from "./routes/stripe.js";
import categories from "./routes/category.js";
import likes from "./routes/like.js";
import ratingRoute from "./routes/rating.js";
import addressRoute from "./routes/address.js";
import orderDetailRoute from "./routes/orderdetail.js";
import recommendRoute from "./routes/recommend.js";
// import { checkExpired } from './app/http/controllers/post.js';
const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
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
app.use("/api/recommend", recommendRoute)
export default app;
