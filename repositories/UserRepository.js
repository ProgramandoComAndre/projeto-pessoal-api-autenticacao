const User = require("../models/User");

class InMemoryUserRepository {
    constructor() {
        this.items = []
    }

    /**
     * Insert a user in database
     * @param {User} user 
     */
    async insertUser(user) {
        this.items.push(user)
    }
}

module.exports = { InMemoryUserRepository}