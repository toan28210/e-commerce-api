// import { Router } from 'express';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
// import HTTPStatus from 'http-status';
// import cookieSession from 'cookie-session';
// import User from '../app/models/user.js';
// import env from '../config/config.js';
// import passport from '../config/passport.js';
// const { TOKEN_KEY } = env;
// const router = Router();
// router.use(
//   cookieSession({
//     name: 'project',
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     keys: ['key1', 'key2'],
//   })
// );

// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!(email && password)) {
//       return res.status(HTTPStatus.BAD_REQUEST).send({
//         message:
//           'Vui lòng không để trống thông tin đăng nhập! Bao gồm Email và Mật khẩu!'
//       });
//     }
//     const oldUser = await User.findOne({ email });
//     if (oldUser && (await bcrypt.compare(password, oldUser.password))) {
//       if(oldUser.blocked == true){
//         return res.status(HTTPStatus.OK).json({message:"Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với Quản trị viên để biết thêm thông tin"});
//       }
//       const token = jwt.sign({ user_id: oldUser._id, username: oldUser.username, role:oldUser.role }, TOKEN_KEY, {
//         algorithm: 'HS256',
//         expiresIn: '2h',
//       });
//       const {username,role,createdAt,updatedAt,id,avatar}= oldUser
      
//       return res.status(HTTPStatus.OK).json({email,username,role,id,token,avatar});
//     } 
//     return res.status(HTTPStatus.OK).json({message:"Thông tin đăng nhập không chính xác! Hãy kiểm tra lại Username hoặc Password"});
//   } catch (err) {
//     return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json(err.message);
//   }
// }
// );

// const isLoggedIn = (req, res, next) => {
//   if (req.user) {
//     next();
//   } else {
//     return res.status(HTTPStatus.UNAUTHORIZED).redirect('/login');
//   }
// };

// router.get('/login/failed', (req, res) =>
//   res
//     .status(HTTPStatus.UNAUTHORIZED)
//     .json({ message: 'Đăng nhập không thành công!' })
// );

// export default router;

import { Router } from "express";
const router = Router();;
import User from "../models/User.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";


//REGISTER
router.post("/register", async (req, res)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC),
    })
    try{
        const saveUser = await newUser.save()
        res.status(201).json(saveUser)
        console.log(saveUser)
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
