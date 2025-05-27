import { supabase } from './supabase';

export interface ProductRate {
  ProductCode: string;
  StateCode: string;
  RateCode: number;
  DateOn: string;
  DateOff: string | null;
  HealthCategory: number | null;
  BaseRate: number | null;
  LHCApplicable: string | null;
  RebateApplicable: string | null;
  LastUpdateTimestamp: string;
  LastUpdateUser: string | null;
}

export interface ProductRateDetailType {
  ProductCode: string;
  StateCode: string;
  RateCode: number;
  ScaleCode: string;
  DateOn: string;
  DateOff: string | null;
  WeeklyRate: number | null;
  MonthlyRate: number | null;
  QuarterlyRate: number | null;
  HalfYearlyRate: number | null;
  YearlyRate: number | null;
  LastUpdateUser: string | null;
  LastUpdateTimestamp: string;
}

export interface RebatePercentage {
  IncomeTier: number;
  RebateType: string;
  DateOn: string;
  DateOff: string | null;
  Rebate: number;
  LastUpdateUserid: string | null;
  LastUpdateTimestamp: string;
}

export interface ScaleFactor {
  ProductCode: string;
  ScaleCode: string;
  DateOn: string;
  DateOff: string | null;
  ScaleFactor: number;
  LastUpdateUser: string | null;
  LastUpdateTimestamp: string;
}

export interface RiskLoading {
  ProductCode: string;
  Age: number;
  Sex: string;
  RiskLoading: number;
  DateOn: string;
  DateOff: string | null;
  LastUpdateUser: string | null;
  LastUpdateTimestamp: string;
}

export interface UploadProgress {
  successful: number;
  duplicates: number;
  errors: number;
  total: number;
}

export interface FetchProductsParams {
  page: number;
  itemsPerPage: number;
  filters: {
    productCode?: string;
    stateCode?: string;
    rateCode?: string;
    dateOn?: string;
    scaleCode?: string;
    incomeTier?: string;
    rebateType?: string;
    age?: string;
    sex?: string;
  };
}

export async function fetchProducts({ page, itemsPerPage, filters }: FetchProductsParams) {
  let countQuery = supabase
    .from('ProductRateMaster')
    .select('*', { count: 'exact', head: true });

  if (filters.productCode) {
    countQuery = countQuery.ilike('ProductCode', `%${filters.productCode}%`);
  }
  if (filters.stateCode) {
    countQuery = countQuery.eq('StateCode', filters.stateCode);
  }
  if (filters.rateCode) {
    countQuery = countQuery.eq('RateCode', parseInt(filters.rateCode));
  }
  if (filters.dateOn) {
    countQuery = countQuery.eq('DateOn', filters.dateOn);
  }

  const { count, error: countError } = await countQuery;

  if (countError) throw countError;

  let query = supabase
    .from('ProductRateMaster')
    .select('*')
    .order('ProductCode', { ascending: true })
    .order('StateCode', { ascending: true })
    .order('RateCode', { ascending: true })
    .order('DateOn', { ascending: true });

  if (filters.productCode) {
    query = query.ilike('ProductCode', `%${filters.productCode}%`);
  }
  if (filters.stateCode) {
    query = query.eq('StateCode', filters.stateCode);
  }
  if (filters.rateCode) {
    query = query.eq('RateCode', parseInt(filters.rateCode));
  }
  if (filters.dateOn) {
    query = query.eq('DateOn', filters.dateOn);
  }

  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  
  query = query.range(from, to);

  const { data, error } = await query;

  if (error) throw error;

  return {
    data: data || [],
    count: count || 0
  };
}

