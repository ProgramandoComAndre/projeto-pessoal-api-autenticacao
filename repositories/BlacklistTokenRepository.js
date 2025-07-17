const { DataSource } = require("typeorm");
const { User } = require("../models/User");
const { users } = require("../controllers/db/db");
const { BlacklistToken } = require("../models/BlacklistToken");


class InMemoryBlacklistTokenRepository {

    constructor({}={}) {
        this.items = []
    }

    /**
     * Insert a user in database
     * @param {User} user 
     */
    async insertToken(token) {
        this.items.push(token)
    }
    /**
     * 
     * @param {string} email 
     * @returns {User}
     */
    async tokenExists(jti) {
        return this.items.some((value) => value.jti == jti)
    }
}

class TypeOrmBlacklistTokenRepository {

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
     * @param {BlacklistToken} blacklistToken 
     */
    async insertToken(blacklistToken) {
        const ormRepository = this.db.getRepository("BlacklistToken")
        const blacklistTokenSchema = ormRepository.create({
            jti: blacklistToken.jti,
            userId: blacklistToken.userId,
            expires: blacklistToken.expires
        })

        await ormRepository.save(blacklistTokenSchema)
    }
    /**
     * 
     * @param {string} token 
     * @returns {boolean}
     */
    async tokenExists(jti) {
        const ormRepository = this.db.getRepository("BlacklistToken")
        const blacklistTokenSchema = await ormRepository.findOneBy({
            jti
        })

        if(blacklistTokenSchema == null){
            return false
        }
        return true
    }
}

module.exports = { InMemoryBlacklistTokenRepository, TypeOrmBlacklistTokenRepository}