import axios from "axios";
import { SPOTIFY_BASE_URL, ENDPOINTS } from "./endpoint.js";
import { getAccessToken, refreshAccessToken, logout } from "./auth.js";

/**
 * Create an axios instance for Spotify API calls
 */
const spotifyApi = axios.create({
  baseURL: SPOTIFY_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Axios request interceptor to add authorization token
 */
spotifyApi.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // No token available, throw error to trigger login
      throw new Error("No access token available");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Axios response interceptor to handle token expiration
 */
spotifyApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 Unauthorized and we haven't retried already
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        await refreshAccessToken();

        // Retry the original request with new token
        const token = await getAccessToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return spotifyApi(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * API Methods for specific Spotify endpoints
 */
export const spotifyService = {
  // Current user
  getCurrentUser: () => spotifyApi.get(ENDPOINTS.currentUser),

  // Browse
  getFeaturedPlaylists: (limit = 20) =>
    spotifyApi.get(`${ENDPOINTS.featuredPlaylists}?limit=${limit}`),

  getNewReleases: (limit = 20) =>
    spotifyApi.get(`${ENDPOINTS.newReleases}?limit=${limit}`),

  getCategories: (limit = 20) =>
    spotifyApi.get(`${ENDPOINTS.categories}?limit=${limit}`),

  // Library
  getSavedTracks: (limit = 20, offset = 0) =>
    spotifyApi.get(`${ENDPOINTS.savedTracks}?limit=${limit}&offset=${offset}`),

  saveTrack: (trackId) =>
    spotifyApi.put(`${ENDPOINTS.savedTracks}`, { ids: [trackId] }),

  removeTrack: (trackId) =>
    spotifyApi.delete(`${ENDPOINTS.savedTracks}?ids=${trackId}`),

  getSavedAlbums: (limit = 20, offset = 0) =>
    spotifyApi.get(`${ENDPOINTS.savedAlbums}?limit=${limit}&offset=${offset}`),

  // Playlists
  getUserPlaylists: (limit = 20, offset = 0) =>
    spotifyApi.get(
      `${ENDPOINTS.userPlaylists}?limit=${limit}&offset=${offset}`
    ),

  getPlaylist: (playlistId) =>
    spotifyApi.get(ENDPOINTS.getPlaylist(playlistId)),

  createPlaylist: (userId, name, description = "", isPublic = false) =>
    spotifyApi.post(`/users/${userId}/playlists`, {
      name,
      description,
      public: isPublic,
    }),

  addTracksToPlaylist: (playlistId, trackUris) =>
    spotifyApi.post(`/playlists/${playlistId}/tracks`, {
      uris: trackUris,
    }),

  // Search
  search: (
    query,
    types = ["track", "artist", "album", "playlist"],
    limit = 10
  ) =>
    spotifyApi.get(
      `${ENDPOINTS.search}?q=${encodeURIComponent(query)}&type=${types.join(
        ","
      )}&limit=${limit}`
    ),

  // Artists
  getArtist: (artistId) => spotifyApi.get(ENDPOINTS.getArtist(artistId)),

  getArtistAlbums: (artistId, limit = 20) =>
    spotifyApi.get(`${ENDPOINTS.getArtistAlbums(artistId)}?limit=${limit}`),

  getArtistTopTracks: (artistId) =>
    spotifyApi.get(
      `${ENDPOINTS.getArtistTopTracks(artistId)}?market=from_token`
    ),

  followArtist: (artistId) =>
    spotifyApi.put(`/me/following?type=artist&ids=${artistId}`),

  unfollowArtist: (artistId) =>
    spotifyApi.delete(`/me/following?type=artist&ids=${artistId}`),

  // Albums
  getAlbum: (albumId) => spotifyApi.get(ENDPOINTS.getAlbum(albumId)),

  // Tracks
  getTrack: (trackId) => spotifyApi.get(ENDPOINTS.getTrack(trackId)),

  // User top items
  getUserTopArtists: (timeRange = "medium_term", limit = 20) =>
    spotifyApi.get(
      `${ENDPOINTS.userTopItems}/artists?time_range=${timeRange}&limit=${limit}`
    ),

  getUserTopTracks: (timeRange = "medium_term", limit = 20) =>
    spotifyApi.get(
      `${ENDPOINTS.userTopItems}/tracks?time_range=${timeRange}&limit=${limit}`
    ),

  // Player
  getCurrentPlayback: () => spotifyApi.get("/me/player"),

  getRecentlyPlayed: (limit = 20) =>
    spotifyApi.get(`/me/player/recently-played?limit=${limit}`),

  // You can add more methods as needed
};
