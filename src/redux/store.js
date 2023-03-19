import { configureStore } from '@reduxjs/toolkit'
import balanceSlice from './slices/balanceSlice'
import demoSlice from './slices/demoSlice'
import orderSlice from './slices/orderSlice'
const store = configureStore({
    reducer: {
        // demo
        demo: demoSlice,
        // 其他
        balance: balanceSlice,
        order:orderSlice
    },
    middleware:getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck:false,//关闭序列化的检查
    })
})
export default store