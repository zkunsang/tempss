const dbMongo = require('@ss/dbMongo');

const InventoryDao = require('@ss/daoMongo/InventoryDao');
const ReqUserInventory = require('@ss/models/umsController/ReqUserInventory');
const DateUtil = require('@ss/util/DateUtil');

function unixTimeStampToDateString(inventoryList) {
    for(const inventory of inventoryList) {
        DateUtil.unixTimeStampToDateString(inventory, 'updateDate');
        DateUtil.unixTimeStampToDateString(inventory, 'createDate');
    }
}

module.exports = async (ctx, next) => {
    const reqUserInventory = new ReqUserInventory(ctx.request.body);
    ReqUserInventory.validModel(reqUserInventory);

    const uid = reqUserInventory.getUid();

    const inventoryDao = new InventoryDao(dbMongo);
    const inventoryList = await inventoryDao.findMany({ uid });

    unixTimeStampToDateString(inventoryList);

    ctx.status = 200;
    ctx.body.data = { inventoryList };
    
    await next();
};