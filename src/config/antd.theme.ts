import type { ThemeConfig } from 'antd'

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    borderRadius: 8,
    fontFamily: 'inherit',
  },
  components: {
    Button: {
      controlHeight: 40,
      fontWeight: 500,
    },
    Input: {
      controlHeight: 40,
    },
    Select: {
      controlHeight: 40,
    },
  },
}
