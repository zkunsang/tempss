const DateUtil = require('@ss/util/DateUtil');
const ReqIPEdit = require('@ss/models/umsController/ReqIPEdit');
const IP = require('@ss/models/mongo/IP');
const IPDao = require('@ss/daoMongo/IPDao');

module.exports = async (ctx, next) => {
    const reqIpEdit = new ReqIPEdit(ctx.request.body);
    ReqIPEdit.validModel(reqIpEdit);

    const ip = reqIPCreate.getIP();

    const ipDao = new IPDao(ctx.$dbMongo);
    const ipInfo = await ipDao.findOne({ip});

    const memo = ipInfo.getMemoList();

    const adminId = ctx.$adminInfo.adminId;
    const updateDate = ctx.$date;
    const dateString = DateUtil.utsToDsObj({updateDate}, 'updateDate');
    const newMemo = [`[${dateString}]${reqIpEdit.getMEMO()} - ${adminId}`];
    memo.push(newMemo);

    await ipDao.updateOne({ip}, {memo, updateDate, status});
    
    ctx.status = 200;
    ctx.body.data = {};
    await next();
}