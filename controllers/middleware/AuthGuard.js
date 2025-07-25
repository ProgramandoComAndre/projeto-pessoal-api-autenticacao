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
           

            if(!req.headers.authorization) {
                throw new UnauthorizedException("Invalid Token!!")
            }
            const tokenPayload = await this.tokenService.verify(req.headers.authorization.replace("Bearer ", "").trim() || "")
            // validar se o token está na blacklist

            const isRevoked = await this.tokenService.isRevoked(tokenPayload.jti)
            if(isRevoked) {
                throw new UnauthorizedException("Token is revoked");
            }
            req.user = tokenPayload
            next()
           
        }
    }
}

module.exports = AuthGuard