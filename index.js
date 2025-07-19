const express = require('express');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const DependencyInjectionUtil = require("./common/DependencyInjection.js");
const { InMemoryUserRepository, TypeOrmUserRepository } = require('./repositories/UserRepository.js');
const BcryptHashService = require('./services/IHashService.js');
const JwtTokenService = require('./services/ITokenService.js');
const UserService = require('./services/UserService.js');
const AuthService = require('./services/AuthService.js');
const AuthGuard = require('./controllers/middleware/AuthGuard.js');
const { initDB, dataSource } = require('./repositories/db/typeorm/datasource.js');
const { TypeOrmBlacklistTokenRepository } = require('./repositories/BlacklistTokenRepository.js');
const { TypeOrmRefreshTokenRepository } = require('./repositories/RefreshTokenRepository.js');
const services = require("./services.json");
const addServices = require('./common/addServices.js');
console.log(services)
const options = {
  info: {
    version: '1.0.0',
    title: 'Serviço de autenticação',
    description: "Serviço de autenticação para consolidação de conceitos de REST API"
  },
  security: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
    }
  },
  baseDir: __dirname,
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  filesPattern: './routes/*.js',
  // URL where SwaggerUI will be rendered
  swaggerUIPath: '/docs',
  // Expose OpenAPI UI
  exposeSwaggerUI: true,
  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: false,
  // Open API JSON Docs endpoint.
  apiDocsPath: '/v3/api-docs',
  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,
  // You can customize your UI options.
  // you can extend swagger-ui-express config. You can checkout an example of this
  // in the `example/configuration/swaggerOptions.js`
  swaggerUiOptions: {},
  // multiple option in case you want more that one instance
  multiple: true,
};

const app = express();
const PORT = 3000;

DependencyInjectionUtil.addDb(dataSource)
DependencyInjectionUtil.addDependency("refreshTokenRepository", TypeOrmRefreshTokenRepository)
DependencyInjectionUtil.addDependency("blacklistTokenRepository", TypeOrmBlacklistTokenRepository)
DependencyInjectionUtil.addDependency("userRepository", TypeOrmUserRepository)
DependencyInjectionUtil.addDependency("hashService", BcryptHashService)
DependencyInjectionUtil.addDependency("tokenService", JwtTokenService)
DependencyInjectionUtil.addDependency("userService", UserService)
DependencyInjectionUtil.addDependency("authService", AuthService)
DependencyInjectionUtil.addDependency("authGuard", AuthGuard)

app.use(express.json())
app.use("/api/users", require("./routes/UserRouter.js"))
app.use("/api/auth", require("./routes/AuthRouter.js"))
addServices(services, app)

expressJSDocSwagger(app)(options);

initDB().then(() => {
  app.listen(PORT, () => console.log(`API Docs at http://localhost:${PORT}/docs`));
})

