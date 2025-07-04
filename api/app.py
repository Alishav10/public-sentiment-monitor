from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import sys

# Add social_scraper to system path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCRAPER_DIR = os.path.join(BASE_DIR, '..', 'social_scraper')
sys.path.insert(0, SCRAPER_DIR)

#  Import scraper from correct path
from keyword_scraper.scrape_google_news import scrape_google_news

app = Flask(__name__)
CORS(app)

DATA_FILE = os.path.join(BASE_DIR, 'sentiment_data.json')

# Health check
@app.route("/api/sentiment", methods=["GET"])
def health_check():
    return jsonify({"message": "API working!"})

#  Home route (optional)
@app.route("/", methods=["GET"])
def home():
    return "Public Sentiment Monitor API is running!"

# Load/save helpers
def load_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

#  Search sentiment endpoint
@app.route('/api/sentiment/search', methods=['GET'])
def search_sentiment():
    keyword = request.args.get('keyword')
    if not keyword:
        return jsonify({'error': 'Missing keyword'}), 400

    articles = scrape_google_news(keyword)

    sentiment_counts = {"Positive": 0, "Neutral": 0, "Negative": 0}
    trends = {}

    for article in articles:
        sentiment = article.get("sentiment_category", "Neutral")
        sentiment_counts[sentiment] += 1
        date = article.get("date_published", "unknown")[:10]
        if date not in trends:
            trends[date] = {"Positive": 0, "Neutral": 0, "Negative": 0}
        trends[date][sentiment] += 1

    trend_list = [{"date": date, "sentiment_breakdown": trend} for date, trend in sorted(trends.items())]

    return jsonify({
        "articles": articles,
        "summary": sentiment_counts,
        "trends": trend_list
    })

#  Other endpoints
@app.route('/api/sentiment/raw', methods=['GET'])
def get_raw_articles():
    return jsonify(load_data())

@app.route('/api/sentiment/summary', methods=['GET'])
def get_summary():
    data = load_data()
    stats = {
        "total_articles": len(data),
        "sentiment_breakdown": {"Positive": 0, "Neutral": 0, "Negative": 0}
    }
    for item in data:
        sentiment = item.get("sentiment_category", "").capitalize()
        if sentiment in stats["sentiment_breakdown"]:
            stats["sentiment_breakdown"][sentiment] += 1
    return jsonify(stats)

@app.route('/api/sentiment/trends', methods=['GET'])
def get_trends():
    data = load_data()
    trends = {}
    for item in data:
        date = item.get('date_published', 'unknown')[:10]
        category = item.get('sentiment_category', 'Neutral')
        if date not in trends:
            trends[date] = {'Positive': 0, 'Neutral': 0, 'Negative': 0}
        if category in trends[date]:
            trends[date][category] += 1
    trend_list = [{'date': date, 'sentiment_breakdown': counts} for date, counts in sorted(trends.items())]
    return jsonify(trend_list)

#  Run server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
