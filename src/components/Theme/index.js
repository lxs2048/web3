import { ConfigProvider } from 'antd';

const ThemeProvider = ({children}) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#00b96b',
      },
    }}
  >
    {children}
  </ConfigProvider>
);

export default ThemeProvider;