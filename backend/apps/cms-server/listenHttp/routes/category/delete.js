const ReqCategoryDelete = require('@ss/models/cmsController/ReqCategoryDelete');
const CategoryDao = require('@ss/daoMongo/CategoryDao');
const Category = require('@ss/models/mongo/Category');

module.exports = async (ctx, next) => {
    try {
        const reqCategoryDelete = new ReqCategoryDelete(ctx.request.body);
        ReqCategoryDelete.validModel(reqCategoryDelete);

        const itemCategory = reqCategoryDelete.getItemCategory();
        const categoryDao = new CategoryDao(ctx.$dbMongo);
        const categoryInfo = await categoryDao.findOne({ itemCategory });

        if (!categoryInfo) {
            ctx.status = 400;
            ctx.body = { message: 'no exist category' };
            await next();
            return;
        }

        const deleteCategoryInfo = new Category(reqCategoryDelete);
        
        await categoryDao.deleteOne(deleteCategoryInfo);

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