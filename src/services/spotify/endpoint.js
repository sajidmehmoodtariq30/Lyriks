export const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";
export const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
export const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

export const ENDPOINTS = {
  // Browse
  featuredPlaylists: "/browse/featured-playlists",
  newReleases: "/browse/new-releases",
  categories: "/browse/categories",

  // Users
  currentUser: "/me",
  userPlaylists: "/me/playlists",
  userTopItems: "/me/top", // Add type (artists, tracks) and time_range as params

  // Library
  savedTracks: "/me/tracks",
  savedAlbums: "/me/albums",
  followedArtists: "/me/following",

  // Search
  search: "/search",

  // Dynamic endpoints - add parameters when calling
  getPlaylist: (id) => `/playlists/${id}`,
  getAlbum: (id) => `/albums/${id}`,
  getArtist: (id) => `/artists/${id}`,
  getArtistAlbums: (id) => `/artists/${id}/albums`,
  getArtistTopTracks: (id) => `/artists/${id}/top-tracks`,
  getTrack: (id) => `/tracks/${id}`,
};
