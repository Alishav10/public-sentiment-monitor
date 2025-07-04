from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import sys

# Setup system path for scraper
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
SCRAPER_DIR = os.path.join(BASE_DIR, '..', 'social_scraper')
sys.path.append(SCRAPER_DIR)

from keyword_scraper.scrape_google_news import scrape_google_news

app = Flask(__name__)
CORS(app)

DATA_FILE = os.path.join(BASE_DIR, 'sentiment_data.json')

@app.route("/")
def home():
    return "Public Sentiment Monitor API is running!"

@app.route("/api/sentiment", methods=["GET"])
def health_check():
    return jsonify({"message": "API working!"})

@app.route("/api/sentiment/search", methods=["GET"])
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

@app.route("/api/sentiment/raw", methods=["GET"])
def get_raw_articles():
    if not os.path.exists(DATA_FILE):
        return jsonify([])
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return jsonify(json.load(f))

@app.route("/api/sentiment/summary", methods=["GET"])
def get_summary():
    if not os.path.exists(DATA_FILE):
        return jsonify({})
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    stats = {
        "total_articles": len(data),
        "sentiment_breakdown": {"Positive": 0, "Neutral": 0, "Negative": 0}
    }
    for item in data:
        sentiment = item.get("sentiment_category", "Neutral")
        stats["sentiment_breakdown"][sentiment] += 1

    return jsonify(stats)

@app.route("/api/sentiment/trends", methods=["GET"])
def get_trends():
    if not os.path.exists(DATA_FILE):
        return jsonify([])
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    trends = {}
    for item in data:
        date = item.get("date_published", "unknown")[:10]
        sentiment = item.get("sentiment_category", "Neutral")
        if date not in trends:
            trends[date] = {"Positive": 0, "Neutral": 0, "Negative": 0}
        trends[date][sentiment] += 1

    trend_list = [{"date": date, "sentiment_breakdown": breakdown} for date, breakdown in sorted(trends.items())]
    return jsonify(trend_list)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
