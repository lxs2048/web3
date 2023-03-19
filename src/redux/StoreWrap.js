import { Provider } from "react-redux"
import store from './store'
function StoreWrap({children}) {
  return (
    <Provider store={store}>{children}</Provider>
  )
}

export default StoreWrap