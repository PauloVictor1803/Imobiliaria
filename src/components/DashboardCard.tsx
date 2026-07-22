import React, { useMemo } from 'react';
import { Property } from '../types';
import { Home, TrendingUp, CheckCircle, DollarSign, Wallet, Building, Percent, BarChart3, PieChart, ArrowLeft } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface DashboardCardProps {
  properties: Property[];
  setActiveTab?: (tab: string) => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ properties, setActiveTab }) => {
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
    <div className="absolute inset-0 z-[1000] bg-gray-50 pt-20 pb-8 px-4 md:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto pb-12">
        <div className="flex items-center gap-4 mb-2">
          {setActiveTab && (
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="md:hidden bg-white p-2.5 rounded-lg shadow-sm border border-gray-200 text-gray-600 hover:text-blue-600 transition-colors"
              title="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600 hidden md:block" />
            Visão Geral de Vendas e Estoque
          </h1>
        </div>
        <p className="text-gray-500 mb-8 md:ml-11">Acompanhe a performance do seu portfólio de imóveis em tempo real.</p>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-gray-500">
              <Building className="w-5 h-5 text-gray-400" />
              <p className="text-sm font-semibold uppercase tracking-wider">Total de Imóveis</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalProperties}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CheckCircle className="w-16 h-16 text-emerald-500" />
            </div>
            <div className="flex items-center gap-2 mb-4 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-semibold uppercase tracking-wider">Vendidos</p>
            </div>
            <div className="flex items-end gap-3">
              <p className="text-3xl font-bold text-emerald-600">{soldCount}</p>
              <p className="text-sm text-emerald-600 font-medium mb-1">({soldPercentage.toFixed(1)}%)</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Home className="w-16 h-16 text-blue-500" />
            </div>
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <Home className="w-5 h-5" />
              <p className="text-sm font-semibold uppercase tracking-wider">Disponíveis</p>
            </div>
            <p className="text-3xl font-bold text-blue-600">{availableCount}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <DollarSign className="w-5 h-5" />
              <p className="text-sm font-semibold uppercase tracking-wider">Ticket Médio (Vendas)</p>
            </div>
            <p className="text-3xl font-bold text-indigo-600">{formatCurrency(avgTicket)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Financials */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-4">
                <Wallet className="w-5 h-5 text-gray-400" />
                Performance Financeira
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">VGV (Valor Geral de Vendas)</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPortfolioValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Realizado (Vendas)</p>
                    <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalSoldRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Expectativa (Estoque Disponível)</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(expectedRevenue)}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Custo Total (Todos os imóveis)</p>
                    <p className="text-2xl font-bold text-gray-600">{formatCurrency(totalCost)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                      Lucro Realizado 
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Garantido</span>
                    </p>
                    <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalSoldProfit)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                      Lucro Projetado 
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">Estoque</span>
                    </p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(expectedProfit)}</p>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar for Sales */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-sm font-medium text-gray-700">Progresso de Vendas (VGV)</p>
                  <p className="text-sm font-bold text-emerald-600">
                    {totalPortfolioValue > 0 ? ((totalSoldRevenue / totalPortfolioValue) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-3 rounded-full transition-all duration-1000" 
                    style={{ width: `${totalPortfolioValue > 0 ? (totalSoldRevenue / totalPortfolioValue) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Charts */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full min-h-[400px] flex flex-col">
              <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-4">
                <PieChart className="w-4 h-4 text-gray-400" />
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
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: number) => [value, 'Imóveis']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-400 text-sm">Nenhum imóvel cadastrado</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
