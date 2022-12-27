import Like from "../app/models/Like.js";
import {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} from './verifyToken.js'


import { Router } from "express";
const router = Router();;

//CREATE

router.post("/", async (req, res) => {
  const newLike = new Like(req.body);
  try {
    const saveLike = await newLike.save();
    res.status(200).json(saveLike);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
    const productId = req.body.productId
    try {
      await Like.findByIdAndDelete(req.params.id);
      res.status(200).json("Like has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //CHECK
  router.post("/findOne", async (req, res) => {
    const userId = req.body.userId
    const productId = req.body.productId
    try {
      const like = await Like.findOne({ userId: userId, productId: productId});
      res.status(200).json(like);
    } catch (err) {
      res.status(500).json(err);
    }
  });

export default router;