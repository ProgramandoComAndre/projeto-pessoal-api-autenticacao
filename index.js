const express = require('express');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const DependencyInjectionUtil = require("./common/DependencyInjection.js");
const { InMemoryUserRepository } = require('./repositories/UserRepository.js');
const BcryptHashService = require('./services/IHashService.js');
const { JsonWebTokenError } = require('jsonwebtoken');
const JwtTokenService = require('./services/ITokenService.js');
const UserService = require('./services/UserService.js');
const AuthService = require('./services/AuthService.js');
const AuthGuard = require('./controllers/middleware/AuthGuard.js');
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

DependencyInjectionUtil.addDependency("userRepository", InMemoryUserRepository)
DependencyInjectionUtil.addDependency("hashService", BcryptHashService)
DependencyInjectionUtil.addDependency("tokenService", JwtTokenService)
DependencyInjectionUtil.addDependency("userService", UserService)
DependencyInjectionUtil.addDependency("authService", AuthService)
DependencyInjectionUtil.addDependency("authGuard", AuthGuard)

app.use(express.json())
app.use("/api/users", require("./routes/UserRouter.js"))
app.use("/api/auth", require("./routes/AuthRouter.js"))
expressJSDocSwagger(app)(options);


app.listen(PORT, () => console.log(`API Docs at http://localhost:${PORT}/docs`));