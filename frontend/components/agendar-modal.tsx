"use client"

import { useState } from "react"
import { Calendar, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { appointmentService } from "@/services/api"
import { useAuth } from "@/contexts/AuthContext"
import { format, parse } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Trainer {
  id: number
  nome: string
  especialidade: string
}

interface AgendarModalProps {
  trainer: Trainer
  isOpen: boolean
  onClose: () => void
}

registerLocale('pt-BR', ptBR);

export default function AgendarModal({ trainer, isOpen, onClose }: AgendarModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"))
  const [horaInicio, setHoraInicio] = useState<string>("08:00")
  const [horaFim, setHoraFim] = useState<string>("09:00")
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()

  if (!isOpen) return null

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return ""
    const parsedDate = parse(dateString, "yyyy-MM-dd", new Date())
    if (isNaN(parsedDate.getTime())) {
      return "Data inválida"
    }
    return format(parsedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  const handleSubmit = async () => {
    if (!user) return

    try {
      setSubmitting(true)

      const appointmentData = {
        user_id: user.id,
        trainer_id: trainer.id,
        data: selectedDate,
        hora_inicio: horaInicio,
        hora_fim: horaFim,
        status: "pending",
      }

      const response = await appointmentService.createAppointment(appointmentData)

      if (response && response.success) {
        toast({
          title: "Agendamento realizado com sucesso!",
          description: `Seu agendamento com ${trainer.nome} foi confirmado para ${formatDateForDisplay(
              selectedDate
          )}, das ${horaInicio} às ${horaFim}.`,
          variant: "default",
        })
        onClose()
      }
    } catch (error) {
      console.error("Erro ao agendar:", error)
      toast({
        title: "Erro ao realizar agendamento",
        description: "Ocorreu um erro ao tentar agendar. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <Toaster />
        <div className="bg-gray-900 rounded-lg border border-purple-800 w-full max-w-md">
          <div className="flex justify-between items-center p-4 border-b border-gray-800">
            <h2 className="text-xl font-semibold">Agendar com {trainer.nome}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Data</label>
              <div className="relative">
                <DatePicker
                    selected={selectedDate ? new Date(selectedDate) : new Date()}
                    onChange={(date) => {
                      if (date) {
                        setSelectedDate(format(date, 'yyyy-MM-dd'));
                      }
                    }}
                    dateFormat="dd/MM/yyyy"
                    locale="pt-BR"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white pl-3 pr-10"
                    customInput={
                      <div className="relative w-full">
                        <input
                            className="w-full p-2 bg-gray-800 rounded-md text-white pl-3 pr-10"
                            value={selectedDate ? format(new Date(`${selectedDate}T12:00:00`), 'dd/MM/yyyy', { locale: ptBR }) : ''}
                            readOnly
                        />
                        <Calendar className="absolute right-3 top-5 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    }
                />
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Data selecionada: {formatDateForDisplay(selectedDate)}
              </p>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Hora início</label>
                <div className="relative">
                  <input
                      type="time"
                      value={horaInicio}
                      onChange={(e) => setHoraInicio(e.target.value)}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  />
                  <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Hora fim</label>
                <div className="relative">
                  <input
                      type="time"
                      value={horaFim}
                      onChange={(e) => setHoraFim(e.target.value)}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  />
                  <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-purple-700 hover:bg-purple-600"
              >
                {submitting ? "Agendando..." : "Confirmar"}
              </Button>
            </div>
          </div>
        </div>
      </div>
  )
}
