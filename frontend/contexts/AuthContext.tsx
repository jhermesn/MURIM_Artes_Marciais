"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { authService } from "@/services/api"

type User = {
  id: string
  nome_completo: string
  email: string
  telefone?: string
  role: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (
    name: string,
    email: string,
    telefone: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

    useEffect(() => {
    const checkAuth = async () => {
      try {
                const token = localStorage.getItem("auth_token")
        if (!token) {
          setIsLoading(false)
          return
        }

        try {
          const userDataResponse = await authService.getProfile()

          const userData = {
            id: userDataResponse.id || userDataResponse.user?.id || "",
            nome_completo: userDataResponse.nome_completo || userDataResponse.user?.nome_completo || "",
            email: userDataResponse.email || userDataResponse.user?.email || "",
            telefone: userDataResponse.telefone || userDataResponse.user?.telefone || "",
            role: userDataResponse.role || userDataResponse.user?.role || "aluno",
          }
          setUser(userData)
        } catch (error) {
          console.error("Erro ao verificar autenticação:", error)
                    localStorage.removeItem("auth_token")
          setUser(null)
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
                localStorage.removeItem("auth_token")
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

    const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    try {
      const response = await authService.login({
        email,
        senha: password,       })

            if (!response || !response.token || !response.user) {
        throw new Error("Resposta de login inválida do servidor")
      }

            const userData = {
        id: response.user.id || "",
        nome_completo: response.user.nome_completo || "",
        email: response.user.email || "",
        telefone: response.user.telefone || "",
        role: response.user.role || "aluno",
      }
      setUser(userData)
      return { success: true, message: "Login realizado com sucesso" }
    } catch (error) {
      console.error("Erro no login:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro ao fazer login",
      }
    } finally {
      setIsLoading(false)
    }
  }

    const register = async (
    name: string,
    email: string,
    telefone: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    try {
      await authService.register({
        nome_completo: name,
        email,
        telefone,
        senha: password,       })

            return login(email, password)
    } catch (error) {
      console.error("Erro no registro:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro ao registrar usuário",
      }
    } finally {
      setIsLoading(false)
    }
  }

    const updateUserProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false

    try {
      setIsLoading(true)
      await authService.updateProfile(userData)

            setUser((prev) => (prev ? { ...prev, ...userData } : null))
      return true
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

    const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("auth_token")
      router.push("/")
    }
  }

    const isAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

