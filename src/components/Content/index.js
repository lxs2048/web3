import React from 'react'
import { useStore } from '../../Store/hooks'
function Content() {
  const {num,Dispatch} = useStore()
  return (
    <div>
        <div>{num}</div>
        <button onClick={()=>{Dispatch({type:'increase',payload:2})}}>+</button>
        <button onClick={()=>{Dispatch({type:'decrease',payload:1})}}>-</button>
    </div>
  )
}

export default Content