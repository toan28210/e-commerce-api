import Product from "../app/models/Product.js";
import {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} from './verifyToken.js'


import { Router } from "express";
const router = Router();;
import fs from 'fs'
import fastcsv from 'fast-csv'

const handleWriteFileUser = async () => {
	const ws = fs.createWriteStream("/Users/toantran/Downloads/DOAN_2/shopapi/data/products.csv");
    try {
        let users = await Product.find()
        console.log(users)
        const lines = users.map(({_id, amount, title}) => `${_id.toString()},${amount.toString()},${title}`).join('\n');
        console.log("data: ", lines);

        ws.write('_id,desc,title\n')
        ws.write(lines)
        ws.end()

    } catch(e) {
        console.log(e);
    }
}

//CREATE

router.post("/", async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    handleWriteFileUser()
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.patch("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET HOT PRODUCT
router.get("/hot", async (req, res) => {
  try{
    var query = { sold: -1 };
    const product = await Product.find().sort(query)

    res.status(200).json(product)
  } catch(err) {
    res.status(500).json(err)
  }
})

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  const qSearch = req.query.search;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    }else if(qSearch){
      products = await Product.find({ $text: { $search: qSearch } });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;