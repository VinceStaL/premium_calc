import React, { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { calculatePremium } from '../lib/premiumService';
import { STATE_CODES, SCALE_CODES, PAYMENT_FREQUENCIES, SEX_OPTIONS } from '../lib/constants';

interface Props {
  onBack: () => void;
}

interface FormData {
  effectiveDate: string;
  productCodes: string[];
  stateCode: string;
  scaleCode: string;
  rateCode: string;
  paymentFrequency: string;
  rebateType: string;
  lhcPercentage: number;
  sex1?: string;
  age1?: number;
  sex2?: string;
  age2?: number;
}

interface PremiumResult {
  productCode: string;
  basePremium: number;
  scaleFactor: number | null;
  scaleAndFrequencyPremium: number;
  riskLoading1: number | null;
  riskLoadingAmount1: number | null;
  riskLoading2: number | null;
  riskLoadingAmount2: number | null;
  lhcPercentage: number;
  lhcAmount: number;
  rebatePercentage: number | null;
  rebateAmount: number;
  premiumBeforeRebate: number;
  finalPremium: number;
}

export default function PremiumTest({ onBack }: Props) {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PremiumResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [productCodes, setProductCodes] = useState<string[]>([]);
  const [rebateTypes, setRebateTypes] = useState<string[]>([]);
  const [useBaseRate, setUseBaseRate] = useState(false);
  const [useRiskRating, setUseRiskRating] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const getDefaultFormData = (): FormData => ({
    effectiveDate: today,
    productCodes: ['', '', ''], // Initialize with three empty strings for three product codes
    stateCode: 'N',
    scaleCode: 'S',
    rateCode: '0',
    paymentFrequency: 'monthly',
    rebateType: '',
    lhcPercentage: 0,
    sex1: 'F',
    age1: 0,
    sex2: 'M',
    age2: 0
  });

  const [formData, setFormData] = useState(getDefaultFormData());

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch product codes
        const { data: productData, error: productError } = await supabase
          .from('ProductRateMaster')
          .select('ProductCode')
          .order('ProductCode');

        if (productError) throw productError;

        // Get unique product codes
        const uniqueCodes = [...new Set(productData.map(item => item.ProductCode))];
        setProductCodes(uniqueCodes);

        // Fetch rebate types
        const { data: rebateData, error: rebateError } = await supabase
          .from('RebatePercentage')
          .select('RebateType')
          .order('RebateType');

        if (rebateError) throw rebateError;

        // Get unique rebate types
        const uniqueRebateTypes = [...new Set(rebateData.map(item => item.RebateType))];
        setRebateTypes(uniqueRebateTypes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  function handleReset() {
    setFormData(getDefaultFormData());
    setResult([]);
    setError(null);
    setUseBaseRate(false);
    setUseRiskRating(false);
  }

  const needsSecondPerson = useRiskRating && ['D', 'F', 'Q'].includes(formData.scaleCode);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult([]);

    try {
      // First, validate the input data
      if (!formData.effectiveDate) throw new Error('Effective Date is required');
      if (!formData.productCodes.some(code => code)) throw new Error('At least one Product Code is required');
      if (!formData.stateCode) throw new Error('State Code is required');
      if (!formData.scaleCode) throw new Error('Scale Code is required');
      if (!formData.rateCode) throw new Error('Rate Code is required');
      if (!formData.paymentFrequency) throw new Error('Payment Frequency is required');
      if (formData.lhcPercentage < 0 || formData.lhcPercentage > 70) {
        throw new Error('LHC Percentage must be between 0 and 70');
      }

      if (useRiskRating) {
        if (!formData.sex1) throw new Error('Sex (Person 1) is required');
        if (formData.age1 === undefined) throw new Error('Age (Person 1) is required');
        if (formData.age1 < 0 || formData.age1 > 120) throw new Error('Age (Person 1) must be between 0 and 120');

        if (needsSecondPerson) {
          if (!formData.sex2) throw new Error('Sex (Person 2) is required');
          if (formData.age2 === undefined) throw new Error('Age (Person 2) is required');
          if (formData.age2 < 0 || formData.age2 > 120) throw new Error('Age (Person 2) must be between 0 and 120');
        }
      }

      const result = await calculatePremium({
        supabase,
        effectiveDate: formData.effectiveDate,
        productCodes: formData.productCodes.filter(code => code),
        stateCode: formData.stateCode,
        scaleCode: formData.scaleCode,
        rateCode: formData.rateCode,
        paymentFrequency: formData.paymentFrequency,
        rebateType: formData.rebateType,
        lhcPercentage: formData.lhcPercentage,
        useBaseRate,
        useRiskRating,
        sex1: formData.sex1,
        age1: formData.age1,
        sex2: needsSecondPerson ? formData.sex2 : undefined,
        age2: needsSecondPerson ? formData.age2 : undefined
      });

      setResult(result);
    } catch (error) {
      console.error('Error calculating premium:', error);
      setError(error instanceof Error ? error.message : 'Failed to calculate premium');
    } finally {
      setLoading(false);
    }
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access the Premium Test.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Menu
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Premium Test</h1>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <RotateCcw className="w-5 h-5" />
            Reset Form
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-6 mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={useBaseRate}
                onChange={(e) => setUseBaseRate(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Use Base Rate</span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={useRiskRating}
                onChange={(e) => setUseRiskRating(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Use Risk Rating</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Effective Date*
              </label>
              <input
                type="date"
                required
                value={formData.effectiveDate}
                onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Code 1*
              </label>
              <select
                required
                value={formData.productCodes[0] || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  productCodes: [e.target.value, prev.productCodes[1], prev.productCodes[2]]
                }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Product Code</option>
                {productCodes.map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Code 2
              </label>
              <select
                value={formData.productCodes[1] || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  productCodes: [prev.productCodes[0], e.target.value, prev.productCodes[2]]
                }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Product Code</option>
                {productCodes.map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Code 3
              </label>
              <select
                value={formData.productCodes[2] || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  productCodes: [prev.productCodes[0], prev.productCodes[1], e.target.value]
                }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Product Code</option>
                {productCodes.map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State Code*
              </label>
              <select
                required
                value={formData.stateCode}
                onChange={(e) => setFormData(prev => ({ ...prev, stateCode: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select State Code</option>
                {STATE_CODES.map(state => (
                  <option key={state.code} value={state.code}>
                    {state.code} - {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scale Code*
              </label>
              <select
                required
                value={formData.scaleCode}
                onChange={(e) => setFormData(prev => ({ ...prev, scaleCode: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Scale Code</option>
                {SCALE_CODES.map(scale => (
                  <option key={scale.code} value={scale.code}>
                    {scale.code} - {scale.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate Code*
              </label>
              <input
                type="number"
                required
                min="0"
                max="999"
                value={formData.rateCode}
                onChange={(e) => setFormData(prev => ({ ...prev, rateCode: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Frequency*
              </label>
              <select
                required
                value={formData.paymentFrequency}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentFrequency: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Payment Frequency</option>
                {PAYMENT_FREQUENCIES.map(freq => (
                  <option key={freq.value} value={freq.value}>{freq.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rebate Level
              </label>
              <select
                value={formData.rebateType}
                onChange={(e) => setFormData(prev => ({ ...prev, rebateType: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Rebate Level</option>
                {rebateTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LHC Percentage (0-70)
              </label>
              <input
                type="number"
                min="0"
                max="70"
                value={formData.lhcPercentage}
                onChange={(e) => setFormData(prev => ({ ...prev, lhcPercentage: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {useRiskRating && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sex (Person 1)*
                  </label>
                  <select
                    required
                    value={formData.sex1}
                    onChange={(e) => setFormData(prev => ({ ...prev, sex1: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {SEX_OPTIONS.map(sex => (
                      <option key={sex.code} value={sex.code}>
                        {sex.code} - {sex.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age (Person 1)*
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="120"
                    value={formData.age1}
                    onChange={(e) => setFormData(prev => ({ ...prev, age1: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {needsSecondPerson && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sex (Person 2)*
                      </label>
                      <select
                        required
                        value={formData.sex2}
                        onChange={(e) => setFormData(prev => ({ ...prev, sex2: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {SEX_OPTIONS.map(sex => (
                          <option key={sex.code} value={sex.code}>
                            {sex.code} - {sex.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age (Person 2)*
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        max="120"
                        value={formData.age2}
                        onChange={(e) => setFormData(prev => ({ ...prev, age2: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Calculating...' : 'Calculate Premium'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {result && result.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-48 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Calculation
                  </th>
                  {result.map(r => (
                    <th key={r.productCode} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {r.productCode}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="w-48 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Base Premium</td>
                  {result.map(r => (
                    <td key={r.productCode} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${r.basePremium.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${result.reduce((sum, r) => sum + r.basePremium, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr>
                  <td className="w-48 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Scale Factor</td>
                  {result.map(r => (
                    <td key={r.productCode} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {r.scaleFactor?.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) ?? 'N/A'}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">N/A</td>
                </tr>
                <tr>
                  <td className="w-48 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Scale and Frequency Premium</td>
                  {result.map(r => (
                    <td key={r.productCode} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${r.scaleAndFrequencyPremium.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${result.reduce((sum, r) => sum + r.scaleAndFrequencyPremium, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
                {useRiskRating && (
                  <>
                    <tr>
                      <td className="w-48 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Risk Loading (Person 1)</td>
                      {result.map(r => (
                        <td key={r.productCode} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {r.riskLoading1 !== null ? `${(r.riskLoading1 * 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%` : 'N/A'}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">N/A</td>
                    </tr>
                    <tr>
                      <td className="w-48 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Risk Loading Amount (Person 1)</td>
                      {result.map(r => (
                        <td key={r.productCode} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {r.riskLoadingAmount1 !== null ? `$${r.riskLoadingAmount1.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${result.reduce((sum, r) => sum + (r.riskLoadingAmount1 || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                    {needsSecondPerson && (
                      <>
                        <tr>
                          <td className="w-48 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Risk Loading (Person 2)</td>
                          {result.map(r => (
                            <td key={r.productCode} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {r.riskLoading2 !== null ? `${(r.riskLoading2 * 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%` : 'N/A'}
                            </td>
                          ))}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">N/A</td>
                        </tr>
                        <tr>
                          <td className="w-48 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Risk Loading Amount (Person 2)</td>
                          {result.map(r => (
                            <td key={r.productCode} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {r.riskLoadingAmount2 !== null ? `$${r.riskLoadingAmount2.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                            </td>
                          ))}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${result.reduce((sum, r) => sum + (r.riskLoadingAmount2 || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      </>
                    )}
                  </>
                )}
                {result.some(r => r.lhcPercentage > 0) && (
                  <>
                    <tr>
                      <td className="w-48 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">LHC Percentage</td>
                      {result.map(r => (
                        <td key={r.productCode} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {r.lhcPercentage > 0 ? `${r.lhcPercentage.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%` : 'N/A'}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">N/A</td>
                    </tr>
                    <tr>
                      <td className="w-48 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">LHC Amount</td>
                      {result.map(r => (
                        <td key={r.productCode} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${r.lhcAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${result.reduce((sum, r) => sum + r.lhcAmount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </>
                )}
                {result.some(r => r.rebatePercentage !== null) && (
                  <>
                    <tr>
                      <td className="w-48 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Premium Before Rebate</td>
                      {result.map(r => (
                        <td key={r.productCode} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${r.premiumBeforeRebate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${result.reduce((sum, r) => sum + r.premiumBeforeRebate, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-48 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rebate Percentage</td>
                      {result.map(r => (
                        <td key={r.productCode} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {r.rebatePercentage !== null ? `${r.rebatePercentage.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%` : 'N/A'}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">N/A</td>
                    </tr>
                    <tr>
                      <td className="w-48 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rebate Amount</td>
                      {result.map(r => (
                        <td key={r.productCode} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${r.rebateAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${result.reduce((sum, r) => sum + r.rebateAmount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </>
                )}
                <tr className="bg-gray-50 font-semibold">
                  <td className="w-48 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Final Premium</td>
                  {result.map(r => (
                    <td key={r.productCode} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${r.finalPremium.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${result.reduce((sum, r) => sum + r.finalPremium, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export { PremiumTest };