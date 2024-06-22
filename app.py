from flask import Flask, request, jsonify, render_template_string
from textblob import TextBlob
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configure MySQL connection
db_config = {
    'user': 'root',
    'password': 'Utkarsh2819',
    'host': 'localhost',
    'database': 'sentiment_analysis'
}

# Connect to the database and create the table if it doesn't exist
def create_table():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tweets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tweet TEXT NOT NULL,
                sentiment VARCHAR(255) NOT NULL
            );
        """)
        conn.commit()
        cursor.close()
        conn.close()
    except mysql.connector.Error as err:
        print(f"Error: {err}")

create_table()

# Analyze sentiment
def analyze_sentiment(tweet):
    analysis = TextBlob(tweet)
    if analysis.sentiment.polarity > 0:
        return "positive"
    elif analysis.sentiment.polarity == 0:
        return "neutral"
    else:
        return "negative"

@app.route('/')
def home():
    return render_template_string("""
        <h1>Welcome to Tweet Sentiment Analysis</h1>
        <p>Use the form below to analyze the sentiment of your tweet.</p>
        <form action="/analyze" method="post">
            <textarea name="tweet" rows="4" cols="50" placeholder="Enter your tweet"></textarea><br>
            <button type="submit">Analyze</button>
        </form>
    """)

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        tweet = data.get('tweet')
        sentiment = analyze_sentiment(tweet)
        
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO tweets (tweet, sentiment) VALUES (%s, %s)", (tweet, sentiment))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'tweet': tweet, 'sentiment': sentiment})
    except mysql.connector.Error as db_err:
        print(f"Database error: {db_err}")
        return jsonify({"error": "Database error"}), 500
    except ValueError as ve:
        print(f"Value error: {ve}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/tweets', methods=['GET'])
def get_tweets():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM tweets")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(rows)
    except mysql.connector.Error as db_err:
        print(f"Database error: {db_err}")
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

if __name__ == '__main__':
    app.run(debug=True)
