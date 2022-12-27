import Rating from "../app/models/Rating.js";
import {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} from './verifyToken.js'


import { Router } from "express";
const router = Router();;

//CREATE

router.post("/", async (req, res) => {
  const newRating = new Rating(req.body);
  try {
    const saveRating = await newRating.save();
    res.status(200).json(saveRating);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET

router.get("/find/:productId", async (req, res) => {
    try{
      var query = { sold: -1 };
      const rating = await Rating.find({productId: req.params.productId}).sort(query)
      res.status(200).json(rating)
    } catch(err) {
      res.status(500).json(err)
    }
  })

// //DELETE
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