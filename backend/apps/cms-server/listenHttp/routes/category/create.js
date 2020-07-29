const ReqCategoryCreate = require('@ss/models/cmsController/ReqCategoryCreate');
const CategoryDao = require('@ss/daoMongo/CategoryDao');
const Category = require('@ss/models/mongo/Category');

module.exports = async (ctx, next) => {
    try {
        const updateDate = ctx.$date;
        const reqCategoryCreate = new ReqCategoryCreate(ctx.request.body);
        ReqCategoryCreate.validModel(reqCategoryCreate);

        const itemCategory = reqCategoryCreate.getItemCategory();
        const categoryDao = new CategoryDao(ctx.$dbMongo);
        const categoryInfo = await categoryDao.findOne({ itemCategory });

        if (categoryInfo) {
            ctx.status = 400;
            ctx.body = { message: 'already exist' };
            await next();
            return;
        }

        const createCategoryInfo = new Category(reqCategoryCreate);
        createCategoryInfo.setUpdateDate(updateDate);

        await categoryDao.insertOne(createCategoryInfo)

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