export async function fetchProductRateDetails({ page, itemsPerPage, filters }: FetchProductsParams) {
  try {
    let countQuery = supabase
      .from('ProductRateDetail')
      .select('*', { count: 'exact', head: true });

    if (filters.productCode) {
      countQuery = countQuery.ilike('ProductCode', `%${filters.productCode}%`);
    }
    if (filters.stateCode) {
      countQuery = countQuery.eq('StateCode', filters.stateCode);
    }
    if (filters.rateCode) {
      countQuery = countQuery.eq('RateCode', parseInt(filters.rateCode));
    }
    if (filters.dateOn) {
      countQuery = countQuery.eq('DateOn', filters.dateOn);
    }
    if (filters.scaleCode) {
      countQuery = countQuery.eq('ScaleCode', filters.scaleCode);
    }

    const { count, error: countError } = await countQuery;

    if (countError) throw countError;

    let query = supabase
      .from('ProductRateDetail')
      .select('*')
      .order('ProductCode', { ascending: true })
      .order('StateCode', { ascending: true })
      .order('RateCode', { ascending: true })
      .order('ScaleCode', { ascending: true })
      .order('DateOn', { ascending: true });

    if (filters.productCode) {
      query = query.ilike('ProductCode', `%${filters.productCode}%`);
    }
    if (filters.stateCode) {
      query = query.eq('StateCode', filters.stateCode);
    }
    if (filters.rateCode) {
      query = query.eq('RateCode', parseInt(filters.rateCode));
    }
    if (filters.dateOn) {
      query = query.eq('DateOn', filters.dateOn);
    }
    if (filters.scaleCode) {
      query = query.eq('ScaleCode', filters.scaleCode);
    }

    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    
    query = query.range(from, to);

    const { data, error } = await query;

    if (error && error.code === 'PGRST116') {
      return {
        data: [],
        count: 0
      };
    }

    if (error) throw error;

    return {
      data: data || [],
      count: count || 0
    };
  } catch (error) {
    if (error.code === 'PGRST116') {
      console.log('No records found for the given criteria');
      return {
        data: [],
        count: 0
      };
    }
    throw error;
  }
}

export async function fetchRebatePercentages({ page, itemsPerPage, filters }: FetchProductsParams) {
  try {
    let countQuery = supabase
      .from('RebatePercentage')
      .select('*', { count: 'exact', head: true });

    if (filters.incomeTier) {
      countQuery = countQuery.eq('IncomeTier', parseInt(filters.incomeTier));
    }
    if (filters.rebateType) {
      countQuery = countQuery.eq('RebateType', filters.rebateType);
    }
    if (filters.dateOn) {
      countQuery = countQuery.eq('DateOn', filters.dateOn);
    }

    const { count, error: countError } = await countQuery;

    if (countError) throw countError;

    let query = supabase
      .from('RebatePercentage')
      .select('*')
      .order('IncomeTier', { ascending: true })
      .order('RebateType', { ascending: true })
      .order('DateOn', { ascending: true });

    if (filters.incomeTier) {
      query = query.eq('IncomeTier', parseInt(filters.incomeTier));
    }
    if (filters.rebateType) {
      query = query.eq('RebateType', filters.rebateType);
    }
    if (filters.dateOn) {
      query = query.eq('DateOn', filters.dateOn);
    }

    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    
    query = query.range(from, to);

    const { data, error } = await query;

    if (error && error.code === 'PGRST116') {
      return {
        data: [],
        count: 0
      };
    }

    if (error) throw error;

    return {
      data: data || [],
      count: count || 0
    };
  } catch (error) {
    if (error.code === 'PGRST116') {
      console.log('No records found for the given criteria');
      return {
        data: [],
        count: 0
      };
    }
    throw error;
  }
}

export async function fetchScaleFactors({ page, itemsPerPage, filters }: FetchProductsParams) {
  try {
    let countQuery = supabase
      .from('ScaleFactors')
      .select('*', { count: 'exact', head: true });

    if (filters.scaleCode) {
      countQuery = countQuery.eq('ScaleCode', filters.scaleCode);
    }
    if (filters.dateOn) {
      countQuery = countQuery.eq('DateOn', filters.dateOn);
    }

    const { count, error: countError } = await countQuery;

    if (countError) throw countError;

    let query = supabase
      .from('ScaleFactors')
      .select('*')
      .order('ScaleCode', { ascending: true })
      .order('DateOn', { ascending: true });

    if (filters.scaleCode) {
      query = query.eq('ScaleCode', filters.scaleCode);
    }
    if (filters.dateOn) {
      query = query.eq('DateOn', filters.dateOn);
    }

    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    
    query = query.range(from, to);

    const { data, error } = await query;

    if (error && error.code === 'PGRST116') {
      return {
        data: [],
        count: 0
      };
    }

    if (error) throw error;

    return {
      data: data || [],
      count: count || 0
    };
  } catch (error) {
    if (error.code === 'PGRST116') {
      console.log('No records found for the given criteria');
      return {
        data: [],
        count: 0
      };
    }
    throw error;
  }
}

