const { BadRequestException, ConflictException } = require("./HttpExceptions")
const {users} = require("./db/db")
const User = require("../models/User")
const {matchedData, validationResult} = require('express-validator')
class UserController {

    /**
     * @typedef {object} IUserService
     * @property {(user: {name:string, email:string, password: string}) => Promise<void>} registerUser
     */
    /**
     * 
     * @param {IUserService} userService
     */
    constructor(userService) {
        this.userService = userService
    }

/**
 * Registers a new user.
 * 
 * @returns {Function} Express middleware function that handles user registration
 * and sends a JSON response with a success message.
 */

    /**
     * Registers a new user.
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * 
     * @returns {Object} Express middleware function that handles user registration
     * and sends a JSON response with a success message.
     */
    registerUser() {
        return async(req, res) => {
            try {
            const result = validationResult(req)
            if(!result.isEmpty())
                return res.status(400).json({errors: result.array()})
            const data = matchedData(req);
            
            const newUser = await this.userService.registerUser(data)
            const registerUserResponse = {id: newUser.id, name: newUser.name, email: newUser.email}
            return res.status(200).json(registerUserResponse)
           
        }
         catch(ex) {
            if(ex instanceof BadRequestException) {
                return res.status(ex.statusCode).json({message: ex.message})
            }
            else if(ex instanceof ConflictException) {
                return res.status(ex.statusCode).json({message: ex.message})
            }
            else if(ex instanceof Error){
                return res.status(500).json({message: "Internal Server Error", details: ex.stack})
            }
         }
        }
    }
}

module.exports = UserController