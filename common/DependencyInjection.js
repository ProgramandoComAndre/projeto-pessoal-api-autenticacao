class DependencyInjectionUtil {
    static dependencies = {}

    static addDependency(type, Service) {
        this.dependencies[type] = new Service({...this.dependencies})
    }
    
    static addDb(db) {
        this.dependencies["db"] = db
    }

    static getDependency (type) {
        return this.dependencies[type]
    }
}

module.exports = DependencyInjectionUtil