import React from 'react';
import SummaryChart from './SummaryChart';
import TrendsChart from './TrendsChart';  // 👈 Add this

const Dashboard = () => {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800">
        Public Sentiment Monitor
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SummaryChart />
        <TrendsChart /> {/* 👈 Plug it in */}
      </div>

      {/* ArticleList will come next */}
    </div>
  );
};

export default Dashboard;
