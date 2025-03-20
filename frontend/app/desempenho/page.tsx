"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight, Target, Zap, Brain, Heart, X } from "lucide-react"

export default function Desempenho() {
  const [selectedTip, setSelectedTip] = useState(null)

  const performanceTips = [
    {
      id: 1,
      title: "Técnicas de Respiração",
      description:
        "Aprenda a controlar sua respiração para aumentar a resistência, potência e foco durante os treinos e combates.",
      icon: <Zap className="h-6 w-6 text-purple-500" />,
      image: "/dicas_de_desempenho/tecnicas-de-respiracao.jpg",
      content: [
        "Respiração diafragmática para maior oxigenação",
        "Sincronização da respiração com movimentos",
        "Técnicas de respiração para recuperação rápida",
        "Exercícios de respiração para aumentar a energia interna (Qi)",
      ],
      fullContent: `
        <h3 class="text-xl font-semibold mb-3">Respiração Diafragmática</h3>
        <p class="mb-4">A respiração diafragmática, também conhecida como respiração abdominal, é fundamental para as artes marciais chinesas. Ao respirar usando o diafragma, você aumenta a capacidade pulmonar, melhora a oxigenação do sangue e mantém a calma durante situações de estresse.</p>
        
        <h3 class="text-xl font-semibold mb-3">Sincronização com Movimentos</h3>
        <p class="mb-4">Nas artes marciais chinesas, cada movimento tem um padrão respiratório específico. Geralmente, inspira-se durante movimentos de preparação ou recuo, e expira-se durante a execução de golpes. Esta sincronização aumenta a potência e eficiência dos movimentos.</p>
        
        <h3 class="text-xl font-semibold mb-3">Recuperação Rápida</h3>
        <p class="mb-4">Técnicas de respiração controlada permitem recuperar o fôlego rapidamente entre sequências intensas de movimentos. A respiração rítmica e profunda ajuda a eliminar o ácido lático e reduzir a fadiga muscular.</p>
        
        <h3 class="text-xl font-semibold mb-3">Cultivo do Qi</h3>
        <p class="mb-4">Na medicina tradicional chinesa, acredita-se que a respiração correta ajuda a cultivar e direcionar o Qi (energia vital). Exercícios específicos de respiração, como os praticados no Qi Gong, fortalecem o sistema energético do corpo, melhorando a saúde geral e o desempenho marcial.</p>
      `,
    },
    {
      id: 2,
      title: "Treinamento Mental",
      description:
        "Desenvolva a concentração, foco e resiliência mental necessários para o domínio das artes marciais.",
      icon: <Brain className="h-6 w-6 text-purple-500" />,
      image: "/dicas_de_desempenho/treinamento-mental.jpg",
      content: [
        "Meditação para foco e clareza mental",
        "Visualização para aperfeiçoamento técnico",
        "Técnicas para controle emocional durante combates",
        "Desenvolvimento da intuição marcial",
      ],
      fullContent: `
        <h3 class="text-xl font-semibold mb-3">Meditação e Foco</h3>
        <p class="mb-4">A meditação regular desenvolve a capacidade de manter o foco mesmo em situações de estresse. Nas artes marciais chinesas, a prática de meditação sentada (Zuò Chán) ou em movimento (como no Tai Chi) treina a mente para permanecer presente e atenta.</p>
        
        <h3 class="text-xl font-semibold mb-3">Visualização</h3>
        <p class="mb-4">A visualização é uma técnica poderosa onde você mentalmente ensaia movimentos e técnicas. Estudos mostram que a visualização ativa os mesmos circuitos neurais que a prática física, ajudando a aperfeiçoar técnicas e corrigir erros mesmo quando não está treinando fisicamente.</p>
        
        <h3 class="text-xl font-semibold mb-3">Controle Emocional</h3>
        <p class="mb-4">O treinamento mental nas artes marciais chinesas enfatiza o controle das emoções, especialmente durante o combate. Técnicas de respiração e foco ajudam a manter a calma e tomar decisões racionais mesmo sob pressão, evitando reações impulsivas que podem levar a erros.</p>
        
        <h3 class="text-xl font-semibold mb-3">Intuição Marcial</h3>
        <p class="mb-4">Com o tempo e treinamento adequado, desenvolve-se o que os mestres chamam de "intuição marcial" - a capacidade de antecipar movimentos do oponente e reagir instintivamente. Esta habilidade vem da integração profunda entre mente e corpo, permitindo respostas rápidas e eficientes sem pensamento consciente.</p>
      `,
    },
    {
      id: 3,
      title: "Condicionamento Físico",
      description:
        "Estratégias específicas para desenvolver força, flexibilidade e resistência para artes marciais chinesas.",
      icon: <Heart className="h-6 w-6 text-purple-500" />,
      image: "/dicas_de_desempenho/condicionamento-fisico.jpg",
      content: [
        "Exercícios de fortalecimento específicos para artes marciais",
        "Rotinas para aumentar a flexibilidade e amplitude de movimento",
        "Treinamento intervalado para resistência de combate",
        "Recuperação ativa e prevenção de lesões",
      ],
      fullContent: `
        <h3 class="text-xl font-semibold mb-3">Fortalecimento Específico</h3>
        <p class="mb-4">As artes marciais chinesas exigem um tipo específico de força que combina potência explosiva com resistência muscular. Exercícios tradicionais como a postura do cavalo (Ma Bu), flexões nos dedos e treinamento com armas pesadas desenvolvem força funcional diretamente aplicável às técnicas marciais.</p>
        
        <h3 class="text-xl font-semibold mb-3">Flexibilidade e Mobilidade</h3>
        <p class="mb-4">A flexibilidade é crucial para executar chutes altos, posturas baixas e movimentos amplos. Além do alongamento estático, as artes marciais chinesas incorporam exercícios dinâmicos de mobilidade que preparam o corpo para os movimentos específicos das formas e combates.</p>
        
        <h3 class="text-xl font-semibold mb-3">Resistência de Combate</h3>
        <p class="mb-4">O treinamento intervalado de alta intensidade (HIIT) simula as demandas energéticas do combate real, alternando períodos de esforço máximo com breves recuperações. Este tipo de treinamento desenvolve tanto o sistema aeróbico quanto o anaeróbico, essenciais para o desempenho marcial.</p>
        
        <h3 class="text-xl font-semibold mb-3">Recuperação e Prevenção</h3>
        <p class="mb-4">Técnicas de recuperação ativa como automassagem com bastões de bambu (Gua Sha), banhos de contraste e exercícios de mobilidade leve aceleram a recuperação e previnem lesões. A medicina tradicional chinesa também oferece métodos como acupuntura e fitoterapia para tratar e prevenir problemas físicos relacionados ao treinamento intenso.</p>
      `,
    },
    {
      id: 4,
      title: "Aperfeiçoamento Técnico",
      description: "Métodos para refinar suas técnicas e movimentos para maior eficiência e precisão.",
      icon: <Target className="h-6 w-6 text-purple-500" />,
      image: "/dicas_de_desempenho/aperfeicoamento-tecnico.webp",
      content: [
        "Análise de movimento para correção de erros técnicos",
        "Treinamento de precisão e timing",
        "Desenvolvimento da consciência espacial",
        "Integração de técnicas em sequências fluidas",
      ],
      fullContent: `
        <h3 class="text-xl font-semibold mb-3">Análise de Movimento</h3>
        <p class="mb-4">A análise detalhada de cada movimento é fundamental para o aperfeiçoamento técnico. Tradicionalmente, isso é feito através da observação cuidadosa do mestre, mas hoje também pode ser complementado com gravações de vídeo. Identificar e corrigir pequenos erros técnicos pode fazer uma grande diferença no desempenho geral.</p>
        
        <h3 class="text-xl font-semibold mb-3">Precisão e Timing</h3>
        <p class="mb-4">A precisão nas artes marciais chinesas vai além de acertar o alvo - envolve aplicar a técnica correta, com a quantidade certa de força, no momento exato. Exercícios específicos como o "Chi Sau" (mãos aderentes) no Wing Chun desenvolvem sensibilidade tátil e timing refinado.</p>
        
        <h3 class="text-xl font-semibold mb-3">Consciência Espacial</h3>
        <p class="mb-4">Desenvolver consciência espacial permite ao praticante navegar eficientemente durante o combate, mantendo distâncias ideais e aproveitando o ambiente ao seu favor. Exercícios de combate com múltiplos oponentes e treinamento com olhos vendados aguçam esta percepção.</p>
        
        <h3 class="text-xl font-semibold mb-3">Integração de Técnicas</h3>
        <p class="mb-4">O verdadeiro domínio vem quando técnicas individuais se fundem em sequências fluidas e naturais. O conceito de "não-mente" (Wu Xin) descreve o estado onde o praticante executa técnicas complexas sem pensamento consciente, respondendo instantaneamente às mudanças na situação de combate.</p>
      `,
    },
  ]

  const handleOpenPopup = (tip) => {
    setSelectedTip(tip)
    document.body.style.overflow = "hidden"
  }

  const handleClosePopup = () => {
    setSelectedTip(null)
    document.body.style.overflow = "auto"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Dicas de Desempenho</h1>
          <p className="text-gray-400 mb-8">
            Estratégias e técnicas para maximizar seu potencial nas artes marciais chinesas.
          </p>

          <div className="space-y-12">
            {performanceTips.map((tip) => (
              <div key={tip.id} className="bg-gray-900 rounded-lg overflow-hidden border border-purple-900 shadow-lg">
                <div className="md:flex">
                  <div className="md:w-2/5 relative h-64 md:h-auto">
                    <Image src={tip.image || "/placeholder.svg"} alt={tip.title} fill className="object-cover" />
                  </div>
                  <div className="p-6 md:w-3/5">
                    <div className="flex items-center mb-3">
                      {tip.icon}
                      <h2 className="text-xl font-semibold ml-2">{tip.title}</h2>
                    </div>
                    <p className="text-gray-300 mb-4">{tip.description}</p>
                    <ul className="space-y-2 mb-4">
                      {tip.content.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-purple-500 mr-2">•</span>
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleOpenPopup(tip)}
                      className="inline-flex items-center text-purple-500 hover:text-purple-400"
                    >
                      Saiba mais <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gray-900 rounded-lg p-6 shadow-lg border border-purple-900">
            <h2 className="text-xl font-semibold mb-4">Aplicação nas Aulas</h2>
            <p className="text-gray-300 mb-4">
              Estas dicas de desempenho são incorporadas em nossas aulas regulares. Nossos instrutores trabalham estes
              conceitos durante os treinos para ajudar todos os alunos a desenvolverem seu potencial máximo.
            </p>
            <p className="text-gray-300">
              Para mais informações sobre como aplicar estas técnicas em sua prática, converse com nossos mestres
              durante as aulas ou participe de nossos workshops temáticos realizados periodicamente.
            </p>
          </div>
        </div>
      </div>

      {/* Popup para exibir o conteúdo completo */}
      {selectedTip && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-purple-900">
            <div className="sticky top-0 bg-gray-900 p-4 border-b border-purple-900 flex justify-between items-center">
              <h2 className="text-xl font-semibold">{selectedTip.title}</h2>
              <button
                onClick={handleClosePopup}
                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div dangerouslySetInnerHTML={{ __html: selectedTip.fullContent }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

