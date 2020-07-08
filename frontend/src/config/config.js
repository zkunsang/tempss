const isLive = location.host == 'manage-storykr.qpyou.cn:50000';
const isQa = location.host == 'manage-storykr.qpyou.cn:8080';
const isDev = location.host == 'prism-cms.day7games.com';

export default {
    isLive,
    isQa,
    getBackendUrl: (() => {
        if(isLive) { return 'http://manage-storykr.qpyou.cn:3200'; }
        else if(isQa) { return 'http://manage-storykr.qpyou.cn:3100'; }
        else if(isDev) { return 'http://prism-cms.day7games.com:3000'; }
        else return 'http://localhost:52000'
    })(),
    getCndUrl: (() => {
        return isLive || isQa ? 'http://prism-qa.day7games.com/' : 'http://story.storyself.com/'
    })()
};

