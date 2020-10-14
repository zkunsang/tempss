const s3Config = require(`../config/${process.env.NODE_ENV}/s3.json`)

const state = {
    isAddBoard: false,
    boards: [],
    board: {},
    card: {},
    bodyColor: '#ffffff',
    navbarColor: '#026aa7',
    isShowBoardSettings: false,
    sessionId: null,
    adminId: null,
    CDN_URL: s3Config.s3Url
};

export default state;