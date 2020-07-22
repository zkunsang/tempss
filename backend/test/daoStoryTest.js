require('../apps/startup');
const assert = require('assert');
const StoryDao = require('../node_storyself/dao/StoryDao');
const Story = require('../node_storyself/models/mongo/story');

let dbMongo = null;
let storyDao = null;

before(async () => {
    await require('../apps/api-server/boot/initSS')();
    dbMongo = require('../node_storyself/dbMongo');

    storyDao = new StoryDao(dbMongo.storyConnect);
});

after(() => {

})

describe('dbMongo', () => {
    describe('create', () => {
        it('db is not null', () => {
            assert.equal(!dbMongo, false);
        })

        it('storyConnect is not null', () => {
            assert.equal(!dbMongo.storyConnect, false);
        });
    });
});

describe('dao', () => {
    describe('create', () => {
        it('storyDao is not null', () => {
            assert.equal(!storyDao, false);
        });
    })
})

async function CRUDBefore() {
    const idList = ['storyId1', 'storyId2', 'storyId3', 'storyId4', 'storyId5', 'storyId6'];

    for (const item of idList) {
        await storyDao.insert(new Story(item, 1));
    }
}

async function CRUDAfter() {
    await storyDao.deleteAll();
}

describe('daoStory', () => {
    describe('CRUD', () => {

        before(async () => {
            await CRUDBefore();
            beforeStoryList = await storyDao.getList();
            beforeLength = beforeStoryList.length;
        });

        after(async () => {
            await CRUDAfter();
        })

        it('getOne', async() => {
            const find = { stroyId: 'storyId1' };
            const story = await storyDao.getOne(find);

            assert.equal(story.storyId, find.storyId);
        });

        it('getList', async() => {
            const find = { stroyId: 'storyId1' };
            const storyList = await storyDao.getList(find);

            assert.equal(typeof storyList, typeof []);
        });

        it('insert', async () => {
            const beforeStoryList = await storyDao.getList();
            const beforeLength = beforeStoryList.length;

            const story = new Story('insertTestStoryId', 1);
            await storyDao.insert(story);

            const afterStoryList = await storyDao.getList();
            const afterLenght = afterStoryList.length;

            assert.equal(afterLenght, beforeLength + 1);
        });

        it('update', async () => {
            const beforeStoryList = await storyDao.getList();
            const beforeLength = beforeStoryList.length;

            const insertStory = new Story('updateIdTest', 1);
            await storyDao.insert(insertStory);

            const afterStoryList = await storyDao.getList();
            const afterLenght = afterStoryList.length;

            assert.equal(afterLenght, beforeLength + 1);

            const updateStory = { storyId: insertStory.storyId, status: 0 };
            const find = { storyId: updateStory.storyId };
            const $set = { status: updateStory.status };

            await storyDao.update(find, $set);

            const findStory = await storyDao.getOne(find);

            console.log(findStory);
            assert.equal(updateStory.storyId, findStory.storyId);
            assert.equal(updateStory.status, findStory.status);
        })
    });
})

