const Resource = require("../models/mongo/resource");
const Dao = require('./Dao');

class ResourceDao {
    constructor(connection) {
        this.db = connection.db('story');
        this.collection = this.db.collection('resource');
    }
    
    async insertOne(resource) {
        ResourceDao.insertValid(resource);
        await this.collection.insertOne(resource);
    }

    async insertMany(resourceList) {
        ResourceDao.insertValidList(resourceList);
        await this.collection.insertMany(resourceList);
    }

    async updateOne(where, $set) {
        ResourceDao.checkWhere(where);
        ResourceDao.checkSet($set);

        const result = await this.collection.updateMany(where, { $set });
        Dao.checkUpdateCount(result.modifiedCount, 1, ResourceDao, where, $set);
    }

    async updateMany(where, $set, updateCount) {
        Dao.checkTestEnv();
        ResourceDao.checkWhere(where);
        ResourceDao.checkSet($set);

        const result = await this.collection.updateMany(where, { $set });
        Dao.checkUpdateCount(result.modifiedCount, updateCount, ResourceDao, where, $set);
    }

    async updateAll($set) {
        Dao.checkTestEnv();
        ResourceDao.checkSet($set);
        await this.collection.updateMany({}, { $set });
    }

    async findOne(where) {
        Dao.checkNotAllowWhereNull(ResourceDao, where);
        ResourceDao.checkWhere(where);

        const result = await this.collection.find(where).toArray();
        Dao.checkFindCount(result.getLength, 1, ResourceDao, where);
        
        return new Resource(result[0]);
    }

    async findMany(where) {
        Dao.checkNotAllowWhereNull(ResourceDao, where);
        ResourceDao.checkWhere(where);
        const findList = await this.collection.find(where).toArray();

        if (findList.length === 0) return null;
        return Dao.mappingList(Resource, findList);
    }

    async findAll() {
        const findList = await this.collection.find().toArray();
        if (findList.length === 0) return null;
        return Dao.mappingList(Resource, findList);
    }

    static insertValidList(resourceList) {
        for( const resource of resourceList) {
            ResourceDao.insertValidList(resource);
        }
    }
    
    static insertValid(resource) {
        Dao.checkValidObj(Resource, resource);
        Dao.checkInsertField(ResourceDao, resource);
    }

    static checkWhere(where) {
        Dao.checkAllowWhereField(ResourceDao, where);
        Resource.validValue(where);
    }

    static checkSet($set) {
        Dao.checkNotAllowSetNull(ResourceDao, $set);
        Dao.checkAllowSetField(ResourceDao, $set);
        Dao.checkNotAllowSetField(ResourceDao, $set);
        Resource.validValue($set);
    }

    static requireInsertFieldList() {
        return [
            Resource.Schema.STORY_ID.key,
            Resource.Schema.RESOURCE_ID.key,
            Resource.Schema.SIZE.key,
            Resource.Schema.VERSION.key,
            Resource.Schema.CRC32.key,
            Resource.Schema.UPDATE_DATE.key
        ];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return [
            Resource.Schema.SIZE.key,
            Resource.Schema.VERSION.key,
            Resource.Schema.CRC32.key,
            Resource.Schema.UPDATE_DATE.key
        ]
    };

    static notAllowSetFieldList() {
        return [
            Resource.Schema.STORY_ID.key,
            Resource.Schema.RESOURCE_ID.key,
        ]
    };
}

module.exports = ResourceDao;