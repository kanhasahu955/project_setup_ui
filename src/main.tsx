import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App as AntdApp, ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import { ApolloProvider } from '@apollo/client/react'
import { store } from '@/store/store'
import { createApolloClient, setApolloClient } from '@/config/apollo.config'
import { antdTheme } from '@/config/antd.theme'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ToastListener } from '@/components/Toast'
import { SocketProvider } from '@/context/SocketContext'
import { AppRouter } from '@/routes/AppRouter'
import '@ant-design/icons' // Load after antd so icon registry exists (fixes production "Activity" error)
import '@/assets/styles/style.css'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found')

const apolloClient = createApolloClient(() => store.getState().auth.token ?? null)
setApolloClient(apolloClient)

createRoot(rootEl).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <ApolloProvider client={apolloClient}>
          <SocketProvider>
            <ConfigProvider theme={antdTheme}>
              <AntdApp>
                <ToastListener />
                <BrowserRouter>
                  <AppRouter />
                </BrowserRouter>
              </AntdApp>
            </ConfigProvider>
          </SocketProvider>
        </ApolloProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
)
