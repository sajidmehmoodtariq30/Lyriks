import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCodeForToken } from '../services/spotify/auth';

const Callback = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        // Extract code and state from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const storedState = localStorage.getItem('spotify_auth_state');
        const error = urlParams.get('error');

        const handleAuth = async () => {
            try {
                // Check for errors from Spotify
                if (error) {
                    throw new Error(`Authentication error: ${error}`);
                }

                // Verify state to prevent CSRF attacks
                if (!state || state !== storedState) {
                    throw new Error('State mismatch! Authentication attempt may have been compromised.');
                }

                // Exchange code for token
                if (code) {
                    await exchangeCodeForToken(code);

                    // Redirect to homepage after successful authentication
                    navigate('/');
                } else {
                    throw new Error('No authentication code received from Spotify');
                }
            } catch (err) {
                console.error('Authentication failed:', err);
                setError(err.message);

                // Redirect to login page with error after short delay
                setTimeout(() => {
                    navigate('/login', {
                        state: { error: err.message }
                    });
                }, 3000);
            }
        };

        handleAuth();
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            {error ? (
                <div className="text-red-500 bg-red-100 border border-red-400 px-4 py-3 rounded">
                    <p>Authentication failed: {error}</p>
                    <p className="mt-2">Redirecting to login page...</p>
                </div>
            ) : (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-4 text-xl">Connecting to Spotify...</p>
                </div>
            )}
        </div>
    );
};

export default Callback;