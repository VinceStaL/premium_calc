import React, { useEffect, useState } from 'react';
import { PlusCircle, Pencil, Trash2, X, Upload, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowLeft } from 'lucide-react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import toast from 'react-hot-toast';
import { STATE_CODES, SCALE_CODES } from '../lib/constants';
import { ProductRateDetailType } from '../lib/productRateService';

const ITEMS_PER_PAGE = 9;
const MAX_VISIBLE_PAGES = 5;

interface Props {
  onUpload: () => void;
  onBack: () => void;
}

export function ProductRateDetail({ onUpload, onBack }: Props) {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [products, setProducts] = useState<ProductRateDetailType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<ProductRateDetailType> | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [productCodeFilter, setProductCodeFilter] = useState('');
  const [stateCodeFilter, setStateCodeFilter] = useState('');
  const [rateCodeFilter, setRateCodeFilter] = useState('');
  const [scaleCodeFilter, setScaleCodeFilter] = useState('');
  const [dateOnFilter, setDateOnFilter] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [currentPage, productCodeFilter, stateCodeFilter, rateCodeFilter, scaleCodeFilter, dateOnFilter]);

  async function fetchProducts() {
    try {
      setLoading(true);
      
      let countQuery = supabase
        .from('ProductRateDetail')
        .select('*', { count: 'exact', head: true });

      if (productCodeFilter) {
        countQuery = countQuery.ilike('ProductCode', `%${productCodeFilter}%`);
      }
      if (stateCodeFilter) {
        countQuery = countQuery.eq('StateCode', stateCodeFilter);
      }
      if (rateCodeFilter) {
        countQuery = countQuery.eq('RateCode', parseInt(rateCodeFilter));
      }
      if (scaleCodeFilter) {
        countQuery = countQuery.eq('ScaleCode', scaleCodeFilter);
      }
      if (dateOnFilter) {
        countQuery = countQuery.eq('DateOn', dateOnFilter);
      }

      const { count, error: countError } = await countQuery;

      if (countError) throw countError;
      setTotalCount(count || 0);

      let query = supabase
        .from('ProductRateDetail')
        .select('*')
        .order('ProductCode', { ascending: true })
        .order('StateCode', { ascending: true })
        .order('RateCode', { ascending: true })
        .order('ScaleCode', { ascending: true })
        .order('DateOn', { ascending: true });

      if (productCodeFilter) {
        query = query.ilike('ProductCode', `%${productCodeFilter}%`);
      }
      if (stateCodeFilter) {
        query = query.eq('StateCode', stateCodeFilter);
      }
      if (rateCodeFilter) {
        query = query.eq('RateCode', parseInt(rateCodeFilter));
      }
      if (scaleCodeFilter) {
        query = query.eq('ScaleCode', scaleCodeFilter);
      }
      if (dateOnFilter) {
        query = query.eq('DateOn', dateOnFilter);
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }

  function validateForm(): boolean {
    const errors: Record<string, string> = {};
    
    if (!currentProduct?.ProductCode) {
      errors.ProductCode = 'Product Code is required';
    }
    if (!currentProduct?.StateCode) {
      errors.StateCode = 'State Code is required';
    }
    if (currentProduct?.RateCode === undefined || currentProduct.RateCode === null) {
      errors.RateCode = 'Rate Code is required';
    }
    if (!currentProduct?.ScaleCode) {
      errors.ScaleCode = 'Scale Code is required';
    }
    if (!currentProduct?.DateOn) {
      errors.DateOn = 'Date On is required';
    }
    if (!currentProduct?.DateOff) {
      errors.DateOff = 'Date Off is required';
    }

    if (currentProduct?.ProductCode) {
      if (currentProduct.ProductCode.length !== 3) {
        errors.ProductCode = 'Product Code must be exactly 3 characters';
      }
    }

    if (currentProduct?.RateCode !== undefined) {
      if (currentProduct.RateCode < 0 || currentProduct.RateCode > 999) {
        errors.RateCode = 'Rate Code must be between 0 and 999';
      }
    }

    if (currentProduct?.ScaleCode && !SCALE_CODES.find(s => s.code === currentProduct.ScaleCode)) {
      errors.ScaleCode = 'Invalid Scale Code';
    }

    if (currentProduct?.DateOff && currentProduct?.DateOn) {
      if (new Date(currentProduct.DateOff) <= new Date(currentProduct.DateOn)) {
        errors.DateOff = 'Date Off must be after Date On';
      }
    }

    const rates = [
      'WeeklyRate',
      'MonthlyRate',
      'QuarterlyRate',
      'HalfYearlyRate',
      'YearlyRate'
    ] as const;

    rates.forEach(rate => {
      const value = currentProduct?.[rate];
      if (value !== undefined && value !== null && value < 0) {
        errors[rate] = `${rate.replace('Rate', '')} Rate must be greater than or equal to zero`;
      }
    });

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

      const { ProductCode, StateCode, RateCode, ScaleCode, DateOn } = currentProduct || {};
      if (!ProductCode || !StateCode || RateCode === undefined || !ScaleCode || !DateOn) {
        throw new Error('Required fields are missing');
      }

      const { error } = await supabase
        .from('ProductRateDetail')
        .upsert({
          ...currentProduct,
          ProductCode: ProductCode.toUpperCase(),
          LastUpdateTimestamp: new Date().toISOString(),
          LastUpdateUser: session.user.email
        });

      if (error) throw error;
      toast.success('Product rate detail updated successfully');
      setIsModalOpen(false);
      setCurrentProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product rate detail:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save product rate detail');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(
    productCode: string,
    stateCode: string,
    rateCode: number,
    scaleCode: string,
    dateOn: string
  ) {
    if (!session) {
      toast.error('You must be logged in to perform this action');
      return;
    }

    if (!confirm('Are you sure you want to delete this product rate detail?')) return;

    try {
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
      toast.success('Product rate detail deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product rate detail:', error);
      toast.error('Failed to delete product rate detail');
    }
  }

  function clearFilters() {
    setProductCodeFilter('');
    setStateCodeFilter('');
    setRateCodeFilter('');
    setScaleCodeFilter('');
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
          <p className="text-gray-600">Please log in to access the Product Rate Detail.</p>
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
        <h1 className="text-2xl font-bold text-gray-800">Product Rate Detail</h1>
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
              setCurrentProduct(null);
              setValidationErrors({});
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Product Rate Detail
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              State Code
            </label>
            <select
              value={stateCodeFilter}
              onChange={(e) => {
                setStateCodeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All States</option>
              {STATE_CODES.map(state => (
                <option key={state.code} value={state.code}>
                  {state.code} - {state.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate Code
            </label>
            <input
              type="number"
              value={rateCodeFilter}
              onChange={(e) => {
                setRateCodeFilter(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter by Rate Code"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scale Code
            </label>
            <select
              value={scaleCodeFilter}
              onChange={(e) => {
                setScaleCodeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Scales</option>
              {SCALE_CODES.map(scale => (
                <option key={scale.code} value={scale.code}>
                  {scale.code} - {scale.name}
                </option>
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
                      State Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rate Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scale Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Off
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weekly Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monthly Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quarterly Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Half Yearly Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Yearly Rate
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
                  {products.map((product) => (
                    <tr key={`${product.ProductCode}-${product.StateCode}-${product.RateCode}-${product.ScaleCode}-${product.DateOn}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.ProductCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.StateCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.RateCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.ScaleCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(product.DateOn).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.DateOff ? new Date(product.DateOff).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.WeeklyRate?.toFixed(2) ?? '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.MonthlyRate?.toFixed(2) ?? '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.QuarterlyRate?.toFixed(2) ?? '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.HalfYearlyRate?.toFixed(2) ?? '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.YearlyRate?.toFixed(2) ?? '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.LastUpdateUser || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(product.LastUpdateTimestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setCurrentProduct(product);
                            setValidationErrors({});
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(
                            product.ProductCode,
                            product.StateCode,
                            product.RateCode,
                            product.ScaleCode,
                            product.DateOn
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
                {currentProduct?.ProductCode ? 'Edit Product Rate Detail' : 'Add New Product Rate Detail'}
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
                  value={currentProduct?.ProductCode || ''}
                  onChange={(e) => setCurrentProduct(prev => ({ ...prev, ProductCode: e.target.value }))}
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
                  State Code*
                </label>
                <select
                  required
                  value={currentProduct?.StateCode || ''}
                  onChange={(e) => setCurrentProduct(prev => ({ ...prev, StateCode: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    validationErrors.StateCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select State Code</option>
                  {STATE_CODES.map(state => (
                    <option key={state.code} value={state.code}>
                      {state.code} - {state.name}
                    </option>
                  ))}
                </select>
                {validationErrors.StateCode && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.StateCode}</p>
                )}
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
                  value={currentProduct?.RateCode ?? ''}
                  onChange={(e) => setCurrentProduct(prev => ({ ...prev, RateCode: parseInt(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${validationErrors.RateCode ? 'border-red-500' : 'border-gray-300'}`}
                />
                {validationErrors.RateCode && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.RateCode}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scale Code*
                </label>
                <select
                  required
                  value={currentProduct?.ScaleCode || ''}
                  onChange={(e) => setCurrentProduct(prev => ({ ...prev, ScaleCode: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    validationErrors.ScaleCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Scale Code</option>
                  {SCALE_CODES.map(scale => (
                    <option key={scale.code} value={scale.code}>
                      {scale.code} - {scale.name}
                    </option>
                  ))}
                </select>
                {validationErrors.ScaleCode && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.ScaleCode}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date On*
                </label>
                <input
                  type="date"
                  required
                  value={currentProduct?.DateOn || ''}
                  onChange={(e) => setCurrentProduct(prev => ({ ...prev, DateOn: e.target.value }))}
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
                  value={currentProduct?.DateOff || ''}
                  onChange={(e) => setCurrentProduct(prev => ({ ...prev, DateOff: e.target.value }))}
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
                  Weekly Rate
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentProduct?.WeeklyRate ?? ''}
                  onChange={(e) => setCurrentProduct(prev => ({ ...prev, WeeklyRate: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    validationErrors.WeeklyRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.WeeklyRate && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.WeeklyRate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Rate
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentProduct?.MonthlyRate ?? ''}
                  onChange={(e) => setCurrentProduct(prev => ({ ...prev, MonthlyRate: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    validationErrors.MonthlyRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.MonthlyRate && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.MonthlyRate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quarterly Rate
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentProduct?.QuarterlyRate ?? ''}
                  onChange={(e) => setCurrentProduct(prev => ({ ...prev, QuarterlyRate: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    validationErrors.QuarterlyRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.QuarterlyRate && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.QuarterlyRate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Half Yearly Rate
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentProduct?.HalfYearlyRate ?? ''}
                  onChange={(e) => setCurrentProduct(prev => ({ ...prev, HalfYearlyRate: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    validationErrors.HalfYearlyRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.HalfYearlyRate && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.HalfYearlyRate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yearly Rate
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentProduct?.YearlyRate ?? ''}
                  onChange={(e) => setCurrentProduct(prev => ({ ...prev, YearlyRate: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    validationErrors.YearlyRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.YearlyRate && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.YearlyRate}</p>
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
                  {currentProduct?.ProductCode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}