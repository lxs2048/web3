import { useReducer } from 'react';
export const initialState = {
    num: 0,
};

const ACTION_HANDLERS = {
    increase: (state, action) => {
        return Object.assign({}, state, {
            num: action.payload + state.num
        });
    },
    decrease: (state, action) => {
        return Object.assign({}, state, {
            num: state.num - action.payload
        });
    }
};

const reducer = (state, action) => {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
};

const useReducerStore = () => {
    const [state, _Dispatch] = useReducer(reducer, initialState);

    return [state, _Dispatch];
};

export default useReducerStore;