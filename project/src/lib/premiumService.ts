import { SupabaseClient } from '@supabase/supabase-js';

interface PremiumCalculationParams {
  supabase: SupabaseClient;
  effectiveDate: string;
  productCodes: string[];  // Changed from single productCode to array
  stateCode: string;
  scaleCode: string;
  rateCode: string;
  paymentFrequency: string;
  rebateType: string;
  lhcPercentage: number;
  useBaseRate: boolean;
  useRiskRating?: boolean;
  sex1?: string;
  age1?: number;
  sex2?: string;
  age2?: number;
}

interface PremiumResult {
  productCode: string;  // Added to identify which product the result belongs to
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

async function getScaleFactor(supabase: SupabaseClient, productCode: string, scaleCode: string, effectiveDate: string): Promise<number | null> {
  const { data, error } = await supabase
    .from('ScaleFactors')
    .select('ScaleFactor')
    .eq('ProductCode', productCode)
    .eq('ScaleCode', scaleCode)
    .lte('DateOn', effectiveDate)
    .gt('DateOff', effectiveDate)
    .order('DateOn', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.ScaleFactor ?? null;
}

async function getRiskLoading(supabase: SupabaseClient, productCode: string, sex: string, age: number, effectiveDate: string): Promise<number | null> {
  const { data, error } = await supabase
    .from('RiskLoading')
    .select('RiskLoading')
    .eq('ProductCode', productCode)
    .eq('Sex', sex)
    .eq('Age', age)
    .lte('DateOn', effectiveDate)
    .gt('DateOff', effectiveDate)
    .order('DateOn', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.RiskLoading ?? null;
}

async function getRebatePercentage(supabase: SupabaseClient, rebateType: string, effectiveDate: string): Promise<number | null> {
  if (!rebateType) return null;

  const { data, error } = await supabase
    .from('RebatePercentage')
    .select('Rebate')
    .eq('RebateType', rebateType)
    .lte('DateOn', effectiveDate)
    .gt('DateOff', effectiveDate)
    .order('DateOn', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.Rebate ?? null;
}

async function calculateSinglePremium(
  supabase: SupabaseClient,
  productCode: string,
  params: Omit<PremiumCalculationParams, 'supabase' | 'productCodes'>
): Promise<PremiumResult> {
  // Step 1: Get base premium and flags from ProductRateMaster
  const { data: masterData, error: masterError } = await supabase
    .from('ProductRateMaster')
    .select('BaseRate, LHCApplicable, RebateApplicable')
    .eq('ProductCode', productCode)
    .eq('StateCode', params.stateCode)
    .eq('RateCode', parseInt(params.rateCode))
    .lte('DateOn', params.effectiveDate)
    .gt('DateOff', params.effectiveDate)
    .order('DateOn', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (masterError) throw masterError;
  if (!masterData) throw new Error(`No base rate found for product code ${productCode}`);

  const basePremium = masterData.BaseRate;
  let scaledBasePremium: number;
  let scaleAndFrequencyPremium: number;
  let finalPremium: number;
  let scaleFactor: number | null = null;

  // Step 2: Calculate scale and frequency premium
  if (params.useBaseRate) {
    // Get scale factor
    scaleFactor = await getScaleFactor(supabase, productCode, params.scaleCode, params.effectiveDate);
    scaledBasePremium = scaleFactor !== null ? basePremium * scaleFactor : basePremium;
    scaleAndFrequencyPremium = scaledBasePremium;

    // Apply frequency adjustment
    switch (params.paymentFrequency) {
      case 'daily':
        scaleAndFrequencyPremium = scaleAndFrequencyPremium * 12 / 365.25;
        break;
      case 'weekly':
        scaleAndFrequencyPremium = scaleAndFrequencyPremium * 12 * 7 / 365.25;
        break;
      case 'fortnightly':
        scaleAndFrequencyPremium = scaleAndFrequencyPremium * 12 * 14 / 365.25;
        break;
      case 'monthly':
        // No adjustment needed for monthly
        break;
      case 'quarterly':
        scaleAndFrequencyPremium = scaleAndFrequencyPremium * 3;
        break;
      case 'halfYearly':
        scaleAndFrequencyPremium = scaleAndFrequencyPremium * 6;
        break;
      case 'yearly':
        scaleAndFrequencyPremium = scaleAndFrequencyPremium * 12;
        break;
      default:
        throw new Error('Invalid payment frequency');
    }
  } else {
    // Get premium directly from ProductRateDetail
    const { data: rateData, error: rateError } = await supabase
      .from('ProductRateDetail')
      .select('*')
      .eq('ProductCode', productCode)
      .eq('StateCode', params.stateCode)
      .eq('ScaleCode', params.scaleCode)
      .eq('RateCode', parseInt(params.rateCode))
      .lte('DateOn', params.effectiveDate)
      .gt('DateOff', params.effectiveDate)
      .order('DateOn', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (rateError) throw rateError;
    if (!rateData) throw new Error(`No rate found for product code ${productCode}`);

    // Get premium based on payment frequency
    switch (params.paymentFrequency) {
      case 'weekly':
        scaleAndFrequencyPremium = rateData.WeeklyRate;
        break;
      case 'monthly':
        scaleAndFrequencyPremium = rateData.MonthlyRate;
        break;
      case 'quarterly':
        scaleAndFrequencyPremium = rateData.QuarterlyRate;
        break;
      case 'halfYearly':
        scaleAndFrequencyPremium = rateData.HalfYearlyRate;
        break;
      case 'yearly':
        scaleAndFrequencyPremium = rateData.YearlyRate;
        break;
      default:
        throw new Error('Invalid payment frequency');
    }
    scaledBasePremium = scaleAndFrequencyPremium;
  }

  // Initialize final premium with scale and frequency premium
  finalPremium = scaleAndFrequencyPremium;

  // Step 3: Calculate risk loading amounts
  let riskLoading1: number | null = null;
  let riskLoading2: number | null = null;
  let riskLoadingAmount1: number | null = null;
  let riskLoadingAmount2: number | null = null;

  if (params.useRiskRating && params.sex1 !== undefined && params.age1 !== undefined) {
    // Get risk loading for first person
    riskLoading1 = await getRiskLoading(supabase, productCode, params.sex1, params.age1, params.effectiveDate);
    if (riskLoading1 !== null) {
      riskLoadingAmount1 = scaleAndFrequencyPremium * riskLoading1;
      finalPremium += riskLoadingAmount1;
    }

    // Get risk loading for second person if applicable
    if (['D', 'F', 'Q'].includes(params.scaleCode) && params.sex2 !== undefined && params.age2 !== undefined) {
      riskLoading2 = await getRiskLoading(supabase, productCode, params.sex2, params.age2, params.effectiveDate);
      if (riskLoading2 !== null) {
        riskLoadingAmount2 = scaleAndFrequencyPremium * riskLoading2;
        finalPremium += riskLoadingAmount2;
      }
    }
  }

  // Step 4: Apply LHC loading if applicable
  let lhcAmount = 0;
  if (masterData.LHCApplicable === 'Y' && params.lhcPercentage > 0) {
    lhcAmount = scaleAndFrequencyPremium * (params.lhcPercentage / 100);
    finalPremium += lhcAmount;
  }

  // Store premium before rebate
  const premiumBeforeRebate = finalPremium;

  // Step 5: Apply rebate if applicable
  let rebateAmount = 0;
  const rebatePercentage = masterData.RebateApplicable === 'Y' ? await getRebatePercentage(supabase, params.rebateType, params.effectiveDate) : null;

  if (rebatePercentage !== null && masterData.RebateApplicable === 'Y') {
    rebateAmount = scaleAndFrequencyPremium * (rebatePercentage / 100);
    finalPremium -= rebateAmount;
  }

  return {
    productCode,
    basePremium: Number(basePremium.toFixed(2)),
    scaledBasePremium: Number(scaledBasePremium.toFixed(2)),
    scaleAndFrequencyPremium: Number(scaleAndFrequencyPremium.toFixed(2)),
    finalPremium: Number(finalPremium.toFixed(2)),
    scaleFactor,
    riskLoading1,
    riskLoading2,
    riskLoadingAmount1: riskLoadingAmount1 !== null ? Number(riskLoadingAmount1.toFixed(2)) : null,
    riskLoadingAmount2: riskLoadingAmount2 !== null ? Number(riskLoadingAmount2.toFixed(2)) : null,
    rebatePercentage,
    rebateAmount: Number(rebateAmount.toFixed(2)),
    premiumBeforeRebate: Number(premiumBeforeRebate.toFixed(2)),
    lhcPercentage: params.lhcPercentage,
    lhcAmount: Number(lhcAmount.toFixed(2))
  };
}

export async function calculatePremium(params: PremiumCalculationParams): Promise<PremiumResult[]> {
  const results: PremiumResult[] = [];

  for (const productCode of params.productCodes) {
    if (!productCode) continue;  // Skip empty product codes
    
    const result = await calculateSinglePremium(params.supabase, productCode, {
      effectiveDate: params.effectiveDate,
      stateCode: params.stateCode,
      scaleCode: params.scaleCode,
      rateCode: params.rateCode,
      paymentFrequency: params.paymentFrequency,
      rebateType: params.rebateType,
      lhcPercentage: params.lhcPercentage,
      useBaseRate: params.useBaseRate,
      useRiskRating: params.useRiskRating,
      sex1: params.sex1,
      age1: params.age1,
      sex2: params.sex2,
      age2: params.age2
    });

    results.push(result);
  }

  return results;
}