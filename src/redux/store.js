import { configureStore } from '@reduxjs/toolkit'
import balanceSlice from './slices/balanceSlice'
import demoSlice from './slices/demoSlice'
const store = configureStore({
    reducer: {
        // demo
        demo: demoSlice,
        // 其他
        balance: balanceSlice
    },
    // middleware:{}
})
export default store