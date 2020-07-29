const ItemExchange = require("../models/mongo/ItemExchange");
const Dao = require('./Dao');

class ItemExchangeDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.storyConnect.db('story');
        this.collection = this.db.collection('itemExchange');
    }

    static model = ItemExchange;

    static requireInsertFieldList() {
        return [
            ItemExchange.Schema.ITEM_ID.key,
            ItemExchange.Schema.MATERIAL_ID.key,
            ItemExchange.Schema.MATERIAL_QNY.key,
            ItemExchange.Schema.UPDATE_DATE.key,
        ];
    }

    static allowWhereFieldList() {
        return [
            ItemExchange.Schema.ITEM_ID.key,
        ];
    }

    static allowSetFieldList() {
        return [
            ItemExchange.Schema.MATERIAL_ID.key,
            ItemExchange.Schema.MATERIAL_QNY.key,
            ItemExchange.Schema.UPDATE_DATE.key,
        ]
    };

    static notAllowSetFieldList() {
        return [
            ItemExchange.Schema.ITEM_ID.key,
        ]
    };
}

module.exports = ItemExchangeDao;