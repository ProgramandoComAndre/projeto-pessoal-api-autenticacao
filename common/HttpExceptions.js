class BadRequestException extends Error {
    constructor(message) {
        super(message)
        this.name = "BadRequestException"
        this.statusCode = 400
    }
}

class ConflictException extends Error {
    constructor(message) {
        super(message)
        this.name = "ConflictException"
        this.statusCode = 409
    }
}

module.exports = { BadRequestException, ConflictException }