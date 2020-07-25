const moment = require('moment');
const SSError = require('@ss/error');

const NullAllow = {
    YES: 1,
    NO: 0
}

const Type = {
    STRING: 'string',
    NUMBER: 'number'
};

class ValidateUtil {
    constructor() { }

    static validEmail(obj, field, item, nullable) {
        ValidateUtil._checkIsNull(obj, field, item, nullable);
        ValidateUtil._checkType(obj, field, item, Type.STRING);
        ValidateUtil._checkValidEmail(obj, field, item);
    }

    static validString(obj, field, item, nullable) {
        ValidateUtil._checkIsNull(obj, field, item, nullable);
        ValidateUtil._checkType(obj, field, item, Type.STRING);
    }

    static validNumber(obj, field, item, nullable) {
        ValidateUtil._checkIsNull(obj, field, item, nullable);
        ValidateUtil._checkType(obj, field, item, Type.NUMBER);
    }

    static validUnixTimeStamp(obj, field, item, nullable) {
        ValidateUtil._checkIsNull(obj, field, item, nullable);
        ValidateUtil._checkType(obj, field, item, Type.NUMBER);
        ValidateUtil._checkValidUnixTimestamp(obj, field, item);
    }

    static _checkIsNull(obj, field, item, nullable) {
        if (nullable) return;

        if (item === undefined || item === null) {
            throw new SSError.Model(SSError.Model.Code.checkNull, `${obj.name} - [${field}] can't be null`);
        }
    }

    static _checkType(obj, field, item, type) {
        if (item && typeof item !== type) {
            throw new SSError.Model(SSError.Model.Code.checkType, `${obj.name} - [${field}] is ${type}`);
        }
    }
    static _checkValidEmail(obj, field, item) {
        if (item) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const result = re.test(String(item).toLowerCase())

            if (!result) {
                throw new SSError.Model(SSError.Model.Code.notValidEmail, `${obj.name} - [${field}] invalid email address`)
            }
        }
    }

    static _checkValidUnixTimestamp(obj, field, item) {
        if (item) {
            try {
                moment().unix(item);
            }
            catch (err) {
                throw new SSError.Model(SSError.Model.Code.notValidUnixTimeStamp, `${obj.name} - [${field}] invalid timestamp`);
            }
        }
    }
}

module.exports = ValidateUtil;
module.exports.NullAllow = NullAllow;
