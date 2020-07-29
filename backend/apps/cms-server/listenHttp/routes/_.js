const moment = require('moment');

module.exports = async (ctx, next) => {
    
    ctx.$date = moment().unix();
    await next();
    
};