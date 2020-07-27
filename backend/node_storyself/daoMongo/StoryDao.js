const Story = require('../models/mongo/story');
const Dao = require('./Dao');

class StoryDao {
    constructor(connection) {
        this.db = connection.db('story');
        this.collection = this.db.collection('story');
        this.collection.createIndex({ storyId: 1 }, { unique: true });
    }

    async insertOne(story) {
        StoryDao.insertValid(story);
        await this.collection.insertOne(story);
    }

    async insertMany(storyList) {
        StoryDao.insertValidList(storyList);
        await this.collection.insertMany(storyList);
    }

    async updateOne(where, $set) {
        StoryDao.checkWhere(where);
        StoryDao.checkSet($set);

        const result = await this.collection.updateMany(where, { $set });
        Dao.checkUpdateCount(result.modifiedCount, 1, StoryDao, where, $set);
    }

    async updateMany(where, $set, updateCount) {
        Dao.checkTestEnv();
        StoryDao.checkWhere(where);
        StoryDao.checkSet($set);

        const result = await this.collection.updateMany(where, { $set });
        Dao.checkUpdateCount(result.modifiedCount, updateCount, StoryDao, where, $set);
    }

    async updateAll($set) {
        Dao.checkTestEnv();
        StoryDao.checkSet($set);
        await this.collection.updateMany({}, { $set });
    }

    async findOne(where) {
        Dao.checkNotAllowWhereNull(StoryDao, where);
        StoryDao.checkWhere(where);

        const result = await this.collection.find(where).toArray();
        Dao.checkFindCount(result.getLength, 1, StoryDao, where);
        
        return new Story(result[0]);
    }

    async findMany(where) {
        Dao.checkNotAllowWhereNull(StoryDao, where);
        StoryDao.checkWhere(where);
        const findList = await this.collection.find(where).toArray();

        if (findList.length === 0) return null;
        return Dao.mappingList(Story, findList);
    }

    async findAll() {
        const findList = await this.collection.find().toArray();
        if (findList.length === 0) return null;
        return Dao.mappingList(Story, findList);
    }

    async deleteOne(where) {
        StoryDao.checkWhere(where);
        const result = await this.collection.deleteOne(where);
        Dao.checkDeleteOneCount(result.deletedCount, StoryDao, where);
    }

    async deleteAll() {
        Dao.checkTestEnv();
        await this.collection.deleteMany();
    }

    static insertValidList(storyList) {
        for (const story of storyList) {
            StoryDao.insertValid(story);
        }
    }
    static insertValid(story) {
        Dao.checkValidObj(Story, story);
        Dao.checkInsertField(StoryDao, story);
    }

    static checkWhere(where) {
        Dao.checkAllowWhereField(StoryDao, where);
        Story.validValue(where);
    }

    static checkSet($set) {
        Dao.checkNotAllowSetNull(StoryDao, $set);
        Dao.checkAllowSetField(StoryDao, $set);
        Dao.checkNotAllowSetField(StoryDao, $set);
        Story.validValue($set);
    }
    
    static requireInsertFieldList() {
        return [
            Story.Schema.STORY_ID.key,
            Story.Schema.STATUS.key,
            Story.Schema.VERSION.key
        ];
    }

    static allowWhereFieldList() {
        return [];
    }

    static allowSetFieldList() {
        return [
            Story.Schema.STATUS.key,
            Story.Schema.VERSION.key
        ]
    };

    static notAllowSetFieldList() {
        return [
            Story.Schema.STORY_ID.key
        ]
    };
}

module.exports = StoryDao;