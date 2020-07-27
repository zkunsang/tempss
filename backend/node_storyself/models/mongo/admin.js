const ValidateUtil = require('../../util');
const ValidType = ValidateUtil.ValidType;
const NullAllow = ValidateUtil.NullAllow;
const AdminRole = ValidateUtil.AdminRole;

const Schema = {
    ADMIN_ID: { key: 'adminId', required: true, type: ValidType.STRING },
    PASSWORD: { key: 'password', required: true, type: ValidType.STRING },
    ADMIN_ROLE: { key: 'adminRole', required: true, type: ValidType.STRING, validRange: Object.keys(AdminRole) },
    CREATE_DATE: { key: 'createDate', required: true, type: ValidType.UNIX_TIMESTAMP }
}

class Admin {
    constructor({ adminId, password, adminRole, createDate }) {
        this[Schema.ADMIN_ID.key] = adminId;
        this[Schema.PASSWORD.key] = password;
        this[Schema.ADMIN_ROLE.key] = adminRole;
        this[Schema.CREATE_DATE.key] = createDate;
    }

    static validModel(obj) {
        User._validCommon(obj, NullAllow.NO);
    }

    static validValue(obj) {
        User._validCommon(obj, NullAllow.YES);
    }

    static _validCommon(obj, nullable) {
        ValidateUtil.valid(Admin, Schema, obj, nullable);
    }
}

module.exports = Admin;
module.exports.Schema = Schema;