import React from 'react'
import useReduxStore from '../../hooks/useReduxStore'
import { loadHello, setHello } from '../../redux/slices/demoSlice'

function Demo() {
    const [state, dispatch] = useReduxStore(state => state.demo)
    return (<>
        <div>Demo {state.hello}</div>
        <button onClick={()=>{
            dispatch(setHello('hi ~'))
        }}>同步</button>
        <button onClick={()=>{
            dispatch(loadHello({val:'hi hi'}))
        }}>异步</button>
    </>
    )
}

export default Demo