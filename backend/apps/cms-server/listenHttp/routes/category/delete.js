const ReqCategoryDelete = require('@ss/models/cmsController/ReqCategoryDelete');
const ItemCategoryDao = require('@ss/daoMongo/ItemCategoryDao');

module.exports = async (ctx, next) => {
    const reqCategoryDelete = new ReqCategoryDelete(ctx.request.body);
    ReqCategoryDelete.validModel(reqCategoryDelete);

    const itemCategory = reqCategoryDelete.getItemCategory();
    const itemCategoryDao = new ItemCategoryDao(ctx.$dbMongo);
    const itemCategoryInfo = await itemCategoryDao.findOne({ itemCategory });

    if (!itemCategoryInfo) {
        ctx.status = 400;
        ctx.body = { message: 'no exist category' };
        await next();
        return;
    }

    await itemCategoryDao.deleteOne({itemCategory});

    ctx.status = 200;
    ctx.body = {};
    await next();
}