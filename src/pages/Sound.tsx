import { useState, useEffect } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, Wind, Droplets, Flame, Coffee, Bird, Zap, Waves } from 'lucide-react';
import { motion } from 'motion/react';
import { useUser } from '../context/UserContext';
import { syncSoundPreferences } from '../services/firebaseService';

const sounds = [
  { id: 'rain', name: 'Gentle Rain', icon: Droplets, color: 'text-blue-400' },
  { id: 'wind', name: 'Highlands Wind', icon: Wind, color: 'text-gray-400' },
  { id: 'fire', name: 'Hearth Fire', icon: Flame, color: 'text-orange-400' },
  { id: 'cafe', name: 'Quiet Cafe', icon: Coffee, color: 'text-amber-400' },
  { id: 'forest', name: 'Deep Forest', icon: Bird, color: 'text-green-400' },
  { id: 'waves', name: 'Ocean Tide', icon: Waves, color: 'text-cyan-400' },
  { id: 'static', name: 'White Noise', icon: Zap, color: 'text-indigo-400' },
];

export default function Sound() {
  const { profile } = useUser();
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-8 py-12 h-full flex flex-col"
    >
      <header className="mb-20">
        <span className="font-sans text-xs font-black text-primary tracking-[0.3em] uppercase opacity-40">Auditory Atmosphere</span>
        <h1 className="font-display text-7xl font-bold italic text-on-background tracking-tighter mt-4">Soundscape.</h1>
        <p className="font-display text-xl text-on-surface-variant italic opacity-60 mt-4 max-w-2xl">
          Curate the silence. Let the background wash over your focus, creating a cocoon of intentional vibration.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {sounds.map((sound) => {
          const isActive = activeSound === sound.id;
          return (
            <motion.div
              whileHover={{ y: -5 }}
              key={sound.id}
              onClick={() => toggleSound(sound.id)}
              className={`relative bg-surface-container rounded-[2.5rem] p-10 border transition-all cursor-pointer group flex flex-col items-center gap-8 ${
                isActive 
                  ? 'border-primary shadow-xl shadow-primary/5 bg-white' 
                  : 'border-outline/10 hover:border-primary/30'
              }`}
            >
              <div className={`p-8 rounded-full bg-surface-dim transition-all group-hover:scale-110 ${isActive ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>
                <sound.icon size={32} />
              </div>
              <div className="text-center">
                <p className={`font-display text-xl font-bold italic transition-colors ${isActive ? 'text-primary' : 'text-on-background'}`}>
                  {sound.name}
                </p>
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-30">Atmosphere</span>
              </div>
              
              {isActive && (
                <div className="absolute top-6 right-8">
                   <div className="flex gap-1 h-3 items-end">
                      {[1, 2, 3, 4].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ height: ['4px', '12px', '6px', '12px', '4px'] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                          className="w-1 bg-primary rounded-full"
                        />
                      ))}
                   </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-auto bg-surface-container-high rounded-[3rem] p-12 border border-outline/20">
        <div className="flex flex-col md:flex-row items-center gap-12">
           <div className="flex items-center gap-8">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-primary shadow-lg shadow-black/5 hover:scale-105 active:scale-95 transition-all"
              >
                {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              <div className="space-y-1">
                 <h4 className="font-display text-2xl font-bold italic text-on-background"> {activeSound ? sounds.find(s => s.id === activeSound)?.name : 'Silence'} </h4>
                 <p className="font-sans text-[10px] uppercase font-bold tracking-widest opacity-40">Now Resonance</p>
              </div>
           </div>

           <div className="flex-1 w-full space-y-4">
              <div className="flex justify-between font-mono text-[10px] opacity-40">
                 <span>Subdued</span>
                 <span>Immersive</span>
              </div>
              <input 
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                className="w-full h-1 bg-white rounded-full appearance-none cursor-pointer accent-primary"
              />
           </div>

           <div className="flex items-center gap-4">
              <button className="flex items-center gap-4 bg-primary text-on-primary px-10 py-5 rounded-2xl font-sans font-bold text-xs tracking-widest uppercase hover:shadow-xl shadow-primary/20 transition-all">
                <Zap size={16} fill="currentColor" /> Enhance Focus
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
