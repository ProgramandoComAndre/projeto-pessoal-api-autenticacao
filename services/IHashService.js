const bcryptjs = require("bcryptjs")

class BcryptHashService {
    async hash(value) {
        return bcryptjs.hash(value, 10)
    }

    async compare(value, hashValue) {
        return bcryptjs.compare(value, hashValue)
    }
}

module.exports = BcryptHashService