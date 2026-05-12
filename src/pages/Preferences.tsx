import { useLoomStore } from '../hooks/useLoomStore';
import { Clock, Zap, Database, Info, ShieldAlert } from 'lucide-react';

export default function Preferences() {
  const { data, updatePreferences, clearAllData } = useLoomStore();

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loom-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        // Basic validation could be added here
        localStorage.setItem('loom_personal_v1', JSON.stringify(importedData));
        window.location.reload();
      } catch (err) {
        alert('Invalid data format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-3xl mx-auto py-20 px-12 space-y-16">
      <div className="space-y-2">
        <h1 className="text-4xl">preferences.</h1>
        <p className="italic text-ink-400">"Tailoring your quiet space."</p>
      </div>

      <div className="space-y-12">
        {/* Daily Ritual */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-ink-700">
            <Clock size={20} className="opacity-40" />
            <h2 className="text-2xl italic tracking-tight">Daily ritual</h2>
          </div>
          <div className="loom-card p-10 space-y-8">
            <div className="flex justify-between items-center group">
              <label className="font-serif text-lg italic text-ink-900">
                When does my day start?
                <p className="meta-text text-[8px] opacity-40">used for state transitions</p>
              </label>
              <input 
                type="number" 
                min="0" max="23"
                value={data.preferences.dayStartHour}
                onChange={(e) => updatePreferences({ dayStartHour: parseInt(e.target.value) })}
                className="w-16 bg-cream-100 border-none rounded-md px-3 py-2 text-center text-xl font-serif outline-none focus:ring-1 focus:ring-sage-500"
              />
            </div>

            <div className="flex justify-between items-center group">
              <label className="font-serif text-lg italic text-ink-900">
                When should Sunday review unlock?
                <p className="meta-text text-[8px] opacity-40">local time on Sundays</p>
              </label>
              <input 
                type="number" 
                min="0" max="23"
                value={data.preferences.sundayReviewHour}
                onChange={(e) => updatePreferences({ sundayReviewHour: parseInt(e.target.value) })}
                className="w-16 bg-cream-100 border-none rounded-md px-3 py-2 text-center text-xl font-serif outline-none focus:ring-1 focus:ring-sage-500"
              />
            </div>

            <div className="flex justify-between items-center group">
              <label className="font-serif text-lg italic text-ink-900">
                Show intention prompt every morning
              </label>
              <input 
                type="checkbox"
                checked={data.preferences.showMorningPrompt}
                onChange={(e) => updatePreferences({ showMorningPrompt: e.target.checked })}
                className="w-6 h-6 rounded accent-sage-500"
              />
            </div>
          </div>
        </section>

        {/* AI Features */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-ink-700">
            <Zap size={20} className="opacity-40" />
            <h2 className="text-2xl italic tracking-tight">Intelligence</h2>
          </div>
          <div className="loom-card p-10 space-y-8">
            <div className="flex justify-between items-center group opacity-50 cursor-not-allowed">
              <label className="font-serif text-lg italic text-ink-900">
                Auto-suggest category when I save a fragment
              </label>
              <div className="text-right">
                 <input type="checkbox" disabled className="w-6 h-6 rounded accent-sage-500" />
                 <p className="meta-text text-[6px] text-ink-400 mt-1">COMING SOON</p>
              </div>
            </div>

            <div className="flex justify-between items-center group opacity-50 cursor-not-allowed">
              <label className="font-serif text-lg italic text-ink-900">
                Generate a weekly noticing on Sundays
              </label>
              <div className="text-right">
                 <input type="checkbox" disabled className="w-6 h-6 rounded accent-sage-500" />
                 <p className="meta-text text-[6px] text-ink-400 mt-1">COMING SOON</p>
              </div>
            </div>

            <p className="text-xs italic text-ink-400 border-t border-cream-200 pt-6">
               "These features are being quietly refined. When active, they will use Gemini to help you notice patterns."
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 text-ink-700">
            <Database size={20} className="opacity-40" />
            <h2 className="text-2xl italic tracking-tight">Data & Categories</h2>
          </div>
          <div className="loom-card p-10 space-y-8">
            <div className="grid grid-cols-2 gap-4">
               <button 
                 onClick={handleExport}
                 className="loom-button-secondary border border-cream-200 py-4 text-center rounded-md"
               >
                 Export everything as JSON
               </button>
               <label className="loom-button-secondary border border-cream-200 py-4 text-center rounded-md cursor-pointer block">
                 Import from JSON
                 <input type="file" className="hidden" accept=".json" onChange={handleImport} />
               </label>
            </div>

            <button 
              onClick={() => { if(confirm('Erase all of your thoughts forever? This cannot be undone.')) clearAllData(); }}
              className="w-full text-red-500/50 hover:text-red-500 text-xs italic transition-all pt-4"
            >
              Clear all data
            </button>
          </div>
        </section>

        <section className="text-center py-20 opacity-20">
           <p className="italic text-sm">"loom is yours. Built quietly."</p>
        </section>
      </div>
    </div>
  );
}
