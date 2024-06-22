import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { Container, Form, Button, Card, ListGroup } from 'react-bootstrap';
import Lottie from 'react-lottie';

// Import animation data
import thumbsUpAnimation from './animations/thumbsUp.json';
import thumbsDownAnimation from './animations/thumbsDown.json';
import victoryHandAnimation from './animations/victoryHand.json';

function App() {
    const [tweet, setTweet] = useState('');
    const [result, setResult] = useState(null);
    const [storedTweets, setStoredTweets] = useState([]);
    const [showStoredTweets, setShowStoredTweets] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/analyze', { tweet });
            setResult(response.data);
            setTweet(''); // Clear the textarea after submission
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchStoredTweets = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/tweets');
            setStoredTweets(response.data);
            setShowStoredTweets(true);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const toggleStoredTweets = () => {
        setShowStoredTweets(!showStoredTweets);
    };

    const getAnimationData = () => {
        if (!result) return null;
        switch (result.sentiment) {
            case 'positive':
                return thumbsUpAnimation;
            case 'negative':
                return thumbsDownAnimation;
            case 'neutral':
                return victoryHandAnimation;
            default:
                return null;
        }
    };

    const animationOptions = {
        loop: false,
        autoplay: true,
        animationData: getAnimationData(),
    };

    return (
        <Container className="mt-5 container">
            <h1 className="text-center mb-4">Tweet Sentiment Analysis</h1>
            {!showStoredTweets && (
                <Card className="p-4 shadow-sm">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="tweetTextarea">
                            <Form.Label>Enter your tweet</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={tweet}
                                onChange={(e) => setTweet(e.target.value)}
                                placeholder="Enter your tweet"
                                className="mb-3"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">
                            Analyze
                        </Button>
                    </Form>
                    {result && (
                        <Card className="mt-4 p-3 fade-in text-center">
                            <h2>Analysis Result</h2>
                            <p><strong>Tweet:</strong> {result.tweet}</p>
                            <p><strong>Sentiment:</strong> {result.sentiment}</p>
                            {getAnimationData() && (
                                <Lottie options={animationOptions} height={150} width={150} />
                            )}
                        </Card>
                    )}
                </Card>
            )}
            {!showStoredTweets && (
                <Button variant="secondary" className="mt-3 w-100" onClick={fetchStoredTweets}>
                    Fetch Stored Tweets
                </Button>
            )}
            {showStoredTweets && (
                <>
                    <Button variant="danger" className="mt-3 w-100" onClick={toggleStoredTweets}>
                        Close Stored Tweets
                    </Button>
                    <Card className="mt-4 p-3 fade-in">
                        <h2>Stored Tweets</h2>
                        <ListGroup variant="flush">
                            {storedTweets.map((t) => (
                                <ListGroup.Item key={t.id}>
                                    <strong>Tweet:</strong> {t.tweet} - <strong>Sentiment:</strong> {t.sentiment}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </>
            )}
        </Container>
    );
}

export default App;
