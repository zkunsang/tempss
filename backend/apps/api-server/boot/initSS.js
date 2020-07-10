const ss = require('@ss');
const mongo = require('@ss/dbMongo');

module.exports = async () => {
    await ss.configs.ready();
    await mongo.ready();
};