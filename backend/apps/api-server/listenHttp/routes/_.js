const moment = require('moment')
const NetworkLog = require('@ss/models/apilog/NetworkLog.js')

const helper = require('@ss/helper');
const SSError = require('@ss/error');

const dbRedisPB = require('@ss/dbRedisPB');
const DateUtil = require('@ss/util/DateUtil');

function checkServerBlock(date) {
    // serverBlock으로 변경
    if(dbRedisPB.serverStatus.status == 0) 
        return false;

    const { startDate, endDate } = dbRedisPB.serverStatus;

    return DateUtil.isBetween(date, startDate, endDate);
}

module.exports = async (ctx, next) => {
    ctx.$date = moment().valueOf();

    ctx.body = ctx.body || {};
    ctx.body.common = ctx.body.common || {};
    ctx.body.error = ctx.body.error || {};
    ctx.body.data = ctx.body.data || {};

    
    if(checkServerBlock(ctx.$date)) {
        console.log("block")
        return ;
        // whitelist 통과
    }

    console.log("non block");

    // blacklist block
    
    // serverStatus 확인
    // whiteList 확인
    try {
        await next();
    }
    catch (err) {
        if (err instanceof SSError.RunTime) {
            if (err instanceof SSError.Dao) {
                processDaoError(ctx, err);
            }
            else if (err instanceof SSError.Model) {
                processModelError(ctx, err);
            }
            else if (err instanceof SSError.Service) {
                processServiceError(ctx, err);
            }
            else if (err instanceof SSError.Controller) {
                processControllerError(ctx, err);
            }
            else {
                uncaughtError(ctx, err);
            }

            helper.slack.sendMessage(err.makeErrorMessage());
        } else {
            helper.slack.sendMessage(err.stack);
            uncaughtError(ctx, err);
        }
    }
    
    helper.fluent.sendNetworkLog(new NetworkLog(ctx, ctx.$date, moment().valueOf()));
};

function uncaughtError(ctx, err) {
    ctx.status = 500;
    ctx.body.error = { 
        message: err.message,
        additional: err.additionalMessage
     };
}

function processDaoError(ctx, err) {
    ctx.status = 500;
    ctx.body.error = { 
        message: err.message,
        additional: err.additionalMessage
     };
}

function processModelError(ctx, err) {
    ctx.status = 400;
    ctx.body.error = {
        message: err.message,
        additional: err.additionalMessage
    };
}

function processServiceError(ctx, err) {
    ctx.status = 400;
    ctx.body.error = {
        message: err.message,
        additional: err.additionalMessage
    };
}

function processControllerError(ctx, err) {
    ctx.status = 400;
    ctx.body.error = {
        message: err.message,
        additional: err.additionalMessage
    };
}