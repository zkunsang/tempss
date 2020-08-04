const moment = require('moment');
const helper = require('@ss/helper');
const SSError = require('@ss/error');


class CommonPacket {
    constructor(ctx, startDate, endDate) {
        this.pathname = ctx.path;
        this.ip = ctx.ip;
        

        const body = ctx.request.body;
        this.deviceId = body.deviceId;
        this.deviceName = body.deviceName;
        this.osVersion = body.osVersion;
        this.gameLanguage = body.gameLanguage;

        this.body = JSON.stringify(ctx.request.body);
        // this.body = ctx.request.body;
        this.res = ctx.body;
        this.status = ctx.status;
        this.ms = endDate - startDate;
        this.endDate = moment(endDate).format();
        this.startDate = moment(startDate).format();
    }
}

module.exports = async (ctx, next) => {
    ctx.$date = moment().valueOf();
    
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
            helper.slack.sendMessage(err);
            uncaughtError(ctx, err);
        }
    }
    helper.fluent.sendLog('network', new CommonPacket(ctx, ctx.$date, moment().valueOf()));
};

function uncaughtError(ctx, err) {
    ctx.status = 500;
    ctx.body = { 
        message: err.message,
        additional: err.additionalMessage
     };
}

function processDaoError(ctx, err) {
    ctx.status = 500;
    ctx.body = { 
        message: err.message,
        additional: err.additionalMessage
     };
}

function processModelError(ctx, err) {
    ctx.status = 400;
    ctx.body = {
        message: err.message,
        additional: err.additionalMessage
    };
}

function processServiceError(ctx, err) {
    ctx.status = 400;
    ctx.body = {
        message: err.message,
        additional: err.additionalMessage
    };
}

function processControllerError(ctx, err) {
    ctx.status = 400;
    ctx.body = {
        message: err.message,
        additional: err.additionalMessage
    };
}