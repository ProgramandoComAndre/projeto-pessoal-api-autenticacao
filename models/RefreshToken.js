const EntitySchema = require("typeorm").EntitySchema
class RefreshToken {
    constructor(token, userId, expires, active=1) {
        this.token = token
        this.userId = userId
        this.expires = expires
        this.active = active
    }

    invalidateToken() {
        if(this.active == 1) {
            this.active = 0;
        }
    }
}

const refreshTokenSchema = new EntitySchema({
    name: "RefreshToken",
    tableName: "RefreshTokens",
    columns: {
        token: {
            primary: true,
            type: "text"
        },
        userId: {
            type: "text",
            nullable: false
        },
        expires: {
            type: "integer",
            nullable: false
        },
        active: {
            type: "integer",
            nullable: false,
            default: 1
        }
    },

    relations: {
        user: {
            target: "User",
            type: "many-to-one",
            joinColumn: {
                name: "userId"
            }
        }
    }
})

module.exports = {RefreshToken, refreshTokenSchema}