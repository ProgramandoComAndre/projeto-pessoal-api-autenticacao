const jwt = require('jsonwebtoken')
const crypto = require("crypto")
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
}

module.exports = JwtTokenService