import React, { useEffect } from 'react'
import { Card, Col, Row, Statistic, Descriptions } from 'antd';
import useConnectSol from '../../hooks/useConnectSol'
import useReduxStore from '../../hooks/useReduxStore'
import { loadBalanceData } from '../../redux/slices/balanceSlice'
import { loadOrderLists } from '../../redux/slices/orderSlice';
export const convert = (n) => {
  if (!n || !window.WEB) return ''
  return window.WEB.web3.utils.fromWei(n, "ether")
}
function Balance() {
  const [initData] = useConnectSol()
  const [state, dispatch] = useReduxStore(state => state.balance)
  useEffect(() => {
    initData.web3 && dispatch(loadBalanceData(initData))
    if(initData.Instance){
      const exchange = initData.Instance.exchangeInstance
      exchange.events.Order({},(error,event)=>{
        dispatch(loadOrderLists(initData))
      })
      exchange.events.Cancel({},(error,event)=>{
        dispatch(loadOrderLists(initData))
      })
      exchange.events.Trade({},(error,event)=>{
        dispatch(loadOrderLists(initData))
        dispatch(loadBalanceData(initData))
      })
    }
  }, [initData])
  const { TokenWallet, TokenExchange, EtherWallet, EtherExchange } = state || {}
  return (
    <div style={{ width: '100%', padding: '16px', boxSizing: 'border-box' }}>
      <Descriptions title="User Info">
        <Descriptions.Item label="Address">
          {initData.Account}
        </Descriptions.Item>
      </Descriptions>
      <Row gutter={16}>
        <Col span={6}>
          <Card hoverable>
            <Statistic
              title="钱包DOL"
              value={convert(TokenWallet)}
              precision={3}
              valueStyle={{
                color: '#3f8600',
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable>
            <Statistic
              title="交易所中的DOL"
              value={convert(TokenExchange)}
              precision={3}
              valueStyle={{
                color: '#9254de',
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable>
            <Statistic
              title="钱包ETH"
              value={convert(EtherWallet)}
              precision={3}
              valueStyle={{
                color: '#4096ff',
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable>
            <Statistic
              title="交易所中的ETH"
              value={convert(EtherExchange)}
              precision={3}
              valueStyle={{
                color: '#ff7a45',
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Balance