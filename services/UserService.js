const { BadRequestException } = require("../common/HttpExceptions");
const User = require("../models/User");

class UserService {
    /**
     * @typedef {object} IUserRepository
     * @property {(user:User) => Promise<void>} insertUser
     */
    /**
     * @typedef {object} IHashService
     * @property {(value: string) => Promise<string>} hash
     */
    /**
     * 
     * @param {IUserRepository} userRepository
     * @param {IHashService} hashService
     */
    constructor(userRepository, hashService) {
       this.userRepository = userRepository
       this.hashService = hashService
    }

    /**
     * 
     * @typedef {object} RegisterUserDto
     * @property {string} name
     * @property {string} email
     * @property {string} password 
     */

    /**
     * 
     * @param {RegisterUserDto} registerUserDto 
     */
    async registerUser(registerUserDto) {
        if(registerUserDto.password < 8) {
            throw new BadRequestException("password must have at least 8 characters")
        }
        registerUserDto.password = await this.hashService.hash(registerUserDto.password)
        console.log(registerUserDto.password)
        const user = User.create(registerUserDto)
        await this.userRepository.insertUser(user)
    }
}

module.exports = UserService