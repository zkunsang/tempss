import config from '../config/config'

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
    CDN_URL: config.getCndUrl
};

export default state;