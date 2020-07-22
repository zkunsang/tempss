const ss = require('@ss');
const mongo = require('@ss/dbMongo');
const helper = require('@ss/helper');
const wrapper = require('@ss/wrapper');

module.exports = async () => {
    await ss.configs.ready();
    await helper.ready();
    await mongo.ready();
    await wrapper.ready();
};