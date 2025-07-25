const { BadRequestException, NotFoundException, UnauthorizedException } = require("./HttpExceptions")
const {users} = require("./db/db")
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
     * @property {(id:string) => Promise<{id: string,name: string,email:string}>} myProfile
     * @property {(tokenData:any) => Promise<bool>} logout 
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
        return async(req, res, next) => {
            const { email, password } = req.body
            const loginResponse = await this.authService.login({email, password})
            return res.status(200).json(loginResponse)
           
        
         
        }
    }

     myProfile() {
        return async (req, res, next) => {

            try {
                const {id} = req.user
                const user = await this.authService.myProfile(id)
                const result = {id: user.id, name: user.name, email: user.email}
                return res.status(200).json(result)
            }
            catch(error) {
                if(error instanceof NotFoundException) {
                    return res.status(error.statusCode).json({message: error.message})
                }
                return res.status(500).json({message: "Internal Server Error", details: error.message})
            }

        } 
    }
    logout() {
        return async(req, res, next) => {
            
                const tokenData = req.user
                const {refreshToken} = req.body
                const result = await this.authService.logout(tokenData, refreshToken)
             return res.status(200).json({success: true, message: "Logout successfully"})
            
            
        }
    }

    refreshToken() {
        return async(req, res, next) => {
            
               const {refreshToken} = req.body
               const result = await this.authService.refreshNewToken(refreshToken)
               return res.status(200).json(result) 
            
            
        }
    }
}

module.exports = AuthController