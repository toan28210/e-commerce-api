import  Address  from "../app/models/Address.js";
import {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} from './verifyToken.js'


import { Router } from "express";
const router = Router();;

//CREATE

router.post("/", async (req, res) => {
  const newAddress = new Address(req.body);
  try {
    const saveAddress = await newAddress.save();
    res.status(200).json(saveAddress);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET

router.get("/find/:userId", async (req, res) => {
  try{
    const address = await Address.find({userId: req.params.userId})
    res.status(200).json(address)
  } catch(err) {
    res.status(500).json(err)
  }
})

router.get("/find/add/:addressId", async (req, res) => {
  try{
    const address = await Address.find({_id: req.params.addressId})
    res.status(200).json(address)
  } catch(err) {
    res.status(500).json(err)
  }
})

router.get("/find/default/:userId", async (req, res) => {
  try{
    const address = await Address.find({userId: req.params.userId, isdefault: true})
    res.status(200).json(address)
  } catch(err) {
    res.status(500).json(err)
  }
})

//UPDATE
router.patch("/:addressId", async (req, res) => {
  try {
    const updatedAddressDefault = await Address.findByIdAndUpdate(
      req.params.addressId,
      {
        $set: { isdefault: req.body.isdefault },
      },
      { new: true }
    );
    res.status(200).json(updatedAddressDefault);
  } catch (err) {
    res.status(500).json(err);
  }
});


//UPDATEs]
router.patch("/user/:userId", async (req, res) => {
  try {
    const updatedAddressDefault = await Address.updateMany(
      {userId: req.params.userId },
      {
        $set: { isdefault: req.body.isdefault }
      },
      { new: true }
    );
    console.log(updatedAddressDefault);
    res.status(200).json(updatedAddressDefault);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
// router.delete("/:id", async (req, res) => {
//     const productId = req.body.productId
//     try {
//       await Like.findByIdAndDelete(req.params.id);
//       res.status(200).json("Like has been deleted...");
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });

//   //CHECK
//   router.post("/findOne", async (req, res) => {
//     const userId = req.body.userId
//     const productId = req.body.productId
//     try {
//       const like = await Like.findOne({ userId: userId, productId: productId});
//       res.status(200).json(like);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });

export default router;