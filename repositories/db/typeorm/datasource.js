const typeorm = require("typeorm")
const {userSchema} = require("../../../models/User");
const {blacklistTokenSchema} = require("../../../models/BlacklistToken")
const path = require("path")
const dataSource = new typeorm.DataSource({
    type: "sqlite",
    database: "users.db",
    synchronize: true,
    entities: [userSchema, blacklistTokenSchema]
})

async function initDB() {
    try {
        await dataSource.initialize()
        console.info("DB Connected");
    }
    catch(ex) {
        console.error(ex)
        process.exit(1)
    }
    
}

module.exports = { dataSource, initDB}