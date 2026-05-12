/**
 * TMDB Movie Service - Handles fetching movie/show metadata.
 */

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const movieService = {
  async fetchTMDB(endpoint: string) {
    if (!TMDB_API_KEY) {
        return null;
    }
    
    const separator = endpoint.includes('?') ? '&' : '?';
    const response = await fetch(`${BASE_URL}${endpoint}${separator}api_key=${TMDB_API_KEY}`);
    if (!response.ok) return null;
    return response.json();
  },

  async getTrendingBackdrop() {
    const data = await this.fetchTMDB('/trending/movie/week');
    if (!data || !data.results || data.results.length === 0) return null;
    const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
    return {
      title: randomMovie.title || randomMovie.name,
      url: `https://image.tmdb.org/t/p/original${randomMovie.backdrop_path}`,
      intensity: randomMovie.vote_average > 7 ? 'High' : 'Subtle'
    };
  },

  async searchMovies(query: string) {
    return this.fetchTMDB(`/search/movie?query=${encodeURIComponent(query)}`);
  },

  async searchMulti(query: string) {
    return this.fetchTMDB(`/search/multi?query=${encodeURIComponent(query)}`);
  },

  async getMovieDetails(movieId: string, type: 'movie' | 'tv' = 'movie') {
    return this.fetchTMDB(`/${type}/${movieId}`);
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
