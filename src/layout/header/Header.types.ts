export interface NavItem {
  readonly key: string
  readonly label: string
  readonly path: string
  readonly authRequired?: boolean
  readonly roles?: readonly string[]
}
