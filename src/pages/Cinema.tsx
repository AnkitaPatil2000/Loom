import { useState } from 'react';
import { Film, Play, Eye, Share2, Sparkles, Filter, Download, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const initialScenes = [
  { id: '1', title: 'Midnight Library', intensity: 'Cozy', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000' },
  { id: '2', title: 'Cyberpunk Zen Garden', intensity: 'Electric', url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=2000' },
  { id: '3', title: 'Tuscan Morning', intensity: 'Soft', url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=2000' },
  { id: '4', title: 'Rainy Tokyo Alley', intensity: 'Deep', url: 'https://images.unsplash.com/photo-1503891450247-ee5f8bbaf7ef?auto=format&fit=crop&q=80&w=2000' },
];

export default function Cinema() {
  const [scenes, setScenes] = useState(initialScenes);
  const [selectedScene, setSelectedScene] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNewAtmosphere = () => {
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
        const newScene = {
            id: Date.now().toString(),
            title: 'Generated Ethereal Plain',
            intensity: 'Unique',
            url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000'
        };
        setScenes([newScene, ...scenes]);
        setIsGenerating(false);
    }, 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-8 py-12"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-24">
        <div className="space-y-3">
           <span className="font-sans text-xs font-black text-primary tracking-[0.3em] uppercase opacity-40 block">Visual Resonator</span>
           <h1 className="font-display text-7xl md:text-8xl font-bold italic text-on-background tracking-tighter leading-[0.85]">Cinema.</h1>
           <p className="font-display text-xl text-on-surface-variant italic opacity-60 max-w-lg leading-relaxed">Architecting the visual background for your mind.</p>
        </div>
        <button 
          onClick={generateNewAtmosphere}
          disabled={isGenerating}
          className="flex items-center gap-4 bg-primary text-on-primary px-10 py-5 rounded-[2rem] font-sans font-bold text-sm tracking-widest uppercase hover:shadow-2xl shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group whitespace-nowrap"
        >
          {isGenerating ? (
            <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                    <motion.div 
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 bg-white rounded-full"
                    />
                ))}
            </div>
          ) : (
            <>
               <Sparkles size={18} className="group-hover:rotate-12 transition-transform" /> Generate Atmosphere
            </>
          )}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {scenes.map((scene) => (
          <motion.div
            layout
            key={scene.id}
            onClick={() => setSelectedScene(scene)}
            className="group relative h-[400px] bg-surface-container rounded-[3rem] overflow-hidden cursor-pointer border border-outline/10 hover:border-primary/40 transition-colors"
          >
            <img 
              src={scene.url} 
              alt={scene.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-10 md:p-12 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500">
               <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="font-sans text-[10px] font-bold text-primary tracking-[0.3em] uppercase block mb-1">{scene.intensity} Intensity</span>
                    <h3 className="font-display text-4xl md:text-5xl font-bold italic text-white leading-none tracking-tight">{scene.title}</h3>
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
                     <div className="flex gap-2">
                        <button className="bg-white/10 backdrop-blur-md text-white w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/20 transition-all">
                           <Play size={18} fill="currentColor" />
                        </button>
                        <button className="bg-white/10 backdrop-blur-md text-white w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/20 transition-all">
                           <Maximize2 size={18} />
                        </button>
                     </div>
                     <button className="bg-white text-black px-8 py-4 rounded-xl font-sans font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-lg">
                        Enter Space
                     </button>
                  </div>
               </div>
            </div>
            
            <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-mono text-[10px] px-4 py-2 rounded-full opacity-60">
               {scene.id.length > 5 ? 'Generated' : 'Curated'}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedScene && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black p-8 md:p-20 flex flex-col items-center justify-center"
          >
            <button 
              onClick={() => setSelectedScene(null)}
              className="absolute top-12 right-12 text-white/40 hover:text-white transition-colors"
            >
              <Maximize2 size={32} className="rotate-45" />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full h-full rounded-[4rem] overflow-hidden shadow-2xl relative"
            >
               <img 
                 src={selectedScene.url} 
                 alt={selectedScene.title}
                 className="w-full h-full object-cover"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-8">
                  <div className="max-w-4xl space-y-12">
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4], y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="flex justify-center"
                    >
                      <Film size={80} className="text-white opacity-20" />
                    </motion.div>
                    
                    <div className="space-y-4">
                      <h2 className="font-display text-7xl md:text-9xl font-bold italic text-white tracking-tighter leading-none">{selectedScene.title}</h2>
                      <p className="font-display text-xl md:text-3xl text-white/50 italic max-w-2xl mx-auto leading-relaxed">Breathe with the image. Let world details fade into the background of your focus.</p>
                    </div>

                    <button 
                      onClick={() => setSelectedScene(null)}
                      className="bg-white text-black px-12 py-6 rounded-[2rem] font-sans font-bold text-xs md:text-sm uppercase tracking-[0.4em] hover:bg-primary hover:text-white transition-all shadow-2xl"
                    >
                      Return to Reality
                    </button>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
