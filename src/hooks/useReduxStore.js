import { useSelector, useDispatch } from 'react-redux';
const useReduxStore = (selector) => {
    const dispatch = useDispatch()
    const state = useSelector(selector)
    return [state, dispatch];
};

export default useReduxStore;