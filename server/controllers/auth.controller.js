import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import User from '../models/user.model';

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) return next(err);

    if (user) {
      console.log('Here0');
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) return next(err);

        if (isMatch) {
          console.log('here2');
          const token = jwt.sign({
            username: user.username
          }, config.jwtSecret);
          return res.json({
            token,
            username: user.username
          });
        }
        else return next(err);
      });
    }
  });
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

export default { login, getRandomNumber };
