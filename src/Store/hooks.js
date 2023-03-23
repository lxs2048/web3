import { StoreCtx } from './context';
import { useContext } from 'react';

/**
 * 获取全局store/state
 */
export const useStore = () => {
  return useContext(StoreCtx);
};