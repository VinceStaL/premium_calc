export interface PremiumParams {
  productCodes: string[];
  effectiveDate: string;
  stateCode: string;
  scaleCode: string;
  rateCode: string;
  paymentFrequency: string;
  rebateType: string;
  lhcPercentage: number;
  useBaseRate: boolean;
  useRiskRating: boolean;
  sex1?: string;
  age1?: number;
  sex2?: string;
  age2?: number;
}

export interface PremiumResult {
  productCode: string;
  basePremium: number;
  scaledBasePremium: number;
  scaleAndFrequencyPremium: number;
  finalPremium: number;
  scaleFactor: number | null;
  riskLoading1: number | null;
  riskLoading2: number | null;
  riskLoadingAmount1: number | null;
  riskLoadingAmount2: number | null;
  rebatePercentage: number | null;
  rebateAmount: number;
  premiumBeforeRebate: number;
  lhcPercentage: number;
  lhcAmount: number;
}