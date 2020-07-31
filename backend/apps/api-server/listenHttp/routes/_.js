const moment = require('moment');
const helper = require('@ss/helper');
const SSError = require('@ss/error');

module.exports = async (ctx, next) => {
    ctx.$date = moment().unix();
    try {
        await next();
    }
    catch (err) {
        if(err instanceof SSError.RunTime) {
            helper.slack.sendMessage(err.makeErrorMessage());
        } else {
            helper.slack.sendMessage(err);
        }
        console.error(err);
        // ctx.status = 400;
        // ctx.body = { message: err.message };
    }
};