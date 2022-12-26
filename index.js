const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");
const cors = require("cors");
const stripeRoute = require("./routes/stripe")
const categories = require("./routes/category");
const likes = require("./routes/like");
const ratingRoute = require("./routes/rating");
const addressRoute = require("./routes/address");
const orderDetailRoute = require("./routes/orderdetail");

dotenv.config();


mongoose.connect(process.env.MON_URL)
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

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is rungning")
})