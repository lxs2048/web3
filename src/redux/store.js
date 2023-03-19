import { configureStore } from '@reduxjs/toolkit'
import demoSlice from './slices/demoSlice'
const store = configureStore({
    reducer: {
        // demo
        demo: demoSlice
        // 其他
    },
    // middleware:{}
})
export default store