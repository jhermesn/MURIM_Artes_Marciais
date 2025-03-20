"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, MessageSquare, ShoppingBag, Calendar, Clock, Menu, X, Home, UserCog } from "lucide-react"
import AdminRoute from "@/components/admin-route"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Usuários", href: "/admin/usuarios", icon: Users },
    { name: "Mensagens", href: "/admin/mensagens", icon: MessageSquare },
    { name: "Produtos", href: "/admin/produtos", icon: ShoppingBag },
    { name: "Horários", href: "/admin/horarios", icon: Clock },
    { name: "Agendamentos", href: "/admin/agendamentos", icon: Calendar },
    { name: "Instrutores", href: "/admin/instrutores", icon: UserCog },
  ]

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <AdminRoute>
      <div className="flex h-screen bg-gray-900">
        {/* Sidebar para desktop */}
        <aside className="hidden md:flex md:flex-col md:w-64 bg-gray-800 text-white">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Painel Admin</h2>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm ${
                        isActive ? "bg-purple-700 text-white" : "text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        {/* Sidebar móvel */}
        <div
          className={`fixed inset-0 z-40 md:hidden bg-black bg-opacity-50 transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={toggleSidebar}
        ></div>

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out md:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Painel Admin</h2>
            <button onClick={toggleSidebar} className="text-gray-300 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm ${
                        isActive ? "bg-purple-700 text-white" : "text-gray-300 hover:bg-gray-700"
                      }`}
                      onClick={toggleSidebar}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header móvel */}
          <header className="bg-gray-800 text-white md:hidden">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-xl font-bold">Painel Admin</h2>
              <button onClick={toggleSidebar} className="text-gray-300 hover:text-white">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </header>

          {/* Conteúdo da página */}
          <main className="flex-1 overflow-y-auto bg-gray-900 text-white">{children}</main>
        </div>
      </div>
    </AdminRoute>
  )
}

