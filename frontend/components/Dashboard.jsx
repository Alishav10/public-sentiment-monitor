import React, { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import SummaryChart from './SummaryChart';
import TrendsChart from './TrendsChart';

const Dashboard = () => {
  const [articles, setArticles] = useState([]);
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (keyword) => {
  try {
    const response = await fetch(`https://public-sentiment-monitor-2.onrender.com/api/sentiment`);
    const data = await response.json();
    console.log("Health check:", data);
  } catch (err) {
    console.error("Health check failed:", err);
  }
};


  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <SearchBar onSearch={handleSearch} />
      {error && <div className="text-red-600">{error}</div>}
      {summary && <SummaryChart summary={summary} />}
      {trends.length > 0 && <TrendsChart trends={trends} />}
      {articles.length > 0 && <SearchResults results={articles} />}
    </div>
  );
};

export default Dashboard;
