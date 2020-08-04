const moment = require('moment');
const helper = require('@ss/helper');
const SSError = require('@ss/error');



module.exports = async (ctx, next) => {
    ctx.$date = moment().unix();
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

        console.error(err);

    }
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