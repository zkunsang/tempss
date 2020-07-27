const getters = {
    isAuth(state) {
        return !!state.adminId;
    }
}

export default getters;