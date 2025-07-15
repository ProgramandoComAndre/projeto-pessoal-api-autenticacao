const User = require("../../models/User")
const { UnauthorizedException } = require("../HttpExceptions")

class AuthGuard {

    /**
     * @typedef {object} IUserRepository
     * @property {(id:string) => Promise<User>} findUserById
     */

    /**
     * @typedef {object} TokenPayload
     * @property {string} id
     * @property {string} jti
     */

    /**
     * @typedef {object} ITokenService
     * @property {(token: string) => Promise<TokenPayload>} verify
     */
    /**
     * 
     * @param {IUserRepository} userRepository 
     * @param {ITokenService} tokenService 
     */

    
    constructor({userRepository, tokenService}) {
        this.userRepository = userRepository
        this.tokenService = tokenService
    }

    auth() {
        return async (req, res, next) => {
           try {
            if(!req.headers.authorization) {
                throw new UnauthorizedException("Invalid Token!!")
            }
            const tokenPayload = await this.tokenService.verify(req.headers.authorization.replace("Bearer ", "").trim() || "")
            // validar se o token está na blacklist
            req.user = tokenPayload
            next()
           }
           catch(error) {
               if(error instanceof UnauthorizedException)
                return res.status(error.statusCode).json({message: error.message})

               return res.status(500).json({message: "Internal Server Error", details: error.message})
           }
        }
    }
}

module.exports = AuthGuard