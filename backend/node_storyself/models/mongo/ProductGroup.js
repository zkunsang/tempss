const Model = require('@ss/models');

const ValidateUtil = require('@ss/util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    GROUP_ID: { key: 'groupId', required: true, type: ValidType.STRING },
    START_DATE: { key: 'startDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    END_DATE: { key: 'endDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    SERVER_LIMIT: { key: 'serverLimit', required: true, type: ValidType.NUMBER },
    USER_LIMIT: { key: 'userLimit', required: true, type: ValidType.NUMBER },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
}

class ProductGroup extends Model {
    constructor({ groupId, startDate, endDate, serverLimit, userLimit }) {
        super();
        this[Schema.GROUP_ID.key] = groupId;
        this[Schema.START_DATE.key] = startDate;
        this[Schema.END_DATE.key] = endDate;
        this[Schema.SERVER_LIMIT.key] = serverLimit;
        this[Schema.USER_LIMIT.key] = userLimit;
    }

    setUpdateDate(updateDate) {
        this[Schema.UPDATE_DATE.key] = updateDate;
    }
}

module.exports = ProductGroup;
module.exports.Schema = Schema;