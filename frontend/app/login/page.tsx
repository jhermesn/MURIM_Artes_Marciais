"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Lock, Mail, AlertCircle } from "lucide-react"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

    useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

    const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória"
    } else if (formData.password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

        if (name === "email") {
      formattedValue = value.trim().toLowerCase()
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
    })

        if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
        if (loginError) {
      setLoginError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)
      setLoginError(null)

      try {
        const result = await login(formData.email, formData.password)

        if (result.success) {
                    router.push("/")
        } else {
          setLoginError(result.message)
        }
      } catch (error) {
        setLoginError("Ocorreu um erro durante o login. Tente novamente.")
        console.error("Erro de login:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Entrar</h1>
            <p className="text-gray-400">Acesse sua conta para gerenciar suas atividades e reservas</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-8 shadow-lg border border-purple-900">
            {loginError && (
              <div className="mb-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p>{loginError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 bg-gray-800 border ${
                      errors.email ? "border-red-500" : "border-gray-700"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block mb-2 text-sm font-medium">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 bg-gray-800 border ${
                      errors.password ? "border-red-500" : "border-gray-700"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-3 flex justify-center">
                {isSubmitting ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Não tem uma conta?{" "}
                <Link href="/registro" className="text-purple-500 hover:text-purple-400">
                  Registre-se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

