"use client"

import { useEffect, useState } from "react"
import { Clock, Calendar, Loader2 } from "lucide-react"
import { scheduleService } from "@/services/api"

type ApiSchedule = {
  id: number
  dia_semana: string
  hora_inicio: string
  hora_fim: string
  modalidade: string
  nivel: string
}

type ClassItem = {
  time: string
  name: string
  level: string
}

type ScheduleDay = {
  day: string
  classes: ClassItem[]
}

export default function Horarios() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [schedules, setSchedules] = useState<ScheduleDay[]>([])

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true)
        const response = await scheduleService.getAllSchedules()

        if (response && response["hydra:member"]) {
                    const apiSchedules: ApiSchedule[] = response["hydra:member"]
          const formattedSchedules = formatSchedulesForDisplay(apiSchedules)
          setSchedules(formattedSchedules)
        } else {
                    setSchedules([])
        }
      } catch (err) {
        console.error("Erro ao buscar horários:", err)
        setError("Não foi possível carregar os horários. Por favor, tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchSchedules()
  }, [])

    const formatSchedulesForDisplay = (apiSchedules: ApiSchedule[]): ScheduleDay[] => {
        const scheduleMap = new Map<string, ClassItem[]>()

        const weekDaysOrder = [
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
      "Domingo",
    ]

        weekDaysOrder.forEach((day) => {
      scheduleMap.set(day, [])
    })

        apiSchedules.forEach((schedule) => {
      const classItem: ClassItem = {
        time: `${formatTime(schedule.hora_inicio)} - ${formatTime(schedule.hora_fim)}`,
        name: schedule.modalidade,
        level: schedule.nivel,
      }

      const dayClasses = scheduleMap.get(schedule.dia_semana) || []
      dayClasses.push(classItem)
      scheduleMap.set(schedule.dia_semana, dayClasses)
    })

        const formattedSchedules: ScheduleDay[] = []

    weekDaysOrder.forEach((day) => {
      const classes = scheduleMap.get(day) || []
            if (classes.length > 0) {
                classes.sort((a, b) => {
          const timeA = a.time.split(" - ")[0]
          const timeB = b.time.split(" - ")[0]
          return timeA.localeCompare(timeB)
        })

        formattedSchedules.push({
          day,
          classes,
        })
      }
    })

    return formattedSchedules
  }

    const formatTime = (time: string): string => {
    if (!time) return ""
    const [hours, minutes] = time.split(":")
    return `${hours}:${minutes}`
  }

    if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
          <p className="text-gray-300">Carregando horários...</p>
        </div>
      </div>
    )
  }

    if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg p-6 shadow-lg border border-red-500">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Erro ao Carregar Horários</h1>
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-md text-white"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

    if (schedules.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Horários de Aulas</h1>
            <p className="text-gray-400 mb-8">
              Confira nossa programação semanal de aulas e encontre o melhor horário para você.
            </p>

            <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900">
              <p className="text-gray-300 text-center">
                Não há horários disponíveis no momento. Por favor, entre em contato conosco para mais informações.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

    return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Horários de Aulas</h1>
          <p className="text-gray-400 mb-8">
            Confira nossa programação semanal de aulas e encontre o melhor horário para você.
          </p>

          <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900 mb-8">
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-purple-500 mr-2" />
              <h2 className="text-xl font-semibold">Programação Semanal</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Nossa academia está aberta de segunda a sexta das 6h às 22h30, e aos sábados das 8h às 17h. Confira abaixo
              os horários específicos de cada modalidade.
            </p>
          </div>

          <div className="space-y-8">
            {schedules.map((schedule, index) => (
              <div key={index} className="bg-gray-900 rounded-lg overflow-hidden border border-purple-900">
                <div className="bg-purple-900 px-6 py-3">
                  <h3 className="text-lg font-semibold text-white">{schedule.day}</h3>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left pb-3 text-gray-400">Horário</th>
                          <th className="text-left pb-3 text-gray-400">Modalidade</th>
                          <th className="text-left pb-3 text-gray-400">Nível</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.classes.map((classItem, classIndex) => (
                          <tr key={classIndex} className="border-b border-gray-800 last:border-0">
                            <td className="py-3 flex items-center">
                              <Clock className="h-4 w-4 text-purple-500 mr-2" />
                              <span>{classItem.time}</span>
                            </td>
                            <td className="py-3 font-medium">{classItem.name}</td>
                            <td className="py-3 text-gray-400">{classItem.level}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900">
            <h3 className="text-xl font-semibold mb-4">Informações Importantes</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span>Recomendamos chegar com 15 minutos de antecedência para se preparar adequadamente.</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span>Traga roupas confortáveis e uma garrafa de água.</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span>
                  Alunos iniciantes podem participar de qualquer aula marcada como "Iniciante" ou "Todos os níveis".
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span>
                  Em caso de dúvidas sobre qual modalidade escolher, agende uma consulta com nossos instrutores.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