export async function saveProductRate(product: Partial<ProductRate>, userEmail: string) {
  const { error } = await supabase
    .from('ProductRateMaster')
    .upsert({
      ...product,
      ProductCode: product.ProductCode?.toUpperCase(),
      LastUpdateTimestamp: new Date().toISOString(),
      LastUpdateUser: userEmail
    });

  if (error) throw error;
}

export async function saveProductRateDetail(product: Partial<ProductRateDetailType>, userEmail: string) {
  const { error } = await supabase
    .from('ProductRateDetail')
    .upsert({
      ...product,
      ProductCode: product.ProductCode?.toUpperCase(),
      LastUpdateTimestamp: new Date().toISOString(),
      LastUpdateUser: userEmail
    });

  if (error) throw error;
}

export async function saveRebatePercentage(rebate: Partial<RebatePercentage>, userEmail: string) {
  if (rebate.Rebate !== undefined && rebate.Rebate !== null) {
    if (rebate.Rebate < 0 || rebate.Rebate > 45) {
      throw new Error('Rebate must be between 0 and 45');
    }
    if (rebate.Rebate !== 0) {
      rebate.Rebate = Number(rebate.Rebate.toFixed(3));
    }
  }

  const { error } = await supabase
    .from('RebatePercentage')
    .upsert({
      ...rebate,
      LastUpdateTimestamp: new Date().toISOString(),
      LastUpdateUserid: userEmail
    });

  if (error) throw error;
}

export async function saveScaleFactor(scaleFactor: Partial<ScaleFactor>, userEmail: string) {
  if (scaleFactor.ScaleFactor !== undefined && scaleFactor.ScaleFactor !== null) {
    if (scaleFactor.ScaleFactor < 0 || scaleFactor.ScaleFactor > 10) {
      throw new Error('Scale Factor must be between 0 and 10');
    }
    if (scaleFactor.ScaleFactor !== 0) {
      scaleFactor.ScaleFactor = Number(scaleFactor.ScaleFactor.toFixed(3));
    }
  }

  const { error } = await supabase
    .from('ScaleFactors')
    .upsert({
      ...scaleFactor,
      LastUpdateTimestamp: new Date().toISOString(),
      LastUpdateUser: userEmail
    });

  if (error) throw error;
}

export async function saveRiskLoading(riskLoading: Partial<RiskLoading>, userEmail: string) {
  if (riskLoading.RiskLoading !== undefined && riskLoading.RiskLoading !== null) {
    if (riskLoading.RiskLoading < 0 || riskLoading.RiskLoading > 10) {
      throw new Error('Risk Loading must be between 0 and 10');
    }
    if (riskLoading.RiskLoading !== 0) {
      riskLoading.RiskLoading = Number(riskLoading.RiskLoading.toFixed(2));
    }
  }

  const { error } = await supabase
    .from('RiskLoading')
    .upsert({
      ...riskLoading,
      LastUpdateTimestamp: new Date().toISOString(),
      LastUpdateUser: userEmail
    });

  if (error) throw error;
}

export async function deleteProductRate(
  productCode: string,
  stateCode: string,
  rateCode: number,
  dateOn: string
) {
  const { error } = await supabase
    .from('ProductRateMaster')
    .delete()
    .match({
      ProductCode: productCode,
      StateCode: stateCode,
      RateCode: rateCode,
      DateOn: dateOn
    });

  if (error) throw error;
}

export async function deleteProductRateDetail(
  productCode: string,
  stateCode: string,
  rateCode: number,
  scaleCode: string,
  dateOn: string
) {
  const { error } = await supabase
    .from('ProductRateDetail')
    .delete()
    .match({
      ProductCode: productCode,
      StateCode: stateCode,
      RateCode: rateCode,
      ScaleCode: scaleCode,
      DateOn: dateOn
    });

  if (error) throw error;
}

export async function deleteRebatePercentage(
  incomeTier: number,
  rebateType: string,
  dateOn: string
) {
  const { error } = await supabase
    .from('RebatePercentage')
    .delete()
    .match({
      IncomeTier: incomeTier,
      RebateType: rebateType,
      DateOn: dateOn
    });

  if (error) throw error;
}

