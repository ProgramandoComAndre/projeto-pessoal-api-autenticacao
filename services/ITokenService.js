const jwt = require('jsonwebtoken')
const crypto = require("crypto")
const { UnauthorizedException, BadRequestException } = require('../controllers/HttpExceptions')
const { BlacklistToken } = require('../models/BlacklistToken')
const { RefreshToken } = require('../models/RefreshToken')

class JwtTokenService {
    
    /**
     * 
     * @typedef {object} BlackListTokenRepository
     * @property {(tokenData: BlacklistToken) => Promise<bool>} insertToken
     * @property {(jti:string) => Promise<bool>} tokenExists 
     */

    /**
     * 
     * @typedef {object} RefreshTokenRepository
     * @property {(tokenData: RefreshToken) => Promise<bool>} insertToken
     * @property {(token:string) => Promise<RefreshToken>} findByToken 
     */
    

    /**
     * @typedef {object} Service
     * @property {BlackListTokenRepository} blacklistTokenRepository
     * @property {RefreshTokenRepository} refreshTokenRepository
     */
    /**
     * 
     * @param {Service} param0 
     */
    constructor({blacklistTokenRepository,refreshTokenRepository} = {}) {
        this.blacklistTokenRepository = blacklistTokenRepository
        this.refreshTokenRepository = refreshTokenRepository
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

    async invalidateRefreshToken(token) {
        const tokenExists = await this.refreshTokenRepository.findByToken(token)
        if(!tokenExists) {
            throw new BadRequestException("You already have logged out")
        }

        if(tokenExists.active == 0) {
            throw new BadRequestException("You already have logged out")
        }
        tokenExists.invalidateToken()
        await this.refreshTokenRepository.updateToken(tokenExists)
    }
    async sign(id) {
        const jti = crypto.randomUUID()
        const payload = { id, jti }
        const token = jwt.sign(payload, "test_secret", { expiresIn: "1d"})
        return token
    }
    async createNewTokenPair(userId) {
        const accessToken = await this.sign(userId)
        const refreshToken = await this.generateRefreshToken(userId)
        return { accessToken, refreshToken }
    }
    async generateRefreshToken(userId) {
        const token = crypto.randomUUID()
        const hoje = new Date();
        const expires = new Date(hoje);
        expires.setFullYear(hoje.getFullYear() + 1);
        const timestampUnix = Math.floor(expires.getTime() / 1000);

        const payload = { userId, token, expires: timestampUnix }

        const refreshToken = new RefreshToken(payload.token, payload.userId, payload.expires, 1)
        await this.refreshTokenRepository.insertToken(refreshToken)
        return refreshToken.token
    }

    async renewToken(refreshToken) {
        const refreshTokenExists = await this.refreshTokenRepository.findByToken(refreshToken)
        if(!refreshTokenExists) {
            throw new UnauthorizedException("Login again")
        }

        if(refreshTokenExists.active == 0) {
            throw new UnauthorizedException("Login again")
        }
        const unixTimestamp = Math.floor(new Date().getTime() / 1000)
        if(unixTimestamp > refreshTokenExists.expires) {
            throw new UnauthorizedException("Login again")
        }

        const accessToken = await this.sign(refreshTokenExists.userId)
        return accessToken
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