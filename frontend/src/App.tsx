import PremiumCalculator from './components/PremiumCalculator';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Premium Calculator</h1>
        </div>
      </header>
      
      <main className="py-8">
        <PremiumCalculator />
      </main>
      
      <footer className="bg-gray-800 text-gray-300 p-4 mt-auto">
        <div className="max-w-4xl mx-auto text-center text-sm">
          &copy; {new Date().getFullYear()} Premium Calculator
        </div>
      </footer>
    </div>
  );
}

export default App;