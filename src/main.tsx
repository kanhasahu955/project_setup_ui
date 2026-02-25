import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { antdTheme } from '@/config/antd.theme'
import { AppRouter } from '@/routes/AppRouter'
import '@/assets/styles/style.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={antdTheme}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </StrictMode>
)
