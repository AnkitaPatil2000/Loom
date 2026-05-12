import { Calculator, Zap, Star, TrendingUp, ChevronRight, Info, Search, Sprout, Flower2, TreeDeciduous, Leaf, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const growthStats = [
  { subject: 'Technical', A: 120, fullMark: 150 },
  { subject: 'Creative', A: 98, fullMark: 150 },
  { subject: 'Operational', A: 86, fullMark: 150 },
  { subject: 'Strategic', A: 130, fullMark: 150 },
  { subject: 'Human', A: 70, fullMark: 150 },
  { subject: 'Wellness', A: 65, fullMark: 150 },
];

const gardenAreas = [
  { id: 1, name: 'System Architecture', level: 12, growth: 85, category: 'Technical', stage: 'Full Bloom', lastTended: '2 hours ago', icon: TreeDeciduous },
  { id: 2, name: 'Typography & Layout', level: 9, growth: 42, category: 'Creative', stage: 'Budding', lastTended: 'Yesterday', icon: Flower2 },
  { id: 3, name: 'Project Management', level: 7, growth: 91, category: 'Operational', stage: 'Sprouting', lastTended: '3 days ago', icon: Sprout },
  { id: 4, name: 'Data Analysis', level: 11, growth: 25, category: 'Technical', stage: 'Rooted', lastTended: '1 week ago', icon: Leaf },
  { id: 5, name: 'Public Speaking', level: 4, growth: 68, category: 'Human', stage: 'Seedling', lastTended: 'Never', icon: Sprout },
  { id: 6, name: 'Interface Design', level: 14, growth: 95, category: 'Creative', stage: 'Full Bloom', lastTended: 'Yesterday', icon: Flower2 },
];

const stageStyles = {
  'Full Bloom': 'text-primary border-primary bg-primary/5',
  'Budding': 'text-secondary border-secondary/20 bg-secondary/5',
  'Rooted': 'text-on-surface-variant border-outline bg-surface-dim',
  'Sprouting': 'text-on-surface-variant border-outline bg-surface-dim opacity-70',
  'Seedling': 'text-on-surface-variant border-outline bg-surface-dim opacity-50',
};

export default function Growth() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-16 max-w-7xl mx-auto space-y-24"
    >
      {/* Header section with growth index */}
      <div className="flex justify-between items-end mb-12">
        <div className="space-y-4">
          <p className="font-sans text-[10px] text-primary uppercase font-bold tracking-[0.3em] opacity-60">The Soul's Garden / Season 42</p>
          <h3 className="font-display text-7xl font-bold tracking-tight italic">Watch your growth.</h3>
        </div>
        <div className="flex items-center gap-12 bg-surface-container-low rounded-[2rem] px-12 py-8 border border-outline/20">
          <div className="text-right">
            <span className="font-sans text-[10px] uppercase text-on-surface-variant tracking-widest font-bold opacity-40">Nurture Level</span>
            <p className="font-display text-4xl font-bold italic text-primary">42.</p>
          </div>
          <div className="w-[1px] h-12 bg-outline/20"></div>
          <div className="text-right">
             <span className="font-sans text-[10px] uppercase text-on-surface-variant tracking-widest font-bold opacity-40">Growth Energy</span>
             <p className="font-display text-4xl font-bold italic text-primary">124.5k</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Radar Chart Summary */}
        <div className="col-span-12 lg:col-span-5 bg-surface-container-high rounded-[2rem] border border-outline/20 p-12 flex flex-col justify-between min-h-[580px] group transition-all duration-700 hover:shadow-xl hover:shadow-primary/5">
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-start mb-8">
               <div className="space-y-1">
                  <h4 className="font-display text-2xl font-bold italic">Vibrational Balance.</h4>
                  <p className="font-display text-sm italic opacity-60">Visualizing the harmony of your intentions.</p>
               </div>
               <Sun size={24} className="text-primary opacity-20 group-hover:rotate-90 transition-transform duration-1000" />
            </div>
            
            <div className="flex-1 w-full min-h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={growthStats}>
                  <PolarGrid stroke="rgba(111, 130, 106, 0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontFamily: 'Inter', fontWeight: 600, fill: '#6b6357', opacity: 0.5 }} />
                  <Radar
                    name="Growth"
                    dataKey="A"
                    stroke="#6F826A"
                    fill="#6F826A"
                    fillOpacity={0.1}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="pt-8 border-t border-outline/20">
            <p className="font-display text-lg italic text-on-surface-variant leading-relaxed opacity-60">
               Your <span className="text-primary font-bold">Technical</span> essence is flourishing beautifully. Perhaps some <span className="text-secondary font-bold">Human</span> connection would bring balance to your garden this week?
            </p>
          </div>
        </div>

        {/* Skill Cards Grid */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-10">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary opacity-30 group-focus-within:opacity-100 transition-opacity" size={18} />
            <input 
              type="text" 
              placeholder="Search your garden..." 
              className="w-full bg-white rounded-2xl py-6 pl-16 pr-6 text-sm font-sans font-medium placeholder:italic border border-outline/10 focus:border-primary/30 outline-none transition-all shadow-sm focus:shadow-lg focus:shadow-primary/5"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {gardenAreas.map((area) => (
              <div key={area.id} className="bg-white rounded-[2rem] border border-outline/10 p-10 hover:shadow-xl hover:shadow-primary/5 transition-all group cursor-pointer relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-[0.03] group-hover:opacity-[0.07] transition-all pointer-events-none group-hover:scale-110 duration-700">
                  <area.icon size={120} />
                </div>
                
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-2">
                    <span className="font-sans text-[10px] uppercase font-bold text-primary tracking-widest opacity-40">{area.category}</span>
                    <h5 className="font-display text-2xl font-bold italic group-hover:text-primary transition-colors">{area.name}</h5>
                  </div>
                  <div className="font-display text-2xl font-bold italic text-primary">v.{area.level}</div>
                </div>

                <div className="space-y-6">
                  <div className="h-1.5 w-full bg-surface-dim rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-[2000ms]" 
                      style={{ width: `${area.growth}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`font-sans text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border ${(stageStyles as any)[area.stage]}`}>
                      {area.stage}
                    </span>
                    <span className="font-sans text-[10px] italic text-on-surface-variant opacity-40">Tended {area.lastTended}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="bg-surface-container rounded-2xl p-8 text-on-surface-variant font-sans text-xs font-bold uppercase tracking-[0.3em] border-2 border-dashed border-outline/20 hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center gap-6 opacity-60 hover:opacity-100 group">
            <PlusIcon size={18} className="group-hover:rotate-90 transition-transform duration-500" /> Plant New Intentions
          </button>
        </div>
      </div>

      {/* Chronicle of Growth */}
      <section className="bg-surface-container rounded-[3rem] p-16 relative overflow-hidden border border-outline/10">
        <div className="absolute -bottom-12 right-0 p-12 opacity-[0.03]">
            <TrendingUp size={300} />
        </div>
        
        <div className="flex items-center gap-6 mb-16 relative z-10">
           <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Star size={24} className="text-secondary" fill="currentColor" />
           </div>
           <h4 className="font-display text-4xl font-bold italic">Chronicle of Growth.</h4>
        </div>

        <div className="space-y-0 relative z-10">
            {[
                { date: 'JUN 15', action: 'Level Up', detail: 'Technical: System Architecture reached Level 12', icon: Zap },
                { date: 'JUN 02', action: 'Achievement', detail: 'Creative: 30-Day streak of intentional journaling', icon: Star },
                { date: 'MAY 20', action: 'Unlock', detail: 'Operational: Project Management archetype discovered', icon: Sprout },
            ].map((milestone, i) => (
                <div key={i} className="flex gap-16 py-12 border-b border-outline/20 items-center last:border-b-0 hover:bg-white/50 transition-all cursor-pointer group px-8 -mx-8 rounded-2xl">
                    <span className="font-mono text-xs text-primary font-black tracking-widest w-24 shrink-0">{milestone.date}</span>
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-outline/10 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500 group-hover:scale-110">
                        <milestone.icon size={18} />
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="font-sans text-[10px] uppercase font-bold tracking-[0.2em] opacity-40 group-hover:text-primary transition-colors">{milestone.action}</p>
                        <p className="font-display text-2xl font-bold italic tracking-tight">{milestone.detail}</p>
                    </div>
                    <ChevronRight size={24} className="text-outline/40 group-hover:text-primary group-hover:translate-x-3 transition-all duration-500" />
                </div>
            ))}
        </div>
      </section>
    </motion.div>
  );
}

function PlusIcon({ size, className }: { size?: number, className?: string }) {
    return (
        <svg 
            width={size || 24} 
            height={size || 24} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    )
}
