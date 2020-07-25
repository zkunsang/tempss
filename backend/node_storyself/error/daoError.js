const RunTimeError = require('./runTimeError');

class DaoError extends RunTimeError {
    constructor(errObj) {
        super('DaoError', errObj);
    }
}

module.exports = DaoError;
module.exports.Code = {
    getOneLength: { code: 20001, name: 'getOneLength', message: 'expect just one row'},
    updateOneCount: { code: 20002, name: 'updateOneCount', message: 'expect update just one' },
    updateManyCount: { code: 20003, name: 'updateManyCount', message: 'update more or less than expected' },
    noAffectedField: { code: 20004, name: 'noAffectedField', message: 'no affected update field' },
    notAllowSetField: { code: 20005, name: 'notAllowSetField', message: 'primary key doesn\'t allow change' },
    noExistAllowWhereField: { code: 20006, name: 'noExistAllowWhereField', message: 'no match where phrase'},
    requireInsertField: { code: 20007, name: 'requireInsertField', message: 'insert need required field'},
    setCantBeNull: { code: 20008, name: 'setCantBeNull', message: 'update set can\'t be null'},
    setValidValue: { code: 20009, name: 'setValidValue', message: 'check valid value'},
    notAllowTempObj: { code: 20010, name: 'notAllowTempObj', message: 'make obj using MODEL!'},
    onlyTestFunction: { code: 20011, name: 'onlyTestFunction', message: 'only test function'},
}

