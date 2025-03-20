"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, User, LogOut, Settings } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".user-menu-container") && !target.closest(".user-menu-button")) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const menuItems = [
    { name: "Início", href: "/" },
    { name: "Horários", href: "/horarios" },
    { name: "Personal Trainer", href: "/personal" },
    { name: "Dicas de Desempenho", href: "/desempenho" },
    { name: "Nutrição", href: "/nutricao" },
    { name: "Vestuário", href: "/vestuario" },
  ]

  return (
    <nav className="bg-black border-b border-purple-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-purple-600 font-bold text-2xl">MURIM</span>
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-purple-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/contato"
              className="ml-4 bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-md transition-all duration-300"
            >
              Fale Conosco
            </Link>

            <div className="ml-4 relative user-menu-container">
              <button
                onClick={toggleUserMenu}
                className="p-2 text-white hover:text-purple-400 transition-colors user-menu-button"
                aria-label={isAuthenticated ? "Menu do usuário" : "Entrar"}
              >
                {isAuthenticated ? (
                  <div className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user?.nome_completo ? user.nome_completo.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                ) : (
                  <User className="h-6 w-6" />
                )}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 border border-purple-900 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-800">
                        <p className="text-sm font-medium">{user?.nome_completo || "Usuário"}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>

                      {user?.role === "admin" && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-purple-500"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="inline-block w-4 h-4 mr-2" />
                          Painel Admin
                        </Link>
                      )}

                      <Link
                        href="/perfil"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-purple-500"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="inline-block w-4 h-4 mr-2" />
                        Meu Perfil
                      </Link>


                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-purple-500"
                      >
                        <LogOut className="inline-block w-4 h-4 mr-2" />
                        Sair
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-purple-500"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Entrar
                      </Link>
                      <Link
                        href="/registro"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-purple-500"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Registrar
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center">
            <div className="relative user-menu-container">
              <button
                onClick={toggleUserMenu}
                className="p-2 text-white hover:text-purple-400 transition-colors user-menu-button"
                aria-label={isAuthenticated ? "Menu do usuário" : "Entrar"}
              >
                {isAuthenticated ? (
                  <div className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user?.nome_completo ? user.nome_completo.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                ) : (
                  <User className="h-6 w-6" />
                )}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 border border-purple-900 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-800">
                        <p className="text-sm font-medium">{user?.nome_completo || "Usuário"}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>

                      {user?.role === "admin" && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-purple-500"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="inline-block w-4 h-4 mr-2" />
                          Painel Admin
                        </Link>
                      )}

                      <Link
                        href="/perfil"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-purple-500"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="inline-block w-4 h-4 mr-2" />
                        Meu Perfil
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-purple-500"
                      >
                        <LogOut className="inline-block w-4 h-4 mr-2" />
                        Sair
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-purple-500"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Entrar
                      </Link>
                      <Link
                        href="/registro"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-purple-500"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Registrar
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={toggleMenu}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-purple-400 hover:text-white hover:bg-purple-900 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menu principal</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-b border-purple-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-purple-500 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/contato"
              className="block mt-2 bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-3 rounded-md transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Fale Conosco
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

