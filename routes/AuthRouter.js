const DependencyInjectionUtil = require("../common/DependencyInjection");
const AuthController = require("../controllers/AuthController")
const {body}= require("express-validator");

const router = require("express").Router()
const authService = DependencyInjectionUtil.getDependency("authService")
const authGuard = DependencyInjectionUtil.getDependency("authGuard")
const authController = new AuthController(authService);

/**
 * @typedef {object} LoginDto
 * @property {string} email.required - Email
 * @property {string} password.required - Password
 */

/**
 * @typedef {object} LoginResponse
 * @property {string} id.required Id
 * @property {string} name.required - Name
 * @property {string} email.required - Email´
 * @property {string} token.required - Token
 */

/**
 * @typedef {object} ErrorMessage
 * @property {string} message.required Message
 */
/**
 * POST /api/auth
 * @tags Auth
 * @param {LoginDto} request.body.required - User Basic Info
 * @summary Route to login user
 * @returns {LoginResponse} 200 - User Logged Successfully
 * @returns {ErrorMessage} 400 - Invalid Email
 * @returns {ErrorMessage} 404 - User not found
 * @returns {ErrorMessage} 401 - Wrong password
 */


router.post("/",authController.login())
/**
 * GET /api/auth/profile
 * @tags Auth
 * @summary Get user profile by token
 * @returns {LoginResponse} 200 - User Found
 * @returns {ErrorMessage} 401 - Invalid Token!, Expired Token!
 * @security BearerAuth
 */
router.get("/profile", authGuard.auth(), authController.myProfile())
module.exports = router