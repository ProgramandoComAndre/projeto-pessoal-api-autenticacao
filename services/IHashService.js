const bcryptjs = require("bcryptjs")

class BcryptHashService {
    async hash(value) {
        return bcryptjs.hash(value, 10)
    }
}

module.exports = BcryptHashService