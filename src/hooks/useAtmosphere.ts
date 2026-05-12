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
  accent: 'rgba(var(--primary), 0.1)',
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

    if (imageUrl) {
      // Heuristic color extraction
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = 1;
        canvas.height = 1;
        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        
        const primary = `rgb(${r}, ${g}, ${b})`;
        const secondary = `rgb(${Math.max(0, r - 50)}, ${Math.max(0, g - 50)}, ${Math.max(0, b - 50)})`;
        const glow = `rgba(${r}, ${g}, ${b}, 0.25)`;
        const accent = `rgba(${r}, ${g}, ${b}, 0.1)`;
        const warmth = (r + g) / (r + g + b + 1);

        setTheme({
          primary,
          secondary,
          accent,
          glow,
          warmth,
        });
      };
      img.onerror = () => {
         // Fallback to mood mapping if image fails
         applyMoodTheme(mood);
      };
    } else {
      applyMoodTheme(mood);
    }
  }, [imageUrl, mood]);

  function applyMoodTheme(m?: string) {
    if (!m) {
      setTheme(defaultTheme);
      return;
    }
    switch (m.toLowerCase()) {
      case 'ambient':
      case 'calm':
        setTheme({
          primary: '#93c5fd',
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
          primary: '#fbbf24',
          secondary: '#78350f',
          accent: 'rgba(251, 191, 36, 0.1)',
          glow: 'rgba(251, 191, 36, 0.2)',
          warmth: 0.8,
        });
        break;
      case 'electronic':
      case 'techno':
        setTheme({
          primary: '#a855f7',
          secondary: '#3b0764',
          accent: 'rgba(168, 85, 247, 0.1)',
          glow: 'rgba(168, 85, 247, 0.2)',
          warmth: 0.4,
        });
        break;
      case 'cinematic':
      case 'emotional':
        setTheme({
          primary: '#f43f5e',
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

  return theme;
}
