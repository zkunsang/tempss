const ValidateUtil = require('@ss/util');
const Model = require('@ss/models')

const ValidType = ValidateUtil.ValidType;

const Schema = {}

class ReqStoryList extends Model {
    constructor() {
        super();
    }
}

module.exports = ReqStoryList;
module.exports.Schema = Schema;