import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App as AntdApp, ConfigProvider } from 'antd'
import '@ant-design/icons' // Load after antd so icon registry exists (fixes production "Activity" error)
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { antdTheme } from '@/config/antd.theme'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ToastListener } from '@/components/Toast'
import { AppRouter } from '@/routes/AppRouter'
import '@/assets/styles/style.css'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found')

createRoot(rootEl).render(
  <StrictMode>
    <ErrorBoundary>
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
    </ErrorBoundary>
  </StrictMode>
)
