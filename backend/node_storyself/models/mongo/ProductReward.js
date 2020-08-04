const Model = require('@ss/models');
const Inventory = require("@ss/models/mongo/Inventory");

const ValidateUtil = require('@ss/util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    PRODUCT_ID: { key: 'productId', required: true, type: ValidType.STRING },
    REWARD_TYPE: { key: 'rewardType', required: true, type: ValidType.STRING },
    REWARD_ID: { key: 'rewardId', required: true, type: ValidType.STRING },
    REWARD_QNY: { key: 'rewardQny', required: true, type: ValidType.NUMBER },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
}

class ProductReward extends Model {
    constructor({ productId, rewardType, rewardId, rewardQny }) {
        super();
        this[Schema.PRODUCT_ID.key] = productId || undefined;
        this[Schema.REWARD_TYPE.key] = rewardType || undefined;
        this[Schema.REWARD_ID.key] = rewardId || undefined;
        this[Schema.REWARD_QNY.key] = rewardQny || undefined;
    }

    setUpdateDate(updateDate) {
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    setProductId(productId) {
        this[Schema.PRODUCT_ID.key] = productId;
    }

    getProductId() {
        return this[Schema.PRODUCT_ID.key];
    }

    makeInventoryObject() {
        let inventoryObj = {}
        inventoryObj[Inventory.Schema.ITEM_ID.key] = this[Schema.REWARD_ID.key];
        inventoryObj[Inventory.Schema.ITEM_QNY.key] = this[Schema.REWARD_QNY.key];

        return new Inventory(inventoryObj);
    }
}

module.exports = ProductReward;
module.exports.Schema = Schema;