import React, { useState } from 'react';
import { CommitmentData, Investor, AllotmentRecord, RejectionRecord } from '../types';
import { getQRNGStream, getQRNGMetadata } from '../utils/crypto';
import { Check, AlertTriangle, ChevronDown, ChevronUp, Table, ArrowRight } from 'lucide-react';

interface Props {
  investors: Investor[];
  commitment: CommitmentData;
  onComplete: (investors: Investor[], records: AllotmentRecord[], rejections: RejectionRecord[]) => void;
}

// --- SUB-COMPONENTS (Moved outside to prevent re-creation) ---

const MentalModel = () => (
  <div className="mb-10 p-6 bg-slate-900 rounded-lg text-white shadow-lg">
    <h2 className="text-xl md:text-2xl font-light leading-relaxed text-center">
      “We repeatedly draw quantum random numbers and only accept those that give every ticket exactly the same probability of winning—no more, no less.”
    </h2>
  </div>
);

const FairnessSecurityBanner = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-300 rounded-lg overflow-hidden mb-12 shadow-sm">
    <div className="bg-white p-6 border-b md:border-b-0 md:border-r border-slate-300">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Fairness = Probability</h3>
      <ul className="space-y-3 text-sm text-slate-800">
        <li className="flex items-start gap-2"><Check size={16} className="text-blue-600 mt-0.5" /> Rejection sampling method</li>
        <li className="flex items-start gap-2"><Check size={16} className="text-blue-600 mt-0.5" /> Every ticket has exactly 1/N probability</li>
        <li className="flex items-start gap-2"><Check size={16} className="text-blue-600 mt-0.5" /> Bias mathematically eliminated</li>
      </ul>
    </div>
    <div className="bg-slate-50 p-6">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Security = Integrity</h3>
      <ul className="space-y-3 text-sm text-slate-800">
        <li className="flex items-start gap-2"><Check size={16} className="text-emerald-600 mt-0.5" /> Commitment fingerprint (SHA-256)</li>
        <li className="flex items-start gap-2"><Check size={16} className="text-emerald-600 mt-0.5" /> System locked before randomness</li>
        <li className="flex items-start gap-2"><Check size={16} className="text-emerald-600 mt-0.5" /> No post-facto manipulation possible</li>
      </ul>
    </div>
    <div className="col-span-1 md:col-span-2 bg-slate-200 py-2 text-center border-t border-slate-300">
      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Fairness is mathematical. Security is cryptographic.</span>
    </div>
  </div>
);

