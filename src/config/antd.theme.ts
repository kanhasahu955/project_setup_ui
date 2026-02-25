import type { ThemeConfig } from 'antd'
import { getTailwindHex } from '@/utils/tailwindColors.util'

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: getTailwindHex('blue', 500),
    colorSuccess: getTailwindHex('green', 500),
    colorWarning: getTailwindHex('amber', 500),
    colorError: getTailwindHex('red', 500),
    colorInfo: getTailwindHex('sky', 500),
    borderRadius: 8,
    fontFamily: 'inherit',
  },
  components: {
    Button: {
      controlHeight: 40,
      fontWeight: 500,
      colorPrimaryHover: getTailwindHex('blue', 600),
    },
    Input: {
      controlHeight: 40,
    },
    Select: {
      controlHeight: 40,
    },
  },
}
