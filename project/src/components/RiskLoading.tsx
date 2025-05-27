import React, { useEffect, useState } from 'react';
import { PlusCircle, Pencil, Trash2, X, Upload, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowLeft } from 'lucide-react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import toast from 'react-hot-toast';
import { RiskLoading as RiskLoadingType } from '../lib/productRateService';

const SEX_OPTIONS = ['M', 'F'];
const ITEMS_PER_PAGE = 9;
const MAX_VISIBLE_PAGES = 5;

interface Props {
  onUpload: () => void;
  onBack: () => void;
}

export function RiskLoading({ onUpload, onBack }: Props) {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [riskLoadings, setRiskLoadings] = useState<RiskLoadingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRiskLoading, setCurrentRiskLoading] = useState<Partial<RiskLoadingType> | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [productCodeFilter, setProductCodeFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [sexFilter, setSexFilter] = useState('');
  const [dateOnFilter, setDateOnFilter] = useState('');

  useEffect(() => {
    fetchRiskLoadings();
  }, [currentPage, productCodeFilter, ageFilter, sexFilter, dateOnFilter]);

  async function fetchRiskLoadings() {
    try {
      setLoading(true);
      
      let countQuery = supabase
        .from('RiskLoading')
        .select('*', { count: 'exact', head: true });

      if (productCodeFilter) {
        countQuery = countQuery.ilike('ProductCode', `%${productCodeFilter}%`);
      }
      if (ageFilter) {
        countQuery = countQuery.eq('Age', parseInt(ageFilter));
      }
      if (sexFilter) {
        countQuery = countQuery.eq('Sex', sexFilter);
      }
      if (dateOnFilter) {
        countQuery = countQuery.eq('DateOn', dateOnFilter);
      }

      const { count, error: countError } = await countQuery;

      if (countError) throw countError;
      setTotalCount(count || 0);

      let query = supabase
        .from('RiskLoading')
        .select('*')
        .order('ProductCode', { ascending: true })
        .order('Age', { ascending: true })
        .order('Sex', { ascending: true })
        .order('DateOn', { ascending: true });

      if (productCodeFilter) {
        query = query.ilike('ProductCode', `%${productCodeFilter}%`);
      }
      if (ageFilter) {
        query = query.eq('Age', parseInt(ageFilter));
      }
      if (sexFilter) {
        query = query.eq('Sex', sexFilter);
      }
      if (dateOnFilter) {
        query = query.eq('DateOn', dateOnFilter);
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) throw error;
      setRiskLoadings(data || []);
    } catch (error) {
      console.error('Error fetching risk loadings:', error);
      toast.error('Failed to fetch risk loadings');
    } finally {
      setLoading(false);
    }
  }

  function validateForm(): boolean {
    const errors: Record<string, string> = {};
    
    if (!currentRiskLoading?.ProductCode) {
      errors.ProductCode = 'Product Code is required';
    }
    if (currentRiskLoading?.Age === undefined || currentRiskLoading.Age === null) {
      errors.Age = 'Age is required';
    }
    if (!currentRiskLoading?.Sex) {
      errors.Sex = 'Sex is required';
    }
    if (!currentRiskLoading?.DateOn) {
      errors.DateOn = 'Date On is required';
    }
    if (!currentRiskLoading?.DateOff) {
      errors.DateOff = 'Date Off is required';
    }
    if (currentRiskLoading?.RiskLoading === undefined || currentRiskLoading.RiskLoading === null) {
      errors.RiskLoading = 'Risk Loading is required';
    }

    if (currentRiskLoading?.ProductCode) {
      if (currentRiskLoading.ProductCode.length !== 3) {
        errors.ProductCode = 'Product Code must be exactly 3 characters';
      }
    }

    if (currentRiskLoading?.Age !== undefined) {
      if (currentRiskLoading.Age < 0 || currentRiskLoading.Age > 120) {
        errors.Age = 'Age must be between 0 and 120';
      }
    }

    if (currentRiskLoading?.Sex && !SEX_OPTIONS.includes(currentRiskLoading.Sex)) {
      errors.Sex = 'Sex must be M or F';
    }

    if (currentRiskLoading?.DateOff && currentRiskLoading?.DateOn) {
      if (new Date(currentRiskLoading.DateOff) <= new Date(currentRiskLoading.DateOn)) {
        errors.DateOff = 'Date Off must be after Date On';
      }
    }

    if (currentRiskLoading?.RiskLoading !== undefined && currentRiskLoading.RiskLoading !== null) {
      if (currentRiskLoading.RiskLoading < 0 || currentRiskLoading.RiskLoading > 10) {
        errors.RiskLoading = 'Risk Loading must be between 0 and 10';
      }
      if (currentRiskLoading.RiskLoading !== 0) {
        const roundedRiskLoading = Number(currentRiskLoading.RiskLoading.toFixed(2));
        if (roundedRiskLoading !== currentRiskLoading.RiskLoading) {
          setCurrentRiskLoading(prev => ({
            ...prev,
            RiskLoading: roundedRiskLoading
          }));
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!session) {
        throw new Error('You must be logged in to perform this action');
      }

      if (!validateForm()) {
        Object.values(validationErrors).forEach(error => {
          toast.error(error);
        });
        setLoading(false);
        return;
      }

      const { ProductCode, Age, Sex, DateOn } = currentRiskLoading || {};
      if (!ProductCode || Age === undefined || !Sex || !DateOn) {
        throw new Error('Required fields are missing');
      }

      const { error } = await supabase
        .from('RiskLoading')
        .upsert({
          ...currentRiskLoading,
          ProductCode: ProductCode.toUpperCase(),
          LastUpdateTimestamp: new Date().toISOString(),
          LastUpdateUser: session.user.email
        });

      if (error) throw error;
      toast.success('Risk loading updated successfully');
      setIsModalOpen(false);
      setCurrentRiskLoading(null);
      fetchRiskLoadings();
    } catch (error) {
      console.error('Error saving risk loading:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save risk loading');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(productCode: string, age: number, sex: string, dateOn: string) {
    if (!session) {
      toast.error('You must be logged in to perform this action');
      return;
    }

    if (!confirm('Are you sure you want to delete this risk loading?')) return;

    try {
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
      toast.success('Risk loading deleted successfully');
      fetchRiskLoadings();
    } catch (error) {
      console.error('Error deleting risk loading:', error);
      toast.error('Failed to delete risk loading');
    }
  }

  function clearFilters() {
    setProductCodeFilter('');
    setAgeFilter('');
    setSexFilter('');
    setDateOnFilter('');
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  let startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
  let endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);

  if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
    startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
  }

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access the Risk Loading.</p>
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Risk Loading</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onUpload}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Upload Spreadsheet
          </button>
          <button
            onClick={() => {
              setCurrentRiskLoading(null);
              setValidationErrors({});
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Risk Loading
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Code
            </label>
            <input
              type="text"
              value={productCodeFilter}
              onChange={(e) => {
                setProductCodeFilter(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter by Product Code"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              min="0"
              max="120"
              value={ageFilter}
              onChange={(e) => {
                setAgeFilter(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter by Age"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sex
            </label>
            <select
              value={sexFilter}
              onChange={(e) => {
                setSexFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All</option>
              {SEX_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date On
            </label>
            <input
              type="date"
              value={dateOnFilter}
              onChange={(e) => {
                setDateOnFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <div className="min-w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sex
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Off
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Loading
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Update Time
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {riskLoadings.map((riskLoading) => (
                    <tr key={`${riskLoading.ProductCode}-${riskLoading.Age}-${riskLoading.Sex}-${riskLoading.DateOn}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {riskLoading.ProductCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {riskLoading.Age}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {riskLoading.Sex}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(riskLoading.DateOn).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {riskLoading.DateOff ? new Date(riskLoading.DateOff).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {riskLoading.RiskLoading?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {riskLoading.LastUpdateUser || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(riskLoading.LastUpdateTimestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setCurrentRiskLoading(riskLoading);
                            setValidationErrors({});
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(
                            riskLoading.ProductCode,
                            riskLoading.Age,
                            riskLoading.Sex,
                            riskLoading.DateOn
                          )}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Last
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalCount)}</span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}
                  </span>{' '}
                  of <span className="font-medium">{totalCount}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  {/* First Page */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">First</span>
                    <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {/* Page Numbers */}
                  {visiblePages.map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        page === currentPage
                          ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Page */}
                  <button
                    onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Last</span>
                    <ChevronsRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {currentRiskLoading?.ProductCode ? 'Edit Risk Loading' : 'Add New Risk Loading'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Code* (3 characters)
                </label>
                <input
                  type="text"
                  required
                  maxLength={3}
                  value={currentRiskLoading?.ProductCode || ''}
                  onChange={(e) => setCurrentRiskLoading(prev => ({ ...prev, ProductCode: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    validationErrors.ProductCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.ProductCode && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.ProductCode}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age* (0-120)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="120"
                  value={currentRiskLoading?.Age ?? ''}
                  onChange={(e) => setCurrentRiskLoading(prev => ({ ...prev, Age: parseInt(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    validationErrors.Age ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.Age && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.Age}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sex*
                </label>
                <select
                  required
                  value={currentRiskLoading?.Sex || ''}
                  onChange={(e) => setCurrentRiskLoading(prev => ({ ...prev, Sex: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    validationErrors.Sex ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Sex</option>
                  {SEX_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {validationErrors.Sex && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.Sex}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date On*
                </label>
                <input
                  type="date"
                  required
                  value={currentRiskLoading?.DateOn || ''}
                  onChange={(e) => setCurrentRiskLoading(prev => ({ ...prev, DateOn: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    validationErrors.DateOn ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.DateOn && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.DateOn}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Off*
                </label>
                <input
                  type="date"
                  required
                  value={currentRiskLoading?.DateOff || ''}
                  onChange={(e) => setCurrentRiskLoading(prev => ({ ...prev, DateOff: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    validationErrors.DateOff ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.DateOff && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.DateOff}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Loading* (0-10)
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  max="10"
                  value={currentRiskLoading?.RiskLoading ?? ''}
                  onChange={(e) => setCurrentRiskLoading(prev => ({ ...prev, RiskLoading: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    validationErrors.RiskLoading ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.RiskLoading && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.RiskLoading}</p>
                )}
              </div>

              <div className="col-span-2 mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {currentRiskLoading?.ProductCode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}