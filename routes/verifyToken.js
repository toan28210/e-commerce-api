import jwt from 'jsonwebtoken'
import HTTPStatus from 'http-status';
import env from '../config/config.js'
const { TOKEN_KEY } = env;
const verifyToken = (req, res, next) => {
  const {
    headers: { authorization },
  } = req;
  const token = authorization && authorization.split(' ').pop();
  if (!token) {
    return res
      .status(HTTPStatus.UNAUTHORIZED)
      .json({ message: 'you are not authenticated!' });
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res
      .status(HTTPStatus.UNAUTHORIZED)
      .json({ message: '"Token is not valid!"' });
  }
  return next();
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not alowed to do that!");
      }
    });
  };
  
  const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not alowed to do that!");
      }
    });
  };

  export   {verifyToken,verifyTokenAndAuthorization,
  verifyTokenAndAdmin};