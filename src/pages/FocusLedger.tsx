import { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, Square, History, Filter, Download, Wind, Coffee, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useUser } from '../context/UserContext';
import { subscribeToCollection, logFocusSession } from '../services/firebaseService';

interface Session {
  id: string;
  initiative: string;
  category: string;
  durationSeconds: number;
  startTime: any;
  quality: string;
}

const focusData = [
  { day: 'Mon', hours: 5.2 },
  { day: 'Tue', hours: 4.8 },
  { day: 'Wed', hours: 6.5 },
  { day: 'Thu', hours: 5.9 },
  { day: 'Fri', hours: 7.2 },
  { day: 'Sat', hours: 3.1 },
  { day: 'Sun', hours: 2.4 },
];

export default function Flow() {
  const { user } = useUser();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [initiative, setInitiative] = useState('');
  const [category, setCategory] = useState('Deep Work');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToCollection('focus_sessions', (data) => {
        setSessions(data as Session[]);
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (isActive) {
        if (!startTimeRef.current) startTimeRef.current = new Date();
        timerRef.current = setInterval(() => {
            setTime(prev => prev + 1);
        }, 1000);
    } else {
        if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleStop = async () => {
    if (time < 60) {
        if (!confirm('Session is very short. Record anyway?')) {
            setIsActive(false);
            setTime(0);
            startTimeRef.current = null;
            return;
        }
    }

    await logFocusSession({
      initiative: initiative || 'Unnamed Flow',
      category: category,
      durationSeconds: time,
      startTime: startTimeRef.current || new Date(),
      quality: time > 3600 ? 'Sustained' : 'Focused'
    });

    setIsActive(false);
    setTime(0);
    setInitiative('');
    startTimeRef.current = null;
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs.toString().padStart(2, '0') + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-16 max-w-7xl mx-auto space-y-24"
    >
      {/* Current State Section */}
      <section className="space-y-12">
        <div className="flex justify-between items-baseline">
           <div className="space-y-4">
              <h3 className="font-display text-6xl font-bold italic tracking-tight">Your current flow.</h3>
              <p className="font-display text-xl text-on-surface-variant italic opacity-60">Today's focus is shaping into something meaningful.</p>
           </div>
           <div className="flex items-center gap-2 px-6 py-2 bg-primary/10 text-primary rounded-full font-sans text-xs font-bold uppercase tracking-widest">
              <Zap size={14} className={isActive ? 'animate-pulse' : ''} /> {isActive ? 'In Deep Flow' : 'At Rest'}
           </div>
        </div>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-5 bg-white rounded-[2rem] p-12 flex flex-col justify-center items-center relative group border border-outline/10 shadow-sm transition-all hover:shadow-xl hover:shadow-primary/5 h-[480px]">
            <div className="absolute top-12 left-12 opacity-10 group-hover:rotate-45 transition-transform duration-1000">
               <Timer size={48} strokeWidth={1} />
            </div>
            
            <div className="text-center space-y-4 mb-12">
               <span className="font-display text-9xl font-bold tracking-tighter text-on-background tabular-nums">
                 {formatTime(time)}
               </span>
               <p className="font-sans text-sm font-semibold text-on-surface-variant opacity-60 tracking-widest uppercase">Minutes of uninterrupted thought</p>
            </div>

            <div className="flex gap-6 relative z-10">
              <button 
                onClick={handleStartPause}
                className="flex items-center justify-center w-20 h-20 rounded-full bg-surface-dim text-on-surface hover:bg-outline/20 transition-all active:scale-95"
              >
                {isActive ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
              </button>
              {(isActive || time > 0) && (
                <button 
                    onClick={handleStop}
                    className="flex items-center justify-center w-20 h-20 rounded-full bg-primary text-on-primary hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
                >
                    <Square size={24} fill="currentColor" />
                </button>
              )}
            </div>

            <div className="mt-12 text-center w-full max-w-xs space-y-4">
               <input 
                 value={initiative}
                 onChange={(e) => setInitiative(e.target.value)}
                 className="w-full bg-transparent border-none font-display text-lg italic text-on-surface-variant text-center outline-none placeholder:opacity-40"
                 placeholder="What are you tending to?"
               />
               <select 
                 value={category}
                 onChange={(e) => setCategory(e.target.value)}
                 className="bg-surface-dim border border-outline/10 rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-primary outline-none"
               >
                 <option>Deep Work</option>
                 <option>Creative</option>
                 <option>Reflection</option>
                 <option>Thinking</option>
                 <option>Execution</option>
               </select>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 bg-surface-container-high rounded-[2rem] p-12 flex flex-col justify-between border border-outline/20 overflow-hidden h-[480px]">
            <div className="space-y-2">
               <span className="font-sans text-[10px] font-black text-primary tracking-[0.3em] uppercase opacity-60">Focus Distribution</span>
               <h5 className="font-display text-xl font-bold italic">The week's energy.</h5>
            </div>
            
            <div className="flex-1 w-full mt-10">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={focusData}>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontFamily: 'Inter', fontWeight: 600, fill: '#6b6357', opacity: 0.5 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(111, 130, 106, 0.05)' }}
                      contentStyle={{ 
                        backgroundColor: '#F6F2EA', 
                        border: '1px solid #D9C7B8',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#2B2B2B'
                      }}
                    />
                    <Bar dataKey="hours" radius={[12, 12, 12, 12]} barSize={40}>
                      {focusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.hours > 6 ? '#6F826A' : '#D9C7B8'} fillOpacity={entry.hours > 6 ? 1 : 0.4} />
                      ))}
                    </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>

            <div className="pt-8 border-t border-outline/30 flex justify-between items-end">
               <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant opacity-40">Your Pace</span>
                  <p className="font-display text-2xl font-bold tracking-tight">Sustained & Steady.</p>
               </div>
               <div className="flex flex-col items-end gap-2">
                  <span className="font-mono text-[10px] font-bold text-primary">32.4 TOTAL HOURS</span>
                  <div className="w-32 h-1.5 bg-white rounded-full overflow-hidden">
                     <div className="h-full bg-primary/40 w-4/5"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Table */}
      <section className="space-y-10">
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-4">
            <History size={24} className="text-secondary" />
            <h4 className="font-display text-4xl font-bold italic">The Timeline.</h4>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-3 px-6 py-2 rounded-full border border-outline hover:bg-surface-dim transition-all font-sans text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              <Filter size={14} /> Filter
            </button>
            <button className="flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all font-sans text-[10px] font-bold uppercase tracking-widest">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-outline/20 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline/20">
                  <th className="p-8 font-sans text-[10px] uppercase text-on-surface-variant opacity-40 tracking-[0.2em] font-black">When</th>
                  <th className="p-8 font-sans text-[10px] uppercase text-on-surface-variant opacity-40 tracking-[0.2em] font-black">Initiative</th>
                  <th className="p-8 font-sans text-[10px] uppercase text-on-surface-variant opacity-40 tracking-[0.2em] font-black text-center">Span</th>
                  <th className="p-8 font-sans text-[10px] uppercase text-on-surface-variant opacity-40 tracking-[0.2em] font-black text-right">Feeling</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/10">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-primary/[0.02] transition-colors group cursor-pointer">
                    <td className="p-8 font-mono text-xs text-on-surface-variant opacity-40 group-hover:opacity-100 transition-opacity italic">
                        {session.startTime?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Now'}
                    </td>
                    <td className="p-8">
                      <div className="space-y-1">
                        <div className="font-display text-xl font-bold text-on-background group-hover:text-primary transition-colors italic">{session.initiative}</div>
                        <div className="font-sans text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">{session.category}</div>
                      </div>
                    </td>
                    <td className="p-8 text-center">
                       <div className="font-display text-xl font-bold text-primary">{formatDuration(session.durationSeconds)}</div>
                    </td>
                    <td className="p-8 text-right">
                       <span className={`font-display text-lg font-bold italic ${session.quality === 'Peak' ? 'text-secondary' : 'text-primary'}`}>
                          {session.quality}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sessions.length === 0 && (
            <div className="p-24 text-center space-y-4 opacity-40">
                <Wind size={48} className="mx-auto text-primary opacity-20" />
                <p className="font-display text-xl italic">The silence of focus. No sessions recorded yet.</p>
            </div>
          )}
          <button className="w-full p-8 font-sans text-[10px] uppercase font-bold tracking-[0.3em] text-on-surface-variant/40 hover:text-primary transition-colors bg-surface-dim">
            View more of your story
          </button>
        </div>
      </section>

      {/* Footer thoughts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         <div className="bg-surface-container rounded-[2rem] p-12 border border-outline/10 group cursor-pointer hover:shadow-xl hover:shadow-primary/5 transition-all">
            <div className="space-y-6">
               <Coffee size={32} className="text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
               <p className="font-display text-2xl italic leading-tight text-on-surface-variant group-hover:text-on-background transition-colors">
                  Energy is finite. Today, I prioritized quality over quantity and the results are felt in the clarity of the work.
               </p>
               <div className="flex justify-between items-center font-sans text-xs font-bold text-primary italic pt-8 border-t border-outline/20 opacity-40 group-hover:opacity-100 transition-opacity">
                  <span>Reflection / 2:45 PM</span>
               </div>
            </div>
         </div>
         <div className="border-2 border-dashed border-outline/20 rounded-[2rem] p-12 flex flex-col justify-center items-center group cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all space-y-6">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-all duration-500">
               <Wind size={24} className="text-on-surface-variant group-hover:text-primary" />
            </div>
            <p className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-on-surface-variant text-center transition-all group-hover:text-primary">Record a silent thought</p>
         </div>
      </div>
    </motion.div>
  );
}
