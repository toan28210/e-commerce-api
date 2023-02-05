import Cart from "../app/models/Cart.js"
import {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} from './verifyToken.js'
import { Router } from "express";
const router = Router();;

//CREATE
router.post("/", async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", async (req, res) => {
  try {
    console.log(req.params.id)
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});
//Delete all cart 
router.delete("/:user_id", async (req, res) => {
  try {
    await Cart.deleteMany({userId: req.params.user_id})
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err)
  }
});

//DELETE
router.delete("/find/:id", async (req, res) => {
  try {
    await Cart.deleteOne({_id: req.params.id});
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER CART
router.get("/find/:userId", async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL

router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});
//CHECK
router.post("/check", async (req, res) => {
  const userId = req.body.userId
  const productId = req.body.productId
  try {
    const cart = await Cart.findOne({ userId: userId, productId: productId});
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;