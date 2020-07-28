const getters = {
    isAuth(state) {
        console.log('getters state', state)
        return !!state.adminId;
    }
}

export default getters;