const TinyWalkthrough = () => {
  const qrngValues = Array.from({length: 16}, (_, i) => i);
  const limit = 10;
  
  return (
    <div className="mb-12 bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
         <h3 className="font-bold text-slate-900">How It Works (Miniature Example)</h3>
         <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">Intuition Builder</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
         <div>
           <p className="mb-2 font-semibold text-slate-700">Scenario:</p>
           <ul className="list-disc pl-5 space-y-1 text-slate-600 mb-4">
             <li>5 Investors, 2 tickets each = <span className="font-bold text-slate-900">10 Tickets (N)</span></li>
             <li>QRNG Range: 0 to 15 (M = 16)</li>
             <li>Rejection Limit (L) = floor(16 / 10) × 10 = <span className="font-bold text-slate-900">10</span></li>
           </ul>
         </div>
         <div>
            <p className="mb-2 font-semibold text-slate-700">Execution:</p>
            <div className="flex flex-wrap gap-1">
              {qrngValues.map(val => {
                const isAccepted = val < limit;
                return (
                  <div 
                    key={val} 
                    className={`w-8 h-8 flex items-center justify-center text-xs font-mono border rounded 
                      ${isAccepted ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-red-50 border-red-200 text-red-400 line-through opacity-60'}`}
                    title={isAccepted ? `Maps to Ticket #${val}` : 'Rejected (> Limit)'}
                  >
                    {val}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-xs text-slate-500 flex gap-4">
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-100 border border-emerald-300 rounded"></div> Accepted (0-9)</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div> Rejected (10-15)</span>
            </div>
         </div>
      </div>
      <p className="mt-6 text-center italic text-slate-600 border-t border-slate-100 pt-4">
        “The exact same logic scales to 20,000 QRNG values.”
      </p>
    </div>
  );
};

const BiasContrast = () => (
  <div className="mb-8 bg-amber-50 border border-amber-200 p-4 rounded-lg text-left">
    <div className="flex items-start gap-3">
      <AlertTriangle className="text-amber-600 shrink-0 mt-1" size={18} />
      <div className="text-sm text-amber-900">
         <p className="mb-2 font-medium">
           “Using R % N directly makes lower ticket numbers slightly more likely whenever M is not a multiple of N.”
         </p>
         <p className="font-bold">
           “Rejection sampling mathematically removes this imbalance.”
         </p>
      </div>
    </div>
  </div>
);

const WinningLedger = ({ 
  finished, 
  records, 
  onComplete, 
  investors, 
  rejections 
}: {
  finished: boolean;
  records: AllotmentRecord[];
  onComplete: (investors: Investor[], records: AllotmentRecord[], rejections: RejectionRecord[]) => void;
  investors: Investor[];
  rejections: RejectionRecord[];
}) => {
  if (!finished) return null;
  return (
    <div className="mt-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Table size={20} className="text-emerald-600" />
          Official Winning Ledger
        </h3>
        <span className="text-xs uppercase bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold tracking-wider">
          Allocation Complete
        </span>
      </div>
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-700">Rank</th>
                <th className="px-6 py-3 font-semibold text-slate-700 font-mono">QRNG (R)</th>
                <th className="px-6 py-3 font-semibold text-slate-700 font-mono">Pool (N)</th>
                <th className="px-6 py-3 font-semibold text-slate-700 font-mono">Map (R % N)</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Winning Ticket</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Investor ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((record) => (
                <tr key={record.rank} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-slate-900">#{record.rank}</td>
                  <td className="px-6 py-3 font-mono text-slate-600">{record.qrngValue}</td>
                  <td className="px-6 py-3 font-mono text-slate-500">{record.poolSize}</td>
                  <td className="px-6 py-3 font-mono text-blue-600 font-bold">{record.remainderIndex}</td>
                  <td className="px-6 py-3 font-mono text-slate-800">{record.ticketId}</td>
                  <td className="px-6 py-3 text-slate-800">INV-{String(record.investorId).padStart(4, '0')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
         <button 
           onClick={() => onComplete(investors, records, rejections)}
           className="bg-emerald-600 text-white px-8 py-3 rounded font-medium text-sm uppercase tracking-wide hover:bg-emerald-500 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
         >
           Proceed to Regulatory Verification <ArrowRight size={18} />
         </button>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---

export const StepAllotment: React.FC<Props> = ({ investors, commitment, onComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMath, setShowMath] = useState(false);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  
  // Local state to hold results before confirming
  const [localRecords, setLocalRecords] = useState<AllotmentRecord[]>([]);
  const [localInvestors, setLocalInvestors] = useState<Investor[]>([]);
  const [localRejections, setLocalRejections] = useState<RejectionRecord[]>([]);

  const runAllotment = async () => {
    setIsProcessing(true);
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    
    let ticketPool: any[] = [];
    investors.forEach(inv => ticketPool.push(...inv.tickets));
    let currentPool = [...ticketPool];
    const totalLots = commitment.totalLotsAvailable;
    const qrngMeta = getQRNGMetadata();
    const M = qrngMeta.maxValue + 1; // 65536
    const qrngData = getQRNGStream(commitment.qrngStartIndex, totalLots * 10);
    
    const records: AllotmentRecord[] = [];
    const rejections: RejectionRecord[] = [];
    const winnerOwnerIds = new Map<number, number>();
    let qrngCursor = 0;
    let lotsDistributed = 0;

    while (lotsDistributed < totalLots && currentPool.length > 0) {
        const N = currentPool.length;
        const L = Math.floor(M / N) * N;

        if (qrngCursor >= qrngData.length) break;
        const qrngPoint = qrngData[qrngCursor];
        const R = qrngPoint.value;
        qrngCursor++;

        if (R >= L) {
            rejections.push({ qrngValue: R, poolSize: N, limit: L, reason: `R (${R}) >= L (${L})` });
            continue;
        }

        const winnerIndex = R % N;
        const winningTicket = currentPool[winnerIndex];
        records.push({
            rank: lotsDistributed + 1,
            ticketId: winningTicket.ticketId,
            investorId: winningTicket.ownerId,
            qrngValue: R,
            poolSize: N,
            rejectionLimit: L,
            remainderIndex: winnerIndex,
            timestamp: new Date().toISOString()
        });

        const currentWins = winnerOwnerIds.get(winningTicket.ownerId) || 0;
        winnerOwnerIds.set(winningTicket.ownerId, currentWins + 1);
        currentPool.splice(winnerIndex, 1);
        lotsDistributed++;

        if (lotsDistributed % Math.ceil(totalLots / 20) === 0) {
            setProgress(Math.round((lotsDistributed / totalLots) * 100));
            await delay(10);
        }
    }

    const finalInvestors = investors.map(inv => {
        const wonCount = winnerOwnerIds.get(inv.id) || 0;
        return { ...inv, status: wonCount > 0 ? 'Allotted' : 'Not Allotted', allottedLots: wonCount } as Investor;
    });

    setProgress(100);
    setLocalRecords(records);
    setLocalInvestors(finalInvestors);
    setLocalRejections(rejections);
    setFinished(true);
    setIsProcessing(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
       <MentalModel />
       <FairnessSecurityBanner />
       <TinyWalkthrough />
       
       <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm text-center">
          <div className="max-w-md mx-auto">
             <h3 className="text-lg font-bold text-slate-900 mb-4">Execute Allotment</h3>
             <BiasContrast />
             
             {isProcessing ? (
               <div className="space-y-4">
                 <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                   <div className="bg-blue-600 h-4 transition-all duration-300" style={{width: `${progress}%`}}></div>
                 </div>
                 <p className="text-sm text-slate-500 font-mono">Processing Ticket Allocations...</p>
               </div>
             ) : finished ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 font-medium">
                  Allotment Logic Executed Successfully. See Ledger below.
                </div>
             ) : (
               <button 
                 onClick={runAllotment}
                 className="w-full bg-blue-700 text-white py-4 rounded font-medium text-sm uppercase tracking-wide hover:bg-blue-600 transition-colors shadow-sm"
               >
                 Run Official Allotment
               </button>
             )}
          </div>
       </div>

       <WinningLedger 
          finished={finished} 
          records={localRecords} 
          onComplete={onComplete} 
          investors={localInvestors}
          rejections={localRejections}
       />

       {!finished && (
        <div className="mt-8 border-t border-slate-200 pt-6">
          <button 
            onClick={() => setShowMath(!showMath)} 
            className="text-slate-500 hover:text-slate-900 text-sm flex items-center gap-2 font-medium"
          >
            {showMath ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            {showMath ? "Hide Technical Details" : "Show Math (Technical)"}
          </button>
          
          {showMath && (
            <div className="mt-4 bg-slate-50 p-6 rounded text-sm font-mono text-slate-700 border border-slate-200">
               <div className="mb-4">
                 <span className="font-bold text-slate-900 block mb-1">Step 1: Calculate Rejection Limit (L)</span>
                 L = floor(M / N) × N
               </div>
               <div className="mb-4">
                 <span className="font-bold text-slate-900 block mb-1">Step 2: Discard Rule</span>
                 IF (QRNG_Value &ge; L) THEN REJECT
               </div>
               <div>
                 <span className="font-bold text-slate-900 block mb-1">Step 3: Modulo Mapping</span>
                 Winner_Index = QRNG_Value % N
               </div>
            </div>
          )}
        </div>
       )}
    </div>
  );
};