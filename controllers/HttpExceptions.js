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

class NotFoundException extends Error {
    constructor(message) {
        super(message)
        this.name = "NotFoundException"
        this.statusCode = 404
    }
}

class UnauthorizedException extends Error {
    constructor(message) {
        super(message)
        this.name = "UnauthorizedException"
        this.statusCode = 401
    }
}

module.exports = { BadRequestException, ConflictException, NotFoundException, UnauthorizedException }