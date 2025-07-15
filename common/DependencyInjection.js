class DependencyInjectionUtil {
    static dependencies = {}

    static addDependency(type, Service) {
        this.dependencies[type] = new Service({...this.dependencies})
    }

    static getDependency (type) {
        return this.dependencies[type]
    }
}

module.exports = DependencyInjectionUtil