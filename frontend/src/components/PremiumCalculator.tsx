import { useState, useEffect } from 'react';
// Remove unused import
import { PremiumParams, PremiumResult } from '../types/premium';
import { Calculator } from 'lucide-react';

const PremiumCalculator = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PremiumResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Debug effect to monitor state changes
  useEffect(() => {
    console.log('Results state updated:', results);
  }, [results]);
  
  const [formData, setFormData] = useState<PremiumParams>({
    productCodes: ['H0A'],
    effectiveDate: new Date().toISOString().split('T')[0],
    stateCode: 'A',
    scaleCode: 'S',
    rateCode: '0',
    paymentFrequency: 'monthly',
    rebateType: 'NONE',
    lhcPercentage: 0,
    useBaseRate: true,
    useRiskRating: false,
    sex1: 'M',
    age1: 30,
    sex2: 'F',
    age2: 32
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'productCodes') {
      setFormData({
        ...formData,
        productCodes: [value]
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseFloat(value) 
          : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log('Submitting form data:', formData);
      
      // Direct API call with fetch instead of using the service
      const response = await fetch('/api/calculate-premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response:', data);
      
      if (data.results) {
        setResults(data.results);
      } else {
        setError('Unexpected response format from API');
      }
    } catch (err: any) {
      setError(`Failed to calculate premium: ${err.message}`);
      console.error('Error in handleSubmit:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-6">
          <Calculator className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Premium Calculator</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Code
              </label>
              <select
                name="productCodes"
                value={formData.productCodes[0]}
                onChange={(e) => setFormData({...formData, productCodes: [e.target.value]})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="H0A">H0A</option>
                <option value="HA0">HA0</option>
                <option value="AML">AML</option>
                <option value="BML">BML</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Effective Date
              </label>
              <input
                type="date"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State Code
              </label>
              <select
                name="stateCode"
                value={formData.stateCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="A">ACT (A)</option>
                <option value="N">NSW (N)</option>
                <option value="Q">QLD (Q)</option>
                <option value="S">SA (S)</option>
                <option value="T">TAS (T)</option>
                <option value="V">VIC (V)</option>
                <option value="W">WA (W)</option>
                <option value="X">NT (X)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scale Code
              </label>
              <select
                name="scaleCode"
                value={formData.scaleCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="S">Single (S)</option>
                <option value="D">Couple (D)</option>
                <option value="F">Family (F)</option>
                <option value="P">Single Parent (P)</option>
                <option value="Q">Extended Family (Q)</option>
                <option value="E">Extended (E)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate Code
              </label>
              <select
                name="rateCode"
                value={formData.rateCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="0">Standard (0)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Frequency
              </label>
              <select
                name="paymentFrequency"
                value={formData.paymentFrequency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="weekly">Weekly</option>
                <option value="fortnightly">Fortnightly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="halfYearly">Half Yearly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rebate Type
              </label>
              <select
                name="rebateType"
                value={formData.rebateType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NONE">None</option>
                <option value="RB">RB</option>
                <option value="RF">RF</option>
                <option value="RI">RI</option>
                <option value="RL">RL</option>
                <option value="RD">RD</option>
                <option value="RG">RG</option>
                <option value="RJ">RJ</option>
                <option value="RM">RM</option>
                <option value="RE">RE</option>
                <option value="RH">RH</option>
                <option value="RK">RK</option>
                <option value="RN">RN</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LHC Percentage
              </label>
              <input
                type="number"
                name="lhcPercentage"
                value={formData.lhcPercentage}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="useBaseRate"
                checked={formData.useBaseRate}
                onChange={(e) => setFormData({...formData, useBaseRate: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Use Base Rate
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="useRiskRating"
                checked={formData.useRiskRating}
                onChange={(e) => setFormData({...formData, useRiskRating: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Use Risk Rating
              </label>
            </div>
          </div>
          
          {formData.useRiskRating && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
              <h3 className="col-span-2 text-lg font-medium text-gray-800">Risk Rating Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Person 1 Sex
                </label>
                <select
                  name="sex1"
                  value={formData.sex1}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Person 1 Age
                </label>
                <input
                  type="number"
                  name="age1"
                  value={formData.age1}
                  onChange={handleChange}
                  min="0"
                  max="120"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {['D', 'F', 'Q', 'E'].includes(formData.scaleCode) && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Person 2 Sex
                    </label>
                    <select
                      name="sex2"
                      value={formData.sex2}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Person 2 Age
                    </label>
                    <input
                      type="number"
                      name="age2"
                      value={formData.age2}
                      onChange={handleChange}
                      min="0"
                      max="120"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>
          )}
          
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Calculating...' : 'Calculate Premium'}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {results && results.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Results</h2>
            
            {results.map((result, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Product: {result.productCode}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <span className="text-gray-600">Base Premium:</span>{' '}
                    <span className="font-medium">${result.basePremium.toFixed(2)}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Scaled Base Premium:</span>{' '}
                    <span className="font-medium">${result.scaledBasePremium.toFixed(2)}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Scale & Frequency Premium:</span>{' '}
                    <span className="font-medium">${result.scaleAndFrequencyPremium.toFixed(2)}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Premium Before Rebate:</span>{' '}
                    <span className="font-medium">${result.premiumBeforeRebate.toFixed(2)}</span>
                  </div>
                  
                  {result.rebateAmount > 0 && (
                    <div>
                      <span className="text-gray-600">Rebate Amount:</span>{' '}
                      <span className="font-medium text-green-600">-${result.rebateAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {result.lhcAmount > 0 && (
                    <div>
                      <span className="text-gray-600">LHC Amount:</span>{' '}
                      <span className="font-medium">${result.lhcAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="col-span-2 mt-2 pt-2 border-t border-gray-200">
                    <span className="text-gray-800 font-semibold">Final Premium:</span>{' '}
                    <span className="text-xl font-bold text-blue-600">${result.finalPremium.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumCalculator;