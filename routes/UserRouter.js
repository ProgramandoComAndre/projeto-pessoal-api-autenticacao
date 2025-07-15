const UserController = require("../controllers/UserController")
const {body}= require("express-validator");
const DependencyInjectionUtil = require("../common/DependencyInjection");
const router = require("express").Router()
const userService = DependencyInjectionUtil.getDependency("userService")
const userController = new UserController(userService);

/**
 * @typedef {object} ValidationError
 * @property {string} type.required - Type
 * @property {string} value.required - Value
 * @property {string} msg.required - Error
 * @property {string} path.required - Path
 * @property {string} location.required - Location
 */

/**
 * @typedef {object} ValidationErrors
 * @property {Array<ValidationError>} errors.required - ValidationErrors
 */
/**
 * @typedef {object} RegisterUserDto
 * @property {string} name.required - Name
 * @property {string} email.required - Email
 * @property {string} password.required - Password
 */

/**
 * @typedef {object} RegisterUserResponse
 * @property {string} id.required Id
 * @property {string} name.required - Name
 * @property {string} email.required - Email
 */

/**
 * @typedef {object} ErrorMessage
 * @property {string} message.required Message
 */
/**
 * POST /api/users
 * @tags User
 * @param {RegisterUserDto} request.body.required - User Basic Info
 * @summary Registers a new user
 * @returns {RegisterUserResponse} 200 - User Registered Successfully
 * @returns {ValidationErrors} 400 - Invalid parameters
 * @returns {ErrorMessage} 409 - User Already exists
 */
router.post("/", body("email", "Invalid Email").isEmail(), body("name", "Name must have at least 1 character").isLength({
    min: 1
}),body("password", "Password must have at least 8 characters").isLength({
    min: 8  
}),userController.registerUser())

module.exports = router