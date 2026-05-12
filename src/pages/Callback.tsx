import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyAuth } from '../services/spotifyService';
import { Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Callback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const errorParam = params.get('error');

    if (errorParam) {
      setError(`Spotify error: ${errorParam}`);
      return;
    }

    if (code) {
      spotifyAuth.handleCallback(code)
        .then(() => {
          navigate('/sound');
        })
        .catch((err) => {
          console.error('Callback error:', err);
          setError(err.message || 'Failed to connect to Spotify');
        });
    } else {
      setError('No authorization code received');
    }
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-surface-container rounded-[2.5rem] p-12 text-center space-y-6 border border-outline/10 shadow-2xl"
        >
          <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={32} />
          </div>
          <h1 className="font-display text-3xl font-bold italic">Connection Failed.</h1>
          <p className="font-sans text-sm text-on-surface-variant opacity-60">
            {error}
          </p>
          <button 
            onClick={() => navigate('/sound')}
            className="w-full bg-primary text-on-primary py-4 rounded-2xl font-sans font-bold text-xs uppercase tracking-widest hover:shadow-xl transition-all"
          >
            Return to Soundscape
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <Loader2 size={48} className="animate-spin text-primary mx-auto" />
        <p className="font-display text-2xl italic animate-pulse">Syncing your frequency...</p>
      </div>
    </div>
  );
}
