const EntitySchema = require("typeorm").EntitySchema
class BlacklistToken {
    constructor(jti, userId, expires) {
        this.jti = jti
        this.userId = userId
        this.expires = expires
    }
}

const blacklistTokenSchema = new EntitySchema({
    name: "BlacklistToken",
    tableName: "BlacklistTokens",
    columns: {
        jti: {
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

module.exports = {BlacklistToken, blacklistTokenSchema}