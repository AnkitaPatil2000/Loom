/**
 * TMDB Movie Service - Handles fetching movie/show metadata.
 */

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const movieService = {
  async fetchTMDB(endpoint: string) {
    if (!TMDB_API_KEY) {
        // Return null if no key, handle gracefully in UI
        return null;
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`);
    if (!response.ok) return null;
    return response.json();
  },

  async searchMovies(query: string) {
    return this.fetchTMDB(`/search/movie?query=${encodeURIComponent(query)}`);
  },

  async getMovieDetails(movieId: string) {
    return this.fetchTMDB(`/movie/${movieId}`);
  },

  async getTrending() {
    return this.fetchTMDB('/trending/movie/week');
  },

  async getMovieCredits(movieId: string) {
    return this.fetchTMDB(`/movie/${movieId}/credits`);
  },

  async getMovieImages(movieId: string) {
    return this.fetchTMDB(`/movie/${movieId}/images`);
  }
};
