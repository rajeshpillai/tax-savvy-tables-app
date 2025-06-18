
import { Link } from 'react-router-dom';
import { Table, BarChart3, Settings } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-3 mb-6">
            <Table className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">Smart DataTable</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of intelligent data management with optimized rendering, 
            real-time calculations, and seamless user interactions.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
            <BarChart3 className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Calculations</h3>
            <p className="text-gray-600">
              Automatic amount and tax calculations with optimized performance and instant updates.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
            <Settings className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Rendering</h3>
            <p className="text-gray-600">
              React memo optimization ensures only necessary components re-render for maximum efficiency.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
            <Table className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Reusable Components</h3>
            <p className="text-gray-600">
              Modular table architecture that adapts to different data structures and use cases.
            </p>
          </div>
        </div>

        {/* Demo Routes */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Explore Our Demos</h2>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/table-demo"
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium shadow-lg"
            >
              <Table size={24} />
              Original Tax Management Demo
            </Link>
            
            <Link 
              to="/smart-data-table"
              className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-medium shadow-lg"
            >
              <Settings size={24} />
              Smart Reusable Table Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
