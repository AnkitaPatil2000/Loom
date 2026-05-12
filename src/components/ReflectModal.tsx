import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles } from 'lucide-react';
import { createThought } from '../services/firebaseService';

interface ReflectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReflectModal({ isOpen, onClose }: ReflectModalProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Personal Log');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await createThought({
        title: content.slice(0, 40) + (content.length > 40 ? '...' : ''),
        content: content,
        summary: content.slice(0, 150) + '...',
        tags: ['Momentary'],
        category: category,
        wordCount: content.split(/\s+/).length
      });
      setContent('');
      onClose();
    } catch (error) {
      console.error("Failed to archive thought:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col"
          >
            <div className="px-10 py-8 border-b border-outline/5 flex justify-between items-center bg-surface-dim/30">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="font-display text-2xl font-bold italic tracking-tight">Quick Reflection</h3>
               </div>
               <button onClick={onClose} className="text-on-surface-variant/40 hover:text-on-surface-variant transition-colors">
                 <X size={24} />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 flex-1 flex flex-col">
              <div className="space-y-4">
                <label className="font-sans text-[10px] font-black uppercase tracking-widest opacity-30">The Essence of Now</label>
                <textarea 
                  autoFocus
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Capture this frequency..."
                  className="w-full bg-surface-container rounded-2xl p-8 font-display text-xl leading-relaxed italic border-none focus:ring-primary focus:ring-1 h-64 resize-none placeholder:opacity-20"
                />
              </div>

              <div className="flex justify-between items-center mt-auto">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-surface-dim border border-outline/10 rounded-xl px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-widest text-primary outline-none"
                >
                  <option>Personal Log</option>
                  <option>Philosophy</option>
                  <option>Creative Strategy</option>
                  <option>Growth</option>
                </select>

                <button 
                  disabled={!content.trim() || isSubmitting}
                  className="bg-primary text-on-primary px-10 py-4 rounded-xl font-sans font-bold text-xs uppercase tracking-widest hover:shadow-xl shadow-primary/20 transition-all flex items-center gap-3 disabled:opacity-50"
                  type="submit"
                >
                  {isSubmitting ? 'Syncing...' : 'Archive Moment'} <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
