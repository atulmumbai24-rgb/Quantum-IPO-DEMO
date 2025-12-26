import React from 'react';
import { CommitmentData, AllotmentRecord, Investor } from '../types';
import { FileBadge, Download, Printer } from 'lucide-react';

interface Props {
  commitment: CommitmentData;
  records: AllotmentRecord[];
  investors: Investor[];
}

export const StepCertificate: React.FC<Props> = ({ commitment, records, investors }) => {
  
  const handleDownload = () => {
    // Generate a CSV-like text audit log
    const headers = "RANK,TICKET_ID,INVESTOR_ID,QRNG_VAL,POOL_SIZE,MAPPING_INDEX,TIMESTAMP";
    const rows = records.map(r => 
      `${r.rank},${r.ticketId},INV-${r.investorId},${r.qrngValue},${r.poolSize},${r.remainderIndex},${r.timestamp}`
    ).join("\n");
    
    const meta = `PROVABLE ALLOCATION PROTOCOL - AUDIT LEDGER
HASH_FINGERPRINT: ${commitment.hash}
TIMESTAMP: ${new Date().toISOString()}
TOTAL_TICKETS: ${commitment.totalTickets}
TOTAL_LOTS: ${commitment.totalLotsAvailable}
--------------------------------------------------
`;

    const content = meta + headers + "\n" + rows;
    
    // Create Blob and link
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Audit_Ledger_${commitment.hash.substring(0,8)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center pt-10 pb-20">
      <div className="bg-white border border-slate-200 p-10 rounded-xl shadow-lg max-w-2xl w-full text-center mb-8 print:shadow-none print:border-none">
         <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-800 rounded-full flex items-center justify-center mb-6 print:hidden">
           <FileBadge size={32} />
         </div>
         <h2 className="text-2xl font-bold text-slate-900 mb-2">Audit Certificate Ready</h2>
         <p className="text-slate-500 mb-8 print:hidden">
            Download the official ledger. This document contains the cryptographic proof required for third-party verification.
         </p>
         
         <div className="bg-slate-50 p-4 rounded text-xs font-mono text-slate-600 break-all border border-slate-200 mb-8 text-left">
           <div className="mb-2 text-slate-400 font-bold">SYSTEM COMMITMENT HASH:</div>
           {commitment.hash}
         </div>

         <div className="flex flex-col md:flex-row gap-4 justify-center print:hidden">
           <button 
             onClick={handleDownload}
             className="bg-slate-900 text-white px-6 py-3 rounded font-medium text-sm uppercase tracking-wide hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
           >
              <Download size={18} />
              Download Audit Ledger (.CSV)
           </button>
           
           <button 
             onClick={handlePrint}
             className="bg-white text-slate-700 border border-slate-300 px-6 py-3 rounded font-medium text-sm uppercase tracking-wide hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
           >
              <Printer size={18} />
              Print Official Report
           </button>
         </div>
      </div>
    </div>
  );
};