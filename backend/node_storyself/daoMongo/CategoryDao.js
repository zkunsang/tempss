const Category = require('../models/mongo/Category');
const Dao = require('./Dao');

class CategoryDao extends Dao {
    constructor(connection) {
        super();
        this.db = connection.userConnect.db('story');
        this.collection = this.db.collection('category');
    }

    static model = Category;

    static requireInsertFieldList() {
        return [
            Category.Schema.ITEM_CATEGORY.key,
            Category.Schema.CATEGORY_NAME.key,
            Category.Schema.UPDATE_DATE.key,
        ];
    }

    static allowWhereFieldList() {
        return [
            Category.Schema.ITEM_CATEGORY.key
        ];
    }

    static allowSetFieldList() {
        return [
            Category.Schema.CATEGORY_NAME.key,
            Category.Schema.UPDATE_DATE.key

        ]
    };

    static notAllowSetFieldList() {
        return [
            Category.Schema.ITEM_CATEGORY.key
        ]
    };
}

module.exports = CategoryDao;