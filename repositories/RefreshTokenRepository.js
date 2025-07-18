const { DataSource } = require("typeorm");
const { users } = require("../controllers/db/db");
const { RefreshToken } = require("../models/RefreshToken");


class InMemoryRefreshTokenRepository {

    constructor({}={}) {
        this.items = []
    }

    /**
     * Insert a user in database
     * @param {RefreshToken} user 
     */
    async insertToken(token) {
        this.items.push(token)
    }
    /**
     * 
     * @param {string} token 
     * @returns {Promise<RefreshToken>}
     */
    async findByToken(token) {
        const index = this.items.findIndex(x=> x.token === token)
        if(index == -1) {
            return undefined
        }
        return this.items[index]
    }

    async updateToken(token) {
        const myToken = await this.items.find((x=> x.token == token.token))
        if(!token){
            throw new Error("Error updating token")
        }
        myToken.active = token.active
    }
}

class TypeOrmRefreshTokenRepository {

    /**
     * @typedef {object} Database
     * @property {DataSource} db
     */
    /**
     * 
     * @param {Database} db 
     */
    constructor({db}={}) {
        this.db = db
    }

    /**
     * Insert a user in database
     * @param {RefreshToken} refreshToken 
     */
    async insertToken(refreshToken) {
        const ormRepository = this.db.getRepository("RefreshToken")
        const refreshTokenSchema = ormRepository.create({
            token: refreshToken.token,
            userId: refreshToken.userId,
            expires: refreshToken.expires
        })

        await ormRepository.save(refreshTokenSchema)
    }
    /**
     * 
     * @param {string} token 
     * @returns {Promise<RefreshToken>}
     */
    async findByToken(token) {
        const ormRepository = this.db.getRepository("RefreshToken")
        const refreshTokenSchema = await ormRepository.findOneBy({
            token
        })

        if(refreshTokenSchema == null){
            return undefined
        }
        const refreshToken = new RefreshToken(refreshTokenSchema.token, refreshTokenSchema.userId, refreshTokenSchema.expires, refreshTokenSchema.active)
        return refreshToken
    }

    async updateToken(token) {
        const ormRepository = this.db.getRepository("RefreshToken")
        const refreshTokenSchema = await ormRepository.findOneBy({
            token: token.token
        })
        if(!refreshTokenSchema) {
            throw new Error("Error updating refreshToken: token not found")
        }

        refreshTokenSchema.active = token.active
        await ormRepository.save(refreshTokenSchema)
    }
}

module.exports = { InMemoryRefreshTokenRepository, TypeOrmRefreshTokenRepository}