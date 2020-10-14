const s3Config = require(`../config/${process.env.NODE_ENV}/s3.json`)
const themeConfig = require(`../config/${process.env.NODE_ENV}/theme.json`)
const apiConfig = require(`../config/${process.env.NODE_ENV}/api.json`)

const state = {
    bodyColor: '#ffffff',
    navbarColor: '#026aa7',
    isShowBoardSettings: false,
    sessionId: null,
    adminId: null,
    CDN_URL: s3Config.s3Url,
    backendUrl: apiConfig.backendUrl,
    appBarColor: themeConfig.appBarColor,
    appBarTitle: themeConfig.appBarTitle
};

export default state;