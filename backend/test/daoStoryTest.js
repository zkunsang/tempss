require('../apps/startup');
const assert = require('assert');

const StoryDao = require('../node_storyself/dao/StoryDao');
const Story = require('../node_storyself/models/mongo/story');
const SSError = require('../node_storyself/error');

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



describe('daoStory', () => {
    async function CRUDBefore() {
        const idList = ['storyId1', 'storyId2', 'storyId3', 'storyId4', 'storyId5', 'storyId6'];
    
        for (const item of idList) {
            await storyDao.insert(new Story({ storyId: item, status: 1 }));
        }
    }
    
    async function CRUDAfter() {
        await storyDao.deleteAll();
    }

    describe('basic', () => {

        before(async () => {
            await CRUDBefore();
            beforeStoryList = await storyDao.getList();
            beforeLength = beforeStoryList.length;
        });
    
        after(async () => {
            await CRUDAfter();
        })

        describe('get', () => {
            it('getOne', async () => {
                const find = { storyId: 'storyId1' };
                const story = await storyDao.getOne(find);

                assert.equal(story.storyId, find.storyId);
            });

            it('getOne - null', async () => {
                const find = { storyId: 'null id' };
                const story = await storyDao.getOne(find);

                assert.equal(story, null);
            });

            it('getList', async () => {
                const find = { storyId: 'storyId1' };
                const storyList = await storyDao.getList(find);

                assert.equal(storyList.length, 1);
                assert.equal(typeof storyList, typeof []);
            });

            it('getList - length 0', async () => {
                const find = { storyId: 'null id' };
                const storyList = await storyDao.getList(find);

                assert.equal(storyList.length, 0);
                assert.equal(typeof storyList, typeof []);
            });
        })

        describe('insert', () => {
            it('insert', async () => {
                const beforeStoryList = await storyDao.getList();
                const beforeLength = beforeStoryList.length;

                const story = new Story({ storyId: 'insertTestStoryId', status: 1 });
                await storyDao.insert(story);

                const afterStoryList = await storyDao.getList();
                const afterLenght = afterStoryList.length;

                assert.equal(afterLenght, beforeLength + 1);
            });
        });

        describe('update', () => {
            it('update', async () => {
                const beforeStoryList = await storyDao.getList();
                const beforeLength = beforeStoryList.length;

                const insertStory = new Story({ storyId: 'updateIdTest', status: 1 });
                await storyDao.insert(insertStory);

                const afterStoryList = await storyDao.getList();
                const afterLenght = afterStoryList.length;

                assert.equal(afterLenght, beforeLength + 1);

                const updateStory = { storyId: insertStory.storyId, status: 0 };
                const find = { storyId: updateStory.storyId };
                const $set = { status: updateStory.status };

                await storyDao.updateOne(find, $set);

                const findStory = await storyDao.getOne(find);

                assert.equal(updateStory.storyId, findStory.storyId);
                assert.equal(updateStory.status, findStory.status);
            });
        })

        describe('delete', () => {
            it('delete', async () => {
                const beforeStoryList = await storyDao.getList();
                const beforeLength = beforeStoryList.length;

                const insertStory = new Story({ storyId: 'deleteTestId', status: 1 });
                await storyDao.insert(insertStory);

                let afterStoryList = await storyDao.getList();
                let afterLenght = afterStoryList.length;

                assert.equal(afterLenght, beforeLength + 1);

                await storyDao.delete(insertStory);

                afterStoryList = await storyDao.getList();
                afterLenght = afterStoryList.length;

                assert.equal(afterLenght, beforeLength);

                let filteredItem = afterStoryList.filter((item) => item.storyId == insertStory.storyId);
                assert.equal(filteredItem.length, 0);
            });

            it('deleteAll', async () => {
                const beforeStoryList = await storyDao.getList();
                const beforeLength = beforeStoryList.length;

                assert.notEqual(beforeLength, 0);
                await storyDao.deleteAll();

                const afterStoryList = await storyDao.getList();
                const afterLength = afterStoryList.length;

                assert.equal(afterLength, 0);
            })
        })
    });

    async function beforeExeption() {
        const idList = ['storyId1', 'storyId2', 'storyId3', 'storyId4', 'storyId5', 'storyId6'];
    
        for (const item of idList) {
            await storyDao.insert(new Story({ storyId: item, status: 1 }));
        }
    }

    async function afterException() {
        await storyDao.deleteAll();
    }

    describe('exception', () => {
        before(async () => {
            await beforeExeption();
        });

        after(async() => {
            await afterException();
        })


        describe('getOne', () => {
            it('throw whereNoExistData', async () => {
                expect(await storyDao.getOne({})).to.throw(
                    new SSError.Dao(SSError.Dao.Code.whereNoExistData));
            });

            it('throw getOneLength', async() => {
                try {
                    await storyDao.getOne({status: 1});
                }
                catch(err) {
                    assert.equal(typeof err, SSError.Dao.Code.getOneLength);
                }
            })
        })

        describe('getList', () => {
            it('throw whereNoExistData', async() => {
                try {
                    await storyDao.getList({});
                }
                catch(err) {
                    assert.equal(typeof err, SSError.Dao.whereNoExistData);
                }
            });
        })
    })
});


