#  Public Sentiment Monitor

The **Public Sentiment Monitor** is a full-stack web application that performs **real-time sentiment analysis** on news articles based on user-input keywords. It scrapes headlines using **Google News RSS**, analyzes sentiment using **VADER**, and visualizes the data through interactive charts and tables.

>  "What are people saying right now?" — This tool gives you live insight ( like are they taking positive, negative, netural) .

---

##  Live Demo

- 🔗 **Frontend** (React + TailwindCSS + Vite): [public-sentiment-monitor.vercel.app](https://your-vercel-url.vercel.app)
- 🔗 **Backend API** (Flask + Render): [public-sentiment-monitor API](https://your-render-url.onrender.com/api/sentiment)

---

##  Features

 Keyword-based real-time scraping from **Google News**  
 Sentiment analysis using **VADER (Valence Aware Dictionary for Sentiment Reasoning)**  
 **Pie Chart** and **Line Graph** visualizations  
 Filter by source, category (Positive/Neutral/Negative), and days  
 **PDF Export** for reports  
 **Dark Mode** toggle  
 Deployed using **Render** (backend) and **Vercel** (frontend)

---

##  Tech Stack

| Frontend            | Backend            | Tools / Services |
|---------------------|--------------------|------------------|
| React (Vite)        | Python (Flask)     | Vercel           |
| Tailwind CSS        | feedparser         | Render           |
| Recharts            | vaderSentiment     | jsPDF            |
| Axios / Fetch API   | Flask-CORS         | Git & GitHub     |

---

##  Project Structure

public_sentiment_monitor/

├── api/ # Flask API

├── social_scraper/ # Google News Scraper + Sentiment Analysis

├── frontend/ # React frontend (Vite + Tailwind)

##  How to Use

1. Type a keyword (e.g., `Tesla`, `Elections`) in the input bar
2. Click `Search` — backend scrapes Google News and performs sentiment analysis
3. View:
   - Pie chart of sentiment distribution
   - Line graph showing sentiment over time
   - Article list with links
4. Export results to PDF if needed

---

##  Setup (Local Development)

```bash
# Backend
cd api
pip install -r ../requirements.txt
python app.py

# Frontend
cd frontend
npm install
npm run dev

