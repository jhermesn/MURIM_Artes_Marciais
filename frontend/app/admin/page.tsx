"use client"

import { useState, useEffect } from "react"
import { Search, Download, Trash2, Eye, UserPlus, Users, Mail, Edit, MessageSquare } from "lucide-react"
import AdminRoute from "@/components/admin-route"
import { messageService, userService } from "@/services/api"
import Link from "next/link"

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalAdmins: 0,
    totalMessages: 0,
    unreadMessages: 0,
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [messages, setMessages] = useState([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(true)
  const [messageError, setMessageError] = useState(null)
  const [totalMessages, setTotalMessages] = useState(0)

  const [users, setUsers] = useState([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [userError, setUserError] = useState(null)
  const [totalUsers, setTotalUsers] = useState(0)
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [userCurrentPage, setUserCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [editUserForm, setEditUserForm] = useState({
    nome_completo: "",
    email: "",
    telefone: "",
    cargo: "",
  })

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true)
      try {
              const userStats = await userService.getUserStats()

              const messagesResponse = await messageService.getAllMessages()
        const unreadCount = await messageService.getUnreadMessagesCount()

        setStats({
          totalUsers: userStats.total || 0,
          totalStudents: userStats.alunos || 0,
          totalAdmins: userStats.admin || 0,
          totalMessages: messagesResponse["hydra:totalItems"] || 0,
          unreadMessages: unreadCount,
        })
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error)
      } finally {
        setIsLoadingStats(false)
      }
    }

    if (activeTab === "dashboard") {
      fetchStats()
    }
  }, [activeTab])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoadingMessages(true)
        const response = await messageService.getAllMessages()

              if (response && response["hydra:member"]) {
          setMessages(response["hydra:member"])
          setTotalMessages(response["hydra:totalItems"] || 0)
        } else {
                  setMessages([])
          setTotalMessages(0)
          setMessageError("Formato de resposta inesperado. Verifique a conexão com o backend.")
        }
      } catch (err) {
        console.error("Erro ao carregar mensagens:", err)
        setMessages([])
        setTotalMessages(0)
        setMessageError("Falha ao carregar mensagens. Verifique se o backend está em execução.")
      } finally {
        setIsLoadingMessages(false)
      }
    }

    if (activeTab === "messages") {
      fetchMessages()
    }
  }, [activeTab])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true)
        const response = await userService.getAllUsers()

              if (response && response["hydra:member"]) {
          setUsers(response["hydra:member"])
          setTotalUsers(response["hydra:totalItems"] || 0)
        } else {
                  setUsers([])
          setTotalUsers(0)
          setUserError("Formato de resposta inesperado. Verifique a conexão com o backend.")
        }
      } catch (err) {
        console.error("Erro ao carregar usuários:", err)
        setUsers([])
        setTotalUsers(0)
        setUserError("Falha ao carregar usuários. Verifique se o backend está em execução.")
      } finally {
        setIsLoadingUsers(false)
      }
    }

    if (activeTab === "users") {
      fetchUsers()
    }
  }, [activeTab])

  const filteredMessages = messages.filter(
    (message) =>
      message.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.assunto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.mensagem?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredUsers = users.filter(
    (user) =>
      user.nome_completo?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.cargo?.toLowerCase().includes(userSearchTerm.toLowerCase()),
  )

  const messagesPerPage = 5
  const totalMessagePages = Math.ceil(filteredMessages.length / messagesPerPage)
  const indexOfLastMessage = currentPage * messagesPerPage
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage)

  const usersPerPage = 5
  const totalUserPages = Math.ceil(filteredUsers.length / usersPerPage)
  const indexOfLastUser = userCurrentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return (
      date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    )
  }

  const handleMessageSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) }

  const handleMessagePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleViewMessage = async (message) => {
    setSelectedMessage(message)
      if (message && !message.lida) {
      try {
        await messageService.markAsRead(message.id)
              setMessages(messages.map((m) => (m.id === message.id ? { ...m, lida: true } : m)))
              setStats((prev) => ({
          ...prev,
          unreadMessages: Math.max(0, prev.unreadMessages - 1),
        }))
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
          setStats((prev) => ({
            ...prev,
            unreadMessages: Math.max(0, prev.unreadMessages - 1),
            totalMessages: Math.max(0, prev.totalMessages - 1),
          }))
        } else {
          setStats((prev) => ({
            ...prev,
            totalMessages: Math.max(0, prev.totalMessages - 1),
          }))
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

  const handleUserSearch = (e) => {
    setUserSearchTerm(e.target.value)
    setUserCurrentPage(1) }

  const handleUserPageChange = (pageNumber) => {
    setUserCurrentPage(pageNumber)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setEditUserForm({
      nome_completo: user.nome_completo || "",
      email: user.email || "",
      telefone: user.telefone || "",
      cargo: user.cargo || "",
    })
    setIsEditingUser(true)
  }

  const handleUserFormChange = (e) => {
    const { name, value } = e.target
    setEditUserForm({
      ...editUserForm,
      [name]: value,
    })
  }

  const handleSaveUser = async () => {
    if (!selectedUser) return

    try {
      await userService.updateUser(selectedUser.id, editUserForm)

          setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, ...editUserForm } : user)))

          setIsEditingUser(false)
      setSelectedUser(null)

          alert("Usuário atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error)
      alert("Erro ao atualizar usuário. Por favor, tente novamente.")
    }
  }

  const handleDeleteUser = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) {
      try {
        await userService.deleteUser(id)

              setUsers(users.filter((user) => user.id !== id))
        setTotalUsers((prev) => prev - 1)

              setStats((prev) => ({
          ...prev,
          totalUsers: Math.max(0, prev.totalUsers - 1),
          totalStudents: Math.max(0, prev.totalStudents - 1),       }))

              if (selectedUser && selectedUser.id === id) {
          setIsEditingUser(false)
          setSelectedUser(null)
        }
      } catch (error) {
        console.error("Erro ao excluir usuário:", error)
        alert("Erro ao excluir usuário. Por favor, tente novamente.")
      }
    }
  }

  const handleCloseUserEdit = () => {
    setIsEditingUser(false)
    setSelectedUser(null)
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

  const handleExportUsers = () => {
      const headers = ["ID", "Nome", "Email", "Telefone", "Cargo", "Data de Registro"]
    const csvContent = [
      headers.join(","),
      ...filteredUsers.map((user) =>
        [
          user.id,
          `"${user.nome_completo?.replace(/"/g, '""') || ""}"`,
          `"${user.email?.replace(/"/g, '""') || ""}"`,
          `"${user.telefone?.replace(/"/g, '""') || ""}"`,
          `"${(user.cargo || "").replace(/"/g, '""')}"`,
          `"${user.created_at ? formatDate(user.created_at) : ""}"`,
        ].join(","),
      ),
    ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `usuarios_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Painel Administrativo</h1>
                <p className="text-gray-400">Gerencie mensagens, usuários e conteúdo do site.</p>
              </div>
            </div>

            {/* Abas de navegação */}
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-purple-900 mb-8">
              <div className="flex flex-wrap">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-4 py-3 focus:outline-none ${
                    activeTab === "dashboard"
                      ? "bg-purple-900 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`px-4 py-3 focus:outline-none flex items-center ${
                    activeTab === "messages"
                      ? "bg-purple-900 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  Mensagens
                  {stats.unreadMessages > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                      {stats.unreadMessages}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`px-4 py-3 focus:outline-none ${
                    activeTab === "users"
                      ? "bg-purple-900 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  Usuários
                </button>
              </div>
            </div>

            {/* Conteúdo do Dashboard */}
            {activeTab === "dashboard" && (
              <div>
                <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900 mb-8">
                  <h2 className="text-xl font-semibold mb-6">Visão Geral</h2>

                  {isLoadingStats ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-gray-800 rounded-lg p-6 border border-purple-800">
                        <div className="flex items-center mb-4">
                          <Users className="h-8 w-8 text-purple-500 mr-3" />
                          <div>
                            <h3 className="text-xl font-semibold">{stats.totalUsers}</h3>
                            <p className="text-gray-400 text-sm">Total de Usuários</p>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                          <div>Alunos: {stats.totalStudents}</div>
                          <div>Administradores: {stats.totalAdmins}</div>
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-6 border border-purple-800">
                        <div className="flex items-center mb-4">
                          <MessageSquare className="h-8 w-8 text-purple-500 mr-3" />
                          <div>
                            <h3 className="text-xl font-semibold">{stats.totalMessages}</h3>
                            <p className="text-gray-400 text-sm">Total de Mensagens</p>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                          <div>Não lidas: {stats.unreadMessages}</div>
                          <div>Lidas: {stats.totalMessages - stats.unreadMessages}</div>
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-6 border border-purple-800">
                        <h3 className="font-semibold mb-2">Ações Rápidas</h3>
                        <div className="space-y-2">
                          <Link
                            href="/admin?tab=messages"
                            onClick={(e) => {
                              e.preventDefault()
                              setActiveTab("messages")
                            }}
                            className="flex items-center text-purple-500 hover:text-purple-400"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Ver mensagens não lidas
                          </Link>
                          <Link
                            href="/admin?tab=users"
                            onClick={(e) => {
                              e.preventDefault()
                              setActiveTab("users")
                            }}
                            className="flex items-center text-purple-500 hover:text-purple-400"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Gerenciar usuários
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Conteúdo de Mensagens */}
            {activeTab === "messages" && (
              <div>
                <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900 mb-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Pesquisar mensagens..."
                        value={searchTerm}
                        onChange={handleMessageSearch}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-400">
                        <span>Total: {totalMessages}</span>
                        {stats.unreadMessages > 0 && (
                          <span className="ml-2">
                            | <span className="text-red-500">Não lidas: {stats.unreadMessages}</span>
                          </span>
                        )}
                      </div>
                      <button onClick={handleExportData} className="btn-secondary flex items-center">
                        <Download className="h-5 w-5 mr-2" />
                        Exportar
                      </button>
                    </div>
                  </div>
                </div>

                {isLoadingMessages ? (
                  <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900 mb-8 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : messageError ? (
                  <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-red-900 mb-8 text-center text-red-400">
                    {messageError}
                  </div>
                ) : (
                  <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-purple-900 mb-8">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-purple-900 text-white">
                            <th className="px-6 py-3 text-left text-sm font-semibold">Nome</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Assunto</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Data</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                            <th className="px-6 py-3 text-right text-sm font-semibold">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {currentMessages.length > 0 ? (
                            currentMessages.map((message) => (
                              <tr
                                key={message.id}
                                className={`hover:bg-gray-800 ${!message.lida ? "bg-gray-800/50" : ""}`}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="font-medium">{message.nome_completo}</div>
                                  <div className="text-sm text-gray-400">{message.email}</div>
                                </td>
                                <td className="px-6 py-4">{message.assunto || "N/A"}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {message.created_at ? formatDate(message.created_at) : "N/A"}
                                </td>
                                <td className="px-6 py-4">
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
                                <td className="px-6 py-4 text-right">
                                  <div className="flex justify-end space-x-2">
                                    <button
                                      onClick={() => handleViewMessage(message)}
                                      className="p-1 text-purple-500 hover:text-purple-400 transition-colors"
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
                              <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                                Nenhuma mensagem encontrada.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Paginação */}
                {totalMessagePages > 1 && (
                  <div className="flex justify-center mb-8">
                    <nav className="flex items-center space-x-1">
                      <button
                        onClick={() => handleMessagePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === 1 ? "text-gray-500 cursor-not-allowed" : "text-gray-300 hover:bg-gray-800"
                        }`}
                      >
                        Anterior
                      </button>

                      {Array.from({ length: totalMessagePages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handleMessagePageChange(page)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === page ? "bg-purple-700 text-white" : "text-gray-300 hover:bg-gray-800"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handleMessagePageChange(currentPage + 1)}
                        disabled={currentPage === totalMessagePages}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === totalMessagePages
                            ? "text-gray-500 cursor-not-allowed"
                            : "text-gray-300 hover:bg-gray-800"
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
                            <p className="bg-gray-800 p-4 rounded-md mt-1 whitespace-pre-line">
                              {selectedMessage.mensagem}
                            </p>
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
            )}

            {/* Conteúdo de Usuários */}
            {activeTab === "users" && (
              <div>
                <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900 mb-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Pesquisar usuários..."
                        value={userSearchTerm}
                        onChange={handleUserSearch}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-400">
                        <span>Total: {totalUsers}</span>
                      </div>
                      <button onClick={handleExportUsers} className="btn-secondary flex items-center">
                        <Download className="h-5 w-5 mr-2" />
                        Exportar
                      </button>
                    </div>
                  </div>
                </div>

                {isLoadingUsers ? (
                  <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900 mb-8 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : userError ? (
                  <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-red-900 mb-8 text-center text-red-400">
                    {userError}
                  </div>
                ) : (
                  <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-purple-900 mb-8">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-purple-900 text-white">
                            <th className="px-6 py-3 text-left text-sm font-semibold">Nome</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Cargo</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Telefone</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Data de Registro</th>
                            <th className="px-6 py-3 text-right text-sm font-semibold">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {currentUsers.length > 0 ? (
                            currentUsers.map((user) => (
                              <tr key={user.id} className="hover:bg-gray-800">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="font-medium">{user.nome_completo}</div>
                                  <div className="text-sm text-gray-400">{user.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                  {user.role === "admin" ? (
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-900/30 text-purple-400">
                                      Administrador
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-900/30 text-blue-400">
                                      Aluno
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4">{user.telefone || "N/A"}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {user.created_at ? formatDate(user.created_at) : "N/A"}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex justify-end space-x-2">
                                    <button
                                      onClick={() => handleEditUser(user)}
                                      className="p-1 text-blue-500 hover:text-blue-400 transition-colors"
                                      title="Editar usuário"
                                    >
                                      <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="p-1 text-red-500 hover:text-red-400 transition-colors"
                                      title="Excluir usuário"
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                                Nenhum usuário encontrado.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Paginação */}
                {totalUserPages > 1 && (
                  <div className="flex justify-center mb-8">
                    <nav className="flex items-center space-x-1">
                      <button
                        onClick={() => handleUserPageChange(userCurrentPage - 1)}
                        disabled={userCurrentPage === 1}
                        className={`px-3 py-1 rounded-md ${
                          userCurrentPage === 1 ? "text-gray-500 cursor-not-allowed" : "text-gray-300 hover:bg-gray-800"
                        }`}
                      >
                        Anterior
                      </button>

                      {Array.from({ length: totalUserPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handleUserPageChange(page)}
                          className={`px-3 py-1 rounded-md ${
                            userCurrentPage === page ? "bg-purple-700 text-white" : "text-gray-300 hover:bg-gray-800"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handleUserPageChange(userCurrentPage + 1)}
                        disabled={userCurrentPage === totalUserPages}
                        className={`px-3 py-1 rounded-md ${
                          userCurrentPage === totalUserPages
                            ? "text-gray-500 cursor-not-allowed"
                            : "text-gray-300 hover:bg-gray-800"
                        }`}
                      >
                        Próxima
                      </button>
                    </nav>
                  </div>
                )}

                {/* Modal de edição de usuário */}
                {isEditingUser && selectedUser && (
                  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-900">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h2 className="text-xl font-semibold">Editar Usuário</h2>
                          <button onClick={handleCloseUserEdit} className="text-gray-400 hover:text-white">
                            &times;
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label htmlFor="nome_completo" className="block mb-2 text-sm font-medium">
                              Nome Completo
                            </label>
                            <input
                              type="text"
                              id="nome_completo"
                              name="nome_completo"
                              value={editUserForm.nome_completo}
                              onChange={handleUserFormChange}
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium">
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={editUserForm.email}
                              onChange={handleUserFormChange}
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="telefone" className="block mb-2 text-sm font-medium">
                              Telefone
                            </label>
                            <input
                              type="text"
                              id="telefone"
                              name="telefone"
                              value={editUserForm.telefone}
                              onChange={handleUserFormChange}
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="cargo" className="block mb-2 text-sm font-medium">
                              Cargo
                            </label>
                            <select
                              id="cargo"
                              name="cargo"
                              value={editUserForm.cargo}
                              onChange={handleUserFormChange}
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="">Selecione um cargo</option>
                              <option value="admin">Administrador</option>
                              <option value="aluno">Aluno</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                          <button
                            onClick={handleSaveUser}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={handleCloseUserEdit}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminRoute>
  )
}

