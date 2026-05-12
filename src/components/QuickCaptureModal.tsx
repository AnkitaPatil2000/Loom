import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, PenLine } from 'lucide-react';
import { useLoomStore } from '../hooks/useLoomStore';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickCaptureModal({ isOpen, onClose }: QuickCaptureModalProps) {
  const { addFragment, data } = useLoomStore();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('All Thoughts');

  const handleSave = () => {
    if (content.trim()) {
      addFragment({
        type: 'thought',
        content: content.trim(),
        category: category,
      });
      setContent('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-900/10 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-cream-50 loom-card border-none relative overflow-hidden flex flex-col"
          >
            <div className="p-10 space-y-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-2xl italic">"Capture a thought"</h3>
                  <button onClick={onClose} className="text-ink-400 hover:text-ink-900 transition-colors">
                    <X size={20} />
                  </button>
               </div>

               <textarea 
                  autoFocus
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="The moment is fleeting..."
                  className="w-full bg-transparent border-none text-xl outline-none h-40 resize-none font-serif italic placeholder:opacity-20"
               />

               <div className="flex justify-between items-center pt-8 border-t border-cream-200">
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-transparent border-none text-sm italic text-ink-700 outline-none cursor-pointer"
                  >
                    {data.categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>

                  <button 
                    disabled={!content.trim()}
                    onClick={handleSave}
                    className="loom-button px-8 flex items-center gap-2"
                  >
                    Save <Send size={14} />
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
