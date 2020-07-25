require('../../apps/startup');
const assert = require('assert');
const TestHelper = require('.././testHelper');
const SSError = require('@ss/error');
const UserDao = require('../../node_storyself/dao/UserDao');
const User = require('../../node_storyself/models/mongo/user');

const moment = require('moment');

let dbMongo = null;
let userDao = null;

before(async () => {
    await require('../../apps/api-server/boot/initSS')();
    dbMongo = require('../../node_storyself/dbMongo');

    userDao = new UserDao(dbMongo.userConnect);
});

after(() => {

})

describe('dbMongo', () => {
    describe('create', () => {
        it('db is not null', () => {
            assert.equal(!dbMongo, false);
        });

        it('userConnect is not null', () => {
            assert.equal(!dbMongo.userConnect, false);
        });
    });
});

describe('dao', () => {
    describe('create', () => {
        it('userDao is not null', () => {
            assert.equal(!userDao, false);
        });
    })
})

function checkSameUser(user, compareUser) {
    assert.equal(user[User.Schema.UID], compareUser[User.Schema.UID]);
    assert.equal(user[User.Schema.EMAIL], compareUser[User.Schema.EMAIL]);
    assert.equal(user[User.Schema.PROVIDER], compareUser[User.Schema.PROVIDER]);
    assert.equal(user[User.Schema.CREATE_DATE], compareUser[User.Schema.CREATE_DATE]);
    assert.equal(user[User.Schema.LAST_LOGIN_DATE], compareUser[User.Schema.LAST_LOGIN_DATE]);
    assert.equal(user[User.Schema.POLICY_VERSION], compareUser[User.Schema.POLICY_VERSION]);
}

function createTempUserObj(uid) {
    const unixTimeStamp = moment().unix();
    const email = `${uid}@test.com`;
    const provider = 'google';
    const createDate = unixTimeStamp;
    const lastLoginDate = unixTimeStamp;
    const policyVersion = 1;

    return { uid, email, provider, createDate, lastLoginDate, policyVersion };
}

describe('daoUser', () => {
    describe('basic', () => {
        let testNewUser = null;
        before(async () => {
            testNewUser = new User(createTempUserObj('testId1'));
            await userDao.insertOne(testNewUser);
        });

        after(async () => {
            await userDao.deleteAll();
        })

        describe('find', () => {
            it('findOne - uid', async () => {
                const findUser = await userDao.findOne({ uid: testNewUser[User.Schema.UID] });
                checkSameUser(findUser, testNewUser);
            });

            it('findOne - email', async () => {
                const findUser = await userDao.findOne({ email: testNewUser[User.Schema.EMAIL] });
                checkSameUser(findUser, testNewUser);
            });
        })

        describe('insert', () => {
            it('insertOne', async () => {
                const newUser = new User(createTempUserObj('testId2'));
                await userDao.insertOne(newUser);

                const findUser = await userDao.findOne({ uid: newUser[User.Schema.UID] });
                checkSameUser(findUser, newUser);
            })
        });

        describe('update', () => {
            it('updateOne', async () => {
                const newUser = new User(createTempUserObj('testId3'));
                await userDao.insertOne(newUser);

                await userDao.updateOne({ uid: newUser[User.Schema.UID] }, { policyVersion: 2 });

                const findUser = await userDao.findOne({ uid: newUser[User.Schema.UID] });

                assert.equal(findUser[User.Schema.POLICY_VERSION], 2);
                assert.equal(findUser[User.Schema.UID], newUser[User.Schema.UID]);
                assert.equal(findUser[User.Schema.EMAIL], newUser[User.Schema.EMAIL]);
                assert.equal(findUser[User.Schema.CREATE_DATE], newUser[User.Schema.CREATE_DATE]);
                assert.equal(findUser[User.Schema.LAST_LOGIN_DATE], newUser[User.Schema.LAST_LOGIN_DATE]);
                assert.equal(findUser[User.Schema.PROVIDER], newUser[User.Schema.PROVIDER]);
            });
        });

        describe('delete', () => {
            it('deleteOne', async () => {
                const newUser = new User(createTempUserObj('testId4'));
                await userDao.insertOne(newUser);
                await userDao.deleteOne(newUser);
            })
        })
    });

    describe('exception', () => {
        describe('findOne', () => {

            describe('checkWhere', () => {
                describe('checkAllowWhereField', () => {
                    const allScemaList = Object.values(User.Schema);
                    const allowScemaList = UserDao.allowWhereFieldList();
                    const notAllow = allScemaList.filter(item => !allowScemaList.includes(item));
                    for (const item of notAllow) {
                        it(`${item}`, async () => {
                            try {
                                let tempObj = {};
                                tempObj[item] = item;
                                await userDao.findOne(tempObj);
                                TestHelper.throwNeedError();
                            }
                            catch (err) {
                                const expectError = new SSError.Dao(SSError.Dao.Code.noExistAllowWhereField);
                                TestHelper.isSameError(expectError, err);
                            }
                        })
                    }
                });

                function createWhereObj(key, value) {
                    let tempObj = {}
                    tempObj[key] = value;
                    return tempObj;
                }
                describe('validValue', () => {
                    describe('validsString', () => {
                        const itemList = [];
                        itemList.push(createWhereObj(User.Schema.UID, 10));
                        itemList.push(createWhereObj(User.Schema.EMAIL, 10));
                        
                        for (const item of itemList) {
                            const _key = Object.keys(item)[0];
                            const _value = Object.values(item)[0];
                            it(`${_key} - ${_value}`, async () => {
                                try {
                                    await userDao.findOne(item);
                                    TestHelper.throwNeedError();
                                }
                                catch (err) {
                                    const expectError = new SSError.Model(SSError.Model.Code.checkType);
                                    TestHelper.isSameError(expectError, err);
                                }
                            })
                        }
                    });
                })

                describe('validEmail', () => {
                    const itemList = [];
                    itemList.push(createWhereObj(User.Schema.EMAIL, 'abc'));
                    itemList.push(createWhereObj(User.Schema.EMAIL, 'asdfb@'));
                    itemList.push(createWhereObj(User.Schema.EMAIL, 'asdfb@dfkjkdf'));
                    itemList.push(createWhereObj(User.Schema.EMAIL, '123@123'));
                    
                    for (const item of itemList) {
                        const _key = Object.keys(item)[0];
                        const _value = Object.values(item)[0];
                        it(`${_key} - ${_value}`, async () => {
                            try {
                                await userDao.findOne(item);
                                TestHelper.throwNeedError();
                            }
                            catch (err) {
                                const expectError = new SSError.Model(SSError.Model.Code.notValidEmail);
                                TestHelper.isSameError(expectError, err);
                            }
                        })
                    }
                })
            });
        })
    })
})

