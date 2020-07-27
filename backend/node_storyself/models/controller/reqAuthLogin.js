const ValidateUtil = require('../../util');

const Platform = ValidateUtil.Platform;
const Provider = ValidateUtil.Provider;
const ValidType = ValidateUtil.ValidType;
const NullAllow = ValidateUtil.NullAllow;
const AppStore = ValidateUtil.AppStore;

const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    EMAIL: { key: 'email', required: true, type: ValidType.EMAIL },
    PROVIDER: { key: 'provider', required: true, type: ValidType.STRING, validRange: Object.values(Provider) },
    DEVICE_ID: { key: 'deviceId', required: true, type: ValidType.STRING },
    PLATFORM: { key: 'platform', required: true, type: ValidType.STRING, validRange: Object.values(Platform) },
    CLIENT_VERSION: { key: 'clientVersion', required: true, type: ValidType.STRING },
    APPSTORE: { key: 'appStore', required: true, type: ValidType.STRING, validRange: Object.values(AppStore) },
    // IS_EMULATE: { key: 'isEmulate', required: true, type: ValidType.BOOLEAN},
}

class ReqAuthLogin {
    constructor({ uid, email, provider, deviceId, platform, clientVersion, appStore }) {
        this[Schema.UID.key] = uid;
        this[Schema.EMAIL.key] = email;
        this[Schema.PROVIDER.key] = provider;
        this[Schema.DEVICE_ID.key] = deviceId;
        this[Schema.PLATFORM.key] = platform;
        this[Schema.CLIENT_VERSION.key] = clientVersion;
        this[Schema.APPSTORE.key] = appStore;
    }

    static validModel(obj) {
        ReqAuthLogin._validCommon(obj, NullAllow.NO);
    }

    static _validCommon(obj, nullable) {
        ValidateUtil.valid(ReqAuthLogin, Schema, obj, nullable);
    }

    getUID() {
        return this[Schema.UID.key];
    }
}

module.exports = ReqAuthLogin;
module.exports.Schema = Schema;
