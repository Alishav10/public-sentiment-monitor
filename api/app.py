const Dashboard = () => {
  const [articles, setArticles] = useState([]);
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (keyword) => {
    if (!keyword.trim()) return;

    try {
      console.log("Sending request to:", `${API_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`);
      const response = await fetch(`${API_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`);
      const text = await response.text();
      console.log("Raw response:", text);

      const data = JSON.parse(text);
      setArticles(data.articles || []);
      setSummary(data.summary || {});
      setTrends(data.trends || []);
      setError('');
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed: " + err.message);
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
