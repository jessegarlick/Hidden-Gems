const initialState = {
    userId: null,
    loading: true,
    navbarColor: "#0dcaf0",
    backgroundColor: "#E0FAFF",
    foregroundColor: "#FFFFFF"
};


// front end components will dispatch an action object :
// { type: "USER_AUTH", payload: userId }
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "USER_AUTH":
            return {
                ...state,
                userId: action.payload,
            };
        case "LOGOUT":
            return {
                ...state,
                ...initialState
            };
        case "COMPLETED_LOADING":
            return {
                ...state,
                loading: false
            }
        case "UPDATE_NAVBAR":
            return {
                ...state,
                navbarColor: action.payload
            }
        case "UPDATE_BACKGROUND":
            return {
                ...state,
                backgroundColor: action.payload
            }
        case "UPDATE_FOREGROUND":
            return {
                ...state,
                foregroundColor: action.payload
            }
        default:
            return state;
    }
}

export default reducer;