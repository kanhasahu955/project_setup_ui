import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App as AntdApp, ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { antdTheme } from '@/config/antd.theme'
import { ToastListener } from '@/components/Toast'
import { AppRouter } from '@/routes/AppRouter'
import '@/assets/styles/style.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={antdTheme}>
        <AntdApp>
          <ToastListener />
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </AntdApp>
      </ConfigProvider>
    </Provider>
  </StrictMode>
)
