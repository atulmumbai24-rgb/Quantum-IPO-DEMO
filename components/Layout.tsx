import React from 'react';
import { 
  Users, 
  Lock, 
  Scale, // Used for Allotment/Fairness
  FileCheck, // Used for Verification 
  FileBadge, // Used for Certificate
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { AppStep } from '../types';

interface LayoutProps {
  currentStep: AppStep;
  maxStepReached: AppStep;
  setStep: (step: AppStep) => void;
  children: React.ReactNode;
}

const steps = [
  { id: AppStep.Initialize, label: 'Initialization', icon: Users },
  { id: AppStep.Commitment, label: 'Commitment', icon: Lock },
  { id: AppStep.Allotment, label: 'Allotment Logic', icon: Scale },
  { id: AppStep.Verification, label: 'Verification', icon: FileCheck },
  { id: AppStep.Certificate, label: 'Final Report', icon: FileBadge },
];

export const Layout: React.FC<LayoutProps> = ({ currentStep, maxStepReached, setStep, children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900">
      {/* Sidebar */}
      <div className="w-full lg:w-72 bg-white border-r border-slate-200 flex flex-col h-auto lg:h-screen lg:fixed lg:left-0 lg:top-0 z-10">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-900 rounded flex items-center justify-center">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900 tracking-tight leading-none">Provable Fairness</span>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">Audit Protocol</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-6 space-y-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isAccessible = step.id <= maxStepReached;
            return (
              <button
                key={step.id}
                onClick={() => isAccessible && setStep(step.id)}
                disabled={!isAccessible}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                  isActive 
                    ? 'bg-slate-100 text-slate-900 font-semibold border-l-4 border-slate-900' 
                    : isAccessible 
                      ? 'text-slate-500 hover:bg-slate-50 hover:text-slate-900' 
                      : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-slate-900' : ''} />
                <span className="text-sm">{step.label}</span>
                {isAccessible && !isActive && step.id < currentStep && (
                  <div className="ml-auto"><CheckCircle size={14} className="text-emerald-600" /></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-6 lg:p-12 overflow-y-auto min-h-screen flex flex-col">
        <div className="flex-1 max-w-5xl mx-auto w-full">
          {children}
        </div>
        
        {/* Mandatory Footer Guarantee */}
        <footer className="mt-20 pt-8 border-t border-slate-200 text-center max-w-5xl mx-auto w-full">
          <p className="text-slate-600 font-medium text-sm max-w-3xl mx-auto">
            “Any third party, without trusting us, can independently verify that every investor had exactly the same probability and that no result was altered.”
          </p>
        </footer>
      </main>
    </div>
  );
};