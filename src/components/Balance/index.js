import React from 'react'
import useConnectSol from '../../hooks/useConnectSol'

function Balance() {
  useConnectSol()
  console.log(window.WEB,'数据😎😎😎window.WEB');
  return (
    <div>Balance</div>
  )
}

export default Balance