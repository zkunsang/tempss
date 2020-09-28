const ss = require('@ss');

const dbMongo = require('@ss/dbMongo');
const helper = require('@ss/helper');
const wrapper = require('@ss/wrapper');
const dbRedis = require('@ss/dbRedis');

const googleAuth = require('@ss/googleAuth');

module.exports = async () => {
    await ss.configs.ready();
    await helper.ready();
    await dbMongo.ready();
    await dbRedis.ready();
    await wrapper.ready();
};