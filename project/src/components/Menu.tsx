import React from 'react';
import { Database, Table2, Percent, Scale, Activity, Calculator, LogOut, Users } from 'lucide-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import toast from 'react-hot-toast';

interface MenuProps {
  onSelectMaster: () => void;
  onSelectDetail: () => void;
  onSelectRebate: () => void;
  onSelectScaleFactors: () => void;
  onSelectRiskLoading: () => void;
  onSelectPremiumTest: () => void;
  onSelectUsers: () => void;
}

export function Menu({
  onSelectMaster,
  onSelectDetail,
  onSelectRebate,
  onSelectScaleFactors,
  onSelectRiskLoading,
  onSelectPremiumTest,
  onSelectUsers
}: MenuProps) {
  const supabase = useSupabaseClient();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Premium Calculation Engine</h1>
          <p className="text-lg text-gray-600 mb-8">Select a table to manage</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={onSelectMaster}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-left group"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Rate Master</h2>
                <p className="text-gray-600">
                  Manage base product rates, health categories, and rebate settings
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={onSelectDetail}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-left group"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Table2 className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Rate Detail</h2>
                <p className="text-gray-600">
                  Manage detailed product rates by scale and payment frequency
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={onSelectRebate}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-left group"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Percent className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Rebate Percentage</h2>
                <p className="text-gray-600">
                  Manage rebate percentages by income tier and rebate type
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={onSelectScaleFactors}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-left group"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <Scale className="w-8 h-8 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Scale Factors</h2>
                <p className="text-gray-600">
                  Manage scale factors for different product scales
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={onSelectRiskLoading}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-left group"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                <Activity className="w-8 h-8 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Risk Loading</h2>
                <p className="text-gray-600">
                  Manage risk loading factors based on age and sex
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={onSelectPremiumTest}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-left group"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                <Calculator className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Premium Test</h2>
                <p className="text-gray-600">
                  Test premium calculations with different parameters
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={onSelectUsers}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-left group"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                <Users className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">User Management</h2>
                <p className="text-gray-600">
                  Manage user accounts and permissions
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}