export async function deleteScaleFactor(
  productCode: string,
  scaleCode: string,
  dateOn: string
) {
  const { error } = await supabase
    .from('ScaleFactors')
    .delete()
    .match({
      ProductCode: productCode,
      ScaleCode: scaleCode,
      DateOn: dateOn
    });

  if (error) throw error;
}

export async function deleteRiskLoading(
  productCode: string,
  age: number,
  sex: string,
  dateOn: string
) {
  const { error } = await supabase
    .from('RiskLoading')
    .delete()
    .match({
      ProductCode: productCode,
      Age: age,
      Sex: sex,
      DateOn: dateOn
    });

  if (error) throw error;
}

export async function deleteAllProductRates() {
  const { error } = await supabase
    .from('ProductRateMaster')
    .delete()
    .gt('ProductCode', '');

  if (error) throw error;
}

export async function deleteAllProductRateDetails() {
  const { error } = await supabase
    .from('ProductRateDetail')
    .delete()
    .gt('ProductCode', '');

  if (error) throw error;
}

export async function deleteAllRebatePercentages() {
  const { error } = await supabase
    .from('RebatePercentage')
    .delete()
    .gt('IncomeTier', -1);

  if (error) throw error;
}

export async function deleteAllScaleFactors() {
  const { error } = await supabase
    .from('ScaleFactors')
    .delete()
    .gt('ProductCode', '');

  if (error) throw error;
}

export async function deleteAllRiskLoadings() {
  const { error } = await supabase
    .from('RiskLoading')
    .delete()
    .gt('ProductCode', '');

  if (error) throw error;
}

