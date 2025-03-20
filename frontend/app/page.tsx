import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Award, Clock, Users, Dumbbell } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Seção Principal */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
              src="/intro.mp4"
              className="object-cover brightness-50 absolute inset-0 w-full h-full"
              autoPlay
              loop
              muted
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-90"></div>
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            <span className="text-purple-500">MURIM</span> Artes Marciais
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Desperte seu potencial através das tradicionais artes marciais chinesas
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/horarios" className="btn-primary">
              Ver Horários
            </Link>
            <Link href="/contato" className="btn-secondary">
              Fale Conosco
            </Link>
          </div>
        </div>
      </section>

      {/* Seção Sobre */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="section-title">Sobre o MURIM</h2>
              <p className="text-gray-300 mb-6">
                MURIM Artes Marciais é um centro de treinamento especializado em artes marciais chinesas tradicionais,
                oferecendo um ambiente imersivo onde os praticantes podem desenvolver habilidades físicas, mentais e
                espirituais através de treinamentos autênticos.
              </p>
              <p className="text-gray-300 mb-6">
                Nossos mestres são altamente qualificados e possuem décadas de experiência, transmitindo conhecimentos
                ancestrais com métodos modernos de ensino, adaptados para praticantes de todos os níveis.
              </p>
              <Link href="/horarios" className="inline-flex items-center text-purple-500 hover:text-purple-400">
                Conheça nossas modalidades <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="md:w-1/2 relative h-[400px] w-full rounded-lg overflow-hidden animate-pulse-glow">
              <Image
                src="/academia-img-800x600.webp?height=800&width=600"
                alt="Treinamento de artes marciais"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção Diferenciais */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mb-12">Nossos Diferenciais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mestres Qualificados</h3>
              <p className="text-gray-400">
                Instrutores com certificações internacionais e décadas de experiência em artes marciais chinesas.
              </p>
            </div>

            <div className="card flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Horários Flexíveis</h3>
              <p className="text-gray-400">
                Aulas em diversos horários para se adequar à sua rotina, incluindo manhã, tarde e noite.
              </p>
            </div>

            <div className="card flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Turmas Personalizadas</h3>
              <p className="text-gray-400">
                Grupos divididos por nível de experiência, garantindo evolução adequada para cada praticante.
              </p>
            </div>

            <div className="card flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <Dumbbell className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Estrutura Completa</h3>
              <p className="text-gray-400">
                Espaço amplo com equipamentos específicos para treinamento de artes marciais chinesas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Chamada */}
      <section className="py-16 bg-black relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image src="/academia-img-1920x1080.jpg?height=600&width=1920" alt="Background" fill className="object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Comece sua jornada no mundo <span className="text-purple-500">MURIM</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Agende uma aula experimental gratuita e descubra o poder das artes marciais chinesas.
            </p>
            <Link href="/contato" className="btn-primary text-lg px-8 py-3">
              Agende Agora
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

