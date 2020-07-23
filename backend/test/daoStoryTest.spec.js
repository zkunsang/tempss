require('../apps/startup');
const { assert, expect } = require('chai');
const StoryDao = require('../node_storyself/dao/StoryDao');
const Story = require('../node_storyself/models/mongo/story');
const SSError = require('../node_storyself/error');
const TestHelper = require('./testHelper');
const _ = require('lodash');

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

        describe('insertMany', () => {
            it('insertMany', async () => {
                const beforeStoryList = await storyDao.getList();
                const beforeLength = beforeStoryList.length;

                const idList = ['insertManyId1', 'insertManyId2', 'insertManyId3'];
                const insertManyList = [];
                idList.map((item) => insertManyList.push(new Story({ storyId: item, status: 1 })))
                await storyDao.insertMany(insertManyList);

                const afterStoryList = await storyDao.getList();
                const afterLength = afterStoryList.length;

                assert.equal(afterLength, beforeLength + idList.length)
                const afterStoryObj = _.keyBy(afterStoryList, 'storyId');
                for (const item of idList) {
                    assert.isNotNull(afterStoryObj[item]);
                }
            });
        })

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

            it('updateMany', async () => {
                const beforeStoryList = await storyDao.getList();
                const beforeLength = beforeStoryList.length;

                const expectUpdateCount = beforeStoryList.reduce(
                    (item, cnt) => item.status === 1 ? ++cnt : cnt);

                await storyDao.updateMany({ status: 1 }, { status: 0 }, expectUpdateCount);

                const afterStoryList = await storyDao.getList();
                const afterLength = afterStoryList.length;

                assert.equal(afterLength, beforeLength);

                const afterStoryObj = _.keyBy(afterStoryList, 'storyId');
                for (const item of beforeStoryList) {
                    const compareItem = afterStoryObj[item.storyId];
                    assert.isNotNull(compareItem);
                    assert.equal(compareItem.storyId, item.storyId);
                    assert.notEqual(item.status, 0);
                }
            })
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

        after(async () => {
            await afterException();
        })


        describe('getOne', () => {
            it('throw whereNoExistData', async () => {
                try {
                    await storyDao.getOne({})
                    throw new Error();
                } catch (err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.whereNoExistData);
                    TestHelper.isSameError(err, expectError);
                }
            });

            it('throw getOneLength', async () => {
                try {
                    await storyDao.getOne({ status: 1 });
                    throw new Error();
                }
                catch (err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.getOneLength);
                    TestHelper.isSameError(err, expectError);
                }
            })
        })

        describe('getList', () => {
            it('throw whereNoExistData', async () => {
                // try {
                //     await storyDao.getList({});
                // }
                // catch(err) {

                //     assert.equal(typeof err, SSError.Dao.whereNoExistData);
                // }
            });
        });
    })
});


