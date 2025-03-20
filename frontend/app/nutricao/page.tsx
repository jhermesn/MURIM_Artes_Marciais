import Image from "next/image"
import { Apple, Coffee, Droplet, Clock } from "lucide-react"

export default function Nutricao() {
  const nutritionTips = [
    {
      category: "Antes do Treino",
      icon: <Clock className="h-6 w-6 text-purple-500" />,
      tips: [
        {
          title: "Carboidratos Complexos",
          description:
            "Consuma alimentos como aveia, batata doce ou arroz integral 1-2 horas antes do treino para energia sustentada.",
          foods: ["Aveia", "Batata doce", "Arroz integral", "Pão integral"],
        },
        {
          title: "Proteínas Leves",
          description: "Adicione uma pequena porção de proteína para suporte muscular sem sobrecarregar a digestão.",
          foods: ["Iogurte grego", "Ovo cozido", "Tofu", "Frango grelhado (porção pequena)"],
        },
        {
          title: "Evitar",
          description:
            "Alimentos pesados, gordurosos ou com alto teor de fibras que podem causar desconforto durante o treino.",
          foods: ["Frituras", "Alimentos muito gordurosos", "Grandes porções", "Álcool"],
        },
      ],
    },
    {
      category: "Após o Treino",
      icon: <Apple className="h-6 w-6 text-purple-500" />,
      tips: [
        {
          title: "Proteínas de Rápida Absorção",
          description:
            "Consuma proteínas de qualidade dentro de 30-60 minutos após o treino para otimizar a recuperação muscular.",
          foods: ["Whey protein", "Frango", "Peixe", "Ovos", "Tofu"],
        },
        {
          title: "Carboidratos para Reposição",
          description: "Reponha os estoques de glicogênio com carboidratos de médio a alto índice glicêmico.",
          foods: ["Frutas", "Arroz", "Batata doce", "Quinoa"],
        },
        {
          title: "Anti-inflamatórios Naturais",
          description: "Inclua alimentos com propriedades anti-inflamatórias para auxiliar na recuperação.",
          foods: ["Cúrcuma", "Gengibre", "Frutas vermelhas", "Peixes gordurosos"],
        },
      ],
    },
    {
      category: "Hidratação",
      icon: <Droplet className="h-6 w-6 text-purple-500" />,
      tips: [
        {
          title: "Antes do Treino",
          description: "Hidrate-se adequadamente nas horas que antecedem o treino para performance ideal.",
          foods: ["Água (400-600ml 2 horas antes)", "Água de coco", "Chás sem cafeína"],
        },
        {
          title: "Durante o Treino",
          description: "Mantenha-se hidratado com pequenos goles frequentes para evitar desidratação.",
          foods: [
            "Água (150-250ml a cada 15-20 minutos)",
            "Bebidas isotônicas (para treinos intensos acima de 60 minutos)",
          ],
        },
        {
          title: "Após o Treino",
          description: "Reponha os líquidos e eletrólitos perdidos durante o exercício.",
          foods: ["Água", "Água de coco", "Bebidas com eletrólitos", "Frutas com alto teor de água"],
        },
      ],
    },
    {
      category: "Suplementação",
      icon: <Coffee className="h-6 w-6 text-purple-500" />,
      tips: [
        {
          title: "Proteínas",
          description: "Suplementos proteicos podem auxiliar na recuperação muscular e no desenvolvimento de força.",
          foods: ["Whey protein", "Proteína vegetal (ervilha, arroz, cânhamo)", "BCAA"],
        },
        {
          title: "Recuperação",
          description: "Suplementos que podem auxiliar na redução da inflamação e na recuperação pós-treino.",
          foods: ["Glutamina", "Ômega-3", "Cúrcuma/Curcumina", "Magnésio"],
        },
        {
          title: "Energia e Foco",
          description: "Suplementos que podem melhorar a energia e concentração durante os treinos.",
          foods: ["Cafeína (com moderação)", "Ginseng", "Maca peruana", "Rhodiola rosea"],
        },
      ],
    },
  ]

  const mealPlans = [
    {
      title: "Plano Básico",
      description: "Ideal para praticantes iniciantes ou com frequência de treino de 2-3 vezes por semana.",
      meals: [
        "Café da manhã: Omelete com vegetais + torrada integral + fruta",
        "Lanche: Iogurte com frutas e castanhas",
        "Almoço: Proteína magra + arroz integral ou batata doce + vegetais",
        "Pré-treino: Banana com pasta de amendoim",
        "Pós-treino: Shake proteico com frutas",
        "Jantar: Peixe ou frango grelhado + vegetais + quinoa",
      ],
    },
    {
      title: "Plano Intermediário",
      description: "Para praticantes regulares com treinos de intensidade moderada a alta, 3-5 vezes por semana.",
      meals: [
        "Café da manhã: Mingau de aveia com whey protein, frutas e sementes",
        "Lanche: Ovos cozidos + fruta + castanhas",
        "Almoço: Porção generosa de proteína + carboidratos complexos + vegetais + gorduras saudáveis",
        "Pré-treino: Batata doce + frango desfiado",
        "Pós-treino: Shake proteico + banana + mel",
        "Jantar: Proteína magra + vegetais + porção moderada de carboidratos",
        "Ceia: Caseína ou iogurte grego com frutas vermelhas",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Nutrição para Artes Marciais</h1>
          <p className="text-gray-400 mb-8">
            Orientações nutricionais para otimizar seu desempenho e recuperação nos treinos de artes marciais chinesas.
          </p>

          <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900 mb-12">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-900 rounded-full flex items-center justify-center mr-4">
                <Image
                  src="/nutricao.png"
                  alt="Nutrição"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Princípios Fundamentais</h2>
                <p className="text-gray-400">Baseados na medicina tradicional chinesa e ciência nutricional moderna</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              A nutrição adequada para praticantes de artes marciais chinesas combina princípios da medicina tradicional
              chinesa com conhecimentos científicos modernos, visando equilibrar o Qi (energia vital), fortalecer os
              músculos e tendões, e promover rápida recuperação.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-purple-400">Equilíbrio Yin-Yang</h3>
                <p className="text-sm text-gray-300">
                  Balanceamento de alimentos "quentes" e "frios" para manter a harmonia energética do corpo.
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-purple-400">Cinco Elementos</h3>
                <p className="text-sm text-gray-300">
                  Incorporação de alimentos que representam os cinco elementos: madeira, fogo, terra, metal e água.
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-purple-400">Timing Nutricional</h3>
                <p className="text-sm text-gray-300">
                  Consumo estratégico de nutrientes em momentos específicos para otimizar energia e recuperação.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-12 mb-12">
            {nutritionTips.map((section, index) => (
              <div key={index} className="bg-gray-900 rounded-lg overflow-hidden border border-purple-900 shadow-lg">
                <div className="bg-purple-900 px-6 py-4 flex items-center">
                  {section.icon}
                  <h2 className="text-xl font-semibold ml-2 text-white">{section.category}</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {section.tips.map((tip, tipIndex) => (
                      <div key={tipIndex} className="border-b border-gray-800 last:border-0 pb-6 last:pb-0">
                        <h3 className="text-lg font-medium mb-2">{tip.title}</h3>
                        <p className="text-gray-300 mb-3">{tip.description}</p>
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-purple-400 mb-2">Alimentos Recomendados:</h4>
                          <div className="flex flex-wrap gap-2">
                            {tip.foods.map((food, foodIndex) => (
                              <span
                                key={foodIndex}
                                className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                              >
                                {food}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-6">Exemplos de Planos Alimentares</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {mealPlans.map((plan, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-6 border border-purple-900 shadow-lg">
                <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                <p className="text-gray-400 mb-4">{plan.description}</p>
                <ul className="space-y-2">
                  {plan.meals.map((meal, mealIndex) => (
                    <li key={mealIndex} className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      <span className="text-gray-300">{meal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900">
            <h2 className="text-xl font-semibold mb-4">Informações Adicionais</h2>
            <p className="text-gray-300 mb-4">
              Estas são apenas orientações gerais. Para necessidades específicas, recomendamos consultar um
              nutricionista especializado em nutrição esportiva. Nossa academia possui parcerias com profissionais
              qualificados que podem oferecer orientações mais personalizadas.
            </p>
            <p className="text-gray-300">
              Para mais informações sobre nutrição e suplementação, converse com nossos instrutores durante as aulas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

