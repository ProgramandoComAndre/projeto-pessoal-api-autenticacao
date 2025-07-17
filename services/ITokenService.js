const jwt = require('jsonwebtoken')
const crypto = require("crypto")
const { UnauthorizedException, BadRequestException } = require('../controllers/HttpExceptions')
const { BlacklistToken } = require('../models/BlacklistToken')
class JwtTokenService {
    
    /**
     * 
     * @typedef {object} BlackListTokenRepository
     * @property {(tokenData: BlacklistToken) => Promise<bool>} insertToken
     * @property {(jti:string) => Promise<bool>} tokenExists 
     */

    /**
     * @typedef {object} Service
     * @property {BlackListTokenRepository} blacklistTokenRepository
     */
    /**
     * 
     * @param {Service} param0 
     */
    constructor({blacklistTokenRepository} = {}) {
        this.blacklistTokenRepository = blacklistTokenRepository
    }

    async isRevoked (jti) {
        return this.blacklistTokenRepository.tokenExists(jti)
    } 

    async invalidateToken(tokenData) {
        const tokenExists = await this.blacklistTokenRepository.tokenExists(tokenData.jti)
        if(tokenExists) {
            throw new BadRequestException("You already have logged out")
        }
        const tokenMapped = new BlacklistToken(tokenData.jti, tokenData.id, tokenData.exp)
        return await this.blacklistTokenRepository.insertToken(tokenMapped)
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