const Story = require("../models/mongo/story");
const SSError = require('@ss/error');
const Dao = require('./Dao');


class StoryDao {
    constructor(connection) {
        this.db = connection.db('story');
        this.collection = this.db.collection('story');
        this.collection.createIndex({ storyId: 1 }, { unique: true });
    }

    async insert(story) {
        StoryDao.insertValid(story);
        const result = await this.collection.insertOne(story);
    }

    async insertMany(storyList) {
        for (const story of storyList) {
            StoryDao.insertValid(story);
        }

        const result = await this.collection.insertMany(storyList);
    }

    async updateMany(where, $set, updateCount) {
        StoryDao.checkWhere(where);
        StoryDao.checkSet($set);

        const result = await this.collection.updateMany(where, { $set });

        if (result.modifiedCount != updateCount) {
            throw new SSError.Dao(SSError.Dao.Code.updateManyCount,
                `${result.modifiedCount} expect ${updateCount},
                where: ${where}, $set: ${$set}`);
        }
    }

    async updateAll($set) {
        StoryDao.checkSet($set);

        const result = await this.collection.updateMany({}, { $set });
    }

    async updateOne(where, $set) {
        StoryDao.checkWhere(where);
        StoryDao.checkSet($set);

        const result = await this.collection.updateMany(where, { $set });
        if (result.modifiedCount != 1) {
            throw new SSError.Dao(SSError.Dao.Code.updateOneCount,
                `${result.modifiedCount} expect 1
                where: ${where}, set: ${$set}
                `);
        }
    }

    async getList(where = null) {
        StoryDao.checkWhere(where);
        const storyList = await this.collection.find(where).toArray();

        const result = [];
        for (const item of storyList) {
            result.push(new Story(item));
        }

        return result;
    }

    async getOne(where = null) {
        StoryDao.checkWhere(where);
        const result = await this.collection.find(where).toArray();

        if (result.length == 0) return null;
        if (result.length > 1) {
            throw new SSError.Dao(SSError.Dao.Code.getOneLength)
        }

        return new Story(result[0]);
    }

    async deleteOne(where) {
        Dao.checkTestEnv();
        StoryDao.checkWhere(where);
        const result = await this.collection.deleteOne(where);
    }

    async deleteAll() {
        Dao.checkTestEnv();
        const result = await this.collection.deleteMany();
    }

    static insertValid(story) {
        Story.typeValid(story);
        
        if (!story.storyId) {
            throw new SSError.Dao(SSError.Dao.Code.requireInsertField, 'Story - storyId required');
        }

        if (story.status === undefined) {
            throw new SSError.Dao(SSError.Dao.Code.requireInsertField, 'Story - status required');
        }

        if (story.status !== Story.Status.activate
            && story.status !== Story.Status.deactivate) {
            throw new SSError.Dao(SSError.Dao.Code.setValidValue, 'Story - status 0:deactivate 1:activate');
        }
    }

    static checkWhere(where) {
        if (!where) return;

        Story.typeValid(where);

        let whereCount = 0;
        if (where.storyId != null) {
            whereCount++;
        }
        if (where.status != null) {
            whereCount++;
        }

        if (whereCount == 0) {
            throw new SSError.Dao(SSError.Dao.Code.noExistAllowWhereField);
        }
    }

    static checkSet($set) {
        if (!$set) {
            throw new SSError.Dao(SSError.Dao.Code.setCantBeNull);
        }
        if ($set.storyId) {
            throw new SSError.Dao(SSError.Dao.Code.notAllowSetField);
        }

        let setCount = 0;
        if ($set.status != null) {
            setCount++;
        }

        if (setCount == 0) {
            throw new SSError.Dao(SSError.Dao.Code.noAffectedField);
        }

        if ($set.status) {
            if ($set.status !== Story.Status.activate
                && $set.status !== Story.Status.deactivate) {
                throw new SSError.Dao(SSError.Dao.Code.setValidValue, 'Story - status 0:deactivate 1:activate');
            }
        }
    }
}

module.exports = StoryDao;