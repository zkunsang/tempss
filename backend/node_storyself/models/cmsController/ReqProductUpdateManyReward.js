const Model = require('@ss/models');

const ValidateUtil = require('@ss/util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Schema = {
    PRODUCT_REWARD_LIST: { key: 'productRewardList', required: true, type: ValidType.ARRAY },
}

class ReqProductUpdateManyReward extends Model {
    constructor({ productRewardList }) {
        super();
        this[Schema.PRODUCT_REWARD_LIST.key] = productRewardList;
    }

    getRewardList() {
        return this[Schema.PRODUCT_REWARD_LIST.key];
    }
}

module.exports = ReqProductUpdateManyReward;
module.exports.Schema = Schema;