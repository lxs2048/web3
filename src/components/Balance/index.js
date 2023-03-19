import React, { useEffect } from 'react'
import useConnectSol from '../../hooks/useConnectSol'
import useReduxStore from '../../hooks/useReduxStore'
import { loadBalanceData } from '../../redux/slices/balanceSlice'
export const convert = (n) => {
  if (!n || !window.WEB) return ''
  return window.WEB.web3.utils.fromWei(n, "ether")
}
function Balance() {
  const [initData] = useConnectSol()
  const [state, dispatch] = useReduxStore(state => state.balance)
  useEffect(() => {
    initData.web3 && dispatch(loadBalanceData(initData))
  }, [initData])
  const { TokenWallet, TokenExchange, EtherWallet, EtherExchange } = state || {}
  return (
    <div>
      <h2>账户：{initData.Account}</h2>
      <h3>钱包中的DOL：{convert(TokenWallet)}</h3>
      <h3>交易所中的DOL：{convert(TokenExchange)}</h3>
      <h3>钱包中的以太币：{convert(EtherWallet)}</h3>
      <h3>交易所中的以太币：{convert(EtherExchange)}</h3>
    </div>
  )
}

export default Balance