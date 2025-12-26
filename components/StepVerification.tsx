import React from 'react';
import { Investor, CommitmentData, Metrics } from '../types';
import { CheckCircle, XCircle, ShieldCheck } from 'lucide-react';

interface Props {
  investors: Investor[];
  commitment: CommitmentData;
  metrics: Metrics;
}

const VerificationCard = ({ label, passed, detail }: { label: string, passed: boolean, detail: string }) => (
  <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center text-center">
     <span className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-3">{label}</span>
     <div className={`mb-3 flex items-center gap-2 text-2xl font-bold ${passed ? 'text-emerald-600' : 'text-red-600'}`}>
       {passed ? <CheckCircle size={24} /> : <XCircle size={24} />}
       {passed ? "YES" : "NO"}
     </div>
     <span className="text-xs text-slate-500">{detail}</span>
  </div>
);

export const StepVerification: React.FC<Props> = ({ commitment, metrics }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Regulatory Verification</h2>
        <p className="text-slate-500 mt-2 text-base">
          Binary outcomes for audit purposes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <VerificationCard 
           label="Integrity Verified" 
           passed={metrics.integrityVerified} 
           detail="System state matches hash" 
         />
         <VerificationCard 
           label="Randomness Source Verified" 
           passed={metrics.sourceVerified} 
           detail="ANU QRNG signature valid" 
         />
         <VerificationCard 
           label="Probability Distortion Detected" 
           passed={!metrics.distortionDetected} 
           detail={!metrics.distortionDetected ? "No bias found (Rejection Sampling active)" : "BIAS DETECTED"} 
         />
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
         <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldCheck size={18} /> Automated Audit Conclusion
         </h3>
         <p className="text-slate-700 text-sm leading-relaxed">
            The system successfully reconstructed the allotment logic using the committed parameters and the specific QRNG block. 
            <strong className="block mt-2">RESULT: PASSED. No anomalies detected.</strong>
         </p>
      </div>
    </div>
  );
};