// src/components/ArticleList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const getColor = (sentiment) => {
  if (sentiment === 'positive') return 'text-green-600 bg-green-100';
  if (sentiment === 'negative') return 'text-red-600 bg-red-100';
  return 'text-yellow-600 bg-yellow-100';
};

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/sentiment/raw')
      .then(res => {
        setArticles(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching articles:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading articles...</p>;
  if (!articles.length) return <p>No articles found.</p>;

  return (
    <div className="bg-white shadow-md rounded-2xl p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Articles with Sentiment</h2>
      <ul className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
        {articles.map((article, index) => (
          <li key={index} className="py-3 px-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-800">{article.title}</h3>
                <p className="text-sm text-gray-500">{article.date}</p>
              </div>
              <span className={`text-sm font-semibold px-2 py-1 rounded-full ${getColor(article.sentiment)}`}>
                {article.sentiment}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticleList;
