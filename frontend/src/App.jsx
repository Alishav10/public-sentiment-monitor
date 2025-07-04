import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Sun, Moon, Search, RefreshCw, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Dashboard from './components/Dashboard.jsx';


const API_BASE_URL = import.meta.env.VITE_API_URL;


const SENTIMENT_COLORS = {
  Positive: '#4CAF50',
  Neutral: '#FFC107',
  Negative: '#F44336',
};

const App = () => {
  const [stats, setStats] = useState(null);
  const [rawContent, setRawContent] = useState([]);
  const [trends, setTrends] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filter, setFilter] = useState('All');
  const [category, setCategory] = useState('All');
  const [source, setSource] = useState('All');
  const [daysBack, setDaysBack] = useState(7);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/search?keyword=${encodeURIComponent(searchKeyword)}`);
      const data = await response.json();

      setRawContent(data.articles || []);
      setStats({
        total_articles: data.articles?.length || 0,
        sentiment_breakdown: {
          Positive: data.summary?.Positive || 0,
          Neutral: data.summary?.Neutral || 0,
          Negative: data.summary?.Negative || 0,
        }
      });

      const trendFormatted = (data.trends || []).map(item => ({
        date: item.date,
        Positive: item.sentiment_breakdown.Positive || 0,
        Neutral: item.sentiment_breakdown.Neutral || 0,
        Negative: item.sentiment_breakdown.Negative || 0
      }));

      setTrends(trendFormatted);
    } catch (e) {
      setError(`Search failed: ${e.message}`);
    }
  };
  
  function App() {
  return <Dashboard />;
}

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Sentiment Article Report", 14, 15);
    const tableData = rawContent.map(article => [
      article.title,
      article.source,
      article.sentiment_category,
      article.sentiment_compound,
      article.date_published,
      article.url || "-"
    ]);
    autoTable(doc, {
      head: [["Title", "Source", "Sentiment", "Score", "Date", "URL"]],
      body: tableData,
      startY: 25,
    });
    doc.save("sentiment_report.pdf");
  };

  const toggleTheme = () => setDarkMode(prev => !prev);

  const filteredArticles = rawContent.filter(article => {
    const matchesCategory = category === 'All' || article.sentiment_category === category;
    const matchesSource = source === 'All' || article.source === source;
    return matchesCategory && matchesSource;
  });

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition-colors duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 shadow text-white">
          <h1 className="text-2xl font-bold">🧠 Public Sentiment Monitor</h1>
          <button onClick={toggleTheme} className="bg-white text-gray-800 p-2 rounded-full shadow">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder="Brand (e.g., Apple)"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="p-2 border rounded-md dark:bg-gray-800"
            />
            <select value={source} onChange={(e) => setSource(e.target.value)} className="p-2 border rounded-md dark:bg-gray-800">
              <option value="All">All Sources</option>
              {[...new Set(rawContent.map(a => a.source))].map(src => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border rounded-md dark:bg-gray-800">
              <option value="All">All Categories</option>
              <option value="Positive">Positive</option>
              <option value="Neutral">Neutral</option>
              <option value="Negative">Negative</option>
            </select>
            <input
              type="number"
              value={daysBack}
              onChange={(e) => setDaysBack(e.target.value)}
              placeholder="Days back"
              className="p-2 border rounded-md dark:bg-gray-800"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-4">
            <button onClick={handleSearch} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              <Search className="h-4 w-4 mr-1" /> Search
            </button>
            <button onClick={handleSearch} className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </button>
            <button onClick={handleDownloadPDF} className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              <Download className="h-4 w-4 mr-1" /> Download PDF
            </button>
          </div>

          {/* Error */}
          {error && <div className="text-red-600 font-medium mb-4">{error}</div>}

          {/* Pie Chart */}
          {stats && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Sentiment Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(stats.sentiment_breakdown).map(([name, value]) => ({ name, value }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {Object.entries(stats.sentiment_breakdown).map(([name], index) => (
                      <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Line Chart */}
          {trends.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Sentiment Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Positive" stroke={SENTIMENT_COLORS.Positive} strokeWidth={2} />
                  <Line type="monotone" dataKey="Neutral" stroke={SENTIMENT_COLORS.Neutral} strokeWidth={2} />
                  <Line type="monotone" dataKey="Negative" stroke={SENTIMENT_COLORS.Negative} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Article Table */}
          {filteredArticles.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Articles</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">Title</th>
                      <th className="px-4 py-2 text-left">Source</th>
                      <th className="px-4 py-2 text-left">Sentiment</th>
                      <th className="px-4 py-2 text-left">Score</th>
                      <th className="px-4 py-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.map((article, index) => (
                      <tr key={index} className="border-t border-gray-300 dark:border-gray-700">
                        <td className="px-4 py-2">
                          <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                            {article.title}
                          </a>
                        </td>
                        <td className="px-4 py-2">{article.source}</td>
                        <td className="px-4 py-2">{article.sentiment_category}</td>
                        <td className="px-4 py-2">{article.sentiment_compound}</td>
                        <td className="px-4 py-2">{article.date_published}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
