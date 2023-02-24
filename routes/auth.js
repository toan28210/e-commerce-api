import { Router } from "express";
const router = Router();;
import User from "../models/User.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import fs from 'fs'
import fastcsv from 'fast-csv'

const fakedata = async () => {
      try {
          for (let i = 0; i < 200; i++) {
            let username1 = "User"+i
            let password = CryptoJS.AES.encrypt("1234567a", process.env.PASS_SEC)
            let email1 = "User"+i+"@gmail.com"
            const newUser = new User({
                username: username1,
                email: email1,
                password: password,
            })
            await newUser.save()
          }
  
      } catch(e) {
          console.log(e);
      }
  }
  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

const handleWriteFileUser = async () => {
	const ws = fs.createWriteStream("/Users/toantran/Downloads/DOAN_2/shopapi/data/users.csv");
    try {
        let users = await User.find()
        console.log(users)
        const lines = users.map(({_id, username, password, email, isAdmin }) => `${_id.toString()},${username},${password},${email},${isAdmin}`).join('\n');
        console.log("data: ", lines);

        ws.write('_id,email,password,phone,username\n')
        ws.write(lines)
        ws.end()

    } catch(e) {
        console.log(e);
    }
}


//REGISTER
router.post("/register", async (req, res)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC),
    })
    try{
        const saveUser = await newUser.save()
        // fakedata()
        handleWriteFileUser()

        res.status(201).json(saveUser)
        // console.log(saveUser)
    }catch(e){
        res.status(500).json(e)
    }
})

//LOGIN

router.post("/login" , async (req, res) => {
    try{
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(401).json("Wrong credentials!");

        const accessToken = jwt.sign(
            {
            id: user._id,
            isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: "3d"}
        )

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        )

        const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8)

        if(Originalpassword !== req.body.password ) return res.status(401).json("Wrong credentials!")

        const {password, ...others} = user._doc;

    return res.status(200).json({...others, accessToken})

    }catch(e) {
        return res.status(500).json(e)
    }
})

//Logout

router.post("/logout" , async (req, res) => {
    try{
        const user = await User.findOne({username: req.body.username});
        !user && res.status(401).json("Wrong credentials!")

        const accessToken = jwt.sign(
            {
            id: user._id,
            isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: "3d"}
        )

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        )

        const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8)

        Originalpassword !== req.body.password && res.status(401).json("Wrong credentials!")

        const {password, ...others} = user._doc;

    res.status(200).json({...others, accessToken})

    }catch(e) {
        res.status(500).json(e)
    }
})


export default router;
