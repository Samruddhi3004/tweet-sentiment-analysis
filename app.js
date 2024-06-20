import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [tweet, setTweet] = useState('');
    const [result, setResult] = useState(null);
    const [storedTweets, setStoredTweets] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/analyze', { tweet });
            setResult(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchStoredTweets = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/tweets');
            setStoredTweets(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="App">
            <h1>Tweet Sentiment Analysis</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={tweet}
                    onChange={(e) => setTweet(e.target.value)}
                    placeholder="Enter your tweet"
                    rows="4"
                    cols="50"
                />
                <br />
                <button type="submit">Analyze</button>
            </form>
            {result && (
                <div>
                    <h2>Analysis Result</h2>
                    <p>Tweet: {result.tweet}</p>
                    <p>Sentiment: {result.sentiment}</p>
                </div>
            )}
            <button onClick={fetchStoredTweets}>Fetch Stored Tweets</button>
            {storedTweets.length > 0 && (
                <div>
                    <h2>Stored Tweets</h2>
                    <ul>
                        {storedTweets.map((t) => (
                            <li key={t.id}>
                                Tweet: {t.tweet} - Sentiment: {t.sentiment}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default App;