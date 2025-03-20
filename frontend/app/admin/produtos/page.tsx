"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    AlertCircle,
    CheckCircle2,
    X,
    Filter,
    ArrowUpDown,
    ImageIcon,
} from "lucide-react"
import { productService } from "@/services/api"
import { useToast } from "@/components/ui/use-toast"
import AdminRoute from "@/components/admin-route"
import Image from "next/image"

interface Produto {
    id: number
    nome: string
    descricao: string
    preco: string
    imagem: string
    categoria: string
}

export default function AdminProdutos() {
    const { toast } = useToast()
    const router = useRouter()

    const [produtos, setProdutos] = useState<Produto[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategoria, setSelectedCategoria] = useState<string>("")
    const [sortField, setSortField] = useState<string>("nome")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentProduto, setCurrentProduto] = useState<Partial<Produto> | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const categorias = [
        { id: "uniformes", nome: "Uniformes Tradicionais" },
        { id: "calcados", nome: "Calçados" },
        { id: "protecao", nome: "Equipamentos de Proteção" },
        { id: "acessorios", nome: "Acessórios" },
    ]


    useEffect(() => {
        fetchProdutos()
    }, [])

    const fetchProdutos = async () => {
        try {
            setIsLoading(true)
            const response = await productService.getAllProducts()

            if (response && response["hydra:member"]) {
                setProdutos(response["hydra:member"])
            } else {
                setProdutos([])
                setError("Não foi possível carregar os produtos. Formato de resposta inesperado.")
            }
        } catch (err) {
            console.error("Erro ao carregar produtos:", err)
            setError("Falha ao carregar produtos. Verifique a conexão com o backend.")
        } finally {
            setIsLoading(false)
        }
    }

    const filteredProdutos = produtos
        .filter(
            (produto) =>
                produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                produto.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .filter((produto) => (selectedCategoria ? produto.categoria === selectedCategoria : true))
        .sort((a, b) => {
            if (sortField === "nome") {
                return sortDirection === "asc" ? a.nome.localeCompare(b.nome) : b.nome.localeCompare(a.nome)
            } else if (sortField === "preco") {
                const precoA = Number.parseFloat(a.preco.replace(/[^\d,]/g, "").replace(",", "."))
                const precoB = Number.parseFloat(b.preco.replace(/[^\d,]/g, "").replace(",", "."))
                return sortDirection === "asc" ? precoA - precoB : precoB - precoA
            }
            return 0
        })

    const openProdutoModal = (produto: Partial<Produto> | null = null) => {
        setCurrentProduto(
            produto || {
                nome: "",
                descricao: "",
                preco: "",
                imagem: "/placeholder.svg?height=300&width=300",
                categoria: "uniformes",
            },
        )
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setCurrentProduto(null)
    }

    const handleSaveProduto = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!currentProduto) return

        try {
            setIsSubmitting(true)

            let precoFormatado = currentProduto.preco || ""
            if (!precoFormatado.startsWith("R$")) {
                precoFormatado = `R$ ${precoFormatado}`
            }

            const produtoData = {
                ...currentProduto,
                preco: precoFormatado,
            }

            if (currentProduto.id) {
                await productService.updateProduct(currentProduto.id, produtoData)
                toast({
                    title: "Produto atualizado",
                    description: "O produto foi atualizado com sucesso.",
                    variant: "default",
                })
            } else {
                await productService.createProduct(produtoData)
                toast({
                    title: "Produto adicionado",
                    description: "O novo produto foi adicionado com sucesso.",
                    variant: "default",
                })
            }

            fetchProdutos()
            closeModal()
        } catch (err) {
            console.error("Erro ao salvar produto:", err)
            toast({
                title: "Erro",
                description: "Ocorreu um erro ao salvar o produto. Tente novamente.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteProduto = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir este produto?")) return

        try {
            await productService.deleteProduct(id)
            toast({
                title: "Produto excluído",
                description: "O produto foi excluído com sucesso.",
                variant: "default",
            })
            fetchProdutos()
        } catch (err) {
            console.error("Erro ao excluir produto:", err)
            toast({
                title: "Erro",
                description: "Ocorreu um erro ao excluir o produto. Tente novamente.",
                variant: "destructive",
            })
        }
    }

    const toggleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    return (
        <AdminRoute>
            <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Gerenciamento de Produtos</h1>
                        <p className="text-gray-400 mb-8">Adicione, edite e remova produtos disponíveis para venda na academia.</p>

                        {/* Barra de ações */}
                        <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-purple-900 flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-auto flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Buscar produtos..."
                                    className="pl-10 pr-4 py-2 w-full rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <Filter className="text-gray-400 h-4 w-4" />
                                <select
                                    className="py-2 px-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={selectedCategoria}
                                    onChange={(e) => setSelectedCategoria(e.target.value)}
                                >
                                    <option value="">Todas as categorias</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={() => openProdutoModal()}
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors w-full md:w-auto justify-center"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Adicionar Produto</span>
                            </button>
                        </div>

                        {error && (
                            <div className="mb-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded flex items-start">
                                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Tabela de produtos */}
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                            </div>
                        ) : filteredProdutos.length > 0 ? (
                            <div className="bg-gray-900 rounded-lg border border-purple-900 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-800">
                                        <thead className="bg-gray-800">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                                            >
                                                Imagem
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                                                onClick={() => toggleSort("nome")}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Nome
                                                    <ArrowUpDown className="h-3 w-3" />
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                                            >
                                                Categoria
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                                                onClick={() => toggleSort("preco")}
                                            >
                                                <div className="flex items-center gap-1">
                                                    Preço
                                                    <ArrowUpDown className="h-3 w-3" />
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
                                            >
                                                Ações
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                        {filteredProdutos.map((produto) => (
                                            <tr key={produto.id} className="hover:bg-gray-800/50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="relative h-12 w-12 rounded overflow-hidden">
                                                        <Image
                                                            src={produto.imagem || "/placeholder.svg?height=100&width=100"}
                                                            alt={produto.nome}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-white">{produto.nome}</div>
                                                    <div className="text-xs text-gray-400 max-w-xs truncate">{produto.descricao}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-900 text-purple-200">
                              {categorias.find((cat) => cat.id === produto.categoria)?.nome || produto.categoria}
                            </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-400 font-medium">
                                                    {produto.preco}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => openProdutoModal(produto)}
                                                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Pencil className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduto(produto.id)}
                                                            className="text-red-400 hover:text-red-300 transition-colors"
                                                            title="Excluir"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-900 rounded-lg p-8 border border-purple-900 text-center">
                                <div className="flex justify-center mb-4">
                                    <ImageIcon className="h-16 w-16 text-gray-600" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-300 mb-2">Nenhum produto encontrado</h3>
                                <p className="text-gray-400 mb-6">
                                    {searchTerm || selectedCategoria
                                        ? "Nenhum produto corresponde aos critérios de busca. Tente outros termos ou categorias."
                                        : "Não há produtos cadastrados no sistema. Adicione seu primeiro produto clicando no botão acima."}
                                </p>
                                {(searchTerm || selectedCategoria) && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm("")
                                            setSelectedCategoria("")
                                        }}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
                                    >
                                        Limpar filtros
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Adicionar/Editar Produto */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-900">
                        <div className="flex justify-between items-center p-6 border-b border-gray-800">
                            <h2 className="text-xl font-semibold">
                                {currentProduto?.id ? "Editar Produto" : "Adicionar Novo Produto"}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveProduto} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-1">
                                        Nome do Produto*
                                    </label>
                                    <input
                                        type="text"
                                        id="nome"
                                        required
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        value={currentProduto?.nome || ""}
                                        onChange={(e) => setCurrentProduto({ ...currentProduto, nome: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="categoria" className="block text-sm font-medium text-gray-300 mb-1">
                                        Categoria*
                                    </label>
                                    <select
                                        id="categoria"
                                        required
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        value={currentProduto?.categoria || "uniformes"}
                                        onChange={(e) => setCurrentProduto({ ...currentProduto, categoria: e.target.value })}
                                    >
                                        {categorias.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.nome}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="preco" className="block text-sm font-medium text-gray-300 mb-1">
                                        Preço*
                                    </label>
                                    <input
                                        type="text"
                                        id="preco"
                                        required
                                        placeholder="R$ 0,00"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        value={currentProduto?.preco || ""}
                                        onChange={(e) => setCurrentProduto({ ...currentProduto, preco: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="imagem" className="block text-sm font-medium text-gray-300 mb-1">
                                        URL da Imagem
                                    </label>
                                    <input
                                        type="text"
                                        id="imagem"
                                        placeholder="/placeholder.svg?height=300&width=300"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        value={currentProduto?.imagem || ""}
                                        onChange={(e) => setCurrentProduto({ ...currentProduto, imagem: e.target.value })}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Insira a URL da imagem ou deixe em branco para usar uma imagem padrão.
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="descricao" className="block text-sm font-medium text-gray-300 mb-1">
                                        Descrição*
                                    </label>
                                    <textarea
                                        id="descricao"
                                        required
                                        rows={4}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        value={currentProduto?.descricao || ""}
                                        onChange={(e) => setCurrentProduto({ ...currentProduto, descricao: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800"
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                                <span>Salvando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="h-4 w-4" />
                                                <span>Salvar Produto</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminRoute>
    )
}

