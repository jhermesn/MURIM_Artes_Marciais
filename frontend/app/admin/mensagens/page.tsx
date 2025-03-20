"use client"

import { useState, useEffect } from "react"
import { messageService } from "@/services/api"
import { Loader2, Search, Download, Trash2, Eye } from "lucide-react"
import AdminRoute from "@/components/admin-route"

export default function AdminMensagens() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [totalMessages, setTotalMessages] = useState(0)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        try {
            setLoading(true)
            const response = await messageService.getAllMessages()
            const unreadResponse = await messageService.getUnreadMessagesCount()

            if (response && response["hydra:member"]) {
                setMessages(response["hydra:member"])
                setTotalMessages(response["hydra:totalItems"] || 0)
            } else {
                setMessages([])
                setTotalMessages(0)
            }

            setUnreadCount(unreadResponse?.count || 0)
        } catch (err) {
            console.error("Erro ao buscar mensagens:", err)
            setError("Não foi possível carregar as mensagens. Por favor, tente novamente mais tarde.")
        } finally {
            setLoading(false)
        }
    }

    const handleViewMessage = async (message) => {
        setSelectedMessage(message)
        if (message && !message.lida) {
            try {
                await messageService.markAsRead(message.id)
                setMessages(messages.map((m) => (m.id === message.id ? { ...m, lida: true } : m)))
                setUnreadCount((prev) => Math.max(0, prev - 1))
            } catch (error) {
                console.error("Erro ao marcar mensagem como lida:", error)
            }
        }
    }

    const handleCloseMessage = () => {
        setSelectedMessage(null)
    }

    const handleDeleteMessage = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta mensagem?")) {
            try {
                await messageService.deleteMessage(id)
                const deletedMessage = messages.find((m) => m.id === id)
                setMessages(messages.filter((message) => message.id !== id))
                setTotalMessages((prev) => prev - 1)

                if (deletedMessage && !deletedMessage.lida) {
                    setUnreadCount((prev) => Math.max(0, prev - 1))
                }

                if (selectedMessage && selectedMessage.id === id) {
                    setSelectedMessage(null)
                }
            } catch (error) {
                console.error("Erro ao excluir mensagem:", error)
                alert("Erro ao excluir mensagem. Por favor, tente novamente.")
            }
        }
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handleExportData = () => {
        const headers = ["ID", "Nome", "Email", "Telefone", "Assunto", "Mensagem", "Data"]
        const csvContent = [
            headers.join(","),
            ...filteredMessages.map((message) =>
                [
                    message.id,
                    `"${message.nome_completo?.replace(/"/g, '""') || ""}"`,
                    `"${message.email?.replace(/"/g, '""') || ""}"`,
                    `"${message.telefone?.replace(/"/g, '""') || ""}"`,
                    `"${(message.assunto || "").replace(/"/g, '""')}"`,
                    `"${message.mensagem?.replace(/"/g, '""') || ""}"`,
                    `"${message.created_at ? formatDate(message.created_at) : ""}"`,
                ].join(","),
            ),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `mensagens_${new Date().toISOString().split("T")[0]}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const filteredMessages = messages.filter(
        (message) =>
            message.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.assunto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.mensagem?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const messagesPerPage = 10
    const totalPages = Math.ceil(filteredMessages.length / messagesPerPage)
    const indexOfLastMessage = currentPage * messagesPerPage
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage
    const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage)

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return (
            date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        )
    }

    return (
        <AdminRoute>
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h1 className="text-2xl font-bold">Gerenciar Mensagens</h1>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Pesquisar mensagens..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
              <span className="text-gray-400">
                Total: {totalMessages} | Não lidas: <span className="text-red-400">{unreadCount}</span>
              </span>
                            <button
                                onClick={handleExportData}
                                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                            >
                                <Download className="h-4 w-4" />
                                Exportar
                            </button>
                        </div>
                    </div>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md mb-6">{error}</div>}

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
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Nome</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Assunto</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Data</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Ações</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentMessages.length > 0 ? (
                                    currentMessages.map((message) => (
                                        <tr
                                            key={message.id}
                                            className={`border-b border-gray-700 last:border-0 ${
                                                !message.lida ? "bg-gray-800/50" : "hover:bg-gray-700"
                                            }`}
                                        >
                                            <td className="px-4 py-3">
                                                <div className="font-medium">{message.nome_completo}</div>
                                                <div className="text-sm text-gray-400">{message.email}</div>
                                            </td>
                                            <td className="px-4 py-3">{message.assunto || "N/A"}</td>
                                            <td className="px-4 py-3">{message.created_at ? formatDate(message.created_at) : "N/A"}</td>
                                            <td className="px-4 py-3">
                                                {message.lida ? (
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-900/30 text-green-400">
                              Lida
                            </span>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-900/30 text-red-400">
                              Não lida
                            </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewMessage(message)}
                                                        className="p-1 text-blue-500 hover:text-blue-400 transition-colors"
                                                        title="Ver detalhes"
                                                    >
                                                        <Eye className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteMessage(message.id)}
                                                        className="p-1 text-red-500 hover:text-red-400 transition-colors"
                                                        title="Excluir mensagem"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                                            {searchTerm
                                                ? "Nenhuma mensagem encontrada para a pesquisa."
                                                : "Nenhuma mensagem recebida ainda."}
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Paginação */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        <nav className="flex items-center space-x-1">
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-md ${
                                    currentPage === 1 ? "text-gray-500 cursor-not-allowed" : "text-gray-300 hover:bg-gray-800"
                                }`}
                            >
                                Anterior
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 rounded-md ${
                                        currentPage === page ? "bg-purple-700 text-white" : "text-gray-300 hover:bg-gray-800"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded-md ${
                                    currentPage === totalPages ? "text-gray-500 cursor-not-allowed" : "text-gray-300 hover:bg-gray-800"
                                }`}
                            >
                                Próxima
                            </button>
                        </nav>
                    </div>
                )}

                {/* Modal de visualização de mensagem */}
                {selectedMessage && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-900">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-semibold">Detalhes da Mensagem</h2>
                                    <button onClick={handleCloseMessage} className="text-gray-400 hover:text-white">
                                        &times;
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">Nome</h3>
                                        <p>{selectedMessage.nome_completo}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">Email</h3>
                                        <p>{selectedMessage.email}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">Telefone</h3>
                                        <p>{selectedMessage.telefone}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">Assunto</h3>
                                        <p>{selectedMessage.assunto || "N/A"}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">Data</h3>
                                        <p>{selectedMessage.created_at ? formatDate(selectedMessage.created_at) : "N/A"}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">Status</h3>
                                        <p>
                                            {selectedMessage.lida ? (
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-900/30 text-green-400">
                          Lida
                        </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-900/30 text-red-400">
                          Não lida
                        </span>
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">Mensagem</h3>
                                        <p className="bg-gray-800 p-4 rounded-md mt-1 whitespace-pre-line">{selectedMessage.mensagem}</p>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                                    >
                                        Excluir
                                    </button>
                                    <button
                                        onClick={handleCloseMessage}
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

