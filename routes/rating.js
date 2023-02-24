import Rating from "../app/models/Rating.js";
import Product from "../app/models/Product.js";
import User from "../models/User.js";
import {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} from './verifyToken.js'


import { response, Router } from "express";
const router = Router();;
import fs from 'fs'
import fastcsv from 'fast-csv'

const handleWriteFileUser = async () => {
	const ws = fs.createWriteStream("/Users/toantran/Downloads/DOAN_2/shopapi/data/ratings.csv");
    try {
        let users = await Rating.find()
        console.log(users)
        const lines = users.map(({_id, productId,rating, userId}) => `${_id.toString()},${productId},${Number(rating)},${userId}`).join('\n');
        console.log("data: ", lines);

        ws.write('_id,productId,rating,userId\n')
        ws.write(lines)
        ws.end()

    } catch(e) {
        console.log(e);
    }
}

//fake data

const fakedata = async () => {
  console.log("help you");
    try {
        let ratings = await Rating.find()
        let users = await User.find()
        let products = await Product.find()
        for (let i = 0; i < 150; i++) {
          let userid = users[i]._id.toString()
          for (let j = 0; j < products.length; j++) {
            let productid = products[j]._id.toString()
            let ratingnumber = getRndInteger(1,5)
            const newrating = new Rating({
              productId: productid,
              userId: userid,
              rating: ratingnumber,
              response: "Hay qua"
            })
            await newrating.save()
            // handleWriteFileUser()
          }
        }

    } catch(e) {
        console.log(e);
    }
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}


//CREATE

router.post("/", async (req, res) => {
  const newRating = new Rating(req.body);
  try {
    const saveRating = await newRating.save();
    // fakedata()
    handleWriteFileUser()
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