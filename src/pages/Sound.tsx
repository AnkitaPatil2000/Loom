import { useState, useEffect, useCallback } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, Wind, Droplets, Flame, Coffee, Bird, Zap, Waves, LogIn, History, ListMusic, User, Disc, Heart, TrendingUp, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';
import { syncSoundPreferences } from '../services/firebaseService';
import { spotifyAuth, spotifyApi } from '../services/spotifyService';
import { useAtmosphere } from '../hooks/useAtmosphere';

const localSounds = [
  { id: 'rain', name: 'Gentle Rain', icon: Droplets, color: 'text-blue-400', mood: 'ambient' },
  { id: 'wind', name: 'Highlands Wind', icon: Wind, color: 'text-gray-400', mood: 'ambient' },
  { id: 'fire', name: 'Hearth Fire', icon: Flame, color: 'text-orange-400', mood: 'warm' },
  { id: 'cafe', name: 'Quiet Cafe', icon: Coffee, color: 'text-amber-400', mood: 'warm' },
  { id: 'forest', name: 'Deep Forest', icon: Bird, color: 'text-green-400', mood: 'ambient' },
  { id: 'waves', name: 'Ocean Tide', icon: Waves, color: 'text-cyan-400', mood: 'ambient' },
  { id: 'static', name: 'White Noise', icon: Zap, color: 'text-indigo-400', mood: 'electronic' },
];

