/**
 * Spotify Service - Handles OAuth PKCE flow and API interactions.
 */

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = window.location.origin + '/sound';
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SCOPES = [
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-top-read',
  'playlist-read-private',
  'user-library-read',
  'user-read-playback-state'
];

interface SpotifyTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export const spotifyAuth = {
  async login() {
    const codeVerifier = generateCodeVerifier(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    window.localStorage.setItem('spotify_code_verifier', codeVerifier);

    const args = new URLSearchParams({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: SCOPES.join(' '),
      redirect_uri: REDIRECT_URI,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    });

    window.location.href = `${AUTH_ENDPOINT}?${args.toString()}`;
  },

  async handleCallback(code: string) {
    const codeVerifier = window.localStorage.getItem('spotify_code_verifier');
    
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: SPOTIFY_CLIENT_ID,
      code_verifier: codeVerifier!,
    });

    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body,
    });

    if (!response.ok) throw new Error('Failed to exchange token');

    const data: SpotifyTokenResponse = await response.json();
    this.saveTokens(data);
    return data;
  },

  saveTokens(data: SpotifyTokenResponse) {
    window.localStorage.setItem('spotify_access_token', data.access_token);
    if (data.refresh_token) window.localStorage.setItem('spotify_refresh_token', data.refresh_token);
    window.localStorage.setItem('spotify_expires_at', (Date.now() + data.expires_in * 1000).toString());
  },

  getAccessToken() {
    return window.localStorage.getItem('spotify_access_token');
  },

  isLoggedIn() {
    const token = this.getAccessToken();
    const expiresAt = window.localStorage.getItem('spotify_expires_at');
    if (!token || !expiresAt) return false;
    return Date.now() < parseInt(expiresAt);
  },

  logout() {
    window.localStorage.removeItem('spotify_access_token');
    window.localStorage.removeItem('spotify_refresh_token');
    window.localStorage.removeItem('spotify_expires_at');
    window.localStorage.removeItem('spotify_code_verifier');
  }
};

/**
 * Spotify API service for fetching data.
 */
export const spotifyApi = {
  async fetchWithAuth(endpoint: string) {
    const token = spotifyAuth.getAccessToken();
    if (!token) throw new Error('Not authenticated with Spotify');

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 401) {
       // Token expired? In a real app we'd refresh here.
       throw new Error('Spotify session expired');
    }

    if (!response.ok) return null;
    return response.json();
  },

  getCurrentTrack() {
    return this.fetchWithAuth('/me/player/currently-playing');
  },

  getRecentlyPlayed() {
    return this.fetchWithAuth('/me/player/recently-played?limit=10');
  },

  getTopArtists() {
    return this.fetchWithAuth('/me/top/artists?limit=10&time_range=medium_term');
  },

  getPlaylists() {
    return this.fetchWithAuth('/me/playlists?limit=20');
  }
};

// --- PKCE Helpers ---

function generateCodeVerifier(length: number) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
