import React from 'react';

const SearchResults = ({ results }) => {
  if (!results.length) return <p className="text-center text-gray-500 mt-4">No results found.</p>;

  return (
    <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {results.map((item, index) => (
        <div key={index} className="border rounded-xl p-4 bg-white shadow-md">
          <h2 className="font-semibold text-lg">{item.title}</h2>
          <p className="text-sm text-gray-500">{item.date_published?.slice(0, 10)}</p>
          <p className="mt-2">{item.description}</p>
          <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full
            ${item.sentiment_category === "Positive" ? "bg-green-100 text-green-800" :
              item.sentiment_category === "Negative" ? "bg-red-100 text-red-800" :
              "bg-gray-100 text-gray-800"}`}>
            {item.sentiment_category}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