export async function uploadProductRates(
  products: Partial<ProductRate>[],
  userEmail: string,
  deleteExisting: boolean = false,
  onProgress?: (progress: UploadProgress) => void,
  signal?: AbortSignal
) {
  const progress: UploadProgress = {
    successful: 0,
    duplicates: 0,
    errors: 0,
    total: products.length
  };

  let progressInterval: NodeJS.Timeout | null = null;

  try {
    if (deleteExisting) {
      await deleteAllProductRates();
    }

    if (onProgress) {
      progressInterval = setInterval(() => {
        onProgress({ ...progress });
      }, 1000);
    }

    for (const product of products) {
      if (signal?.aborted) {
        throw new Error('Upload aborted by user');
      }

      try {
        const { data: existingRecord, error: checkError } = await supabase
          .from('ProductRateMaster')
          .select('*')
          .eq('ProductCode', product.ProductCode?.toUpperCase())
          .eq('StateCode', product.StateCode)
          .eq('RateCode', product.RateCode)
          .eq('DateOn', product.DateOn)
          .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }

        if (existingRecord) {
          progress.duplicates++;
        } else {
          const { error: insertError } = await supabase
            .from('ProductRateMaster')
            .insert({
              ...product,
              ProductCode: product.ProductCode?.toUpperCase(),
              LastUpdateTimestamp: new Date().toISOString(),
              LastUpdateUser: userEmail
            });

          if (insertError) {
            throw insertError;
          }
          progress.successful++;
        }

        await new Promise(resolve => setTimeout(resolve, 100));

        if (onProgress) {
          onProgress({ ...progress });
        }
      } catch (error) {
        if (signal?.aborted) {
          throw new Error('Upload aborted by user');
        }
        progress.errors++;
        console.error('Error processing product:', error);
        if (onProgress) {
          onProgress({ ...progress });
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Upload aborted by user') {
      throw error;
    }
    console.error('Upload failed:', error);
    throw error;
  } finally {
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    if (onProgress) {
      onProgress({ ...progress });
    }
  }

  return progress;
}

export async function uploadProductRateDetails(
  products: Partial<ProductRateDetailType>[],
  userEmail: string,
  deleteExisting: boolean = false,
  onProgress?: (progress: UploadProgress) => void,
  signal?: AbortSignal
) {
  const progress: UploadProgress = {
    successful: 0,
    duplicates: 0,
    errors: 0,
    total: products.length
  };

  let progressInterval: NodeJS.Timeout | null = null;

  try {
    if (deleteExisting) {
      await deleteAllProductRateDetails();
    }

    if (onProgress) {
      progressInterval = setInterval(() => {
        onProgress({ ...progress });
      }, 1000);
    }

    for (const product of products) {
      if (signal?.aborted) {
        throw new Error('Upload aborted by user');
      }

      try {
        const { data: existingRecord, error: checkError } = await supabase
          .from('ProductRateDetail')
          .select('*')
          .eq('ProductCode', product.ProductCode?.toUpperCase())
          .eq('StateCode', product.StateCode)
          .eq('RateCode', product.RateCode)
          .eq('ScaleCode', product.ScaleCode)
          .eq('DateOn', product.DateOn)
          .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }

        if (existingRecord) {
          progress.duplicates++;
        } else {
          const { error: insertError } = await supabase
            .from('ProductRateDetail')
            .insert({
              ...product,
              ProductCode: product.ProductCode?.toUpperCase(),
              LastUpdateTimestamp: new Date().toISOString(),
              LastUpdateUser: userEmail
            });

          if (insertError) {
            throw insertError;
          }
          progress.successful++;
        }

        await new Promise(resolve => setTimeout(resolve, 100));

        if (onProgress) {
          onProgress({ ...progress });
        }
      } catch (error) {
        if (signal?.aborted) {
          throw new Error('Upload aborted by user');
        }
        progress.errors++;
        console.error('Error processing product:', error);
        if (onProgress) {
          onProgress({ ...progress });
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Upload aborted by user') {
      throw error;
    }
    console.error('Upload failed:', error);
    throw error;
  } finally {
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    if (onProgress) {
      onProgress({ ...progress });
    }
  }

  return progress;
}

export async function uploadRebatePercentages(
  rebates: Partial<RebatePercentage>[],
  userEmail: string,
  deleteExisting: boolean = false,
  onProgress?: (progress: UploadProgress) => void,
  signal?: AbortSignal
) {
  const progress: UploadProgress = {
    successful: 0,
    duplicates: 0,
    errors: 0,
    total: rebates.length
  };

  let progressInterval: NodeJS.Timeout | null = null;

  try {
    if (deleteExisting) {
      await deleteAllRebatePercentages();
    }

    if (onProgress) {
      progressInterval = setInterval(() => {
        onProgress({ ...progress });
      }, 1000);
    }

    for (const rebate of rebates) {
      if (signal?.aborted) {
        throw new Error('Upload aborted by user');
      }

      try {
        if (rebate.Rebate !== undefined && rebate.Rebate !== null) {
          if (rebate.Rebate < 0 || rebate.Rebate > 45) {
            throw new Error('Rebate must be between 0 and 45');
          }
          if (rebate.Rebate !== 0) {
            rebate.Rebate = Number(rebate.Rebate.toFixed(3));
          }
        }

        const { data: existingRecord, error: checkError } = await supabase
          .from('RebatePercentage')
          .select('*')
          .eq('IncomeTier', rebate.IncomeTier)
          .eq('RebateType', rebate.RebateType)
          .eq('DateOn', rebate.DateOn)
          .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }

        if (existingRecord) {
          progress.duplicates++;
        } else {
          const { error: insertError } = await supabase
            .from('RebatePercentage')
            .insert({
              ...rebate,
              LastUpdateTimestamp: new Date().toISOString(),
              LastUpdateUserid: userEmail
            });

          if (insertError) {
            throw insertError;
          }
          progress.successful++;
        }

        await new Promise(resolve => setTimeout(resolve, 100));

        if (onProgress) {
          onProgress({ ...progress });
        }
      } catch (error) {
        if (signal?.aborted) {
          throw new Error('Upload aborted by user');
        }
        progress.errors++;
        console.error('Error processing rebate:', error);
        if (onProgress) {
          onProgress({ ...progress });
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Upload aborted by user') {
      throw error;
    }
    console.error('Upload failed:', error);
    throw error;
  } finally {
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    if (onProgress) {
      onProgress({ ...progress });
    }
  }

  return progress;
}

export async function uploadScaleFactors(
  scaleFactors: Partial<ScaleFactor>[],
  userEmail: string,
  deleteExisting: boolean = false,
  onProgress?: (progress: UploadProgress) => void,
  signal?: AbortSignal
) {
  const progress: UploadProgress = {
    successful: 0,
    duplicates: 0,
    errors: 0,
    total: scaleFactors.length
  };

  let progressInterval: NodeJS.Timeout | null = null;

  try {
    if (deleteExisting) {
      await deleteAllScaleFactors();
    }

    if (onProgress) {
      progressInterval = setInterval(() => {
        onProgress({ ...progress });
      }, 1000);
    }

    for (const scaleFactor of scaleFactors) {
      if (signal?.aborted) {
        throw new Error('Upload aborted by user');
      }

      try {
        if (scaleFactor.ScaleFactor !== undefined && scaleFactor.ScaleFactor !== null) {
          if (scaleFactor.ScaleFactor < 0 || scaleFactor.ScaleFactor > 10) {
            throw new Error('Scale Factor must be between 0 and 10');
          }
          if (scaleFactor.ScaleFactor !== 0) {
            scaleFactor.ScaleFactor = Number(scaleFactor.ScaleFactor.toFixed(3));
          }
        }

        const { data: existingRecord, error: checkError } = await supabase
          .from('ScaleFactors')
          .select('*')
          .eq('ProductCode', scaleFactor.ProductCode)
          .eq('ScaleCode', scaleFactor.ScaleCode)
          .eq('DateOn', scaleFactor.DateOn)
          .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }

        if (existingRecord) {
          progress.duplicates++;
        } else {
          const { error: insertError } = await supabase
            .from('ScaleFactors')
            .insert({
              ...scaleFactor,
              LastUpdateTimestamp: new Date().toISOString(),
              LastUpdateUser: userEmail
            });

          if (insertError) {
            throw insertError;
          }
          progress.successful++;
        }

        await new Promise(resolve => setTimeout(resolve, 100));

        if (onProgress) {
          onProgress({ ...progress });
        }
      } catch (error) {
        if (signal?.aborted) {
          throw new Error('Upload aborted by user');
        }
        progress.errors++;
        console.error('Error processing scale factor:', error);
        if (onProgress) {
          onProgress({ ...progress });
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Upload aborted by user') {
      throw error;
    }
    console.error('Upload failed:', error);
    throw error;
  } finally {
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    if (onProgress) {
      onProgress({ ...progress });
    }
  }

  return progress;
}

export async function uploadRiskLoadings(
  riskLoadings: Partial<RiskLoading>[],
  userEmail: string,
  deleteExisting: boolean = false,
  onProgress?: (progress: UploadProgress) => void,
  signal?: AbortSignal
) {
  const progress: UploadProgress = {
    successful: 0,
    duplicates: 0,
    errors: 0,
    total: riskLoadings.length
  };

  let progressInterval: NodeJS.Timeout | null = null;

  try {
    if (deleteExisting) {
      await deleteAllRiskLoadings();
    }

    if (onProgress) {
      progressInterval = setInterval(() => {
        onProgress({ ...progress });
      }, 1000);
    }

    for (const riskLoading of riskLoadings) {
      if (signal?.aborted) {
        throw new Error('Upload aborted by user');
      }

      try {
        if (riskLoading.RiskLoading !== undefined && riskLoading.RiskLoading !== null) {
          if (riskLoading.RiskLoading < 0 || riskLoading.RiskLoading > 10) {
            throw new Error('Risk Loading must be between 0 and 10');
          }
          if (riskLoading.RiskLoading !== 0) {
            riskLoading.RiskLoading = Number(riskLoading.RiskLoading.toFixed(2));
          }
        }

        const { data: existingRecord, error: checkError } = await supabase
          .from('RiskLoading')
          .select('*')
          .eq('ProductCode', riskLoading.ProductCode)
          .eq('Age', riskLoading.Age)
          .eq('Sex', riskLoading.Sex)
          .eq('DateOn', riskLoading.DateOn)
          .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }

        if (existingRecord) {
          progress.duplicates++;
        } else {
          const { error: insertError } = await supabase
            .from('RiskLoading')
            .insert({
              ...riskLoading,
              LastUpdateTimestamp: new Date().toISOString(),
              LastUpdateUser: userEmail
            });

          if (insertError) {
            throw insertError;
          }
          progress.successful++;
        }

        await new Promise(resolve => setTimeout(resolve, 100));

        if (onProgress) {
          onProgress({ ...progress });
        }
      } catch (error) {
        if (signal?.aborted) {
          throw new Error('Upload aborted by user');
        }
        progress.errors++;
        console.error('Error processing risk loading:', error);
        if (onProgress) {
          onProgress({ ...progress });
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Upload aborted by user') {
      throw error;
    }
    console.error('Upload failed:', error);
    throw error;
  } finally {
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    if (onProgress) {
      onProgress({ ...progress });
    }
  }

  return progress;
}