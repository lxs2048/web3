import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const demoSlice = createSlice({
    name: 'demo',
    initialState: {
        hello: "hello"
    },
    reducers: {
        setHello(state, action) {
            state.hello = action.payload
        }
    }
})
export const { setHello } = demoSlice.actions
export default demoSlice.reducer
export const loadHello = createAsyncThunk(
    "demo/loadHello",
    async (data, { dispatch }) => {
        const { val } = data || {}; // 解构参数
        const ret = await mockSync(val)
        dispatch(setHello(ret))
    }
)

const mockSync = async (val)=>{
    return new Promise((reslove)=>{
        setTimeout(()=>{
            reslove(val)
        },1000)
    })
}