const SSError = require('@ss/error');

class Dao {
    constructor() { }

    static checkValidObj(model, obj) {
        if (!obj instanceof model) {
            throw new SSError.Dao(SSError.Dao.Code.notAllowModel, `${obj.name} is not ${model.name}`)
        }
    }

    static checkInsertField(dao, insertObj) {
        const needList = dao.requireInsertFieldList();
        const requireList = needList.filter((item) => !insertObj[item]);

        if (requireList.length > 0) {
            throw new SSError.Dao(SSError.Dao.Code.requireInsertField, `${insertObj.name} - ${requireList.join(',')} need required field `)
        }
    }

    static checkAllowWhereField(dao, where) {
        if (dao.allowWhereFieldList().reduce((acc, item) =>
            where[item] !== undefined && where[item] !== null ? ++acc : acc, 0) === 0) {
            throw new SSError.Dao(SSError.Dao.Code.noExistAllowWhereField);
        }
    }

    static checkAllowSetField(dao, $set) {
        if (dao.allowSetFieldList().reduce((acc, item) =>
            $set[item] !== undefined && $set[item] !== null ? ++acc : acc, 0) === 0) {
            throw new SSError.Dao(SSError.Dao.Code.noAffectedField);
        }
    }

    static checkNotAllowSetField(dao, $set) {
        const notAllowList = dao.notAllowSetFieldList().filter((item) => $set[item]);
        if (notAllowList.length > 0) {
            throw new SSError.Dao(SSError.Dao.Code.notAllowSetData, `${dao.name} - ${notAllowList.join(',')} not allow set field`)
        }
    }

    static checkNotAllowSetNull(dao, $set) {
        if (!$set) {
            throw new SSError.Dao(SSError.Dao.Code.setCantBeNull, `${dao.name} set can't null`);
        }
    }

    static checkUpdateCount(updateCount, expectCount, dao, where, $set) {
        if (updateCount != expectCount) {
            throw new SSError.Dao(SSError.Dao.Code.updateOneCount,
                `${dao.name} ${updateCount} expect ${expectCount}
                where: ${where}, set: ${$set}`);
        }
    }

    static checkFindOneCount(getLength, dao, where) {
        if (getLength != 1) {
            throw new SSError.Dao(SSError.Dao.Code.getOneLength,
                `${dao.name} expect result length 0, 1 - ${getLength} where: ${where}`);
        }
    }

    static checkDeleteOneCount(deleteLength, dao, where) {
        if (deleteLength != 1) {
            throw new SSError.Dao(SSError.Dao.Code.deleteOneLenght,
                `${dao.name} expect result length 1 - ${deleteLength} where: ${where}`);
        }
    }

    static checkTestEnv() {
        if(!process.env.NODE_ENV.startsWith('test')) {
            throw new SSError.Dao(SSError.Dao.Code.onlyTestFunction);
        }
        
    }
}

module.exports = Dao;