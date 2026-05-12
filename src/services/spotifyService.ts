/**
 * Spotify Service - Handles OAuth PKCE flow and API interactions.
 */

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = window.location.origin + '/callback';
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
    if (!SPOTIFY_CLIENT_ID) {
      throw new Error('Spotify Client ID not configured');
    }

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
    
    if (!codeVerifier) {
      throw new Error('Code verifier not found');
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: SPOTIFY_CLIENT_ID,
      code_verifier: codeVerifier,
    });

    try {
      const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Spotify token error:', errorData);
        throw new Error(errorData.error_description || 'Failed to exchange token');
      }

      const data: SpotifyTokenResponse = await response.json();
      this.saveTokens(data);
      return data;
    } catch (error) {
      console.error('Spotify callback fatal error:', error);
      throw error;
    }
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
    // We consider logged in even if expired, because we can refresh
    return !!token;
  },

  async getValidToken() {
    const token = this.getAccessToken();
    const expiresAt = window.localStorage.getItem('spotify_expires_at');
    
    if (!token || !expiresAt) return null;

    if (Date.now() < parseInt(expiresAt)) {
      return token;
    }

    const refreshToken = window.localStorage.getItem('spotify_refresh_token');
    if (!refreshToken) return null;

    // Refresh token
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: SPOTIFY_CLIENT_ID!,
    });

    try {
      const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body,
      });

      if (!response.ok) throw new Error('Token refresh failed');

      const data = await response.json();
      this.saveTokens(data);
      return data.access_token;
    } catch (error) {
      console.error('Spotify refresh error:', error);
      this.logout();
      return null;
    }
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
    const token = await spotifyAuth.getValidToken();
    if (!token) throw new Error('Not authenticated with Spotify');

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 401) {
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
