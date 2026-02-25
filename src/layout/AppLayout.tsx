import { memo } from "react"
import { Outlet } from "react-router-dom"
import { Layout } from "antd"
import { Header } from "@/layout/header/Header"

const { Content } = Layout

export const AppLayout = memo(function AppLayout() {
  return (
    <Layout className="min-h-screen bg-slate-950">
      <Header />
      <Content className="flex-1">
        <Outlet />
      </Content>
    </Layout>
  )
})
