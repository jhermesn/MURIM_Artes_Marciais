import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, MessageSquare } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center">
              <span className="text-purple-600 font-bold text-2xl">MURIM</span>
              <span className="ml-2 text-white text-lg">Artes Marciais</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              Centro de excelência em artes marciais chinesas, oferecendo treinamento de alta qualidade para todos os
              níveis.
            </p>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-purple-500 transition-colors duration-200">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/horarios" className="text-gray-400 hover:text-purple-500 transition-colors duration-200">
                  Horários
                </Link>
              </li>
              <li>
                <Link href="/personal" className="text-gray-400 hover:text-purple-500 transition-colors duration-200">
                  Personal Trainer
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-400 hover:text-purple-500 transition-colors duration-200">
                  Fale Conosco
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/desempenho" className="text-gray-400 hover:text-purple-500 transition-colors duration-200">
                  Dicas de Desempenho
                </Link>
              </li>
              <li>
                <Link href="/nutricao" className="text-gray-400 hover:text-purple-500 transition-colors duration-200">
                  Nutrição
                </Link>
              </li>
              <li>
                <Link href="/vestuario" className="text-gray-400 hover:text-purple-500 transition-colors duration-200">
                  Vestuário Especializado
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Contato</h3>
            <p className="text-gray-400 mb-4">
              Rua das Artes Marciais, 123
              <br />
              São Paulo, SP
              <br />
              contato@murim.com.br
              <br />
              (11) 99999-9999
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-500 transition-colors duration-200"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-500 transition-colors duration-200"
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-500 transition-colors duration-200"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-500 transition-colors duration-200"
              >
                <Youtube size={20} />
                <span className="sr-only">Youtube</span>
              </a>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-500 transition-colors duration-200"
              >
                <MessageSquare size={20} />
                <span className="sr-only">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} MURIM Artes Marciais. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-xs mt-2">Desenvolvido por: Jorge Hermes, Matheus Freire, Miguel Escobar</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

