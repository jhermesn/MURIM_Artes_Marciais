"use client"

import { useState, useEffect } from "react"
import { userService } from "@/services/api"
import { Loader2, Search, Download, Trash2, Edit, Save } from "lucide-react"
import AdminRoute from "@/components/admin-route"

export default function AdminUsuarios() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedUser, setSelectedUser] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({
        nome_completo: "",
        email: "",
        telefone: "",
        role: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [stats, setStats] = useState({
        total: 0,
        alunos: 0,
        admin: 0,
    })

    useEffect(() => {
        fetchUsers()
        fetchStats()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await userService.getAllUsers()

            if (response && response["hydra:member"]) {
                setUsers(response["hydra:member"])
            } else {
                setUsers([])
            }
        } catch (err) {
            console.error("Erro ao buscar usuários:", err)
            setError("Não foi possível carregar os usuários. Por favor, tente novamente mais tarde.")
        } finally {
            setLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            const response = await userService.getUserStats()
            setStats(response || { total: 0, alunos: 0, admin: 0 })
        } catch (err) {
            console.error("Erro ao buscar estatísticas:", err)
        }
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handleEdit = (user) => {
        setSelectedUser(user)
        setEditForm({
            nome_completo: user.nome_completo || "",
            email: user.email || "",
            telefone: user.telefone || "",
            role: user.role || "aluno",
        })
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
        setSelectedUser(null)
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setEditForm({
            ...editForm,
            [name]: value,
        })
    }

    const handleSaveUser = async () => {
        if (!selectedUser) return

        try {
            setIsSubmitting(true)
            await userService.updateUser(selectedUser.id, editForm)

            setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, ...editForm } : user)))

            if (selectedUser.role !== editForm.role) {
                fetchStats()
            }

            setIsEditing(false)
            setSelectedUser(null)
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error)
            alert("Erro ao atualizar usuário. Por favor, tente novamente.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteUser = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) {
            try {
                await userService.deleteUser(id)

                const deletedUser = users.find((user) => user.id === id)
                setUsers(users.filter((user) => user.id !== id))

                if (deletedUser) {
                    setStats((prev) => ({
                        ...prev,
                        total: Math.max(0, prev.total - 1),
                        [deletedUser.role === "admin" ? "admin" : "alunos"]: Math.max(
                            0,
                            prev[deletedUser.role === "admin" ? "admin" : "alunos"] - 1,
                        ),
                    }))
                }

                if (selectedUser && selectedUser.id === id) {
                    setIsEditing(false)
                    setSelectedUser(null)
                }
            } catch (error) {
                console.error("Erro ao excluir usuário:", error)
                alert("Erro ao excluir usuário. Por favor, tente novamente.")
            }
        }
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
                    `"${(user.role || "").replace(/"/g, '""')}"`,
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

    const filteredUsers = users.filter(
        (user) =>
            user.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const usersPerPage = 10
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

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
                    <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Pesquisar usuários..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
              <span className="text-gray-400">
                Total: {stats.total} | Alunos: {stats.alunos} | Admin: {stats.admin}
              </span>
                            <button
                                onClick={handleExportUsers}
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
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Email</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Telefone</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Cargo</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Registro</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Ações</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentUsers.length > 0 ? (
                                    currentUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-700 last:border-0 hover:bg-gray-700">
                                            <td className="px-4 py-3 font-medium">{user.nome_completo}</td>
                                            <td className="px-4 py-3">{user.email}</td>
                                            <td className="px-4 py-3">{user.telefone || "N/A"}</td>
                                            <td className="px-4 py-3">
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
                                            <td className="px-4 py-3">{user.created_at ? formatDate(user.created_at) : "N/A"}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(user)}
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
                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                            {searchTerm ? "Nenhum usuário encontrado para a pesquisa." : "Nenhum usuário cadastrado."}
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

                {/* Modal de edição de usuário */}
                {isEditing && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-purple-900">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-semibold">Editar Usuário</h2>
                                    <button onClick={handleCloseEdit} className="text-gray-400 hover:text-white">
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
                                            value={editForm.nome_completo}
                                            onChange={handleFormChange}
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
                                            value={editForm.email}
                                            onChange={handleFormChange}
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
                                            value={editForm.telefone}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="role" className="block mb-2 text-sm font-medium">
                                            Cargo
                                        </label>
                                        <select
                                            id="role"
                                            name="role"
                                            value={editForm.role}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="aluno">Aluno</option>
                                            <option value="admin">Administrador</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        onClick={handleSaveUser}
                                        disabled={isSubmitting}
                                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                                    >
                                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        Salvar
                                    </button>
                                    <button
                                        onClick={handleCloseEdit}
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
        </AdminRoute>
    )
}

