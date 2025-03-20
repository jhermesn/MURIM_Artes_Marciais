"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { trainerService } from "@/services/api"
import { Loader2, Plus, Pencil, Trash2, Save } from "lucide-react"
import AdminRoute from "@/components/admin-route"
import Image from "next/image"

type Trainer = {
    id: number
    nome: string
    especialidade: string
    experience: string
    descricao: string
    availability: string
    imagem: string
}

type EditingTrainer = Trainer & {
    isNew?: boolean
}

export default function AdminInstrutores() {
    const [trainers, setTrainers] = useState<Trainer[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [editingTrainer, setEditingTrainer] = useState<EditingTrainer | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        fetchTrainers()
    }, [])

    const fetchTrainers = async () => {
        try {
            setLoading(true)
            const response = await trainerService.getAllTrainers()

            if (response && response["hydra:member"]) {
                setTrainers(response["hydra:member"])
            }
        } catch (err) {
            console.error("Erro ao buscar instrutores:", err)
            setError("Não foi possível carregar os instrutores. Por favor, tente novamente mais tarde.")
        } finally {
            setLoading(false)
        }
    }

    const handleAddNew = () => {
        const newTrainer: EditingTrainer = {
            id: -1,
            nome: "",
            especialidade: "",
            experience: "",
            descricao: "",
            availability: "",
            imagem: "/placeholder.svg?height=400&width=400",
            isNew: true,
        }
        setEditingTrainer(newTrainer)
    }

    const handleEdit = (trainer: Trainer) => {
        setEditingTrainer({ ...trainer })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!editingTrainer) return

        setEditingTrainer({
            ...editingTrainer,
            [e.target.name]: e.target.value,
        })
    }

    const handleCancel = () => {
        setEditingTrainer(null)
    }

    const handleSave = async () => {
        if (!editingTrainer) return

        try {
            setIsSubmitting(true)

            const { isNew, ...trainerData } = editingTrainer

            if (isNew) {
                await trainerService.createTrainer(trainerData)
            } else {
                await trainerService.updateTrainer(editingTrainer.id, trainerData)
            }

            await fetchTrainers()
            setEditingTrainer(null)
        } catch (err) {
            console.error("Erro ao salvar instrutor:", err)
            alert("Erro ao salvar instrutor. Por favor, tente novamente.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir este instrutor?")) return

        try {
            setLoading(true)
            await trainerService.deleteTrainer(id)
            await fetchTrainers()
        } catch (err) {
            console.error("Erro ao excluir instrutor:", err)
            alert("Erro ao excluir instrutor. Por favor, tente novamente.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminRoute>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Gerenciar Instrutores</h1>
                    <button
                        onClick={handleAddNew}
                        disabled={!!editingTrainer || loading}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                    >
                        <Plus size={16} />
                        Adicionar Instrutor
                    </button>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md mb-6">{error}</div>}

                {editingTrainer && (
                    <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-purple-800">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingTrainer.isNew ? "Adicionar Instrutor" : "Editar Instrutor"}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Nome</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={editingTrainer.nome}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Especialidade</label>
                                <input
                                    type="text"
                                    name="especialidade"
                                    value={editingTrainer.especialidade}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Experiência</label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={editingTrainer.experience}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Ex: 10 anos"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Disponibilidade</label>
                                <input
                                    type="text"
                                    name="availability"
                                    value={editingTrainer.availability}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Ex: Seg, Qua, Sex"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block mb-2 text-sm font-medium">Descrição</label>
                                <textarea
                                    name="descricao"
                                    value={editingTrainer.descricao}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                ></textarea>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block mb-2 text-sm font-medium">URL da Imagem</label>
                                <input
                                    type="text"
                                    name="imagem"
                                    value={editingTrainer.imagem}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="/placeholder.svg?height=400&width=400"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Salvar
                            </button>
                        </div>
                    </div>
                )}

                {loading && !editingTrainer ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trainers.length > 0 ? (
                            trainers.map((trainer) => (
                                <div
                                    key={trainer.id}
                                    className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-700 transition-colors"
                                >
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={trainer.imagem || "/placeholder.svg?height=400&width=400"}
                                            alt={trainer.nome}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold">{trainer.nome}</h3>
                                        <p className="text-purple-400 text-sm mb-2">{trainer.especialidade}</p>
                                        <p className="text-gray-400 text-sm mb-2">Experiência: {trainer.experience}</p>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{trainer.descricao}</p>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(trainer)}
                                                disabled={!!editingTrainer}
                                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
                                                title="Editar"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(trainer.id)}
                                                disabled={!!editingTrainer || loading}
                                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50"
                                                title="Excluir"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-400">
                                Nenhum instrutor cadastrado. Clique em "Adicionar Instrutor" para começar.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminRoute>
    )
}

