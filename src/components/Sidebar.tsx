import { Home, LayoutDashboard, Settings, Plus, MapPin, X, LogIn, LogOut, Bell } from 'lucide-react';
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddProperty: () => void;
  isAdmin?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  session?: any;
  onLoginClick?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onAddProperty, 
  isAdmin = true,
  isOpen = false,
  onClose,
  session,
  onLoginClick,
  onLogout
}) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[55] md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed md:relative top-0 right-0 md:left-0 md:right-auto w-64 bg-white h-screen border-l md:border-l-0 md:border-r border-gray-200 flex flex-col pt-6 pb-6 shadow-sm z-[60] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        
        <div className="absolute top-4 left-4 md:hidden">
          <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center mb-8 mt-4 md:mt-0">
          <Home className="w-10 h-10 text-blue-900" />
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => { setActiveTab('dashboard'); onClose?.(); }}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MapPin className="w-5 h-5 mr-3" />
            Mapa Geral
          </button>

          <button
            onClick={() => { setActiveTab('properties'); onClose?.(); }}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'properties'
                ? 'bg-blue-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Home className="w-5 h-5 mr-3" />
            {isAdmin ? 'Minhas Casas' : 'Imóveis'}
          </button>

          {isAdmin && (
            <button
              onClick={() => { setActiveTab('sales'); onClose?.(); }}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'sales'
                  ? 'bg-blue-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Painel de Vendas
            </button>
          )}
          
          {isAdmin && (
            <>
              <div className="pt-6 pb-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">
                  Adicionar Novo Imóvel
                </p>
              </div>
              <button
                onClick={() => { onAddProperty(); onClose?.(); }}
                className="w-full flex flex-col items-center justify-center px-4 py-8 rounded-lg text-sm font-medium transition-colors bg-blue-900 text-white hover:bg-blue-800"
              >
                <Plus className="w-8 h-8 mb-2" />
              </button>
            </>
          )}
        </nav>
        
        <div className="px-4 space-y-4 mt-auto pt-6">
          <button
            onClick={() => { setActiveTab(activeTab === 'settings' ? 'dashboard' : 'settings'); onClose?.(); }}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-5 h-5 mr-3" />
            Configurações
          </button>
          
          {/* Mobile Login/Logout button */}
          <div className="md:hidden border-t border-gray-100 pt-4 mt-2">
            {session ? (
              <div className="flex gap-2">
                 <button className="flex-1 bg-white px-3 py-2.5 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="bg-emerald-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                    0
                  </span>
                </button>
                <button 
                  onClick={() => { onLogout?.(); onClose?.(); }}
                  className="flex-1 bg-white p-2.5 px-3 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-red-600"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Sair
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { onLoginClick?.(); onClose?.(); }}
                className="w-full bg-blue-900 text-white px-5 py-2.5 rounded-lg shadow-sm border border-blue-800 flex items-center justify-center gap-2 hover:bg-blue-800 transition-all font-semibold"
                title="Login"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
