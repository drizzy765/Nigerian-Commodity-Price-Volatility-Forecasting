import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function App() {
  const [inputs, setInputs] = useState({
    Brent_Crude: 80.5,
    US_10Y_Yield: 4.2,
    Official_FX: 900,
    Parallel_FX: 1200,
    CPI_YoY: 28.5,
    M2_NGN: 85000000
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock data for the 1-Month Lag Visualizer
  const mockChartData = [
    { time: 'T-2', macro_shock: 20, predicted_volatility: 15 },
    { time: 'T-1', macro_shock: 85, predicted_volatility: 20 },
    { time: 'T0 (Now)', macro_shock: 90, predicted_volatility: 75 },
    { time: 'T+1', macro_shock: 40, predicted_volatility: 80 },
  ];

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: parseFloat(e.target.value) });
  };

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      // Fallback to the known deployed Render URL if the VITE_API_URL environment variable isn't set
      const baseUrl = import.meta.env.VITE_API_URL || 'https://nigerian-commodity-price-volatility.onrender.com';
      const response = await axios.post(`${baseUrl}/predict`, inputs);
      setResults(response.data);
    } catch (error) {
      console.error("Prediction API failed", error);
      alert("Make sure the backend is running on port 8000.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Macroeconomic Risk Dashboard
          </h1>
          <p className="text-slate-400 mt-2 font-medium">1-Month Forward Commodity Volatility Forecast API</p>
        </header>

        {results?.pms_regime_warning && (
          <div className="bg-red-950/40 border-l-4 border-red-500 text-red-200 p-5 rounded-lg shadow-md backdrop-blur-sm">
            <p className="font-bold flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Warning: High Regime Uncertainty
            </p>
            <p className="mt-1 text-sm text-red-300">Historical training data spans the pre-2023 artificial subsidy peg. Out-of-sample predictability is statistically invalid for PMS.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Inputs Panel */}
          <div className="bg-slate-900 p-6 rounded-2xl shadow-lg lg:col-span-1 border border-slate-800">
            <h2 className="text-xl font-bold mb-6 text-slate-200 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Macro Inputs
            </h2>
            <div className="space-y-5">
              {Object.keys(inputs).map((key) => (
                <div key={key} className="flex flex-col group">
                  <label className="text-sm font-semibold text-slate-400 mb-1.5 group-focus-within:text-blue-400 transition-colors">{key.replace('_', ' ')}</label>
                  <input
                    type="number"
                    name={key}
                    value={inputs[key]}
                    onChange={handleInputChange}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition-all placeholder-slate-500"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={fetchPrediction}
              disabled={loading}
              className="mt-8 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </span>
              ) : "Run Forecast"}
            </button>
          </div>

          {/* Results & Visualization Panel */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* Forecast Cards */}
            {results && (
              <div className="grid grid-cols-2 gap-5">
                {Object.entries(results.forecasts).map(([commodity, data]) => {
                  const isHigh = data.accuracy_rating === 'High';
                  const isLow = data.accuracy_rating === 'Low';
                  const isNeg = data.accuracy_rating === 'Negative';
                  const isFail = data.accuracy_rating === 'Failed';
                  
                  let badgeColors = '';
                  if(isHigh) badgeColors = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                  else if (isFail) badgeColors = 'bg-red-500/10 text-red-400 border border-red-500/20';
                  else badgeColors = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';

                  return (
                    <div key={commodity} className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-colors">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                        <svg className="w-16 h-16 text-slate-100" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13.5 2.5a1.5 1.5 0 0 0-3 0v3.5a1.5 1.5 0 0 0 3 0v-3.5zm-5.74 3.26a1.5 1.5 0 1 0-2.12 2.12l2.47 2.48a1.5 1.5 0 0 0 2.12-2.12L7.76 5.76zm11.48 0-2.47 2.47a1.5 1.5 0 1 0 2.12 2.12l2.47-2.47a1.5 1.5 0 0 0-2.12-2.12zM21.5 10.5h-3.5a1.5 1.5 0 0 0 0 3h3.5a1.5 1.5 0 0 0 0-3zM5.5 10.5h-3.5a1.5 1.5 0 0 0 0 3h3.5a1.5 1.5 0 0 0 0-3zm13.74 5.74a1.5 1.5 0 1 0-2.12-2.12l-2.47 2.47a1.5 1.5 0 1 0 2.12 2.12l2.47-2.47zm-14.48 0 2.47 2.47a1.5 1.5 0 1 0 2.12-2.12l-2.47-2.47a1.5 1.5 0 0 0-2.12 2.12zM12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z"/>
                        </svg>
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-300">{commodity}</h3>
                      <div className="mt-4 flex items-end justify-between">
                        <span className="text-4xl font-black text-white">{data.volatility_pct}%</span>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md ${badgeColors}`}>
                          {data.accuracy_rating.toUpperCase()} SIGNAL
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Simulated Recharts Visualizer */}
            <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 h-96">
              <h2 className="text-xl font-bold mb-6 text-slate-200 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                1-Month Lag Visualizer
              </h2>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={mockChartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={{ stroke: '#475569' }} tickLine={{ stroke: '#475569' }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={{ stroke: '#475569' }} tickLine={{ stroke: '#475569' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} 
                    itemStyle={{ color: '#e2e8f0' }} 
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="macro_shock" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Macro Pressure Index" />
                  <Line type="monotone" dataKey="predicted_volatility" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Commodity Volatility" />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
