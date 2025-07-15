const jwt = require('jsonwebtoken')
const crypto = require("crypto")
const { UnauthorizedException } = require('../controllers/HttpExceptions')
class JwtTokenService {
    /**
     * 
     * @param {string} id 
     */

    constructor({} = {}) {

    }
    async sign(id) {
        const jti = crypto.randomUUID()
        const payload = { id, jti }
        const token = jwt.sign(payload, "test_secret", { expiresIn: "1d"})
        return token
    }

     /** 
     * @param {string} token 
     * @returns {TokenPayload}
     * @throws {UnauthorizedException}
     */
    async verify(token) {
        try {
            const payload = jwt.verify(token, "test_secret")
            return payload
        }
        catch(error) {
            if(error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedException("Expired token!")
            }
            else if(error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedException("Invalid token! Login again!!")
            }
            else {
                throw error
            }
        }
    }
    
    /**
     * @typedef {object} TokenPayload
     * @property {string} id
     * @property {string} jti
     */
}

module.exports = JwtTokenService