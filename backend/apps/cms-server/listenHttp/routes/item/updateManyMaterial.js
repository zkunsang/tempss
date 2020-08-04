const ReqItemUpdateManyMaterial = require('@ss/models/cmsController/ReqItemUpdateManyMaterial');

const ItemMaterialDao = require('@ss/daoMongo/ItemMaterialDao');
const Item = require('@ss/models/mongo/Item');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqItemUpdateManyMaterial = new ReqItemUpdateManyMaterial(ctx.request.body);
    ReqItemUpdateManyMaterial.validModel(reqItemUpdateManyMaterial);

    const itemMaterialDao = new ItemMaterialDao(ctx.$dbMongo);
    const itemMaterialList = reqItemUpdateManyMaterial.getMaterialList();
    await itemMaterialDao.deleteAll();
    await insertItemMaterialList(itemMaterialDao, itemMaterialList, updateDate);
    
    ctx.status = 200;
    ctx.body.data = {};
    await next();
}

async function insertItemMaterialList(itemMaterialDao, materialList, updateDate) {
    const insertMaterialList = ItemMaterialDao.mappingList(materialList);
    for(const item of insertMaterialList) {
        item.setUpdateDate(updateDate);
    }
    
    await itemMaterialDao.insertMany(insertMaterialList);
}