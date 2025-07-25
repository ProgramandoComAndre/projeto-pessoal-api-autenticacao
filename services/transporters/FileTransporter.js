const fs = require("fs")
const path = require("path")

class FileTransport {
    constructor(folder) {
        this.folder = folder
    }

    log(logData) {
    
       const dataIso = logData.timestamp.toISOString().split('T')[0];
       console.log(dataIso)
       
       fs.appendFileSync(path.join(this.folder, `log${dataIso.replaceAll("-","")}.log`), JSON.stringify(logData)+"\n")
    }
}

module.exports = FileTransport