import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        AllOrders: [],
        CancelOrders: [],
        FillOrders: []
    },
    reducers: {
        setOrder(state, action) {
            const { AllOrders, CancelOrders, FillOrders } = action.payload
            state.AllOrders = AllOrders
            state.CancelOrders = CancelOrders
            state.FillOrders = FillOrders
        }
    }
})
export const { setOrder } = orderSlice.actions
export default orderSlice.reducer
export const loadOrderLists = createAsyncThunk(
    "order/loadOrderLists",
    async (data, { dispatch }) => {
        const { web3, Instance, Account } = data || {};
        const ret = await Promise.all([
            getExchangeHistoryEvent(Instance.exchangeInstance, 'Order'),
            getExchangeHistoryEvent(Instance.exchangeInstance, 'Cancel'),
            getExchangeHistoryEvent(Instance.exchangeInstance, 'Trade')
        ])
        const [AllOrders, CancelOrders, FillOrders] = ret
        dispatch(setOrder({ AllOrders, CancelOrders, FillOrders }))
    }
)

export const getExchangeHistoryEvent = async (exchangeInstance, type) => {
    const ret = await exchangeInstance.getPastEvents(type, {
        fromBlock: 0,
        toBlock: "latest"
    })
    return ret.map(item => item.returnValues)
}