const moment = require('moment');
const SSError = require('@ss/error');

const NullAllow = {
    YES: true,
    NO: false
}

const Type = {
    STRING: 'string',
    NUMBER: 'number'
};

const ValidType = {
    STRING: 'string',
    NUMBER: 'number',
    UNIX_TIMESTAMP: 'unixTimeStamp',
    EMAIL: 'email',
}

class ValidateUtil {
    constructor() {
        this.validFunc = {};
        this.validFunc[ValidType.STRING] = this.validString;
        this.validFunc[ValidType.NUMBER] = this.validNumber;
        this.validFunc[ValidType.EMAIL] = this.validEmail;
        this.validFunc[ValidType.UNIX_TIMESTAMP] = this.validUnixTimeStamp;
    }

    valid(model, schema, obj, nullable) {
        const schemaKeys = Object.keys(schema);

        for (const schemaKey of schemaKeys) {
            const field = schema[schemaKey].key;
            const required = schema[schemaKey].required;
            const type = schema[schemaKey].type;
            const validRange = schema[schemaKey].validRange;
            const item = obj[field];

            this.validFunc[type].call(this, model, field, item, nullable ? true : !required, validRange);
        }
    }

    validEmail(model, field, item, nullable) {
        if ( this._checkIsNull(model, field, item, nullable) ) {
            return;
        }
        
        this._checkType(model, field, item, Type.STRING);
        this._checkValidEmail(model, field, item);
    }

    validString(model, field, item, nullable, validRange) {
        if ( this._checkIsNull(model, field, item, nullable) ) {
            return;
        }

        this._checkType(model, field, item, Type.STRING);
        this._checkRange(model, field, item, validRange);
    }

    validNumber(model, field, item, nullable, validRange) {
        if ( this._checkIsNull(model, field, item, nullable) ) {
            return;
        }
        
        this._checkType(model, field, item, Type.NUMBER);
        this._checkRange(model, field, item, validRange);
    }

    validUnixTimeStamp(model, field, item, nullable) {
        if ( this._checkIsNull(model, field, item, nullable) ) {
            return;
        }

        this._checkType(model, field, item, Type.NUMBER);
        this._checkValidUnixTimestamp(model, field, item);
    }

    _checkIsNull(model, field, item, nullable) {
        if (nullable) return item === undefined || item === null;

        if (item === undefined || item === null) {
            throw new SSError.Model(SSError.Model.Code.requiredField, `${model.name} - [${field}] can't be null`);
        }

        return false;
    }

    _checkType(model, field, item, type) {
        if (typeof item !== type) {
            throw new SSError.Model(SSError.Model.Code.checkType, `${model.name} - [${field}] is ${type}`);
        }
    }

    _checkValidEmail(model, field, item) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const result = re.test(String(item).toLowerCase())

            if (!result) {
                throw new SSError.Model(SSError.Model.Code.notValidEmail, `${model.name} - [${field}] invalid email address`)
            }
    }

    _checkValidUnixTimestamp(model, field, item) {
        try {
            moment().unix(item);
        }
        catch (err) {
            throw new SSError.Model(SSError.Model.Code.notValidUnixTimeStamp, `${model.name} - [${field}] invalid timestamp`);
        }
    }

    _checkRange(model, field, item, validRange) {
        if (!validRange) return;
        if (!(validRange instanceof Array)) {
            throw new SSError.Model(SSError.Model.Code.validRangeType, `${model.name} - [${field}] check validRange type`);
        }

        if(!validRange.includes(item)) {
            throw new SSError.Model(SSError.Model.Code.validRangeValue, `${model.name} - [${field}] check validRange value`);
        }
    }
}

module.exports = new ValidateUtil();
module.exports.NullAllow = NullAllow;
module.exports.ValidType = ValidType;
