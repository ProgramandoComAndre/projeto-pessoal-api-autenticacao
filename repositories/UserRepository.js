const { DataSource } = require("typeorm");
const { User } = require("../models/User");
const { users } = require("../controllers/db/db");


class InMemoryUserRepository {

    constructor({}={}) {
        this.items = []
    }

    /**
     * Insert a user in database
     * @param {User} user 
     */
    async insertUser(user) {
        this.items.push(user)
    }
    /**
     * 
     * @param {string} email 
     * @returns {User}
     */
    async findUserByEmail(email) {
        const index = this.items.findIndex(x=> x.email === email)
        if(index == -1) {
            return undefined
        }
        return this.items[index]
    }

    /**
     * 
     * @param {string} id 
     * @returns {User}
     */
    async findUserById(id) {
        const index = this.items.findIndex(x=> x.id === id)
        if(index == -1) {
            return undefined
        }
        return this.items[index]
    }
}

class TypeOrmUserRepository {

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
     * @param {User} user 
     */
    async insertUser(user) {
        const ormRepository = this.db.getRepository("User")
        const userSchema = ormRepository.create({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password
        })

        await ormRepository.save(userSchema)
    }
    /**
     * 
     * @param {string} email 
     * @returns {User}
     */
    async findUserByEmail(email) {
        const ormRepository = this.db.getRepository("User")
        const userSchema = await ormRepository.findOneBy({
            email
        })

        if(userSchema == null){
            return undefined
        }
        const user = new User({id: userSchema.id, name: userSchema.name, email: userSchema.email, password: userSchema.password})
        return user
    }

    /**
     * 
     * @param {string} id 
     * @returns {User}
     */
    async findUserById(id) {
        const ormRepository = this.db.getRepository("User")
        const userSchema = await ormRepository.findOneBy({
            id
        })
         if(userSchema == null){
            return undefined
        }
        const user = new User({id: userSchema.id, name: userSchema.name, email: userSchema.email, password: userSchema.password})
        return user
    }
}

module.exports = { InMemoryUserRepository, TypeOrmUserRepository}