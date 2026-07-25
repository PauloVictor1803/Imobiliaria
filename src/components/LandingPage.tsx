import React from 'react';
import { Instagram, Home, MessageCircle, MapPin, Award, Shield } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const handleWhatsApp = () => {
    const message = encodeURIComponent("Oi Ayer! Vim pelo seu site e gostaria de ajuda para encontrar o lar certo em Montes Claros ou região. Podemos conversar?");
    window.open(`https://wa.me/553884079000?text=${message}`, '_blank');
  };

  const handleInstagram = () => {
    window.open('https://instagram.com/ayerpatricio', '_blank');
  };

  return (
    <div className="min-h-full bg-gray-50 text-gray-900 flex flex-col items-center py-12 px-4 md:px-8 font-sans">
      <div className="max-w-4xl w-full flex flex-col space-y-8">
        
        {/* Hero / Profile Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex-shrink-0 w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-blue-900 bg-gray-200 shadow-md">
            <img 
              src="/ayerpatricio.jpg" 
              alt="Ayer Patrício" 
              className="w-full h-full object-cover"
              fetchPriority="high"
            />
          </div>
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 pt-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Ayer Patrício
              </h1>
              <h2 className="text-lg md:text-xl font-semibold text-blue-900 tracking-wide">
                CORRETOR DE IMÓVEIS
              </h2>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
              Te ajudo a chegar no lar certo, sem complicação.
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-sm text-gray-600 font-medium bg-gray-50 border border-gray-200 px-5 py-2.5 rounded-full mt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-500"/> Montes Claros e Região
              </span>
              <span className="text-gray-300 hidden md:inline">|</span>
              <span>CRECI-MG 19966</span>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            Minha Trajetória & Missão
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-600 leading-relaxed text-lg">
            <div className="space-y-5">
              <p>
                Com mais de <strong>26 anos de experiência</strong> como empresário, construí uma trajetória sólida pautada pelo trabalho duro, respeito e a construção de boas relações. Minha essência é pautada na verdade, pois acredito que tudo o que é feito com integridade permanece.
              </p>
              <p>
                Há <strong>16 anos dedicado à corretagem de imóveis</strong>, meu propósito vai além da venda: busco conduzir decisões patrimoniais importantes com a máxima segurança e responsabilidade.
              </p>
            </div>
            <div className="space-y-5 flex flex-col justify-start">
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 text-blue-900 relative">
                <p className="font-medium italic relative z-10 text-[1.05rem] leading-snug">
                  "Entendo que adquirir seu imóvel é uma etapa crucial da sua evolução e conquista, uma mudança de fase que exige o tempo certo e o jeito certo de ser feita."
                </p>
              </div>
              <p>
                Sigo alinhado com os mais qualificados profissionais da área, garantindo um serviço de excelência.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={onEnter}
            className="group flex flex-col items-center justify-center p-8 bg-white text-gray-800 rounded-2xl shadow-sm hover:border-blue-500 transition-all border border-gray-200 hover:shadow-md h-full"
          >
            <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Home className="w-8 h-8 text-blue-900" />
            </div>
            <span className="font-bold text-xl mb-1">Imóveis Disponíveis</span>
            <span className="text-gray-500 text-sm font-medium">Confira as oportunidades</span>
          </button>

          <button 
            onClick={handleWhatsApp}
            className="group flex flex-col items-center justify-center p-8 bg-white text-gray-800 rounded-2xl shadow-sm hover:border-green-500 transition-all border border-gray-200 hover:shadow-md h-full"
          >
            <div className="bg-green-500 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <WhatsAppIcon className="w-8 h-8 text-white" />
            </div>
            <span className="font-bold text-xl mb-1">WhatsApp</span>
            <span className="text-gray-500 text-sm font-medium">+55 38 8407-9000</span>
          </button>

          <button 
            onClick={handleInstagram}
            className="group flex flex-col items-center justify-center p-8 bg-white text-gray-800 rounded-2xl shadow-sm hover:border-pink-500 transition-all border border-gray-200 hover:shadow-md h-full"
          >
            <div className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Instagram className="w-8 h-8 text-white" />
            </div>
            <span className="font-bold text-xl mb-1">Instagram</span>
            <span className="text-gray-500 text-sm font-medium">@ayerpatricio</span>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-6 pb-2 text-center text-sm font-medium text-gray-400 space-y-2">
          <p>© {new Date().getFullYear()} Ayer Patrício Corretor de Imóveis • CRECI-MG 19966</p>
          <p className="hover:text-gray-600 cursor-pointer transition-colors">ayerpatricio.com.br/contato</p>
        </div>

      </div>
    </div>
  );
};
