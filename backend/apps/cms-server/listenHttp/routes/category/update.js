const ReqCategoryUpdate = require('@ss/models/cmsController/ReqCategoryUpdate');
const CategoryDao = require('@ss/daoMongo/CategoryDao');
const Category = require('@ss/models/mongo/Category');

module.exports = async (ctx, next) => {
    try {
        const updateDate = ctx.$date;
        const reqCategoryUpdate = new ReqCategoryUpdate(ctx.request.body);
        ReqCategoryUpdate.validModel(reqCategoryUpdate);

        const itemCategory = reqCategoryUpdate.getItemCategory();
        const categoryDao = new CategoryDao(ctx.$dbMongo);
        const categoryInfo = await categoryDao.findOne({ itemCategory });

        if(!categoryInfo) {
            ctx.status = 400;
            ctx.body = { message: 'no exsit category' };
            await next();       
            return;
        }

        const updateCategoryInfo =  new Category(reqCategoryUpdate);
        delete updateCategoryInfo[Category.Schema.ITEM_CATEGORY.key];

        updateCategoryInfo.setUpdateDate(updateDate);
        await categoryDao.updateOne(itemCategory, updateCategoryInfo)

        ctx.status = 200;
        ctx.body = {};
        await next();
    }
    catch (err) {
        console.error(err);
        ctx.status = 400;
        ctx.body = { message: err.message };

        await next();
    }
}