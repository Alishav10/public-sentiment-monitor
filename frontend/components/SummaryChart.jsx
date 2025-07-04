const SummaryChart = ({ summary }) => {
  const chartData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        label: 'Sentiment Distribution',
        data: [
          summary?.Positive || 0,
          summary?.Negative || 0,
          summary?.Neutral || 0
        ],
        backgroundColor: ['#4ade80', '#f87171', '#facc15'],
        borderColor: ['#22c55e', '#ef4444', '#eab308'],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2 text-center">Sentiment Summary</h2>
      <Pie data={chartData} />
    </div>
  );
};