export default function Sound() {
  const { profile } = useUser();
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  
  // Spotify State
  const [isSpotifyLoggedIn, setIsSpotifyLoggedIn] = useState(spotifyAuth.isLoggedIn());
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [recentPlayed, setRecentPlayed] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [isLoadingSpotify, setIsLoadingSpotify] = useState(false);

  const atmosphere = useAtmosphere(
    currentTrack?.item?.album?.images?.[0]?.url, 
    currentTrack?.item ? 'cinematic' : (activeSound ? localSounds.find(s => s.id === activeSound)?.mood : undefined)
  );

  const [spotifyError, setSpotifyError] = useState<string | null>(null);

  const loadSpotifyData = useCallback(async () => {
    if (!spotifyAuth.isLoggedIn()) return;
    
    setIsLoadingSpotify(true);
    setSpotifyError(null);
    try {
      const token = await spotifyAuth.getValidToken();
      if (!token) {
        setIsSpotifyLoggedIn(false);
        return;
      }

      const [track, recent, list, artists] = await Promise.all([
        spotifyApi.getCurrentTrack(),
        spotifyApi.getRecentlyPlayed(),
        spotifyApi.getPlaylists(),
        spotifyApi.getTopArtists()
      ]);
      
      setCurrentTrack(track);
      setRecentPlayed(recent?.items || []);
      setPlaylists(list?.items || []);
      setTopArtists(artists?.items || []);
    } catch (error: any) {
      console.error("Spotify sync error:", error);
      setSpotifyError(error.message || "Failed to sync with Spotify");
    } finally {
      setIsLoadingSpotify(false);
    }
  }, []);

  useEffect(() => {
    if (isSpotifyLoggedIn) {
      loadSpotifyData();
    }
  }, [isSpotifyLoggedIn, loadSpotifyData]);

  useEffect(() => {
    if (profile?.soundPreferences) {
      setActiveSound(profile.soundPreferences.currentSound);
      setVolume(profile.soundPreferences.volume);
      setIsMuted(profile.soundPreferences.isMuted);
    }
  }, [profile]);

  const toggleSound = async (id: string) => {
    const newSound = activeSound === id ? null : id;
    setActiveSound(newSound);
    await syncSoundPreferences({
      currentSound: newSound,
      volume,
      isMuted
    });
  };

  const handleVolumeChange = async (val: number) => {
    setVolume(val);
    await syncSoundPreferences({
      currentSound: activeSound,
      volume: val,
      isMuted
    });
  };

  const loginSpotify = () => {
    if (!import.meta.env.VITE_SPOTIFY_CLIENT_ID) {
      alert("Spotify Client ID not configured. Add it in the Secrets panel to connect your real account.");
      return;
    }
    spotifyAuth.login();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-8 py-12 space-y-24 min-h-screen relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% -20%, ${atmosphere.glow}, transparent 60%)`,
        transition: 'background 2s ease-in-out'
      }}
    >
      <header className="flex justify-between items-start">
        <div className="space-y-4">
          <span className="font-sans text-xs font-black tracking-[0.3em] uppercase opacity-40" style={{ color: atmosphere.primary }}>
            Auditory Atmosphere
          </span>
          <h1 className="font-display text-7xl md:text-8xl font-bold italic text-on-background tracking-tighter leading-none">Soundscape.</h1>
          <p className="font-display text-xl text-on-surface-variant italic opacity-60 max-w-2xl leading-relaxed">
            Curate the silence. Let the background wash over your focus, creating a cocoon of intentional vibration.
          </p>
        </div>

        {!isSpotifyLoggedIn ? (
          <button 
            onClick={loginSpotify}
            className="flex items-center gap-3 bg-white text-on-background border border-outline/10 px-8 py-4 rounded-2xl font-sans text-xs font-bold tracking-tight hover:shadow-2xl hover:border-black/20 transition-all active:scale-95 group"
          >
            <div className="w-6 h-6 bg-[#1DB954] rounded-full flex items-center justify-center">
               <Music size={12} className="text-white" fill="white" />
            </div>
            <span>Connect Spotify</span>
          </button>
        ) : (
          <div className="flex gap-4 items-center">
            {spotifyError && (
              <span className="text-error font-sans text-[10px] font-bold uppercase tracking-widest bg-error/10 px-4 py-2 rounded-lg flex items-center gap-2">
                <AlertCircle size={12} /> {spotifyError}
              </span>
            )}
            <button 
              onClick={() => { spotifyAuth.logout(); setIsSpotifyLoggedIn(false); setSpotifyError(null); }}
              className="font-sans text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 hover:text-error transition-colors"
            >
              Sign out of Spotify
            </button>
          </div>
        )}
      </header>

      {/* Spotify Section */}
      {isSpotifyLoggedIn && (
        <section className="space-y-12">
          <div className="flex items-center gap-4">
             <div className="w-1 h-8 bg-primary rounded-full"></div>
             <h2 className="font-display text-4xl font-bold italic tracking-tight">Your Echo.</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Now Playing Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-12 xl:col-span-8 bg-surface-container rounded-[3rem] p-12 border border-outline/10 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                {currentTrack?.item ? (
                  <>
                    <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl relative group/img">
                      <img 
                        src={currentTrack.item.album.images[0].url} 
                        alt="Album Art" 
                        className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover/img:bg-black/0 transition-colors"></div>
                    </div>
                    <div className="flex-1 space-y-6 text-center md:text-left">
                       <div className="space-y-2">
                        <span className="font-sans text-[10px] font-black uppercase tracking-[0.3em] text-primary">Currently Resonating</span>
                        <h3 className="font-display text-5xl md:text-6xl font-bold italic leading-none tracking-tighter">{currentTrack.item.name}</h3>
                        <p className="font-display text-2xl text-on-surface-variant italic opacity-60">
                          {currentTrack.item.artists.map((a: any) => a.name).join(', ')}
                        </p>
                       </div>
                       
                       <div className="flex flex-wrap justify-center md:justify-start gap-4">
                          <span className="px-4 py-2 bg-white/40 backdrop-blur-md rounded-full font-mono text-[10px] uppercase font-bold tracking-widest border border-white/40">
                             {currentTrack.item.album.name}
                          </span>
                          <span className="px-4 py-2 bg-primary/10 rounded-full font-mono text-[10px] uppercase font-bold tracking-widest text-primary border border-primary/10">
                             Atmosphere: {atmosphere.warmth > 0.6 ? 'Warm' : 'Cool'}
                          </span>
                       </div>

                       <div className="flex items-center gap-8 pt-4 justify-center md:justify-start">
                          <button className="w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl shadow-primary/30">
                            {currentTrack.is_playing ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                          </button>
                       </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 text-center py-20 space-y-4">
                     <Disc size={48} className="mx-auto text-on-surface-variant/20 animate-spin-slow" />
                     <p className="font-display text-2xl text-on-surface-variant/40 italic">Nothing playing right now... Silence is its own music.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Top Artists / Recent Grid */}
            <div className="lg:col-span-12 xl:col-span-4 space-y-12">
               <div className="bg-surface-container rounded-[2.5rem] p-10 border border-outline/10 space-y-8">
                  <div className="flex justify-between items-center">
                    <h4 className="font-display text-xl font-bold italic">Top Artists.</h4>
                    <TrendingUp size={16} className="text-on-surface-variant/40" />
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                     {topArtists.slice(0, 5).map((artist: any) => (
                       <motion.div whileHover={{ scale: 1.1 }} key={artist.id} className="aspect-square rounded-2xl overflow-hidden relative group cursor-pointer bg-surface-dim">
                          <img src={artist.images[0].url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={artist.name} title={artist.name} />
                       </motion.div>
                     ))}
                  </div>
               </div>

               <div className="bg-surface-container rounded-[2.5rem] p-10 border border-outline/10 space-y-8">
                  <div className="flex justify-between items-center">
                    <h4 className="font-display text-xl font-bold italic">Memory Loop.</h4>
                    <History size={16} className="text-on-surface-variant/40" />
                  </div>
                  <div className="space-y-4">
                     {recentPlayed.slice(0, 3).map((item: any, i) => (
                       <div key={i} className="flex items-center gap-4 group cursor-pointer">
                          <img src={item.track.album.images[0].url} className="w-10 h-10 rounded-lg shadow-lg" alt="" />
                          <div className="flex-1 min-w-0">
                             <p className="font-sans text-xs font-bold text-on-background line-clamp-1 group-hover:text-primary transition-colors">{item.track.name}</p>
                             <p className="font-sans text-[10px] text-on-surface-variant/60 line-clamp-1">{item.track.artists[0].name}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </section>
      )}

      {/* Local Atmospheres Section */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
           <div className="w-1 h-8 bg-primary rounded-full"></div>
           <h2 className="font-display text-4xl font-bold italic tracking-tight">Direct Textures.</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {localSounds.map((sound) => {
            const isActive = activeSound === sound.id;
            return (
              <motion.div
                whileHover={{ y: -5 }}
                key={sound.id}
                onClick={() => toggleSound(sound.id)}
                className={`relative bg-surface-container rounded-[2rem] p-8 border transition-all cursor-pointer group flex flex-col items-center gap-6 ${
                  isActive 
                    ? 'border-primary shadow-xl shadow-primary/5 bg-white' 
                    : 'border-outline/5 hover:border-primary/20'
                }`}
              >
                <div className={`p-6 rounded-full transition-all group-hover:scale-110 ${isActive ? 'bg-primary text-on-primary' : 'bg-surface-dim text-on-surface-variant'}`}>
                  <sound.icon size={24} />
                </div>
                <div className="text-center">
                  <p className={`font-display text-xs font-bold italic transition-colors leading-tight ${isActive ? 'text-primary' : 'text-on-background'}`}>
                    {sound.name}
                  </p>
                </div>
                
                {isActive && (
                  <div className="absolute top-4 right-4">
                     <div className="flex gap-0.5 h-2 items-end">
                        {[1, 2, 3].map(i => (
                          <motion.div 
                            key={i}
                            animate={{ height: ['2px', '8px', '4px', '8px', '2px'] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                            className="w-0.5 bg-primary rounded-full"
                          />
                        ))}
                     </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Control Surface */}
      <div className="sticky bottom-12 bg-white/60 backdrop-blur-3xl rounded-[3rem] p-10 border border-outline/10 shadow-2xl shadow-black/5 z-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
           <div className="flex items-center gap-8">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-primary shadow-lg shadow-black/10 hover:scale-105 active:scale-95 transition-all outline-none border border-outline/10"
              >
                {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              <div className="space-y-1">
                 <h4 className="font-display text-2xl font-bold italic text-on-background"> 
                    {currentTrack?.item ? currentTrack.item.name : (activeSound ? localSounds.find(s => s.id === activeSound)?.name : 'Silence')} 
                 </h4>
                 <p className="font-sans text-[10px] uppercase font-bold tracking-widest opacity-40">Now Resonance</p>
              </div>
           </div>

           <div className="flex-1 w-full space-y-4">
              <div className="flex justify-between font-mono text-[10px] opacity-40 uppercase tracking-widest font-black">
                 <span>Subdued</span>
                 <span>Immersive</span>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/5 rounded-full overflow-hidden">
                   <div className="h-full bg-primary/10 transition-all" style={{ width: `${volume}%` }}></div>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                  className="relative w-full h-2 bg-transparent rounded-full appearance-none cursor-pointer accent-primary z-10"
                />
              </div>
           </div>

           <div className="flex items-center gap-4">
              <button className="flex items-center gap-4 bg-primary text-on-primary px-10 py-5 rounded-2xl font-sans font-bold text-xs tracking-widest uppercase hover:shadow-xl shadow-primary/20 transition-all">
                <Zap size={16} fill="currentColor" className="animate-pulse" /> Enhance Focus
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
