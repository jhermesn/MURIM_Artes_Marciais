"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { User, Mail, Phone, Calendar, CheckCircle, XCircle, Clock } from "lucide-react"
import { appointmentService, trainerService } from "@/services/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function Perfil() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState([])
  const [loadingAppointments, setLoadingAppointments] = useState(true)
  const [appointmentError, setAppointmentError] = useState(null)
  const [trainersMap, setTrainersMap] = useState({})
  const [loadingTrainers, setLoadingTrainers] = useState(true)

    useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

    useEffect(() => {
    if (isAuthenticated && user) {
      Promise.all([fetchUserAppointments(), fetchTrainers()])
          .catch(err => {
            console.error("Erro ao carregar dados:", err)
          })
    }
  }, [isAuthenticated, user])

  const fetchUserAppointments = async () => {
    try {
      setLoadingAppointments(true)
      const response = await appointmentService.getUserAppointments(user.id)

      if (response && response["hydra:member"]) {
        setAppointments(response["hydra:member"])
      } else {
        setAppointments([])
      }
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err)
      setAppointmentError("Não foi possível carregar seus agendamentos. Por favor, tente novamente mais tarde.")
    } finally {
      setLoadingAppointments(false)
    }
  }

  const fetchTrainers = async () => {
    try {
      setLoadingTrainers(true)
      const response = await trainerService.getAllTrainers()
      if (response && response["hydra:member"]) {
        const trainersArray = response["hydra:member"]
        const map = {}
        trainersArray.forEach((t) => {
          map[t.id] = t
        })
        setTrainersMap(map)
      }
    } catch (err) {
      console.error("Erro ao buscar instrutores:", err)
    } finally {
      setLoadingTrainers(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
            const [year, month, day] = dateString.split('-').map(Number)
            const date = new Date(year, month - 1, day)
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    } catch (e) {
      console.error("Error formatting date:", e)
      return dateString
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return ""

        const [hours, minutes] = timeString.substring(0, 5).split(':')

        const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))

        return date.toLocaleTimeString('pt-BR', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
            <span className="flex items-center text-green-400">
            <CheckCircle className="h-4 w-4 mr-1" /> Confirmado
          </span>
        )
      case "pending":
        return (
            <span className="flex items-center text-yellow-400">
            <Clock className="h-4 w-4 mr-1" /> Pendente
          </span>
        )
      case "cancelled":
        return (
            <span className="flex items-center text-red-400">
            <XCircle className="h-4 w-4 mr-1" /> Cancelado
          </span>
        )
      default:
        return <span className="text-gray-400">{status}</span>
    }
  }

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    )
  }

  if (!user) {
    return null   }

  return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">Meu Perfil</h1>

            <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900 mb-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-purple-900 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {user.nome_completo ? user.nome_completo.charAt(0).toUpperCase() : "U"}
                </span>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold">{user.nome_completo || "Usuário"}</h2>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 mt-6">
                <h2 className="text-xl font-semibold mb-6">Informações Pessoais</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-400">Nome Completo</label>
                    <div className="flex items-center bg-gray-800 px-4 py-2 rounded-md">
                      <User className="h-5 w-5 text-gray-500 mr-2" />
                      <span>{user.nome_completo || "Usuário"}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-400">Email</label>
                    <div className="flex items-center bg-gray-800 px-4 py-2 rounded-md">
                      <Mail className="h-5 w-5 text-gray-500 mr-2" />
                      <span>{user.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-400">Telefone</label>
                    <div className="flex items-center bg-gray-800 px-4 py-2 rounded-md">
                      <Phone className="h-5 w-5 text-gray-500 mr-2" />
                      <span>{user.telefone || "Não informado"}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-400">Tipo de Conta</label>
                    <div className="flex items-center bg-gray-800 px-4 py-2 rounded-md">
                      <User className="h-5 w-5 text-gray-500 mr-2" />
                      <span>{user.role === "admin" ? "Administrador" : "Aluno"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção de Agendamentos */}
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                Meus Agendamentos
              </h2>

              {loadingAppointments || loadingTrainers ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
              ) : appointmentError ? (
                  <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-md">{appointmentError}</div>
              ) : appointments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left pb-3 text-gray-400">Instrutor</th>
                        <th className="text-left pb-3 text-gray-400">Data</th>
                        <th className="text-left pb-3 text-gray-400">Horário</th>
                        <th className="text-left pb-3 text-gray-400">Status</th>
                      </tr>
                      </thead>
                      <tbody>
                      {appointments.map((appointment) => (
                          <tr key={appointment.id} className="border-b border-gray-800 last:border-0">
                            <td className="py-3">
                              {trainersMap[appointment.trainer_id]
                                  ? trainersMap[appointment.trainer_id].nome
                                  : `Instrutor #${appointment.trainer_id}`}
                            </td>
                            <td className="py-3">{formatDate(appointment.data)}</td>
                            <td className="py-3">
                              {formatTime(appointment.hora_inicio)} - {formatTime(appointment.hora_fim)}
                            </td>
                            <td className="py-3">{getStatusBadge(appointment.status)}</td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
              ) : (
                  <p className="text-center py-4 text-gray-400">
                    Você ainda não possui agendamentos. Visite nossa página de{" "}
                    <a href="/personal" className="text-purple-500 hover:text-purple-400">
                      Personal Trainers
                    </a>{" "}
                    para agendar uma sessão.
                  </p>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}