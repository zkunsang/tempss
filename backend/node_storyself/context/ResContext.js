const crypto = require('crypto');
const SSError = require('@ss/error');

const UNAUTH_TYPE = {
    NO_EXIST_SESSION: 2,

}

class ResContext {
    constructor(ctx) {
        this.ctx = ctx;
        this.ctx.body = {};
    }

    badRequest() {
        // return this.ctx.throw(400);
    }

    serviceUnavailable(message) {
        throw new SSError.Service(SSError.Service.Code.serviceUnavailable, message);
    }

    internalServerError() {
        // return this.ctx.throw(500);
    }

    unauthorized(type) {
        if(type == UNAUTH_TYPE.NO_EXIST_SESSION)
            throw new SSError.Service(SSError.Service.Code.noExistSession);
        // return this.ctx.throw(400);
    }

    forbidden(failType, failMsg) {
        // return this.ctx.throw(403);
    }

    encrypt() {
        if (this.ctx.body !== undefined) {
            const cipherKey = 'cipher';
            const iv = 'cipher';
            const cipher = crypto.createCipheriv('aes-256-cbc', cipherKey, iv);
            let enc = cipher.update(this.ctx.body);
            this.ctx.body = Buffer.concat([enc, cipher.final()]);
        }
    }

    success(data) {
        this.ctx.body.data = data;
    }
}

module.exports = ResContext;
module.exports.UNAUTH_TYPE = UNAUTH_TYPE; 