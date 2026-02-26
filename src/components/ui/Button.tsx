import { Button as AntdButton } from "antd"
import type { ButtonProps as AntdButtonProps } from "antd"

export interface ButtonProps extends AntdButtonProps {
  /** Full-width block button (common for auth submit). */
  block?: boolean
}

/**
 * Reusable button using antd with optional Tailwind overrides.
 * Use for primary actions, secondary, or link-style; supports loading state.
 */
export function Button({
  className = "",
  block = false,
  ...rest
}: ButtonProps) {
  return (
    <AntdButton
      block={block}
      className={className}
      {...rest}
    />
  )
}
