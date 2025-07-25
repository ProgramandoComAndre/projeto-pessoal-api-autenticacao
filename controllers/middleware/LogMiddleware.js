function logMiddleware(logService) {
    return (err, req, res, next) => {
        if(err.statusCode) {
            return res.status(err.statusCode).json({ message: err.message})
        }
        logService.error(err.message, {route: req.method + " "+ req.path})
        return res.status(500).json({message: err.message, details: err})
    }
}

module.exports = logMiddleware