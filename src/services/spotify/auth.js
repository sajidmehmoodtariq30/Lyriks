import axios from 'axios';
import { SPOTIFY_AUTH_URL, SPOTIFY_TOKEN_URL } from './endpoint.js';

// Scopes define what your app can access
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-library-read',
  'user-library-modify',
  'user-top-read',
  'playlist-read-private',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
  'streaming'
].join(' ');

// Storage keys
const ACCESS_TOKEN_KEY = 'spotify_access_token';
const REFRESH_TOKEN_KEY = 'spotify_refresh_token';
const EXPIRY_TIME_KEY = 'spotify_token_expiry';

/**
 * Generate a random string for state verification
 */
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

/**
 * Get authorization URL for Spotify login
 */
export const getAuthUrl = () => {
  const state = generateRandomString(16);
  localStorage.setItem('spotify_auth_state', state);

  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: import.meta.env.VITE_REDIRECT_URI,
    state: state,
    scope: SCOPES,
  });

  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
};

/**
 * Exchange authorization code for access token
 */
export const exchangeCodeForToken = async (code) => {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  });

  try {
    const response = await axios.post(SPOTIFY_TOKEN_URL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET}`)
      }
    });

    const { access_token, refresh_token, expires_in } = response.data;
    
    // Calculate expiry time and save tokens
    const expiryTime = new Date().getTime() + expires_in * 1000;
    setTokens(access_token, refresh_token, expiryTime);
    
    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiryTime: expiryTime
    };
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
};

/**
 * Refresh the access token using refresh token
 */
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  try {
    const response = await axios.post(SPOTIFY_TOKEN_URL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET}`)
      }
    });

    const { access_token, expires_in } = response.data;
    const refreshToken = response.data.refresh_token || localStorage.getItem(REFRESH_TOKEN_KEY);
    
    // Calculate expiry time and save tokens
    const expiryTime = new Date().getTime() + expires_in * 1000;
    setTokens(access_token, refreshToken, expiryTime);
    
    return {
      accessToken: access_token,
      expiryTime: expiryTime
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

/**
 * Save tokens to localStorage
 */
const setTokens = (accessToken, refreshToken, expiryTime) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(EXPIRY_TIME_KEY, expiryTime.toString());
};

/**
 * Check if the current token is valid
 */
export const isTokenValid = () => {
  const expiryTime = localStorage.getItem(EXPIRY_TIME_KEY);
  return expiryTime && new Date().getTime() < parseInt(expiryTime);
};

/**
 * Get the current access token, refreshing if necessary
 */
export const getAccessToken = async () => {
  if (isTokenValid()) {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  
  try {
    const { accessToken } = await refreshAccessToken();
    return accessToken;
  } catch (error) {
    // If refresh fails, redirect to login
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EXPIRY_TIME_KEY);
    return null;
  }
};

/**
 * Clear all authentication data
 */
export const logout = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(EXPIRY_TIME_KEY);
  localStorage.removeItem('spotify_auth_state');
};