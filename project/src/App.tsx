import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { SessionContextProvider, useSession } from '@supabase/auth-helpers-react';
import { ProductRateMaster } from './components/ProductRateMaster';
import { ProductRateUpload } from './components/ProductRateUpload';
import { ProductRateDetail } from './components/ProductRateDetail';
import { ProductRateDetailUpload } from './components/ProductRateDetailUpload';
import { RebatePercentage } from './components/RebatePercentage';
import { RebatePercentageUpload } from './components/RebatePercentageUpload';
import { ScaleFactors } from './components/ScaleFactors';
import { ScaleFactorsUpload } from './components/ScaleFactorsUpload';
import { RiskLoading } from './components/RiskLoading';
import { RiskLoadingUpload } from './components/RiskLoadingUpload';
import { PremiumTest } from './components/PremiumTest';
import { UserManagement } from './components/UserManagement';
import { Menu } from './components/Menu';
import { Auth } from './components/Auth';
import { SignUp } from './components/SignUp';
import { supabase } from './lib/supabase';

type Screen = 'menu' | 'master' | 'master-upload' | 'detail' | 'detail-upload' | 'rebate' | 'rebate-upload' | 'scale-factors' | 'scale-factors-upload' | 'risk-loading' | 'risk-loading-upload' | 'premium-test' | 'signup' | 'users';

function AppContent() {
  const session = useSession();
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');

  if (!session) {
    return currentScreen === 'signup' ? (
      <SignUp onBack={() => setCurrentScreen('menu')} />
    ) : (
      <Auth onSignUp={() => setCurrentScreen('signup')} />
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'master':
        return <ProductRateMaster onUpload={() => setCurrentScreen('master-upload')} onBack={() => setCurrentScreen('menu')} />;
      case 'master-upload':
        return <ProductRateUpload onBack={() => setCurrentScreen('master')} />;
      case 'detail':
        return <ProductRateDetail onUpload={() => setCurrentScreen('detail-upload')} onBack={() => setCurrentScreen('menu')} />;
      case 'detail-upload':
        return <ProductRateDetailUpload onBack={() => setCurrentScreen('detail')} />;
      case 'rebate':
        return <RebatePercentage onUpload={() => setCurrentScreen('rebate-upload')} onBack={() => setCurrentScreen('menu')} />;
      case 'rebate-upload':
        return <RebatePercentageUpload onBack={() => setCurrentScreen('rebate')} />;
      case 'scale-factors':
        return <ScaleFactors onUpload={() => setCurrentScreen('scale-factors-upload')} onBack={() => setCurrentScreen('menu')} />;
      case 'scale-factors-upload':
        return <ScaleFactorsUpload onBack={() => setCurrentScreen('scale-factors')} />;
      case 'risk-loading':
        return <RiskLoading onUpload={() => setCurrentScreen('risk-loading-upload')} onBack={() => setCurrentScreen('menu')} />;
      case 'risk-loading-upload':
        return <RiskLoadingUpload onBack={() => setCurrentScreen('risk-loading')} />;
      case 'premium-test':
        return <PremiumTest onBack={() => setCurrentScreen('menu')} />;
      case 'users':
        return <UserManagement onBack={() => setCurrentScreen('menu')} />;
      default:
        return (
          <Menu
            onSelectMaster={() => setCurrentScreen('master')}
            onSelectDetail={() => setCurrentScreen('detail')}
            onSelectRebate={() => setCurrentScreen('rebate')}
            onSelectScaleFactors={() => setCurrentScreen('scale-factors')}
            onSelectRiskLoading={() => setCurrentScreen('risk-loading')}
            onSelectPremiumTest={() => setCurrentScreen('premium-test')}
            onSelectUsers={() => setCurrentScreen('users')}
          />
        );
    }
  };

  return renderScreen();
}

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <div className="min-h-screen bg-gray-100">
        <AppContent />
        <Toaster position="top-right" />
      </div>
    </SessionContextProvider>
  );
}

export default App;