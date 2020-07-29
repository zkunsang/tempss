const Model = require('@ss/models');

const ValidateUtil = require('@ss/util/ValidateUtil');
const Platform = ValidateUtil.Platform;
const Provider = ValidateUtil.Provider;
const ValidType = ValidateUtil.ValidType;
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

class ReqAuthLogin extends Model {
    constructor({ uid, email, provider, deviceId, platform, clientVersion, appStore }) {
        super();
        this[Schema.UID.key] = uid;
        this[Schema.EMAIL.key] = email;
        this[Schema.PROVIDER.key] = provider;
        this[Schema.DEVICE_ID.key] = deviceId;
        this[Schema.PLATFORM.key] = platform;
        this[Schema.CLIENT_VERSION.key] = clientVersion;
        this[Schema.APPSTORE.key] = appStore;
    }

    getUID() {
        return this[Schema.UID.key];
    }
}

module.exports = ReqAuthLogin;
module.exports.Schema = Schema;
