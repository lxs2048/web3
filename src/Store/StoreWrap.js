import { StoreCtx } from './context';
import useReducerStore from './index';
function StoreWrap({ children }) {
  const [state, Dispatch] = useReducerStore();
  const store = {
    ...state,
    Dispatch,
  };
  return (
    <StoreCtx.Provider value={store}>
      {children}
    </StoreCtx.Provider>
  );
}

export default StoreWrap;