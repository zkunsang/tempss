const mongo = require('@ss/dbMongo');
const _ = require('lodash');
const ss = require('@ss');

module.exports = async (ctx, next) => {
    try {
        ctx.status = 200;
        ctx.body = {
            cdnUrl: ss.configs.apiServer.cdnUrl,
            appVersion: ss.configs.apiServer.appVersion
        };    
    }
    catch(err) {
        console.error(err);
    }
    
    
    await next();
}