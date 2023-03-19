import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';//address(0)默认地址0x后40个0
const balanceSlice = createSlice({
    name: 'balance',
    initialState: {
        TokenWallet: "0",
        TokenExchange: "0",
        EtherWallet: "0",
        EtherExchange: "0",
    },
    reducers: {
        setTokenWallet(state, action) {
            state.TokenWallet = action.payload
        },
        batchUpdateWallet(state, action) {
            const { TokenWallet, TokenExchange, EtherWallet, EtherExchange } = action.payload
            state.TokenWallet = TokenWallet
            state.TokenExchange = TokenExchange
            state.EtherWallet = EtherWallet
            state.EtherExchange = EtherExchange
        }
    }
})
export const { setTokenWallet, batchUpdateWallet } = balanceSlice.actions
export default balanceSlice.reducer
export const loadBalanceData = createAsyncThunk(
    "balance/fetchBalanceData",
    async (data, { dispatch }) => {
        const { web3, Instance, Account } = data || {}; // 解构参数
        const ret = await Promise.all([
            getTokenWallet(Instance.tokenInstance, Account),
            getTokenExchange(Instance.exchangeInstance, Instance.tokenInstance, Account),
            getEtherWallet(web3, Account),
            getEtherExchange(Instance.exchangeInstance, Account)
        ])
        const [TokenWallet, TokenExchange, EtherWallet, EtherExchange] = ret
        dispatch(batchUpdateWallet({
            TokenWallet,
            TokenExchange,
            EtherWallet,
            EtherExchange
        }))
    }
)

// 获取钱包token DOL
const getTokenWallet = async (tokenInstance, Account) => {
    return tokenInstance.methods.balanceOf(Account).call()
}
// 获取交易所token
const getTokenExchange = async (exchangeInstance, tokenInstance, Account) => {
    return exchangeInstance.methods.balanceOf(tokenInstance.options.address, Account).call()
}
// 获取钱包ether
const getEtherWallet = async (web3, Account) => {
    return web3.eth.getBalance(Account)
}
// 获取交易所ether
const getEtherExchange = async (exchangeInstance, Account) => {
    return exchangeInstance.methods.balanceOf(ETHER_ADDRESS, Account).call()
}