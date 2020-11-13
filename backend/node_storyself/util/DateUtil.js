const moment = require('moment');

const _ = require('lodash');
const defaultDateFormat = 'YYYY-MM-DD HH:mm:ss';
class DateUtil {
    constructor() { }

    dateStringToUnixTimeStamp(object, columnName) {
        object[columnName] = moment(object[columnName], defaultDateFormat).unix();
    }

    unixTimeStampToDateString(object, columnName) {
        const length = object[columnName].toString().length;
        if(length > 10) 
            object[columnName] = object[columnName] / 1000;
        
        object[columnName] = moment.unix(object[columnName]).format(defaultDateFormat);
    }
}

module.exports = new DateUtil();
