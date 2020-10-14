const path = require('path');


module.exports = class Config {
    constructor(configPath) {
        this.configPath = configPath;
    }

    ready() {
        let msg = 'configs: [' + this.configPath + '] ';
        // 1.config list를 불러옴
        // 2.config list를 세팅함
        
        try {
            const configInfo = require(`@cf/${this.configPath}/configList.json`);
            this.setConfig(configInfo);
            // Object.keys(configInfo).map((item) => this.setConfig(configInfo[item]));
        } catch (e) {
            throw msg + e.message;
        }

        console.log(msg + 'ready');
    }

    setConfig(configList) {
        for(const config of configList) {
            this[config] = require(`@cf/${this.configPath}/${config}.json`)
        }
    }
}