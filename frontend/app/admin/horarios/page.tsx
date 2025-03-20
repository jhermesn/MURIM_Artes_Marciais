"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { scheduleService } from "@/services/api"
import { Loader2, Plus, Pencil, Trash2, Save, X } from "lucide-react"
import AdminRoute from "@/components/admin-route"

type Schedule = {
  id: number
  dia_semana: string
  hora_inicio: string
  hora_fim: string
  modalidade: string
  nivel: string
}

type EditingSchedule = Schedule & {
  isNew?: boolean
}

export default function AdminHorarios() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingSchedule, setEditingSchedule] = useState<EditingSchedule | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const diasSemana = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo",
  ]

  const niveis = [
    "Iniciante",
    "Intermediário",
    "Avançado",
    "Iniciante/Intermediário",
    "Intermediário/Avançado",
    "Todos os níveis",
    "Infantil (7-12 anos)",
  ]

  const modalidades = ["Kung Fu", "Tai Chi Chuan", "Wing Chun", "Sanda (Boxe Chinês)", "Qi Gong"]

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      const response = await scheduleService.getAllSchedules()

      if (response && response["hydra:member"]) {
        const sortedSchedules = [...response["hydra:member"]].sort((a, b) => {
          const dayOrder = diasSemana.indexOf(a.dia_semana) - diasSemana.indexOf(b.dia_semana)
          if (dayOrder !== 0) return dayOrder
          return a.hora_inicio.localeCompare(b.hora_inicio)
        })

        setSchedules(sortedSchedules)
      }
    } catch (err) {
      console.error("Erro ao buscar horários:", err)
      setError("Não foi possível carregar os horários. Por favor, tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = () => {
    const newSchedule: EditingSchedule = {
      id: -1,
      dia_semana: diasSemana[0],
      hora_inicio: "07:00:00",
      hora_fim: "08:30:00",
      modalidade: modalidades[0],
      nivel: niveis[0],
      isNew: true,
    }
    setEditingSchedule(newSchedule)
  }

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule({ ...schedule })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingSchedule) return

    setEditingSchedule({
      ...editingSchedule,
      [e.target.name]: e.target.value,
    })
  }

  const handleCancel = () => {
    setEditingSchedule(null)
  }

  const handleSave = async () => {
    if (!editingSchedule) return

    try {
      setIsSubmitting(true)

      const { isNew, ...scheduleData } = editingSchedule

      if (isNew) {
        await scheduleService.createSchedule(scheduleData)
      } else {
        await scheduleService.updateSchedule(editingSchedule.id, scheduleData)
      }

      await fetchSchedules()
      setEditingSchedule(null)
    } catch (err) {
      console.error("Erro ao salvar horário:", err)
      alert("Erro ao salvar horário. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este horário?")) return

    try {
      setLoading(true)
      await scheduleService.deleteSchedule(id)
      await fetchSchedules()
    } catch (err) {
      console.error("Erro ao excluir horário:", err)
      alert("Erro ao excluir horário. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Horários</h1>
          <button
            onClick={handleAddNew}
            disabled={!!editingSchedule || loading}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            <Plus size={16} />
            Adicionar Horário
          </button>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md mb-6">{error}</div>}

        {loading && !editingSchedule ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Dia da Semana</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Horário</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Modalidade</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Nível</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {editingSchedule && (
                    <tr className="bg-purple-900/20 border-b border-gray-700">
                      <td className="px-4 py-3">
                        <select
                          name="dia_semana"
                          value={editingSchedule.dia_semana}
                          onChange={handleChange}
                          className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
                        >
                          {diasSemana.map((dia) => (
                            <option key={dia} value={dia}>
                              {dia}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            name="hora_inicio"
                            value={editingSchedule.hora_inicio.substring(0, 5)}
                            onChange={(e) =>
                              handleChange({
                                ...e,
                                target: {
                                  ...e.target,
                                  name: "hora_inicio",
                                  value: e.target.value + ":00",
                                },
                              } as any)
                            }
                            className="bg-gray-700 text-white rounded-md px-3 py-2"
                          />
                          <span className="text-gray-400">até</span>
                          <input
                            type="time"
                            name="hora_fim"
                            value={editingSchedule.hora_fim.substring(0, 5)}
                            onChange={(e) =>
                              handleChange({
                                ...e,
                                target: {
                                  ...e.target,
                                  name: "hora_fim",
                                  value: e.target.value + ":00",
                                },
                              } as any)
                            }
                            className="bg-gray-700 text-white rounded-md px-3 py-2"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          name="modalidade"
                          value={editingSchedule.modalidade}
                          onChange={handleChange}
                          className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
                        >
                          {modalidades.map((modalidade) => (
                            <option key={modalidade} value={modalidade}>
                              {modalidade}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          name="nivel"
                          value={editingSchedule.nivel}
                          onChange={handleChange}
                          className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
                        >
                          {niveis.map((nivel) => (
                            <option key={nivel} value={nivel}>
                              {nivel}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className="p-1 bg-green-600 hover:bg-green-700 text-white rounded"
                            title="Salvar"
                          >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="p-1 bg-gray-600 hover:bg-gray-700 text-white rounded"
                            title="Cancelar"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {schedules.map((schedule) => (
                    <tr key={schedule.id} className="border-b border-gray-700 last:border-0">
                      <td className="px-4 py-3">{schedule.dia_semana}</td>
                      <td className="px-4 py-3">
                        {schedule.hora_inicio.substring(0, 5)} - {schedule.hora_fim.substring(0, 5)}
                      </td>
                      <td className="px-4 py-3">{schedule.modalidade}</td>
                      <td className="px-4 py-3">{schedule.nivel}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(schedule)}
                            disabled={!!editingSchedule}
                            className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(schedule.id)}
                            disabled={!!editingSchedule || loading}
                            className="p-1 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {schedules.length === 0 && !editingSchedule && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                        Nenhum horário cadastrado. Clique em "Adicionar Horário" para começar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminRoute>
  )
}

