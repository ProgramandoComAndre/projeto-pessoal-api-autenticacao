const { BadRequestException, NotFoundException, UnauthorizedException } = require("./HttpExceptions")
const {users} = require("../db/db")
const User = require("../models/User")
const {matchedData, validationResult} = require('express-validator')
class AuthController {

    /**
     * @typedef {object} LoginRequest
     * @property {string} email
     * @property {string} Password
     */

    /**
     * @typedef {object} LoginResponse
     * @property {string} id
     * @property {string} name
     * @property {string} email
     * @property {string} token
     */
    /**
     * @typedef {object} IAuthService
     * @property {(user: LoginRequest) => Promise<LoginResponse>} login
     */
    /**
     * 
     * @param {IAuthService} authService
     */
    constructor(authService) {
        this.authService = authService
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
    login() {
        return async(req, res) => {
            try {
            const { email, password } = req.body
            const loginResponse = await this.authService.login({email, password})
            return res.status(200).json(loginResponse)
           
        }
         catch(ex) {
            if(ex instanceof BadRequestException) {
                return res.status(ex.statusCode).json({message: ex.message})
            }
            else if(ex instanceof NotFoundException) {
                return res.status(ex.statusCode).json({message: ex.message})
            }
            else if(ex instanceof UnauthorizedException) {
                return res.status(ex.statusCode).json({message: ex.message})
            }
            else if(ex instanceof Error){
                return res.status(500).json({message: "Internal Server Error", details: ex.stack})
            }
         }
        }
    }
}

module.exports = AuthController