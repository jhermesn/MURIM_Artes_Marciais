"use client"

import { useState, useEffect } from "react"
import { appointmentService, userService, trainerService } from "@/services/api"
import { Loader2, Check, X, Eye } from "lucide-react"
import AdminRoute from "@/components/admin-route"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function AdminAgendamentos() {
    const [appointments, setAppointments] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedAppointment, setSelectedAppointment] = useState(null)

    const [usersMap, setUsersMap] = useState({})
    const [trainersMap, setTrainersMap] = useState({})

    useEffect(() => {
        Promise.all([fetchAppointments(), fetchUsers(), fetchTrainers()]).catch((err) => {
            console.error(err)
            setError("Falha ao carregar dados. Tente novamente mais tarde.")
            setLoading(false)
        })
    }, [])

    // Busca todos os agendamentos
    const fetchAppointments = async () => {
        setLoading(true)
        try {
            const response = await appointmentService.getAllAppointments()
            if (response && response["hydra:member"]) {
                setAppointments(response["hydra:member"])
            } else {
                setAppointments([])
            }
        } catch (err) {
            console.error("Erro ao buscar agendamentos:", err)
            setError("Não foi possível carregar os agendamentos. Por favor, tente novamente mais tarde.")
        } finally {
            setLoading(false)
        }
    }

    // Busca todos os usuários e monta um map { [id]: user }
    const fetchUsers = async () => {
        try {
            const response = await userService.getAllUsers()
            if (response && response["hydra:member"]) {
                const usersArray = response["hydra:member"]
                const map = {}
                usersArray.forEach((u) => {
                    map[u.id] = u
                })
                setUsersMap(map)
            }
        } catch (err) {
            console.error("Erro ao buscar usuários:", err)
        }
    }

    // Busca todos os instrutores e monta um map { [id]: trainer }
    const fetchTrainers = async () => {
        try {
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
        }
    }

    const handleViewDetails = (appointment) => {
        setSelectedAppointment(appointment)
    }

    const handleCloseDetails = () => {
        setSelectedAppointment(null)
    }

    const handleConfirmAppointment = async (id) => {
        try {
            await appointmentService.updateAppointment(id, {status: "confirmed"})
            fetchAppointments() // recarrega a lista
        } catch (err) {
            console.error("Erro ao confirmar agendamento:", err)
            alert("Erro ao confirmar agendamento. Por favor, tente novamente.")
        }
    }

    const handleCancelAppointment = async (id) => {
        if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return

        try {
            await appointmentService.updateAppointment(id, {status: "cancelled"})
            fetchAppointments() // recarrega a lista
        } catch (err) {
            console.error("Erro ao cancelar agendamento:", err)
            alert("Erro ao cancelar agendamento. Por favor, tente novamente.")
        }
    }

    // Formata a data no formato "dd de mês de yyyy"
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

    // Formata o horário no formato "HH:mm"
    const formatTime = (timeString) => {
        if (!timeString) return ""

        const [hours, minutes] = timeString.substring(0, 5).split(':')

        const date = new Date()
        date.setHours(parseInt(hours), parseInt(minutes))

        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case "confirmed":
                return (
                    <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">
            Confirmado
          </span>
                )
            case "pending":
                return (
                    <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded-full text-xs">
            Pendente
          </span>
                )
            case "cancelled":
                return (
                    <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded-full text-xs">
            Cancelado
          </span>
                )
            default:
                return (
                    <span className="px-2 py-1 bg-gray-900/30 text-gray-400 rounded-full text-xs">
            {status}
          </span>
                )
        }
    }

    return (
        <AdminRoute>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Gerenciar Agendamentos</h1>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md mb-6">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="bg-gray-900">
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Aluno</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Instrutor</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Data</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Horário</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Ações</th>
                                </tr>
                                </thead>
                                <tbody>
                                {appointments.length > 0 ? (
                                    appointments.map((appointment) => {
                                        const user = usersMap[appointment.user_id]
                                        const trainer = trainersMap[appointment.trainer_id]

                                        const userName = user ? user.nome_completo : `ID: ${appointment.user_id}`
                                        const trainerName = trainer ? trainer.nome : `ID: ${appointment.trainer_id}`

                                        return (
                                            <tr key={appointment.id} className="border-b border-gray-700 last:border-0">
                                                <td className="px-4 py-3">{userName}</td>
                                                <td className="px-4 py-3">{trainerName}</td>
                                                <td className="px-4 py-3">{formatDate(appointment.data)}</td>
                                                <td className="px-4 py-3">
                                                    {formatTime(appointment.hora_inicio)} - {formatTime(appointment.hora_fim)}
                                                </td>
                                                <td className="px-4 py-3">{getStatusBadge(appointment.status)}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleViewDetails(appointment)}
                                                            className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                                                            title="Ver detalhes"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                        {appointment.status === "pending" && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleConfirmAppointment(appointment.id)}
                                                                    className="p-1 bg-green-600 hover:bg-green-700 text-white rounded"
                                                                    title="Confirmar"
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleCancelAppointment(appointment.id)}
                                                                    className="p-1 bg-red-600 hover:bg-red-700 text-white rounded"
                                                                    title="Cancelar"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                            Nenhum agendamento encontrado.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {selectedAppointment && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-900">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-semibold">Detalhes do Agendamento</h2>
                                    <button onClick={handleCloseDetails} className="text-gray-400 hover:text-white">
                                        &times;
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">ID</h3>
                                        <p>{selectedAppointment.id}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">Aluno</h3>
                                        <p>
                                            {
                                                usersMap[selectedAppointment.user_id]
                                                    ? usersMap[selectedAppointment.user_id].nome_completo
                                                    : `ID: ${selectedAppointment.user_id}`
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">Instrutor</h3>
                                        <p>
                                            {
                                                trainersMap[selectedAppointment.trainer_id]
                                                    ? trainersMap[selectedAppointment.trainer_id].nome
                                                    : `ID: ${selectedAppointment.trainer_id}`
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">Data</h3>
                                        <p>{formatDate(selectedAppointment.data)}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">Horário</h3>
                                        <p>
                                            {formatTime(selectedAppointment.hora_inicio)} - {formatTime(selectedAppointment.hora_fim)}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">Status</h3>
                                        <p>{getStatusBadge(selectedAppointment.status)}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">Data de Criação</h3>
                                        <p>{formatDate(selectedAppointment.created_at)}</p>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    {selectedAppointment.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    handleConfirmAppointment(selectedAppointment.id)
                                                    handleCloseDetails()
                                                }}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                                            >
                                                Confirmar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleCancelAppointment(selectedAppointment.id)
                                                    handleCloseDetails()
                                                }}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={handleCloseDetails}
                                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminRoute>
    )
}
