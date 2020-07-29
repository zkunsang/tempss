const ValidateUtil = require('@ss/util');
const Model = require('@ss/models')

const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
}

class ReqItemList extends Model{
    constructor({}) {
        super();
    }
}

module.exports = ReqItemList;
module.exports.Schema = Schema;