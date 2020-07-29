const ReqItemList = require('@ss/models/cmsController/ReqItemList');

const ItemDao = require('@ss/daoMongo/ItemDao');
const ItemExchangeDao = require('@ss/daoMongo/ItemExchangeDao');
const ItemCategoryDao = require('@ss/daoMongo/ItemCategoryDao');

module.exports = async (ctx, next) => {
    try {
        const reqItemList = new ReqItemList(ctx.request.body);
        ReqItemList.validModel(reqItemList);

        const itemDao = new ItemDao(ctx.$dbMongo);
        const itemExchangeDao = new ItemExchangeDao(ctx.$dbMongo);
        const itemCategoryDao = new ItemCategoryDao(ctx.$dbMongo);

        const itemList = await itemDao.findAll();
        const itemExchangeList = await itemExchangeDao.findAll();
        const itemCategoryList = await itemCategoryDao.findAll();

        ctx.status = 200;
        ctx.body = { itemList, itemExchangeList, itemCategoryList };
        await next();
    }
    catch (err) {
        console.error(err);
        ctx.status = 400;
        ctx.body = { message: err.message };

        await next();
    }
}