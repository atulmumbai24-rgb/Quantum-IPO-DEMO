// Terminology Standard:
// Ticket -> Unit of probability (1 ticket = 1 chance)
// Lot -> Unit of allocation (what they win)
// QRNG Value (R) -> Randomness input
// Pool Size (N) -> Probability denominator

export enum AppStep {
  Initialize = 1,
  Commitment = 2,
  Allotment = 3,
  Verification = 4,
  Certificate = 5
}

export interface Ticket {
  ticketId: string;
  ownerId: number;
}

export interface Investor {
  id: number;
  appNumber: string;
  lotsApplied: number; // Number of lots requested
  tickets: Ticket[];   // Units of probability generated
  status: 'Registered' | 'Allotted' | 'Not Allotted';
  allottedLots: number;
}

export interface Config {
  totalInvestors: number;
  totalLotsAvailable: number; // Total supply
  lotSize: number;
}

export interface CommitmentData {
  hash: string; // "System Fingerprint"
  timestamp: string;
  totalTickets: number; // N
  totalLotsAvailable: number;
  qrngStartIndex: number;
  qrngEndIndex: number;
  rawDataSignature: string;
}

export interface AllotmentRecord {
  rank: number;
  ticketId: string;
  investorId: number;
  qrngValue: number; // R
  poolSize: number;  // N
  rejectionLimit: number; // L
  remainderIndex: number; // R % N
  timestamp: string;
}

export interface RejectionRecord {
  qrngValue: number;
  poolSize: number;
  limit: number;
  reason: string;
}

export interface Metrics {
  rejectionCount: number;
  totalDraws: number;
  integrityVerified: boolean;
  sourceVerified: boolean;
  distortionDetected: boolean;
}