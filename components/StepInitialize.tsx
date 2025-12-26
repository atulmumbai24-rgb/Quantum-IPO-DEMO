import React, { useState, useEffect } from 'react';
import { Config, Investor } from '../types';
import { Users, ArrowRight } from 'lucide-react';

interface Props {
  onInit: (config: Config, investors: Investor[]) => void;
}

export const StepInitialize: React.FC<Props> = ({ onInit }) => {
  const [localConfig, setLocalConfig] = useState<Config>({
    totalInvestors: 1000,
    totalLotsAvailable: 100,
    lotSize: 1
  });

  const [estTickets, setEstTickets] = useState(0);

  useEffect(() => {
    // Simple estimation for UI feedback
    setEstTickets(localConfig.totalInvestors * 3); 
  }, [localConfig.totalInvestors]);

  const handleRun = () => {
    // Generate mock investors
    let globalTicketCounter = 1;
    const newInvestors: Investor[] = Array.from({ length: localConfig.totalInvestors }, (_, i) => {
      const id = i + 1;
      const lotsApplied = Math.floor(Math.random() * 5) + 1;
      const tickets = [];
      for(let t = 0; t < lotsApplied; t++) {
        tickets.push({ 
          ticketId: `TKT-${String(globalTicketCounter).padStart(6, '0')}`, 
          ownerId: id 
        });
        globalTicketCounter++;
      }
      return { 
        id, 
        appNumber: `APP-${String(id).padStart(6, '0')}`, 
        lotsApplied, 
        tickets, 
        status: 'Registered', 
        allottedLots: 0 
      };
    });

    onInit(localConfig, newInvestors);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">System Initialization</h2>
        <p className="text-slate-500 mt-2 text-base">
          Configure the supply of Lots (units of allocation) and the demand from Investors.
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Total Investors</label>
            <div className="relative">
              <input 
                type="number" 
                value={localConfig.totalInvestors} 
                onChange={(e) => setLocalConfig({...localConfig, totalInvestors: parseInt(e.target.value) || 0})} 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono focus:ring-2 focus:ring-slate-400 outline-none" 
              />
              <Users size={16} className="absolute left-3 top-4 text-slate-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Total Lots (Supply)</label>
            <input 
              type="number" 
              value={localConfig.totalLotsAvailable} 
              onChange={(e) => setLocalConfig({...localConfig, totalLotsAvailable: parseInt(e.target.value) || 0})} 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono focus:ring-2 focus:ring-slate-400 outline-none" 
            />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100">
           <div className="bg-slate-100 p-4 rounded text-sm text-slate-600 mb-6 flex justify-between items-center">
              <span>Estimated Tickets (Units of Probability):</span>
              <span className="font-mono font-bold text-slate-900">~{estTickets.toLocaleString()}</span>
           </div>

           <button 
            onClick={handleRun}
            className="w-full bg-slate-900 text-white py-4 rounded font-medium text-sm uppercase tracking-wide flex items-center justify-center space-x-2 hover:bg-slate-800 transition-colors"
           >
            <span>Initialize Ticket Pool</span>
            <ArrowRight size={16} />
           </button>
        </div>
      </div>
    </div>
  );
};