const studentHelper = require("../helpers/studentHelper");
const ErrorResponse = require("../classes/errorResponse");

const NODE_ENV = process.env.NODE_ENV || "development";
const ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE || 86400000; // 1 day

/**
 * Login for Student with some credential
 * @method POST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const login = (req, res, next) => {
  const { email, password } = req.body;
  studentHelper
    .login(email, password)
    .then((result) => {
      res.cookie("AccessToken", result.token, {
        httpOnly: true,
        secure: NODE_ENV === "production" ? true : false,
        expires: new Date(new Date().getTime() + parseInt(ACCESS_TOKEN_EXPIRE)),
        sameSite: "strict",
      });
      res.cookie("AccessSession", true, {
        httpOnly: true,
        expires: new Date(new Date().getTime() + parseInt(ACCESS_TOKEN_EXPIRE)),
      });
      res.status(200).json({
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      return next(new ErrorResponse(err.message, 403));
    });
};

/**
 * Activation token
 * @method PUT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const activateAccount = (req, res, next) => {
  const { token, password } = req.body;
  studentHelper
    .activateAccount(token, password)
    .then((result) => {
      res.status(200).json({
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      return next(
        new ErrorResponse(err.message, err.statusCode || 400, err.code)
      );
    });
};

/**
 * Resent Activation token
 * @method PUT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const resentActivationToken = (req, res, next) => {
  studentHelper
    .resentActivationToken(req.body.email)
    .then((result) => {
      res.status(200).json({
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      return next(
        new ErrorResponse(err.message, err.statusCode || 400, err.code)
      );
    });
};

module.exports = { login, activateAccount, resentActivationToken };
