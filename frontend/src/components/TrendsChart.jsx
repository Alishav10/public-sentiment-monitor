const TrendsChart = ({ trends }) => {
  if (!trends.length) return <p>No trend data available.</p>;

  const labels = trends.map(item => item.date);
  const positive = trends.map(item => item.sentiment_breakdown?.Positive || 0);
  const negative = trends.map(item => item.sentiment_breakdown?.Negative || 0);
  const neutral = trends.map(item => item.sentiment_breakdown?.Neutral || 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Positive',
        data: positive,
        borderColor: '#22c55e',
        backgroundColor: '#4ade80',
        fill: false,
      },
      {
        label: 'Negative',
        data: negative,
        borderColor: '#ef4444',
        backgroundColor: '#f87171',
        fill: false,
      },
      {
        label: 'Neutral',
        data: neutral,
        borderColor: '#eab308',
        backgroundColor: '#facc15',
        fill: false,
      },
    ],
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Sentiment Trends Over Time</h2>
      <Line data={data} />
    </div>
  );
};
export default TrendsChart;
