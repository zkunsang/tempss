const RuntimeError = require('./RuntimeError');

class ServiceError extends RuntimeError {
    constructor(errObj, additionalMessage) {
        super('ServiceError', errObj);
        this.additionalMessage = additionalMessage;
    }
}

/**
 * commonError: 30000
 * inventoryError: 31000
 * itemError: 32000,
 * storyError:
 */

module.exports = ServiceError;
module.exports.Code = {
    isNull: { code: 30001, name: 'isNull', message: 'not allow null' },
    notArray: { code: 30002, name: 'notArray', message: 'it should be array' },
    emptyArray: { code: 30003, name: 'emptyArray', message: 'not allow empty array' },
    wrongArrayObject: { code: 30004, name: 'wrongArrayObject', message: 'array includes wrong object' },
    
    putItemNoExistItem: { code: 31001, name: 'putItemNoExistItem', message: 'put item no exist item' },
    putItemOverMaxQny: { code: 31002, name: 'putItemOverMaxQny', message: 'over max qny' },
    useItemNotEnoughItem: { code: 31003, name: 'putItemNotEnughItem', message: 'not enough Item' },
    useItemNoUseableItem: { code: 31004, name: 'useItemNoUseableItem', message: 'no useable item' },

    noExistItemList: { code: 32001, name: 'noExistItemList', message: 'found not exist item' },
    noExistStoryList: { code: 32002, name: 'noExistStoryList', message: 'found not exist story' },

    nonValidGoogleReceipt: { code: 33001, name: 'nonValidGoogleReceipt', message: 'nonValidGoogleReceipt' },
    alreadyProcessedReceipt: { code: 33002, name: 'alreadyProcessedReceipt', message: 'alreadyProcessedReceipt' },

    noExistSession: { code: 34001, name: 'noExistSession', message: 'noExistSession' },
    serviceUnavailable: { code: 34002, name: 'serviceUnavailable', message: 'serviceUnavailable' }
}
