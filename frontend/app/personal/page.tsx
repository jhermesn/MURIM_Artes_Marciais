"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { User, CheckCircle, Calendar } from "lucide-react"
import { trainerService } from "@/services/api"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import AgendarModal from "@/components/agendar-modal"

interface Trainer {
  id: number
  nome: string
  especialidade: string
  experience: string
  descricao: string
  availability: string
  imagem: string
}

export default function Personal() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [showModal, setShowModal] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const benefits = [
    "Instrução de alta qualidade por mestres experientes",
    "Atenção individualizada em aulas em grupo",
    "Progressão técnica estruturada",
    "Ambiente de treino tradicional e respeitoso",
    "Desenvolvimento físico e mental integrado",
    "Aprendizado da filosofia e cultura das artes marciais chinesas",
  ]

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true)
        const response = await trainerService.getAllTrainers()
        if (response && response["hydra:member"]) {
          setTrainers(response["hydra:member"])
        }
      } catch (error) {
        console.error("Erro ao buscar trainers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrainers()
  }, [])

  const handleAgendar = (trainer: Trainer) => {
    if (!user) {
            router.push("/login?redirect=/personal")
      return
    }
    setSelectedTrainer(trainer)
    setShowModal(true)
  }

    const parseAvailability = (availability: string): string[] => {
    if (!availability) return []
    return availability.split(", ")
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Nossos Mestres</h1>
            <p className="text-gray-400 mb-8">
              Conheça os mestres que ministram as aulas em nossa academia, todos com vasta experiência e conhecimento.
            </p>

            <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900 mb-12">
              <h2 className="text-xl font-semibold mb-4">Benefícios de Treinar com Nossos Mestres</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{benefit}</span>
                    </div>
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Mestres Instrutores</h2>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-gray-900 rounded-lg overflow-hidden border border-purple-900">
                        <Skeleton className="h-64 w-full" />
                        <div className="p-6">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2 mb-3" />
                          <Skeleton className="h-4 w-2/3 mb-3" />
                          <Skeleton className="h-16 w-full mb-4" />
                          <div className="border-t border-gray-800 pt-4">
                            <Skeleton className="h-4 w-1/3 mb-2" />
                            <div className="flex flex-wrap gap-2">
                              {[1, 2, 3].map((j) => (
                                  <Skeleton key={j} className="h-6 w-16 rounded-full" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {trainers.length > 0 ? (
                      trainers.map((trainer) => (
                          <div
                              key={trainer.id}
                              className="bg-gray-900 rounded-lg overflow-hidden border border-purple-900 transition-all duration-300 hover:border-purple-500"
                          >
                            <div className="relative h-64 w-full">
                              <Image
                                  src={trainer.imagem || "/placeholder.svg?height=400&width=400"}
                                  alt={trainer.nome}
                                  fill
                                  className="object-cover"
                              />
                            </div>
                            <div className="p-6">
                              <h3 className="text-xl font-semibold mb-1">{trainer.nome}</h3>
                              <p className="text-purple-500 mb-3">{trainer.especialidade}</p>
                              <div className="flex items-center text-gray-400 mb-3">
                                <User className="h-4 w-4 mr-2" />
                                <span>{trainer.experience} de experiência</span>
                              </div>
                              <p className="text-gray-300 mb-4">{trainer.descricao}</p>
                              <div className="border-t border-gray-800 pt-4 mb-4">
                                <p className="text-sm text-gray-400 mb-2">Dias de aula:</p>
                                <div className="flex flex-wrap gap-2">
                                  {parseAvailability(trainer.availability).map((day, index) => (
                                      <span key={index} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                              {day}
                            </span>
                                  ))}
                                </div>
                              </div>
                              <Button
                                  onClick={() => handleAgendar(trainer)}
                                  className="w-full bg-purple-700 hover:bg-purple-600 text-white"
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                Agendar com este Mestre
                              </Button>
                            </div>
                          </div>
                      ))
                  ) : (
                      <div className="col-span-2 text-center py-10">
                        <p className="text-gray-400">Nenhum mestre encontrado. Por favor, tente novamente mais tarde.</p>
                      </div>
                  )}
                </div>
            )}

            <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900">
              <h2 className="text-xl font-semibold mb-4">Informações Adicionais</h2>
              <p className="text-gray-300 mb-4">
                Para conhecer os horários específicos das aulas ministradas por cada mestre, consulte nossa
                <a href="/horarios" className="text-purple-500 hover:text-purple-400">
                  {" "}
                  página de horários
                </a>
                .
              </p>
              <p className="text-gray-300">
                Todos os nossos mestres estão disponíveis para responder dúvidas antes ou após as aulas regulares.
                Sinta-se à vontade para conversar com eles sobre seu progresso e objetivos de treinamento.
              </p>
            </div>
          </div>
        </div>

        {showModal && selectedTrainer && (
            <AgendarModal trainer={selectedTrainer} isOpen={showModal} onClose={() => setShowModal(false)} />
        )}
      </div>
  )
}
