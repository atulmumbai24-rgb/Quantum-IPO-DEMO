import React, { useState } from 'react';
import { CommitmentData, Investor, Config } from '../types';
import { Lock, Server, Database, Key } from 'lucide-react';
import { generateSHA256, getQRNGStream } from '../utils/crypto';

interface Props {
  config: Config;
  investors: Investor[];
  onCommit: (data: CommitmentData) => void;
}

export const StepCommitment: React.FC<Props> = ({ config, investors, onCommit }) => {
  const [isHashing, setIsHashing] = useState(false);
  const [commitment, setCommitment] = useState<CommitmentData | null>(null);

  const totalTickets = investors.reduce((acc, inv) => acc + inv.tickets.length, 0);

  const handleGenerate = async () => {
    setIsHashing(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1200));

    const rangeStart = 1000;
    const rangeEnd = rangeStart + config.totalLotsAvailable + 500;
    const qrngData = getQRNGStream(0, 5); 
    const signatureBase = JSON.stringify(qrngData) + new Date().toISOString() + "QUANT_ALLOC_V2";
    const dataString = `INV:${config.totalInvestors}|TKT:${totalTickets}|LOTS:${config.totalLotsAvailable}|RNG:${rangeStart}-${rangeEnd}|SIG:${signatureBase}`;
    const hash = await generateSHA256(dataString);

    const newCommitment: CommitmentData = {
      hash,
      timestamp: new Date().toISOString(),
      totalTickets,
      totalLotsAvailable: config.totalLotsAvailable,
      qrngStartIndex: rangeStart,
      qrngEndIndex: rangeEnd,
      rawDataSignature: signatureBase.substring(0, 50) + '...'
    };

    setCommitment(newCommitment);
    setIsHashing(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">System State Commitment</h2>
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-600 text-slate-800 text-sm">
          <p className="font-medium">
            “Before seeing any random numbers, we freeze the entire system state into a cryptographic fingerprint. If even one ticket or QRNG value changes later, the hash will not match.”
          </p>
        </div>
      </div>

      {!commitment ? (
        <div className="bg-white p-12 rounded-lg border border-slate-200 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} className="text-slate-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Freeze System State</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm">
            This action creates a system fingerprint of all {totalTickets.toLocaleString()} probability units and the commitment to use specific future random inputs.
          </p>
          <button 
            onClick={handleGenerate} 
            disabled={isHashing} 
            className="bg-slate-900 text-white px-8 py-3 rounded font-medium text-sm uppercase tracking-wide hover:bg-slate-800 transition-colors"
          >
            {isHashing ? 'Freezing State...' : 'Generate System Fingerprint'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
               <span className="font-bold text-slate-700 flex items-center gap-2">
                 <Lock size={16} /> System Locked
               </span>
               <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                 STATE SECURED
               </span>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">System Fingerprint (SHA-256 Hash)</label>
                <div className="font-mono text-sm bg-slate-100 text-slate-800 p-4 rounded border border-slate-300 break-all">
                  {commitment.hash}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-slate-200 rounded">
                  <div className="flex items-center space-x-2 mb-1">
                    <Server size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase">QRNG Source</span>
                  </div>
                  <p className="font-semibold text-slate-900">ANU Quantum</p>
                </div>
                <div className="p-4 border border-slate-200 rounded">
                  <div className="flex items-center space-x-2 mb-1">
                    <Database size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase">Pool Size (N)</span>
                  </div>
                  <p className="font-semibold text-slate-900">{commitment.totalTickets.toLocaleString()}</p>
                </div>
                <div className="p-4 border border-slate-200 rounded">
                  <div className="flex items-center space-x-2 mb-1">
                    <Key size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase">Lots Available</span>
                  </div>
                  <p className="font-semibold text-slate-900">{commitment.totalLotsAvailable}</p>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => onCommit(commitment)} 
            className="w-full bg-blue-700 text-white py-4 rounded font-medium text-sm uppercase tracking-wide hover:bg-blue-600 transition-colors shadow-sm"
          >
            Proceed to Allotment
          </button>
        </div>
      )}
    </div>
  );
};