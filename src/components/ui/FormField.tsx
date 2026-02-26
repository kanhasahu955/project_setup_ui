import { Form, type FormItemProps } from "antd"
import type { ReactNode } from "react"

export interface FormFieldProps extends Omit<FormItemProps, "children"> {
  children: ReactNode
}

/**
 * Wrapper around antd Form.Item with consistent spacing and optional Tailwind.
 * Use for auth forms and any form that needs label + error display.
 */
export function FormField({ children, className = "", ...rest }: FormFieldProps) {
  return (
    <Form.Item
      className={`mb-0.5 ${className}`.trim()}
      {...rest}
    >
      {children}
    </Form.Item>
  )
}
