const User = require("../models/User");

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
}

module.exports = { InMemoryUserRepository}