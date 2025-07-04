from newspaper import Article
from keyword_scraper.analyze_sentiment import get_sentiment

def scrape_articles_from_urls(urls):
    articles = []
    for url in urls:
        try:
            article = Article(url)
            article.download()
            article.parse()
            title = article.title
            text = article.text
            compound, category = get_sentiment(text)
            articles.append({
                'title': title,
                'url': url,
                'source': article.source_url,
                'sentiment_compound': compound,
                'sentiment_category': category
            })
        except:
            continue
    return articles
