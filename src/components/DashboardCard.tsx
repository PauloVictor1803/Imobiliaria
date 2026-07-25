import React, { useMemo, useState } from 'react';
import { Property } from '../types';
import { Home, TrendingUp, CheckCircle, DollarSign, Wallet, Building, Percent, BarChart3, PieChart, ArrowLeft, HelpCircle, X } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface DashboardCardProps {
  properties: Property[];
  setActiveTab?: (tab: string) => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ properties, setActiveTab }) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const totalProperties = properties.length;
  
  const soldProperties = properties.filter(p => p.isSold);
  const availableProperties = properties.filter(p => !p.isSold);
  
  const soldCount = soldProperties.length;
  const availableCount = availableProperties.length;
  
  const soldPercentage = totalProperties > 0 ? (soldCount / totalProperties) * 100 : 0;
  
  const totalPortfolioValue = properties.reduce((sum, p) => sum + p.price, 0);
  const totalCost = properties.reduce((sum, p) => sum + (p.cost || 0), 0);
  
  const expectedRevenue = availableProperties.reduce((sum, p) => sum + p.price, 0);
  const expectedProfit = availableProperties.reduce((sum, p) => sum + (p.price - (p.cost || 0)), 0);
  
  const totalSoldRevenue = soldProperties.reduce((sum, p) => sum + p.price, 0);
  const totalSoldProfit = soldProperties.reduce((sum, p) => sum + (p.price - (p.cost || 0)), 0);
  
  const avgTicket = soldCount > 0 ? totalSoldRevenue / soldCount : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const pieData = [
    { name: 'Vendidos', value: soldCount, color: '#10b981' }, // emerald-500
    { name: 'Disponíveis', value: availableCount, color: '#3b82f6' } // blue-500
  ];
  return (
    <div className="absolute inset-0 z-40 bg-gray-50/50 pt-20 pb-8 px-4 md:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto pb-12">
        <div className="flex items-center gap-4 mb-2 md:pl-0 pl-16">
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
            <BarChart3 className="w-8 h-8 text-blue-600 hidden md:block" />
            Visão Geral de Vendas
            <button 
              onClick={() => setIsHelpModalOpen(true)}
              className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
              title="Entenda as métricas"
            >
              <HelpCircle className="w-6 h-6" />
            </button>
          </h1>
        </div>
        <p className="text-gray-500 mb-8 md:ml-11 md:pl-0 pl-16">
          Acompanhe a performance do seu portfólio de imóveis em tempo real.
        </p>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4 text-gray-500">
              <div className="p-2.5 bg-gray-100/80 rounded-xl text-gray-600">
                <Building className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Total de Imóveis</p>
            </div>
            <p className="text-4xl font-black text-gray-900 tracking-tight">{totalProperties}</p>
          </div>
          
          <div className="bg-emerald-500 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
              <CheckCircle className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-600/50 rounded-xl">
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-100">Vendidos</p>
            </div>
            <div className="flex items-end gap-3 relative z-10">
              <p className="text-4xl font-black tracking-tight">{soldCount}</p>
              <p className="text-sm font-medium mb-1.5 text-emerald-100 bg-emerald-600/40 px-2 py-0.5 rounded-full">
                {soldPercentage.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] transform group-hover:scale-110 transition-transform duration-500">
              <Home className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Home className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Disponíveis</p>
            </div>
            <p className="text-4xl font-black text-blue-600 tracking-tight relative z-10">{availableCount}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Ticket Médio</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 tracking-tight mt-1">{formatCurrency(avgTicket)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Financials */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-8 uppercase tracking-widest flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Wallet className="w-4 h-4 text-gray-600" />
                </div>
                Performance Financeira
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="space-y-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">VGV (Valor Geral de Vendas)</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tight">{formatCurrency(totalPortfolioValue)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Total Realizado (Vendas)</p>
                    <p className="text-2xl font-bold text-emerald-600 tracking-tight">{formatCurrency(totalSoldRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Expectativa (Estoque)</p>
                    <p className="text-2xl font-bold text-blue-600 tracking-tight">{formatCurrency(expectedRevenue)}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Custo Total Global</p>
                    <p className="text-3xl font-black text-gray-400 tracking-tight">{formatCurrency(totalCost)}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Lucro Realizado</p>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">Garantido</span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600 tracking-tight">{formatCurrency(totalSoldProfit)}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Lucro Projetado</p>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">Estoque</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 tracking-tight">{formatCurrency(expectedProfit)}</p>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar for Sales */}
              <div className="mt-10 pt-8 border-t border-gray-100/60">
                <div className="flex justify-between items-end mb-3">
                  <p className="text-sm font-semibold text-gray-600">Progresso de Vendas (VGV)</p>
                  <p className="text-lg font-black text-emerald-600 tracking-tight">
                    {totalPortfolioValue > 0 ? ((totalSoldRevenue / totalPortfolioValue) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                  <div 
                    className="bg-emerald-500 h-4 rounded-full transition-all duration-1000 relative overflow-hidden"
                    style={{ width: `${totalPortfolioValue > 0 ? (totalSoldRevenue / totalPortfolioValue) * 100 : 0}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Charts */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm h-full min-h-[400px] flex flex-col">
              <h3 className="text-sm font-bold text-gray-800 mb-8 uppercase tracking-widest flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <PieChart className="w-4 h-4 text-gray-600" />
                </div>
                Status do Estoque
              </h3>
              <div className="flex-1 w-full flex items-center justify-center min-h-[250px]">
                {totalProperties > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={105}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: number) => [value, 'Imóveis']}
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                          fontWeight: 'bold',
                          padding: '12px'
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle"
                        wrapperStyle={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <PieChart className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Nenhum imóvel cadastrado</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                Entendendo as Métricas
              </h2>
              <button 
                onClick={() => setIsHelpModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-100 pb-2">Visão Geral</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <div className="p-1.5 bg-gray-100 rounded-lg h-fit"><Building className="w-4 h-4 text-gray-600" /></div>
                      <div>
                        <p className="font-bold text-gray-900">Total de Imóveis</p>
                        <p className="text-gray-600 text-sm">A soma de todos os imóveis cadastrados no sistema, incluindo disponíveis e vendidos.</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="p-1.5 bg-emerald-100 rounded-lg h-fit"><CheckCircle className="w-4 h-4 text-emerald-600" /></div>
                      <div>
                        <p className="font-bold text-gray-900">Vendidos</p>
                        <p className="text-gray-600 text-sm">Quantidade de imóveis marcados como vendidos. O percentual indica a taxa de conversão em relação ao total.</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="p-1.5 bg-blue-100 rounded-lg h-fit"><Home className="w-4 h-4 text-blue-600" /></div>
                      <div>
                        <p className="font-bold text-gray-900">Disponíveis</p>
                        <p className="text-gray-600 text-sm">Imóveis em estoque, ainda disponíveis para venda.</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="p-1.5 bg-indigo-100 rounded-lg h-fit"><DollarSign className="w-4 h-4 text-indigo-600" /></div>
                      <div>
                        <p className="font-bold text-gray-900">Ticket Médio</p>
                        <p className="text-gray-600 text-sm">Calculado dividindo o <span className="font-semibold">VGV Realizado</span> pelo número de <span className="font-semibold">Imóveis Vendidos</span>. Representa o valor médio das suas vendas.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-100 pb-2">Performance Financeira</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <div className="p-1.5 bg-gray-100 rounded-lg h-fit"><Wallet className="w-4 h-4 text-gray-600" /></div>
                      <div>
                        <p className="font-bold text-gray-900">VGV (Valor Geral de Vendas)</p>
                        <p className="text-gray-600 text-sm">A soma do preço de venda de todos os imóveis (disponíveis + vendidos). É o potencial máximo de faturamento.</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="p-1.5 bg-gray-100 rounded-lg h-fit"><BarChart3 className="w-4 h-4 text-gray-600" /></div>
                      <div>
                        <p className="font-bold text-gray-900">Custo Total Global</p>
                        <p className="text-gray-600 text-sm">A soma do custo de aquisição/construção de todos os imóveis da carteira.</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="p-1.5 bg-emerald-100 rounded-lg h-fit"><CheckCircle className="w-4 h-4 text-emerald-600" /></div>
                      <div>
                        <p className="font-bold text-gray-900">Total Realizado (Vendas)</p>
                        <p className="text-gray-600 text-sm">O faturamento bruto já garantido, soma do preço de venda apenas dos imóveis <span className="font-semibold">vendidos</span>.</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="p-1.5 bg-emerald-100 rounded-lg h-fit"><TrendingUp className="w-4 h-4 text-emerald-600" /></div>
                      <div>
                        <p className="font-bold text-gray-900">Lucro Realizado</p>
                        <p className="text-gray-600 text-sm">Lucro garantido. Calculado subtraindo o custo dos imóveis vendidos do seu preço de venda final: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs text-emerald-700">Preço Venda - Custo</code>.</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="p-1.5 bg-blue-100 rounded-lg h-fit"><Home className="w-4 h-4 text-blue-600" /></div>
                      <div>
                        <p className="font-bold text-gray-900">Expectativa (Estoque)</p>
                        <p className="text-gray-600 text-sm">Faturamento bruto projetado para o estoque atual (soma do preço de venda dos imóveis <span className="font-semibold">disponíveis</span>).</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="p-1.5 bg-blue-100 rounded-lg h-fit"><Percent className="w-4 h-4 text-blue-600" /></div>
                      <div>
                        <p className="font-bold text-gray-900">Lucro Projetado</p>
                        <p className="text-gray-600 text-sm">Lucro esperado com a venda do estoque atual. Calculado subtraindo o custo dos imóveis disponíveis do seu preço de venda estipulado.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setIsHelpModalOpen(false)}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
