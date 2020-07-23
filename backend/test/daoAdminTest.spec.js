require('../apps/startup');
const assert = require('assert');
const StoryDao = require('../node_storyself/dao/StoryDao');
const ResourceDao = require('../node_storyself/dao/ResourceDao');
const UserDao = require('../node_storyself/dao/UserDao');
const AdminDao = require('../node_storyself/dao/AdminDao');

const Story = require('../node_storyself/models/mongo/story');
const User = require('../node_storyself/models/mongo/user');
const Admin = require('../node_storyself/models/mongo/admin');
const Resource = require('../node_storyself/models/mongo/resource');

let dbMongo = null;
let storyDao = null;
let resourceDao = null;
let userDao = null;
let adminDao = null;

before(async () => {
    console.log('*** base Before start');
    await require('../apps/api-server/boot/initSS')();
    dbMongo = require('../node_storyself/dbMongo');

    storyDao = new StoryDao(dbMongo.storyConnect);
    adminDao = new AdminDao(dbMongo.storyConnect);
    resourceDao = new ResourceDao(dbMongo.storyConnect);

    userDao = new UserDao(dbMongo.userConnect);
    console.log('*** base Before end');
});

after(() => {

})

describe('dbMongo', () => {
    describe('create', () => {
        it('db is not null', () => {
            assert.equal(!dbMongo, false);
        })

        it('userConnect is not null', () => {
            assert.equal(!dbMongo.userConnect, false);
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

        it('userDao is not null', () => {
            assert.equal(!userDao, false);
        })

        it('resourceDao is not null', () => {
            assert.equal(!resourceDao, false);
        })

        it('adminDao is not null', () => {
            assert.equal(!adminDao, false);
        })
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
        });

        after(async () => {
            await CRUDAfter();
        })

        it('insert', async () => {
            const beforeStoryList = await storyDao.getList();
            const beforeLength = beforeStoryList.length;

            const story = new Story('insertTestStoryId', 1);
            const insertResult = await storyDao.insert(story);

            const afterStoryList = await storyDao.getList();
            const afterLenght = afterStoryList.length;

            assert.equal(afterLenght, beforeLength + 1);
        });

        it('update', async () => {
            const story = new Story('updateIdTest', 1);
            const insertResult = await storyDao.insert(story);
        })
    });
})

