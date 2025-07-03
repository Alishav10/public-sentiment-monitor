import feedparser
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from datetime import datetime

analyzer = SentimentIntensityAnalyzer()

def scrape_google_news(keyword):
    feed_url = f"https://news.google.com/rss/search?q={keyword}&hl=en-IN&gl=IN&ceid=IN:en"
    feed = feedparser.parse(feed_url)

    articles = []

    for entry in feed.entries:
        title = entry.title
        link = entry.link
        published = entry.published if hasattr(entry, 'published') else datetime.now().isoformat()

        # Sentiment
        sentiment_score = analyzer.polarity_scores(title)['compound']
        if sentiment_score >= 0.05:
            sentiment = 'Positive'
        elif sentiment_score <= -0.05:
            sentiment = 'Negative'
        else:
            sentiment = 'Neutral'

        articles.append({
            "title": title,
            "source": entry.get('source', {}).get('title', 'Google News'),
            "date_published": published,
            "sentiment_category": sentiment,
            "sentiment_compound": sentiment_score,
            "url": link
        })

    return articles
