import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLoomStore, FragmentType } from '../hooks/useLoomStore';
import { PenLine, Quote, Camera, Mic, Film, Music, ChevronRight, Pencil, Trash2 } from 'lucide-react';

export default function Today() {
  const { data, getTodayState, setIntention, addFragment, saveTheDay, deleteFragment } = useLoomStore();
  const [manualState, setManualState] = useState<'morning' | 'daytime' | 'review' | null>(null);
  
  const todayId = new Date().toISOString().split('T')[0];
  const todayData = data.days.find(d => d.id === todayId);
  const todayFragments = data.fragments.filter(f => f.dayId === todayId);
  
  const currentState = manualState || getTodayState();

  const [intentionInput, setIntentionInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [selectedType, setSelectedType] = useState<FragmentType>('thought');
  const [selectedCategory, setSelectedCategory] = useState('All Thoughts');

  const handleSetIntention = (e: React.FormEvent) => {
    e.preventDefault();
    if (intentionInput.trim()) {
      setIntention(intentionInput.trim());
      setManualState(null);
    }
  };

  const handleSaveFragment = () => {
    if (contentInput.trim()) {
      addFragment({
        type: selectedType,
        content: contentInput.trim(),
        category: selectedCategory,
      });
      setContentInput('');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const getTimeStr = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  // --- RENDERING HELPERS ---

  const renderMorning = () => (
    <div className="max-w-xl mx-auto pt-20 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-5xl">today.</h1>
        <p className="meta-text italic text-ink-400">*{formatDate(todayId)}*</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="loom-card bg-cream-100 p-12 space-y-8"
      >
        <h2 className="text-3xl text-center">"What is today about?"</h2>
        <form onSubmit={handleSetIntention} className="space-y-6">
          <input 
            autoFocus
            type="text" 
            placeholder="one sentence is enough"
            className="w-full bg-transparent border-none text-2xl text-center outline-none italic placeholder:opacity-20"
            value={intentionInput}
            onChange={(e) => setIntentionInput(e.target.value)}
          />
          <div className="flex justify-center">
            <button type="submit" className="loom-button px-8 py-3">Set intention</button>
          </div>
        </form>
      </motion.div>

      <div className="text-center space-y-4">
        <p className="text-ink-400 italic text-sm">"You can capture thoughts throughout the day. Or skip this. The day is yours."</p>
        <button 
          onClick={() => setManualState('daytime')}
          className="loom-button-secondary text-xs"
        >
          skip and go to capture &rarr;
        </button>
      </div>
    </div>
  );

  const renderDaytime = () => (
    <div className="max-w-2xl mx-auto space-y-16 py-12">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl">today.</h1>
          <p className="meta-text italic">*{formatDate(todayId)}*</p>
        </div>
        <button 
          onClick={() => setManualState('review')}
          className="loom-button-secondary text-xs"
        >
          see the week &rarr;
        </button>
      </div>

      {todayData?.intention ? (
        <div className="bg-rose-200 p-4 rounded-[6px] flex justify-between items-center px-6">
          <p className="text-lg italic text-ink-900 leading-none">*"Today is about: {todayData.intention}"*</p>
          <button className="text-ink-400 hover:text-ink-900 transition-colors">
            <Pencil size={14} />
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setManualState('morning')}
          className="loom-button-secondary text-sm"
        >
          set an intention for today &rarr;
        </button>
      )}

      <motion.div 
        layout
        className="loom-card p-10 space-y-8"
      >
        <h2 className="text-2xl font-medium tracking-tight">"What is on your mind?"</h2>
        <textarea 
          value={contentInput}
          onChange={(e) => setContentInput(e.target.value)}
          placeholder="a thought, a quote, a noticing..."
          className="w-full bg-transparent border-none text-xl outline-none min-h-[120px] resize-none placeholder:opacity-20"
        />
        
        <div className="flex justify-between items-center border-t border-cream-200 pt-6">
          <div className="flex gap-4">
            {[
              { type: 'thought', icon: PenLine },
              { type: 'quote', icon: Quote },
              { type: 'photo', icon: Camera },
              { type: 'voice', icon: Mic },
              { type: 'film', icon: Film },
              { type: 'song', icon: Music },
            ].map((btn) => (
              <button 
                key={btn.type}
                onClick={() => setSelectedType(btn.type as FragmentType)}
                className={`p-2 rounded-full transition-all ${selectedType === btn.type ? 'bg-sage-500 text-cream-50' : 'text-ink-400 hover:text-ink-700'}`}
              >
                <btn.icon size={18} />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent border-none text-sm italic text-ink-700 outline-none cursor-pointer"
            >
              {data.categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <button 
              onClick={handleSaveFragment}
              className="loom-button px-6"
            >
              Save
            </button>
          </div>
        </div>
      </motion.div>

      <div className="space-y-8">
        <AnimatePresence initial={false}>
          {todayFragments.length > 0 ? (
            todayFragments.map((fragment) => (
              <motion.div 
                key={fragment.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="group relative loom-card p-8 flex gap-6 items-start"
              >
                <div className="text-ink-400 shrink-0 mt-1">
                  {fragment.type === 'thought' && <PenLine size={16} />}
                  {fragment.type === 'quote' && <Quote size={16} />}
                  {fragment.type === 'photo' && <Camera size={16} />}
                  {fragment.type === 'voice' && <Mic size={16} />}
                  {fragment.type === 'film' && <Film size={16} />}
                  {fragment.type === 'song' && <Music size={16} />}
                </div>
                <div className="flex-1 space-y-2">
                  <p className={`text-xl leading-relaxed ${fragment.type === 'quote' ? 'text-center italic' : ''}`}>
                    {fragment.content}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="meta-text text-[8px]">{getTimeStr(fragment.createdAt)}</span>
                    <span className="font-serif italic text-[10px] text-ink-400">{fragment.category}</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                   <button onClick={() => deleteFragment(fragment.id)} className="text-ink-400 hover:text-red-500 transition-colors">
                      <Trash2 size={12} />
                   </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-ink-400 italic opacity-40">"The day is open. Begin when you are ready."</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center pt-20">
        <button 
          onClick={() => { saveTheDay(); setManualState('review'); }}
          className="loom-button-secondary text-sm"
        >
          save the day &rarr;
        </button>
      </div>
    </div>
  );

  const renderReview = () => {
    // Generate simple stats
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weekFragments = data.fragments.filter(f => new Date(f.createdAt) >= sevenDaysAgo);
    const daysWithFragments = new Set(weekFragments.map(f => f.dayId)).size;
    const intentionsSet = data.days.filter(d => new Date(d.id) >= sevenDaysAgo && d.intention).length;

    // Simple word frequency noticing
    const words = weekFragments.flatMap(f => f.content.toLowerCase().split(/\W+/).filter(w => w.length > 4));
    const counts: Record<string, number> = {};
    words.forEach(w => counts[w] = (counts[w] || 0) + 1);
    const topWord = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayId = d.toISOString().split('T')[0];
        weekDays.push(dayId);
    }

    return (
      <div className="max-w-2xl mx-auto py-12 space-y-16">
        <div className="text-center space-y-2">
          <h1 className="text-4xl text-center">the week.</h1>
          <p className="italic text-ink-400">"A quiet hour to look back."</p>
        </div>

        <div className="bg-rose-200 p-12 rounded-[12px] space-y-8 shadow-[0_2px_12px_rgba(60,50,40,0.04)]">
           <div className="space-y-1">
             <h2 className="text-2xl italic">"This week."</h2>
             <p className="meta-text">MAY 6 — MAY 12</p>
           </div>

           <div className="flex justify-between">
              <div className="space-y-1">
                 <p className="italic text-xs text-ink-700">*Days you wrote:*</p>
                 <p className="text-2xl">{daysWithFragments} of 7</p>
              </div>
              <div className="space-y-1">
                 <p className="italic text-xs text-ink-700">*Fragments captured:*</p>
                 <p className="text-2xl">{weekFragments.length}</p>
              </div>
              <div className="space-y-1">
                 <p className="italic text-xs text-ink-700">*Intentions set:*</p>
                 <p className="text-2xl">{intentionsSet}</p>
              </div>
           </div>

           {topWord && (
             <p className="italic text-ink-900 border-t border-ink-900/10 pt-6">
                *"You returned to the word "{topWord[0]}" {topWord[1]} times."*
             </p>
           )}
        </div>

        <div className="space-y-12">
            {weekDays.map(dayId => {
              const dayData = data.days.find(d => d.id === dayId);
              const dayFrags = data.fragments.filter(f => f.dayId === dayId);
              return (
                <div key={dayId} className="space-y-4">
                  <div className="flex justify-between items-baseline border-b border-cream-200 pb-2">
                     <h3 className="text-xl italic font-medium">*{formatDate(dayId)}*</h3>
                  </div>
                  
                  {dayData?.intention && (
                    <div className="bg-cream-100 p-3 rounded-md px-4">
                      <p className="italic text-sm text-ink-700 leading-none">*"Intention: {dayData.intention}"*</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {dayFrags.length > 0 ? dayFrags.map(f => (
                      <div key={f.id} className="loom-card p-6 flex gap-4 items-start bg-white/50">
                        <PenLine size={14} className="text-ink-400 mt-1" />
                        <p className="text-lg leading-relaxed">{f.content}</p>
                      </div>
                    )) : (
                      <p className="italic text-ink-400 opacity-40 text-sm ml-8">"a quiet day."</p>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        <div className="flex flex-col items-center gap-6 pt-12 pb-20">
          <button 
            onClick={() => setManualState('daytime')}
            className="loom-button-secondary text-sm"
          >
            return to today &rarr;
          </button>
          
          <button className="loom-button px-10">
            begin a new week
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-full px-12 overflow-x-hidden">
      {currentState === 'morning' && renderMorning()}
      {currentState === 'daytime' && renderDaytime()}
      {currentState === 'review' && renderReview()}
    </div>
  );
}
