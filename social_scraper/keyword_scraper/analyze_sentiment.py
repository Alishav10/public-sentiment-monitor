from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()

def get_sentiment(text):
    score = analyzer.polarity_scores(text)
    compound = score['compound']
    category = (
        'Positive' if compound > 0.05 else
        'Negative' if compound < -0.05 else
        'Neutral'
    )
    return compound, category
