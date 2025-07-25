class LogService {
    constructor(...transporters) {
        this.transporters = transporters
    }

    info(message, otherParams = {}) {
        const log = { level: "info", message, ...otherParams, timestamp: new Date()}
        for(let transport of this.transporters) {
            transport.log(log)
        }

    }

    warn(message, otherParams = {}) {
        const log = { level: "warn", message, timestamp: new Date(), ...otherParams}
        for(let transport of this.transporters) {
            transport.log(log)
        }

    }

    error(message, otherParams = {}) {
        const log = { level: "error", message, timestamp: new Date(), ...otherParams}
        for(let transport of this.transporters) {
            transport.log(log)
        }

    }  

}

module.exports = LogService