import React, { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { ArrowLeft, Upload, XCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { parse, isValid, format } from 'date-fns';
import { uploadRiskLoadings, UploadProgress } from '../lib/productRateService';

interface RiskLoading {
  ProductCode: string;
  Age: number;
  Sex: string;
  RiskLoading: number;
  DateOn: string;
  DateOff: string | null;
  LastUpdateUser: string | null;
  LastUpdateTimestamp: string;
}

const SEX_OPTIONS = ['M', 'F'];

const DATE_FORMATS = [
  'M/d/yyyy',
  'MM/dd/yyyy',
  'M/d/yy',
  'MM/dd/yy',
  'd/M/yyyy',
  'dd/MM/yyyy',
  'd/M/yy',
  'dd/MM/yy',
];

function parseFlexibleDate(dateStr: string): Date | null {
  dateStr = dateStr.trim();

  if (!isNaN(Number(dateStr))) {
    const excelDate = XLSX.SSF.parse_date_code(Number(dateStr));
    return new Date(excelDate.y, excelDate.m - 1, excelDate.d);
  }

  for (const dateFormat of DATE_FORMATS) {
    const parsedDate = parse(dateStr, dateFormat, new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }

  const nativeDate = new Date(dateStr);
  if (isValid(nativeDate)) {
    return nativeDate;
  }

  return null;
}

export function RiskLoadingUpload({ onBack }: { onBack: () => void }) {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [deleteAll, setDeleteAll] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  function validateRow(row: any, rowIndex: number): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!row.ProductCode) errors.push(`Row ${rowIndex + 1}: Product Code is required`);
    if (row.Age === undefined || row.Age === null) errors.push(`Row ${rowIndex + 1}: Age is required`);
    if (!row.Sex) errors.push(`Row ${rowIndex + 1}: Sex is required`);
    if (!row.DateOn) errors.push(`Row ${rowIndex + 1}: Date On is required`);
    if (!row.DateOff) errors.push(`Row ${rowIndex + 1}: Date Off is required`);
    if (row.RiskLoading === undefined || row.RiskLoading === null) errors.push(`Row ${rowIndex + 1}: Risk Loading is required`);

    if (row.ProductCode && row.ProductCode.length !== 3) {
      errors.push(`Row ${rowIndex + 1}: Product Code must be exactly 3 characters`);
    }

    if (row.Age !== undefined) {
      const age = Number(row.Age);
      if (isNaN(age) || age < 0 || age > 120) {
        errors.push(`Row ${rowIndex + 1}: Age must be between 0 and 120`);
      }
    }

    if (row.Sex && !SEX_OPTIONS.includes(row.Sex)) {
      errors.push(`Row ${rowIndex + 1}: Sex must be M or F`);
    }

    const dateOn = row.DateOn ? parseFlexibleDate(row.DateOn.toString()) : null;
    const dateOff = row.DateOff ? parseFlexibleDate(row.DateOff.toString()) : null;

    if (!dateOn) {
      errors.push(`Row ${rowIndex + 1}: Invalid Date On format`);
    }
    if (!dateOff) {
      errors.push(`Row ${rowIndex + 1}: Invalid Date Off format`);
    }

    if (dateOn && dateOff && dateOff <= dateOn) {
      errors.push(`Row ${rowIndex + 1}: Date Off must be after Date On`);
    }

    if (row.RiskLoading !== undefined && (row.RiskLoading < 0 || row.RiskLoading > 10)) {
      errors.push(`Row ${rowIndex + 1}: Risk Loading must be between 0 and 10`);
    }

    return { isValid: errors.length === 0, errors };
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValidationErrors([]);
      setUploadProgress(null);
    }
  }

  async function handleStartUpload() {
    if (!selectedFile || !session?.user?.email) return;

    if (deleteAll) {
      const confirmed = window.confirm(
        'Are you sure you want to delete all existing records? This action cannot be undone.'
      );
      if (!confirmed) return;
    }

    setLoading(true);
    setIsUploading(true);
    setValidationErrors([]);
    setUploadProgress(null);

    const newController = new AbortController();
    setAbortController(newController);

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      const allErrors: string[] = [];
      const validRows: RiskLoading[] = [];

      rows.forEach((row: any, index) => {
        if (row.DateOn) {
          const dateOn = parseFlexibleDate(row.DateOn.toString());
          if (dateOn) {
            row.DateOn = format(dateOn, 'yyyy-MM-dd');
          }
        }
        if (row.DateOff) {
          const dateOff = parseFlexibleDate(row.DateOff.toString());
          if (dateOff) {
            row.DateOff = format(dateOff, 'yyyy-MM-dd');
          }
        }
        
        if (row.RiskLoading !== undefined && row.RiskLoading !== null) {
          row.RiskLoading = Number(Number(row.RiskLoading).toFixed(2));
        }

        const { isValid, errors } = validateRow(row, index);
        if (isValid) {
          validRows.push(row as RiskLoading);
        } else {
          allErrors.push(...errors);
        }
      });

      setValidationErrors(allErrors);

      if (validRows.length > 0) {
        try {
          await uploadRiskLoadings(validRows, session.user.email, deleteAll, setUploadProgress, newController.signal);
          if (!newController.signal.aborted) {
            toast.success('Upload completed successfully');
          }
        } catch (error) {
          if (error instanceof Error) {
            if (error.message === 'Upload aborted by user') {
              toast.success('Upload stopped by user');
            } else {
              console.error('Upload error:', error);
              toast.error('Error during upload. Please try again.');
            }
          }
        }
      }

      if (allErrors.length > 0) {
        toast.error('Some rows had validation errors');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Error processing file. Please try again.');
    } finally {
      setLoading(false);
      setIsUploading(false);
      setAbortController(null);
    }
  }

  function handleStopUpload() {
    if (abortController) {
      abortController.abort();
    }
  }

  function handleRemoveFile() {
    setSelectedFile(null);
    setValidationErrors([]);
    setUploadProgress(null);
  }

  function getProgressPercentage(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Risk Loading
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Risk Loading</h1>

        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={deleteAll}
              onChange={(e) => setDeleteAll(e.target.checked)}
              disabled={isUploading}
              className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50"
            />
            <span className="ml-2 text-gray-700">Delete all existing records before upload</span>
          </label>
          {deleteAll && (
            <p className="mt-2 text-sm text-red-600">
              Warning: This will permanently delete all existing records before uploading new ones.
            </p>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4">
            {selectedFile ? (
              <div className="flex-1 flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <FileText className="w-6 h-6 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      Click to select an Excel file
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    className="hidden"
                  />
                </div>
              </label>
            )}
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleStartUpload}
            disabled={!selectedFile || isUploading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-5 h-5" />
            Start Upload
          </button>

          {isUploading && (
            <button
              onClick={handleStopUpload}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <XCircle className="w-5 h-5" />
              Stop Upload
            </button>
          )}
        </div>

        {loading && !isUploading && (
          <div className="mb-4 text-gray-600">
            Processing file...
          </div>
        )}

        {uploadProgress && (
          <div className="space-y-4 mt-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-green-700">Successful</span>
                <span className="text-sm font-medium text-green-700">
                  {uploadProgress.successful} / {uploadProgress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(uploadProgress.successful, uploadProgress.total)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-amber-700">Duplicates</span>
                <span className="text-sm font-medium text-amber-700">
                  {uploadProgress.duplicates} / {uploadProgress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-amber-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(uploadProgress.duplicates, uploadProgress.total)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-red-700">Errors</span>
                <span className="text-sm font-medium text-red-700">
                  {uploadProgress.errors} / {uploadProgress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-red-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(uploadProgress.errors, uploadProgress.total)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Validation Errors</h3>
            <div className="bg-red-50 p-4 rounded-md">
              <ul className="list-disc list-inside space-y-1 text-red-600">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-8 border-t pt-4">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            {showInstructions ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
            {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
          </button>

          {showInstructions && (
            <div className="mt-4 space-y-4">
              <h2 className="text-lg font-semibold">File Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Upload an Excel file (.xlsx) containing risk loading data</li>
                <li>The file should have the following columns: ProductCode, Age, Sex, RiskLoading, DateOn, DateOff</li>
                <li>All fields are required</li>
                <li>Product Code must be exactly 3 characters</li>
                <li>Age must be between 0 and 120</li>
                <li>Sex must be either M or F</li>
                <li>Risk Loading must be between 0 and 10 with up to 2 decimal places</li>
                <li>Dates can be in US (M/D/YYYY) or Australian (D/M/YYYY) format</li>
                <li>Years can be in two-digit (YY) or four-digit (YYYY) format</li>
                <li>Single-digit days and months are accepted (e.g., 1/2/2024 or 2/1/2024)</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}