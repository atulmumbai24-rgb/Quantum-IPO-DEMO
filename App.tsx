import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { StepInitialize } from './components/StepInitialize';
import { StepCommitment } from './components/StepCommitment';
import { StepAllotment } from './components/StepAllotment';
import { StepVerification } from './components/StepVerification';
import { StepCertificate } from './components/StepCertificate';
import { AppStep, Config, Investor, CommitmentData, AllotmentRecord, RejectionRecord, Metrics } from './types';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.Initialize);
  const [maxStepReached, setMaxStepReached] = useState<AppStep>(AppStep.Initialize);
  
  // App State
  const [config, setConfig] = useState<Config>({ totalInvestors: 1000, totalLotsAvailable: 100, lotSize: 1 });
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [commitment, setCommitment] = useState<CommitmentData | null>(null);
  
  // Hold records to display in Certificate/Report
  const [records, setRecords] = useState<AllotmentRecord[]>([]);

  const [metrics, setMetrics] = useState<Metrics>({
    rejectionCount: 0,
    totalDraws: 0,
    integrityVerified: false,
    sourceVerified: false,
    distortionDetected: false
  });

  const advanceStep = (next: AppStep) => {
    setCurrentStep(next);
    if (next > maxStepReached) setMaxStepReached(next);
  };

  const handleInit = (newConfig: Config, newInvestors: Investor[]) => {
    setConfig(newConfig);
    setInvestors(newInvestors);
    advanceStep(AppStep.Commitment);
  };

  const handleCommit = (data: CommitmentData) => {
    setCommitment(data);
    advanceStep(AppStep.Allotment);
  };

  const handleAllotmentComplete = (
    finalInvestors: Investor[], 
    newRecords: AllotmentRecord[], 
    rejections: RejectionRecord[]
  ) => {
    setInvestors(finalInvestors);
    setRecords(newRecords);
    setMetrics({
      rejectionCount: rejections.length,
      totalDraws: newRecords.length + rejections.length,
      integrityVerified: true, // Simulated verification
      sourceVerified: true,
      distortionDetected: false
    });
    advanceStep(AppStep.Verification);
    // Allow users to click Certificate later
    setTimeout(() => {
        if(maxStepReached < AppStep.Certificate) setMaxStepReached(AppStep.Certificate);
    }, 500);
  };

  return (
    <Layout currentStep={currentStep} maxStepReached={maxStepReached} setStep={setCurrentStep}>
      {currentStep === AppStep.Initialize && (
        <StepInitialize onInit={handleInit} />
      )}
      
      {currentStep === AppStep.Commitment && (
        <StepCommitment 
          config={config} 
          investors={investors} 
          onCommit={handleCommit} 
        />
      )}

      {currentStep === AppStep.Allotment && commitment && (
        <StepAllotment 
          investors={investors} 
          commitment={commitment} 
          onComplete={handleAllotmentComplete} 
        />
      )}

      {currentStep === AppStep.Verification && commitment && (
        <StepVerification 
          investors={investors} 
          commitment={commitment} 
          metrics={metrics}
        />
      )}

      {currentStep === AppStep.Certificate && commitment && (
        <StepCertificate 
          commitment={commitment} 
          records={records} 
          investors={investors}
        />
      )}
    </Layout>
  );
};

export default App;