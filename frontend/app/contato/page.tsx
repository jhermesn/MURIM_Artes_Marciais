"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { MapPin, Phone, Mail, MessageSquare, Send, AlertCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { messageService } from "@/services/api"

function ContactForm() {
  const searchParams = useSearchParams()
  const initialRenderRef = useRef(true)

  const [formData, setFormData] = useState({
    nome_completo: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
  })

  const [errors, setErrors] = useState({})
  const [notification, setNotification] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false

      const tipo = searchParams.get("tipo")

      if (tipo) {
        setFormData((prev) => ({
          ...prev,
          assunto: tipo,
        }))

        if (tipo === "Agendamento de aula experimental") {
          setFormData((prev) => ({
            ...prev,
            mensagem:
                "Gostaria de agendar uma aula experimental. \n\nDetalhes adicionais (modalidade de interesse, preferência de horário, etc.): ",
          }))
        } else if (tipo === "Dúvidas sobre uniformes e equipamentos") {
          setFormData((prev) => ({
            ...prev,
            mensagem: "Tenho dúvidas sobre uniformes e equipamentos. \n\nDetalhes da consulta: ",
          }))
        }
      }
    }
  }, [searchParams])

    const validateForm = () => {
    const newErrors = {}

    if (!formData.nome_completo.trim()) {
      newErrors.nome_completo = "Nome é obrigatório"
    } else if (formData.nome_completo.trim().length < 3) {
      newErrors.nome_completo = "Nome deve ter pelo menos 3 caracteres"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório"
    } else if (!/^\(\d{2}\)\s\d{5}-\d{4}$/.test(formData.telefone)) {
      newErrors.telefone = "Telefone inválido. Use o formato (99) 99999-9999"
    }

    if (!formData.assunto) {
      newErrors.assunto = "Selecione um assunto"
    }

    if (!formData.mensagem.trim()) {
      newErrors.mensagem = "Mensagem é obrigatória"
    } else if (formData.mensagem.trim().length < 10) {
      newErrors.mensagem = "Mensagem deve ter pelo menos 10 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

    const handleChange = (e) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === "email") {
      formattedValue = value.trim().toLowerCase()
    } else if (name === "telefone") {
            let numbers = value.replace(/\D/g, "")

            if (numbers.length === 10 && numbers[2] !== "9") {
        numbers = numbers.slice(0, 2) + "9" + numbers.slice(2)
      }

            if (numbers.length >= 11) {
        formattedValue = `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7, 11)}`
      } else {
        formattedValue = numbers
      }
    } else if (name === "nome_completo") {
            formattedValue = value
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
    })
  }

    const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      try {
                const response = await messageService.sendMessage({
          nome_completo: formData.nome_completo,
          email: formData.email,
          telefone: formData.telefone,
          assunto: formData.assunto,
          mensagem: formData.mensagem,
        })

        if (response && response.success) {
          setNotification("Mensagem enviada com sucesso! Em breve entraremos em contato.")

                    setFormData({
            nome_completo: "",
            email: "",
            telefone: "",
            assunto: "",
            mensagem: "",
          })
        } else {
          setNotification("Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.")
        }
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error)
        setNotification("Falha ao enviar mensagem. Verifique sua conexão ou tente novamente mais tarde.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const assuntos = [
    "Informações sobre aulas",
    "Agendamento de aula experimental",
    "Dúvidas sobre mensalidades",
    "Eventos e workshops",
    "Dúvidas sobre uniformes e equipamentos",
    "Outros assuntos",
  ]

  return (
      <>
        {/* Notificação de sucesso ou erro */}
        {notification && (
            <div className="mb-6 bg-gray-900/50 border border-gray-500 text-white px-4 py-3 rounded flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{notification}</p>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900">
              <h2 className="text-xl font-semibold mb-6">Informações de Contato</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-purple-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Endereço</h3>
                    <p className="text-gray-400">
                      Rua das Artes Marciais, 123
                      <br />
                      Bairro Harmonia, São Paulo - SP
                      <br />
                      CEP: 01234-567
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-purple-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Telefone</h3>
                    <p className="text-gray-400">(11) 99999-9999</p>
                    <p className="text-gray-400">(11) 5555-5555</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-purple-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-400">contato@murimartes.com.br</p>
                    <p className="text-gray-400">info@murimartes.com.br</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MessageSquare className="h-6 w-6 text-purple-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">WhatsApp</h3>
                    <p className="text-gray-400">
                      <a
                          href="https://wa.me/5511999999999"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-500 hover:text-purple-400"
                      >
                        Clique aqui para conversar
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900">
              <h2 className="text-xl font-semibold mb-4">Horário de Funcionamento</h2>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-400">Segunda a Sexta</span>
                  <span>6h às 22h30</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Sábado</span>
                  <span>8h às 17h</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Domingo</span>
                  <span>Fechado</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900">
              <h2 className="text-xl font-semibold mb-6">Envie sua Mensagem</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="nome_completo" className="block mb-2 text-sm font-medium">
                      Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="nome_completo"
                        name="nome_completo"
                        value={formData.nome_completo}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 bg-gray-800 border ${
                            errors.nome_completo ? "border-red-500" : "border-gray-700"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                    {errors.nome_completo && <p className="mt-1 text-sm text-red-500">{errors.nome_completo}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 bg-gray-800 border ${
                            errors.email ? "border-red-500" : "border-gray-700"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="telefone" className="block mb-2 text-sm font-medium">
                      Telefone <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 bg-gray-800 border ${
                            errors.telefone ? "border-red-500" : "border-gray-700"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                    {errors.telefone && <p className="mt-1 text-sm text-red-500">{errors.telefone}</p>}
                  </div>
                  <div>
                    <label htmlFor="assunto" className="block mb-2 text-sm font-medium">
                      Assunto <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="assunto"
                        name="assunto"
                        value={formData.assunto}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 bg-gray-800 border ${
                            errors.assunto ? "border-red-500" : "border-gray-700"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                      <option value="">Selecione um assunto</option>
                      {assuntos.map((assunto, index) => (
                          <option key={index} value={assunto}>
                            {assunto}
                          </option>
                      ))}
                    </select>
                    {errors.assunto && <p className="mt-1 text-sm text-red-500">{errors.assunto}</p>}
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="mensagem" className="block mb-2 text-sm font-medium">
                    Mensagem <span className="text-red-500">*</span>
                  </label>
                  <textarea
                      id="mensagem"
                      name="mensagem"
                      rows={5}
                      value={formData.mensagem}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-800 border ${
                          errors.mensagem ? "border-red-500" : "border-gray-700"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  ></textarea>
                  {errors.mensagem && <p className="mt-1 text-sm text-red-500">{errors.mensagem}</p>}
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center justify-center w-full md:w-auto"
                >
                  {isSubmitting ? (
                      <span>Enviando...</span>
                  ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        <span>Enviar Mensagem</span>
                      </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
  )
}

export default function Contato() {
  return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Fale Conosco</h1>
            <p className="text-gray-400 mb-8">
              Entre em contato com a equipe MURIM Artes Marciais. Estamos à disposição para atendê-lo.
            </p>

            <Suspense fallback={<div className="text-center py-8">Carregando formulário...</div>}>
              <ContactForm />
            </Suspense>

            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-purple-900">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Nossa Localização</h2>
                <p className="text-gray-400 mb-4">
                  Estamos localizados em uma região central, com fácil acesso por transporte público e estacionamento nas
                  proximidades.
                </p>
              </div>
              <div className="h-96 w-full">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975874651647!2d-46.65429492378867!3d-23.56413066183402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1709680532696!5m2!1spt-BR!2sbr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Nossa Localização"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}