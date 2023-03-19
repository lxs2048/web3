import Balance from "./components/Balance";
import Demo from "./components/Demo";
import StoreWrap from "./redux/StoreWrap";
function App() {
  return (
    <StoreWrap>
      <Demo/>
      <Balance/>
    </StoreWrap>
  );
}

export default App;
