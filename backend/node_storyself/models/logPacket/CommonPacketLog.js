const moment = require('moment')

class CommonPacketLog {
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

module.exports = CommonPacketLog;