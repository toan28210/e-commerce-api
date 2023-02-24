import Product from "../app/models/Product.js";
import {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} from './verifyToken.js'


import { Router } from "express";
import { PythonShell } from "python-shell";
const router = Router();

router.get("/test", async (req, res) => {
    try {
      const product = await Product.find({ _id: { $in: ["62a4c6018f1baabb80f6f8d3", "62a4c57e8f1baabb80f6f8cf"] }});
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json(err);
    }
  });

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

router.get("/:user_id", async (req, resAPI) => {
    const userId = req.params["user_id"]
    PythonShell.run("/Users/toantran/Downloads/DOAN_2/shopapi/python/recommend.py", { args: [userId] }, async (err, res) => {
        if(err) console.log(err);
        if(res) {
            console.log("python")
            console.log("res, ",res)
            const data = res[0];
			      const transformData = data.slice(1, data.length - 5).replace(new RegExp("'", 'g'), "");
            const newData = transformData.split(", ").map(item => String(item) );
            const newData0 = newData[0].split("[").map(item => String(item) );
            console.log("dataNew: ", newData0)
            console.log("newdata:",newData[1])
            try {
                const products = await Product.find({ _id: { $in: [ newData0[5],newData[1], newData[2], ,newData[3], ,newData[4], ,newData[5], ,newData[6], ,newData[7], ,newData[8], ,newData[9]] }});
                resAPI.status(200).json(products);
            } catch (err) {
                resAPI.status(500).json(err);
            }
            
        }
    })
  });


export default router;