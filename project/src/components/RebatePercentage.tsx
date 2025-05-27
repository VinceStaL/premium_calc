import React, { useEffect, useState } from 'react';
import { PlusCircle, Pencil, Trash2, X, Upload, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowLeft } from 'lucide-react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import toast from 'react-hot-toast';
import { RebatePercentage as RebatePercentageType } from '../lib/productRateService';

const INCOME_TIERS = [0, 1, 2, 3];
const REBATE_TYPES = ['RB', 'RD', 'RE', 'RF', 'RG', 'RH', 'RI', 'RJ', 'RK', 'RL', 'RM', 'RN'];
const ITEMS_PER_PAGE = 9;
const MAX_VISIBLE_PAGES = 5;

interface Props {
  onUpload: () => void;
  onBack: () => void;
}

export function RebatePercentage({ onUpload, onBack }: Props) {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [rebates, setRebates] = useState<RebatePercentageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRebate, setCurrentRebate] = useState<Partial<RebatePercentageType> | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [incomeTierFilter, setIncomeTierFilter] = useState('');
  const [rebateTypeFilter, setRebateTypeFilter] = useState('');
  const [dateOnFilter, setDateOnFilter] = useState('');

  useEffect(() => {
    fetchRebates();
  }, [currentPage, incomeTierFilter, rebateTypeFilter, dateOnFilter]);

  async function fetchRebates() {
    try {
      setLoading(true);
      
      let countQuery = supabase
        .from('RebatePercentage')
        .select('*', { count: 'exact', head: true });

      if (incomeTierFilter) {
        countQuery = countQuery.eq('IncomeTier', parseInt(incomeTierFilter));
      }
      if (rebateTypeFilter) {
        countQuery = countQuery.eq('RebateType', rebateTypeFilter);
      }
      if (dateOnFilter) {
        countQuery = countQuery.eq('DateOn', dateOnFilter);
      }

      const { count, error: countError } = await countQuery;

      if (countError) throw countError;
      setTotalCount(count || 0);

      let query = supabase
        .from('RebatePercentage')
        .select('*')
        .order('IncomeTier', { ascending: true })
        .order('RebateType', { ascending: true })
        .order('DateOn', { ascending: true });

      if (incomeTierFilter) {
        query = query.eq('IncomeTier', parseInt(incomeTierFilter));
      }
      if (rebateTypeFilter) {
        query = query.eq('RebateType', rebateTypeFilter);
      }
      if (dateOnFilter) {
        query = query.eq('DateOn', dateOnFilter);
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) throw error;
      setRebates(data || []);
    } catch (error) {
      console.error('Error fetching rebates:', error);
      toast.error('Failed to fetch rebates');
    } finally {
      setLoading(false);
    }
  }

  function validateForm(): boolean {
    const errors: Record<string, string> = {};
    
    if (currentRebate?.IncomeTier === undefined || currentRebate.IncomeTier === null) {
      errors.IncomeTier = 'Income Tier is required';
    }
    if (!currentRebate?.RebateType) {
      errors.RebateType = 'Rebate Type is required';
    }
    if (!currentRebate?.DateOn) {
      errors.DateOn = 'Date On is required';
    }
    if (!currentRebate?.DateOff) {
      errors.DateOff = 'Date Off is required';
    }
    if (currentRebate?.Rebate === undefined || currentRebate.Rebate === null) {
      errors.Rebate = 'Rebate is required';
    }

    if (currentRebate?.IncomeTier !== undefined && !INCOME_TIERS.includes(currentRebate.IncomeTier)) {
      errors.IncomeTier = 'Income Tier must be 0, 1, 2, or 3';
    }

    if (currentRebate?.RebateType && !REBATE_TYPES.includes(currentRebate.RebateType)) {
      errors.RebateType = 'Invalid Rebate Type';
    }

    if (currentRebate?.DateOff && currentRebate?.DateOn) {
      if (new Date(currentRebate.DateOff) <= new Date(currentRebate.DateOn)) {
        errors.DateOff = 'Date Off must be after Date On';
      }
    }

    if (currentRebate?.Rebate !== undefined && currentRebate.Rebate !== null) {
      if (currentRebate.Rebate < 0 || currentRebate.Rebate > 45) {
        errors.Rebate = 'Rebate must be between 0 and 45';
      }
      if (currentRebate.Rebate !== 0) {
        const roundedRebate = Number(currentRebate.Rebate.toFixed(2));
        if (roundedRebate !== currentRebate.Rebate) {
          setCurrentRebate(prev => ({
            ...prev,
            Rebate: roundedRebate
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

      const { IncomeTier, RebateType, DateOn } = currentRebate || {};
      if (IncomeTier === undefined || !RebateType || !DateOn) {
        throw new Error('Required fields are missing');
      }

      const { error } = await supabase
        .from('RebatePercentage')
        .upsert({
          ...currentRebate,
          LastUpdateTimestamp: new Date().toISOString()
          // LastUpdateUser is handled by the database
        });

      if (error) throw error;
      toast.success('Rebate updated successfully');
      setIsModalOpen(false);
      setCurrentRebate(null);
      fetchRebates();
    } catch (error) {
      console.error('Error saving rebate:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save rebate');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(incomeTier: number, rebateType: string, dateOn: string) {
    if (!session) {
      toast.error('You must be logged in to perform this action');
      return;
    }

    if (!confirm('Are you sure you want to delete this rebate?')) return;

    try {
      const { error } = await supabase
        .from('RebatePercentage')
        .delete()
        .match({
          IncomeTier: incomeTier,
          RebateType: rebateType,
          DateOn: dateOn
        });

      if (error) throw error;
      toast.success('Rebate deleted successfully');
      fetchRebates();
    } catch (error) {
      console.error('Error deleting rebate:', error);
      toast.error('Failed to delete rebate');
    }
  }

  function clearFilters() {
    setIncomeTierFilter('');
    setRebateTypeFilter('');
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
          <p className="text-gray-600">Please log in to access the Rebate Percentage.</p>
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
        <h1 className="text-2xl font-bold text-gray-800">Rebate Percentage</h1>
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
              setCurrentRebate(null);
              setValidationErrors({});
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Rebate
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Income Tier
            </label>
            <select
              value={incomeTierFilter}
              onChange={(e) => {
                setIncomeTierFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Income Tiers</option>
              {INCOME_TIERS.map(tier => (
                <option key={tier} value={tier}>{tier}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rebate Type
            </label>
            <select
              value={rebateTypeFilter}
              onChange={(e) => {
                setRebateTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Rebate Types</option>
              {REBATE_TYPES.map(code => (
                <option key={code} value={code}>{code}</option>
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
                      Income Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rebate Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Off
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rebate
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
                  {rebates.map((rebate) => (
                    <tr key={`${rebate.IncomeTier}-${rebate.RebateType}-${rebate.DateOn}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rebate.IncomeTier}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rebate.RebateType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(rebate.DateOn).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rebate.DateOff ? new Date(rebate.DateOff).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rebate.Rebate?.toFixed(3)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rebate.LastUpdateUser || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(rebate.LastUpdateTimestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setCurrentRebate(rebate);
                            setValidationErrors({});
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(
                            rebate.IncomeTier,
                            rebate.RebateType,
                            rebate.DateOn
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
                {currentRebate?.IncomeTier !== undefined ? 'Edit Rebate' : 'Add New Rebate'}
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
                  Income Tier*
                </label>
                <select
                  required
                  value={currentRebate?.IncomeTier ?? ''}
                  onChange={(e) => setCurrentRebate(prev => ({ 
                    ...prev, 
                    IncomeTier: e.target.value ? parseInt(e.target.value) : null 
                  }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    validationErrors.IncomeTier ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Income Tier</option>
                  {INCOME_TIERS.map(tier => (
                    <option key={tier} value={tier}>{tier}</option>
                  ))}
                </select>
                {validationErrors.IncomeTier && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.IncomeTier}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rebate Type*
                </label>
                <select
                  required
                  value={currentRebate?.RebateType || ''}
                  onChange={(e) => setCurrentRebate(prev => ({ ...prev, RebateType: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    validationErrors.RebateType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Rebate Type</option>
                  {REBATE_TYPES.map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
                {validationErrors.RebateType && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.RebateType}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date On*
                </label>
                <input
                  type="date"
                  required
                  value={currentRebate?.DateOn || ''}
                  onChange={(e) => setCurrentRebate(prev => ({ ...prev, DateOn: e.target.value }))}
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
                  value={currentRebate?.DateOff || ''}
                  onChange={(e) => setCurrentRebate(prev => ({ ...prev, DateOff: e.target.value }))}
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
                  Rebate* (0-45)
                </label>
                <input
                  type="number"
                  required
                  step="0.001"
                  min="0"
                  max="45"
                  value={currentRebate?.Rebate ?? ''}
                  onChange={(e) => setCurrentRebate(prev => ({ ...prev, Rebate: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    validationErrors.Rebate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.Rebate && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.Rebate}</p>
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
                  {currentRebate?.IncomeTier !== undefined ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}