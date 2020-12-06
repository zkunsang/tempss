const moment = require('moment');

const _ = require('lodash');
const defaultDateFormat = 'YYYY-MM-DD HH:mm:ss';
class DateUtil {
    constructor() { }

    dsToUtsObj(object, columnName, dateFormat = defaultDateFormat) {
        object[columnName] = moment(object[columnName], dateFormat).unix();
    }

    utsToDsObj(object, columnName) {
        const length = object[columnName].toString().length;
        if(length > 10) 
            object[columnName] = object[columnName] / 1000;
        
        object[columnName] = moment.unix(object[columnName]).format(defaultDateFormat);
    }

    dsToUts(ds, dateFormat = defaultDateFormat) {
        console.log(ds);
        return moment(ds, dateFormat).unix();
    }

    utsToDs(uts) {
        const length = uts.toString().length;
        if(length > 10) 
            uts = uts / 1000;

        return moment.unix(uts).format(defaultDateFormat);
    }

    utsToDate(uts) {
        console.log(uts);
        if(uts)
            return new Date(uts * 1000);

        return new Date();
    }
}

module.exports = new DateUtil();
