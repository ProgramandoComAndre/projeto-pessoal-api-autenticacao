const Email = require("../common/email-validation")
const { BadRequestException } = require("../controllers/HttpExceptions")
const EntitySchema = require("typeorm").EntitySchema

class User {
    /**
     * @param {{id: number, name: string, email: string, password: string}} user
     */
    constructor({id, name, email, password}) {
        this.id = id
        this.name = name
        this.email = email
        this.password = password
    }

    /**
     * Creates a new user
     * @param {{name: string, email: string, password: string}} user 
     * @returns {User}
     */

    static create(user) {
        if(user.name <= 0) {
            throw new BadRequestException("name must have at least one character")
        }
        if(!Email.isValid(user.email)) {
            throw new BadRequestException("invalid email")
        }
        if(user.password.length <= 0) {
            throw new BadRequestException("Invalid password")
        }
        const id = crypto.randomUUID()
        const newUser = {
            ...user,
            id
        }
        return new User(newUser)  
    }
}

const userSchema = new EntitySchema(
    {
        name: "User",
        tableName: "Users",
         columns: {
            id: {
                primary: true,
                type: "text"
            },
            name: {
                type: "text",
                nullable: false
            },
            email: {
                type: "text",
                nullable: false
            },
            password: {
                type: "text",
                nullable: false
            }
         },
         relations: {
            blacklistToken: {
                target: "BlacklistToken",
                type: "one-to-many",
                inverseSide: "Users"
            },
            refreshToken: {
                target: "RefreshToken",
                type: "one-to-many",
                inverseSide: "Users"
            }
         }
    }
)
module.exports = { User, userSchema }