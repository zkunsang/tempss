const wb = require('@ss');
const mongo = require('@ss/dbMongo');

module.exports = async () => {
    await wb.configs.ready();
    await mongo.ready();
};