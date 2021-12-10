import { createStore } from "redux";

const initialState = {
    city: {
        name: '',
        latitude:'',
        longitude:''

    }
};

const citySet = (state = initialState, action) => {
    const newState = Object.assign({}, state);

    switch (action.type) {
        case "SET_CITY":
            return newState.city = action.payload

        default:
            return state;
    }
};

export default createStore(citySet);
