const { default: axios } = require("axios")
const DependencyInjectionUtil = require("./DependencyInjection")


function proxy(url) {
    return async (req, res)=> {

            try {
            const response = await axios({
                method: req.method,
                url: `${url}${req.originalUrl}`,
                headers: {...req.headers},
                data: req.body
            })

            return res.status(response.status).send(response.data)
        }
        catch(err) {
            console.error(err.message)
            if(err.response) {
                return res.status(err.response.status).send(err.response.data)
            }
            else {
                return res.sendStatus(502)
            }
        }
        }
}

function addServices(services=[], app) {
    for(let service of services) {
        if(service.auth) {
            const authGuard = DependencyInjectionUtil.getDependency("authGuard")
        
            app.use(`/${service.serviceName}`, authGuard.auth(), proxy(service.serviceUrl))
        }     
        else {
           app.use(`/${service.serviceName}`, proxy(service.serviceUrl))

        }
        
    }
}

module.exports = addServices