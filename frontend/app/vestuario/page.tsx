"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Info, AlertCircle, ShoppingBag } from "lucide-react"
import { productService } from "@/services/api"

export default function Vestuario() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

    const categories = [
    { id: "uniformes", name: "Uniformes Tradicionais" },
    { id: "calcados", name: "Calçados" },
    { id: "protecao", name: "Equipamentos de Proteção" },
    { id: "acessorios", name: "Acessórios" },
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await productService.getAllProducts()

                if (response && response["hydra:member"]) {
          setProducts(response["hydra:member"])
        } else {
          setProducts([])
          setError("Formato de resposta inesperado. Verifique a conexão com o backend.")
        }
      } catch (err) {
        console.error("Erro ao carregar produtos:", err)
        setProducts([])
        setError("Falha ao carregar produtos. Verifique se o backend está em execução.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

    const mapProductsToDisplay = (products) => {
    return products.map((product) => ({
      id: product.id,
      nome: product.nome,
      descricao: product.descricao,
      preco: product.preco,
      imagem: product.imagem || "/placeholder.svg?height=300&width=300",
      categoria: product.categoria,
    }))
  }

    const displayProducts = mapProductsToDisplay(products)

    const displayProductsByCategory = categories.map((category) => {
    return {
      ...category,
      products: displayProducts.filter((product) => product.categoria === category.id),
    }
  })

    const hasProducts = displayProductsByCategory.some((category) => category.products.length > 0)

  return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Vestuário Especializado</h1>
            <p className="text-gray-400 mb-8">
              Equipamentos e vestuário de alta qualidade para a prática de artes marciais chinesas disponíveis em nossa
              academia.
            </p>

            <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900 mb-12">
              <div className="flex items-center mb-4">
                <Info className="h-6 w-6 text-purple-500 mr-2" />
                <h2 className="text-xl font-semibold">Guia de Vestuário</h2>
              </div>
              <p className="text-gray-300 mb-4">
                O vestuário adequado é essencial para a prática segura e eficiente das artes marciais chinesas. Cada
                modalidade possui requisitos específicos que respeitam a tradição e otimizam o desempenho.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-purple-400">Conforto e Mobilidade</h3>
                  <p className="text-sm text-gray-300">
                    Escolha roupas que permitam amplitude de movimentos sem restrições, especialmente nas articulações.
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-purple-400">Materiais Respiráveis</h3>
                  <p className="text-sm text-gray-300">
                    Tecidos que absorvem o suor e permitem a ventilação são ideais para treinos intensos.
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-purple-400">Proteção Adequada</h3>
                  <p className="text-sm text-gray-300">
                    Utilize equipamentos de proteção apropriados para cada tipo de treino, especialmente em práticas de
                    combate.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900 mb-12">
              <h2 className="text-xl font-semibold mb-4">Disponibilidade na Academia</h2>
              <p className="text-gray-300 mb-4">
                Todos os itens apresentados nesta página estão disponíveis para compra diretamente em nossa academia.
                Consulte a recepção para verificar disponibilidade de tamanhos e modelos.
              </p>
              <p className="text-gray-300">
                Aceitamos pagamentos em dinheiro, cartão de débito e crédito. Alunos matriculados têm 10% de desconto em
                todos os produtos.
              </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : error ? (
                <div className="mb-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{error}</p>
                  </div>
                </div>
            ) : !hasProducts ? (
                <div className="bg-gray-900 rounded-lg p-8 border border-purple-900 text-center">
                  <div className="flex justify-center mb-4">
                    <ShoppingBag className="h-16 w-16 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-300 mb-2">Nenhum produto disponível</h3>
                  <p className="text-gray-400">
                    No momento, não há produtos cadastrados em nosso sistema. Por favor, volte mais tarde ou entre em
                    contato com a recepção da academia para mais informações sobre os produtos disponíveis.
                  </p>
                </div>
            ) : (
                <div className="space-y-12">
                  {displayProductsByCategory.map(
                      (category) =>
                          category.products.length > 0 && (
                              <div key={category.id}>
                                <h2 className="text-2xl font-semibold mb-2">{category.name}</h2>
                                <p className="text-gray-400 mb-6">
                                  {category.id === "uniformes" &&
                                      "Vestuário autêntico para diferentes estilos de artes marciais chinesas."}
                                  {category.id === "calcados" &&
                                      "Calçados especializados para diferentes modalidades e superfícies de treino."}
                                  {category.id === "protecao" && "Proteções essenciais para treinos de combate e sparring."}
                                  {category.id === "acessorios" && "Itens complementares para aprimorar seu treinamento."}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                  {category.products.map((product) => (
                                      <div
                                          key={product.id}
                                          className="bg-gray-900 rounded-lg overflow-hidden border border-purple-900 shadow-lg hover:border-purple-500 transition-all duration-300"
                                      >
                                        <div className="relative h-64 w-full">
                                          <Image
                                              src={product.imagem || "/placeholder.svg?height=300&width=300"}
                                              alt={product.nome}
                                              fill
                                              className="object-cover"
                                          />
                                        </div>
                                        <div className="p-4">
                                          <h3 className="text-lg font-semibold mb-1">{product.nome}</h3>
                                          <div className="h-24 overflow-y-auto mb-3 text-gray-400 text-sm pr-1 custom-scrollbar">
                                            <p>{product.descricao}</p>
                                          </div>
                                          <div className="flex justify-between items-center">
                                            <span className="text-purple-500 font-bold">{product.preco}</span>
                                            <span className="text-xs text-gray-400">Disponível na academia</span>
                                          </div>
                                        </div>
                                      </div>
                                  ))}
                                </div>
                              </div>
                          ),
                  )}
                </div>
            )}
          </div>
        </div>
      </div>
  )
}

