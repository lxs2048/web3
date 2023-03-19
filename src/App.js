import Balance from "./components/Balance";
import Demo from "./components/Demo";
import ThemeProvider from "./components/Theme";
import StoreWrap from "./redux/StoreWrap";
function App() {
  return (
    <StoreWrap>
      <ThemeProvider>
        <Demo/>
        <Balance/>
      </ThemeProvider>
    </StoreWrap>
  );
}

export default App;
