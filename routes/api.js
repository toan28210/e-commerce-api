import express from 'express';
const router = express.Router();
import passport from '../config/passport.js';
import * as userController from '../app/http/controllers/user.js';
import * as followController from '../app/http/controllers/follow.js';
import * as postController from '../app/http/controllers/post.js';
import * as helperController from '../app/http/controllers/helper.js';
import * as commentController from '../app/http/controllers/comment.js';
import * as subjectController from '../app/http/controllers/subject.js';
import * as groupController from '../app/http/controllers/group.js';
import * as paymentController from '../app/http/controllers/payment.js';
import verifyToken from '../app/http/middlewares/auth.js';
import auth from './auth.js';

// Đăng ký
  router.post('/signup', userController.userValidator, userController.createAccount);
  // router.post('/signup', userController.signup);

// Đăng nhập 
  router.post('/login', auth);
  // router.get('/login/google',
  //   passport.authenticate('google', { scope: ['profile', 'email'] })
  // );
  // router.get('/auth/google/callback',
  //   passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
  //   function (req, res) {
  //     res.status(200).json({ success: true, message: 'Login success' });
  //   });
  // router.get('/login/facebook',
  //   passport.authenticate('facebook', { scope: ['email'] })
  // );
  // router.get('/auth/facebook/callback',
  //   passport.authenticate('facebook', { failureRedirect: '/login', failureMessage: true }),
  //   function (req, res) {
  //     res.status(200).json({ success: true, message: 'Login success' });
  //   });

// Quên mật khẩu
  // router.get('/sendmailForget',
  //   function (req, res) {
  //     res.json({ message: "Sended" });
  //   });
  router.post('/sendmailForget', userController.sendmailFogot);
  router.post('/sendmailForget/confirm', userController.updatePassword);

// Đăng xuất
  router.post('/logout', (req, res) => {
    return res.status(200).json({message: "Đăng xuất thành công!"});
  });

// User
  router.get('/user/info/:id', verifyToken, [userController.userInfo]); // get one
  router.get('/user/info', verifyToken, [userController.userInfo]); // get one
  router.post('/user/:id/edit', verifyToken, userController.editAccount); // update user
  router.post('/user/:id/block', verifyToken, userController.blockUser); // block user
  router.put('/user/:id/follow', verifyToken, followController.follow); // block user

// Admin
  router.get('/users', verifyToken, userController.getAllUser); // get all user for admin
  router.get('/user/:id/info', verifyToken, [userController.userInfoForAd]); // get one for admin 
  router.get('/posts/admin', verifyToken, postController.listPostForAd); // get all post for admin
  router.get('/post/:id/admin', verifyToken, postController.detailPostForAd); // get one for admin 
  router.post('/post/:id/block', verifyToken, postController.blockPost); // block post

// Post 
  router.get('/posts', postController.listPost); // get all post 
  router.get('/post/:id', verifyToken, postController.detailPost); // get one 
  router.get('/post/:id/vote', verifyToken, postController.vote); // function vote
  router.post('/post/new', verifyToken, postController.createPost); // create post 
  router.put('/post/:id/edit', verifyToken, postController.editPost); // update post
  router.delete('/post/:id', verifyToken, postController.deletePost); // delete post

// Helper

// Payment
  router.post('/deposit', verifyToken, paymentController.depositCoins); // gửi req deposit coins
  router.get('/payments', verifyToken, paymentController.listPayment); // get all payments
  router.get('/paymentouts', verifyToken, paymentController.listPaymentOut); // get all paymentouts
  router.get('/payment/:id', verifyToken, paymentController.detailPayment); // get one
  router.post('/withdraw', verifyToken, paymentController.withdrawCoins); // gửi req withdraw coins
  router.get('/withdraw/:id', verifyToken, paymentController.confirmReq); // get one
  router.post('/notify', paymentController.processTransaction); // callback

// Comment
  router.put('/post/:id/comment', verifyToken, commentController.createComment); // create comment
  router.put('/post/:id/comment/:commentId/edit', verifyToken, commentController.editComment); // update comment
  router.get('/post/:id/vote/:commentId', verifyToken, commentController.vote);
  router.put('/post/:id/comment/:commentId/markCorrect', verifyToken, userController.markCorrectAnswer, paymentController.createPaymentInCoins, paymentController.createPaymentOutCoins, 
  function (req, res) {
    if(req.helper.resultCode == 0 && req.owner.resultCode == 0){
      res.json({ message: "Đánh dấu câu trả lời đúng thành công!" });
    }
  }); // mark correct answer
  router.delete('/post/:id/comment/:commentId', verifyToken, commentController.deleteComment); // delete comment

// Group
  router.get('/groups', groupController.listGroup); // get all group
  router.get('/groups', verifyToken, groupController.listGroupForAd); // get all group
  router.get('/group/:id', verifyToken, groupController.detailGroup); // get one group
  router.post('/group/new', verifyToken, groupController.createGroup); // create group
  router.put('/group/:id/edit', verifyToken, groupController.editGroup); // update group
  router.delete('/group/:id', verifyToken, groupController.deleteGroup); // delete group

// Add Subject, add User to Group
  router.put('/subject/join', verifyToken, subjectController.createSubject); // add user vào group
  router.put('/subject/:id/edit', verifyToken, subjectController.editSubject); // update group & user
  router.delete('/subject/:id', verifyToken, subjectController.deleteSubject); // delete user trong group & ngược lại 


export default router;
