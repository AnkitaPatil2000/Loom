import { useState, useEffect } from 'react';

interface AtmosphereTheme {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  warmth: number; // 0 to 1
}

const defaultTheme: AtmosphereTheme = {
  primary: 'rgb(var(--primary))',
  secondary: 'rgb(var(--secondary))',
  accent: 'rgb(var(--primary) / 0.1)',
  glow: 'rgba(var(--primary), 0.2)',
  warmth: 0.5,
};

export function useAtmosphere(imageUrl?: string, mood?: string) {
  const [theme, setTheme] = useState<AtmosphereTheme>(defaultTheme);

  useEffect(() => {
    if (!imageUrl && !mood) {
      setTheme(defaultTheme);
      return;
    }

    // Heuristic mapping for moods (Sound)
    if (mood) {
      switch (mood.toLowerCase()) {
        case 'ambient':
        case 'calm':
          setTheme({
            primary: '#93c5fd', // Soft blue
            secondary: '#1e3a8a',
            accent: 'rgba(147, 197, 253, 0.1)',
            glow: 'rgba(147, 197, 253, 0.2)',
            warmth: 0.2,
          });
          break;
        case 'jazz':
        case 'folk':
        case 'warm':
          setTheme({
            primary: '#fbbf24', // Amber
            secondary: '#78350f',
            accent: 'rgba(251, 191, 36, 0.1)',
            glow: 'rgba(251, 191, 36, 0.2)',
            warmth: 0.8,
          });
          break;
        case 'electronic':
        case 'techno':
          setTheme({
            primary: '#a855f7', // Purple
            secondary: '#3b0764',
            accent: 'rgba(168, 85, 247, 0.1)',
            glow: 'rgba(168, 85, 247, 0.2)',
            warmth: 0.4,
          });
          break;
        case 'cinematic':
        case 'emotional':
          setTheme({
            primary: '#f43f5e', // Rose
            secondary: '#4c0519',
            accent: 'rgba(244, 63, 94, 0.1)',
            glow: 'rgba(244, 63, 94, 0.2)',
            warmth: 0.6,
          });
          break;
        default:
          setTheme(defaultTheme);
      }
    }

    // In a future iteration, we could use a canvas to extract dominant colors from imageUrl.
    // For now, we'll stick to mood-based or placeholder logic.
  }, [imageUrl, mood]);

  return theme;
}
