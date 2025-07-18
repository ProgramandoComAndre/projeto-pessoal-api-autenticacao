const Email = require("../common/email-validation")
const { BadRequestException, NotFoundException, UnauthorizedException } = require("../controllers/HttpExceptions")
const {User} = require("../models/User")

class AuthService {
    /**
     * @typedef {object} ITokenService
     * @property {(id: string) => string} sign
     * @property {(tokenData: any) => Promise<bool>} invalidateToken
     * @property {(userId: string)=> Promise<any>} createNewTokenPair
     */
    /**
     * @typedef {object} IUserRepository
     * @property {(user:User) => Promise<void>} insertUser
     * @property {(email:string)=> Promise<User>} findUserByEmail
     */
    /**
     * @typedef {object} IHashService
     * @property {(value: string) => Promise<string>} hash
     * @property {(value: string, hashValue) => Promise<boolean>} compare
     */

    /**
     * @typedef {object} Service
     * @property {IUserRepository} userRepository
     * @property {IHashService} hashService
     * @property {ITokenService} tokenService
     */

    /**
     * 
     * @param {Service} param0 
     */
    constructor({userRepository, hashService, tokenService} = {}) {
       this.userRepository = userRepository
       this.hashService = hashService
       this.tokenService = tokenService
    }

    /**
     * 
     * @typedef {object} RegisterUserDto
     * @property {string} email
     * @property {string} password 
     */

    /**
     * 
     * @param {RegisterUserDto} registerUserDto 
     */
    async login (registerUserDto) {
        if(!Email.isValid(registerUserDto.email)) {
            throw new BadRequestException("Invalid email")
        }
        const userExists = await this.userRepository.findUserByEmail(registerUserDto.email)
        if(!userExists) {
            throw new NotFoundException(`User with ${registerUserDto.email} not found`)
        }
        const isValidPassword = await this.hashService.compare(registerUserDto.password, userExists.password)
        if(!isValidPassword) {
            throw new UnauthorizedException('Wrong password')
        }
        const {accessToken, refreshToken} = await this.tokenService.createNewTokenPair(userExists.id)
        return { id: userExists.id, name: userExists.name, email: userExists.email, accessToken, refreshToken: refreshToken}
    }
    
    async myProfile(id) {
        const user = await this.userRepository.findUserById(id)
        if(!user) {
            throw new NotFoundException(`User ${id} not found `)
        }
        return {id: user.id, name: user.name, email: user.email}
    }

    async refreshNewToken(token) {
        const accessToken = await this.tokenService.renewToken(token)
        return {accessToken}
    }

    async logout(tokenData, refreshToken) {
        const result = await this.tokenService.invalidateToken(tokenData)
        await this.tokenService.invalidateRefreshToken(refreshToken)
        return result 
    }
}

module.exports = AuthService