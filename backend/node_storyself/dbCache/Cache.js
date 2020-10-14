class Cache {
    constructor() {
        this.dao = null;
        this.cacheMap = {};
        this.version = 0;
        this.currentCacheModel = null;
        this.cacheModel = null;
        this.tableId = null;
    }   

    async loadData(dataTableCacheModel) {
        const version = dataTableCacheModel.get(this.tableId).getVersion();
        
        if(version == this.version) return;
        
        const loadText = this.version == 0 ? 
            `[${this.tableId}] ${version} initialized`: 
            `[${this.tableId}] ${this.version} -> ${version} reloaded`;
        
        console.log(loadText);
        
        this.cacheMap[version] = new this.cacheModel()
        await this.cacheMap[version].loadData(this.dao);
        this.version = version;
        this.currentCacheModel = this.cacheMap[version];
    }
}

module.exports = Cache;