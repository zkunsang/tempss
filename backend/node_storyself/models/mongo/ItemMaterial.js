const Model = require('@ss/models');

const ValidateUtil = require('@ss/util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    ITEM_ID: { key: 'itemId', required: true, type: ValidType.STRING },
    MATERIAL_ID: { key: 'materialId', required: true, type: ValidType.STRING },
    MATERIAL_QNY: { key: 'materialQny', required: true, type: ValidType.NUMBER },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
}

class ItemMaterial extends Model {
    constructor({ itemId, materialId, materialQny }) {
        super();
        this[Schema.ITEM_ID.key] = itemId;
        this[Schema.MATERIAL_ID.key] = materialId;
        this[Schema.MATERIAL_QNY.key] = materialQny;
    }

    setUpdateDate(updateDate) {
        this[Schema.UPDATE_DATE.key] = updateDate;
    }
}

module.exports = ItemMaterial;
module.exports.Schema = Schema;