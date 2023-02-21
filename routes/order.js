import Order from "../app/models/Order.js";
import { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } from './verifyToken.js'

import { Router } from "express";
import OrderDetail from "../app/models/OrderDetail.js";
import Product from "../app/models/Product.js";
const router = Router();;

//CREATE

router.post("/", async (req, res) => {

  const newOrder = new Order(req.body);
  console.log(req.body);


  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER ORDERS
router.get("/find/:userId", async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $match: { userId: req.params.userId }
      },
      {
        "$project": {
          "_id": {
            "$toString": "$_id"
          },
          amount: 1,
          userId: 1,
          status: 1,
          address: 1,
          status: 1
        }
      },
      {
        $lookup: {
          "from": "orderdetails",
          "localField": "_id",
          "foreignField": "orderId",
          "as": "orderDetails"
        },
      },
    ]);
    console.log(orders);
    const a = await Promise.all(
      orders.map(async (element) => {
        if (element.orderDetails) {
         await Promise.all(element.orderDetails.map(async (e) => {
            const product = await Product.findById({ _id: e.productId });
            if (product) {
              e.product=product;
            }
          })
          );
        };
      })
    );

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;