import { useState, useEffect } from 'react';
import { PremiumParams, PremiumResult } from '../types/premium';
import { Calculator, DollarSign, FileText, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';

const PremiumCalculator = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PremiumResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.productCodes.length === 0) {
      setError('Please select at least one product code');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/calculate-premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error(`API responded with status: ${response.status}`);
      
      const data = await response.json();
      if (data.results) {
        setResults(data.results);
      } else {
        setError('Unexpected response format from API');
      }
    } catch (err: any) {
      setError(`Failed to calculate premium: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const totalPremium = results.reduce((sum, result) => sum + result.finalPremium, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Premium Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground">Calculate health insurance premiums with precision</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Calculation Parameters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Product Codes (Select up to 3)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {['H0A', 'HA0', 'AML', 'BML'].map((product) => (
                          <div key={product} className="flex items-center space-x-2">
                            <Checkbox
                              id={product}
                              checked={formData.productCodes.includes(product)}
                              onCheckedChange={(checked) => {
                                let newProductCodes;
                                if (checked) {
                                  if (formData.productCodes.length < 3) {
                                    newProductCodes = [...formData.productCodes, product];
                                  } else return;
                                } else {
                                  newProductCodes = formData.productCodes.filter(code => code !== product);
                                }
                                setFormData({...formData, productCodes: newProductCodes});
                              }}
                              disabled={!formData.productCodes.includes(product) && formData.productCodes.length >= 3}
                            />
                            <Label htmlFor={product} className="text-sm font-medium">{product}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="effectiveDate">Effective Date</Label>
                      <Input
                        id="effectiveDate"
                        type="date"
                        value={formData.effectiveDate}
                        onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>State Code</Label>
                      <Select value={formData.stateCode} onValueChange={(value) => setFormData({...formData, stateCode: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">ACT (A)</SelectItem>
                          <SelectItem value="N">NSW (N)</SelectItem>
                          <SelectItem value="Q">QLD (Q)</SelectItem>
                          <SelectItem value="S">SA (S)</SelectItem>
                          <SelectItem value="T">TAS (T)</SelectItem>
                          <SelectItem value="V">VIC (V)</SelectItem>
                          <SelectItem value="W">WA (W)</SelectItem>
                          <SelectItem value="X">NT (X)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Scale Code</Label>
                      <Select value={formData.scaleCode} onValueChange={(value) => setFormData({...formData, scaleCode: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="S">Single (S)</SelectItem>
                          <SelectItem value="D">Couple (D)</SelectItem>
                          <SelectItem value="F">Family (F)</SelectItem>
                          <SelectItem value="P">Single Parent (P)</SelectItem>
                          <SelectItem value="Q">Extended Family (Q)</SelectItem>
                          <SelectItem value="E">Extended (E)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Payment Frequency</Label>
                      <Select value={formData.paymentFrequency} onValueChange={(value) => setFormData({...formData, paymentFrequency: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="fortnightly">Fortnightly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="halfYearly">Half Yearly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Rebate Type</Label>
                      <Select value={formData.rebateType} onValueChange={(value) => setFormData({...formData, rebateType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NONE">None</SelectItem>
                          <SelectItem value="RB">RB</SelectItem>
                          <SelectItem value="RF">RF</SelectItem>
                          <SelectItem value="RI">RI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lhc">LHC Percentage</Label>
                      <Input
                        id="lhc"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.lhcPercentage}
                        onChange={(e) => setFormData({...formData, lhcPercentage: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="useBaseRate"
                        checked={formData.useBaseRate}
                        onCheckedChange={(checked) => setFormData({...formData, useBaseRate: !!checked})}
                      />
                      <Label htmlFor="useBaseRate">Use Base Rate</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="useRiskRating"
                        checked={formData.useRiskRating}
                        onCheckedChange={(checked) => setFormData({...formData, useRiskRating: !!checked})}
                      />
                      <Label htmlFor="useRiskRating">Use Risk Rating</Label>
                    </div>
                  </div>
                  
                  {formData.useRiskRating && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Risk Rating Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Person 1 Sex</Label>
                            <Select value={formData.sex1} onValueChange={(value) => setFormData({...formData, sex1: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="M">Male</SelectItem>
                                <SelectItem value="F">Female</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="age1">Person 1 Age</Label>
                            <Input
                              id="age1"
                              type="number"
                              min="0"
                              max="120"
                              value={formData.age1}
                              onChange={(e) => setFormData({...formData, age1: parseInt(e.target.value) || 0})}
                            />
                          </div>
                          
                          {['D', 'F', 'Q', 'E'].includes(formData.scaleCode) && (
                            <>
                              <div className="space-y-2">
                                <Label>Person 2 Sex</Label>
                                <Select value={formData.sex2} onValueChange={(value) => setFormData({...formData, sex2: value})}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="M">Male</SelectItem>
                                    <SelectItem value="F">Female</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="age2">Person 2 Age</Label>
                                <Input
                                  id="age2"
                                  type="number"
                                  min="0"
                                  max="120"
                                  value={formData.age2}
                                  onChange={(e) => setFormData({...formData, age2: parseInt(e.target.value) || 0})}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="flex justify-center">
                    <Button type="submit" disabled={loading} size="lg" className="px-8">
                      {loading ? 'Calculating...' : 'Calculate Premium'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {error && (
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <p className="text-destructive">{error}</p>
                </CardContent>
              </Card>
            )}

            {results.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Total Premium
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    ${totalPremium.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            )}

            {results.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {result.productCode}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Premium:</span>
                    <span className="font-medium">${result.basePremium.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scale & Frequency:</span>
                    <span className="font-medium">${result.scaleAndFrequencyPremium.toFixed(2)}</span>
                  </div>
                  {result.rebateAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rebate:</span>
                      <span className="font-medium text-green-600">-${result.rebateAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {result.lhcAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">LHC:</span>
                      <span className="font-medium">${result.lhcAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Final Premium:</span>
                      <span className="text-xl font-bold text-primary">${result.finalPremium.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumCalculator;