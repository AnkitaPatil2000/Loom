import { useState, useEffect } from 'react';
import { Search, Timer, Bell, Command, LogIn, Activity, CheckCircle, Star } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'motion/react';

interface TopAppBarProps {
  title: string;
}

export default function TopAppBar({ title }: TopAppBarProps) {
  const { user, profile, signIn, signOut } = useUser();
  const [time, setTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const notifications = [
    { id: 1, text: 'Morning meditation session logged', type: 'activity', time: '2m ago', icon: Activity },
    { id: 2, text: 'New skill reached level 2: Focus', type: 'growth', time: '1h ago', icon: Star },
    { id: 3, text: 'Daily intention completed', type: 'task', time: '4h ago', icon: CheckCircle },
  ];

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-var(--spacing-sidebar))] h-24 bg-background/80 border-b border-outline/5 flex justify-between items-center px-16 z-40 backdrop-blur-xl">
      <div className="flex flex-col">
        <h2 className="font-display text-4xl font-bold tracking-tight italic text-primary lowercase leading-none">{title}.</h2>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-black opacity-30 mt-2">Active Interface</span>
      </div>

      <div className="flex items-center gap-12">
        <div className="flex items-center gap-3 bg-surface-container/50 px-6 py-3 rounded-2xl border border-outline/5 font-mono text-xs font-black tracking-widest text-on-surface opacity-60">
           <Timer size={14} className="text-primary" />
           <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>

        <div className="flex items-center gap-8 text-on-surface-variant">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 hover:bg-primary/5 rounded-2xl transition-all relative group"
            >
              <Bell className={`opacity-60 group-hover:opacity-100 transition-all ${showNotifications ? 'text-primary opacity-100' : ''}`} size={22} strokeWidth={1.5} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-background shadow-pulse"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-6 w-80 bg-white rounded-[2.5rem] border border-outline/10 shadow-2xl z-50 p-6 overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-6 px-2">
                    <span className="font-display text-lg font-bold italic">Updates.</span>
                    <span className="font-sans text-[8px] font-black uppercase tracking-widest opacity-30">Loom Signal</span>
                  </div>
                  <div className="space-y-4">
                    {notifications.map((n) => (
                      <div key={n.id} className="flex gap-4 p-4 hover:bg-on-surface/5 rounded-3xl transition-all group">
                        <div className="w-10 h-10 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                          <n.icon size={16} />
                        </div>
                        <div className="space-y-1">
                          <p className="font-sans text-xs font-semibold leading-snug">{n.text}</p>
                          <p className="font-sans text-[9px] opacity-40 uppercase tracking-widest font-black">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-4 font-sans text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 rounded-2xl transition-all">
                    View Archive
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 bg-primary/5 px-5 py-3 rounded-2xl font-mono text-[11px] font-black tracking-[0.1em] text-primary transition-all hover:bg-primary/10 cursor-pointer border border-primary/5 shadow-sm">
            <Command size={14} />
            <span>K</span>
          </div>
          
          {user ? (
            <div className="relative group/auth">
              <button 
                className="flex items-center gap-4 bg-primary/5 pl-4 pr-1.5 py-1.5 rounded-full border border-outline/10 hover:bg-primary/10 transition-all cursor-default"
              >
                <div className="flex flex-col items-end">
                  <span className="font-sans text-[10px] font-bold text-on-surface leading-tight tracking-tight">{user.displayName || 'Architect'}</span>
                  <span className="font-sans text-[8px] text-on-surface-variant/60 leading-tight uppercase tracking-widest">{profile?.role || 'Loom Resident'}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-outline/20">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-display text-xs font-bold text-primary">{user.displayName?.[0] || user.email?.[0]}</span>
                  )}
                </div>
              </button>
              
              <div className="absolute top-full right-0 mt-4 w-64 bg-white/80 backdrop-blur-3xl rounded-3xl border border-outline/10 shadow-2xl shadow-black/10 opacity-0 invisible group-hover/auth:opacity-100 group-hover/auth:visible translate-y-2 group-hover/auth:translate-y-0 transition-all duration-300 z-50 p-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/40"></div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border border-outline/10">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-display text-lg font-bold text-primary">{user.displayName?.[0] || user.email?.[0]}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-sm font-bold text-on-background line-clamp-1">{user.displayName}</span>
                    <span className="font-sans text-[10px] text-on-surface-variant/60 truncate max-w-[140px]">{user.email}</span>
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                   <div className="flex justify-between font-sans text-[10px] uppercase tracking-widest text-on-surface-variant/40 mb-2 font-black">Account Statistics</div>
                   <div className="flex justify-between items-center py-2">
                      <span className="font-sans text-xs text-on-surface-variant">Loom Sync</span>
                      <span className="font-mono text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Active</span>
                   </div>
                   <div className="flex justify-between items-center py-2">
                      <span className="font-sans text-xs text-on-surface-variant">Session</span>
                      <span className="font-mono text-[10px] opacity-40 font-bold uppercase tracking-tighter">Persistent</span>
                   </div>
                </div>

                <button 
                  onClick={() => signOut()}
                  className="w-full flex items-center justify-center gap-3 bg-error/5 text-error hover:bg-error hover:text-white px-4 py-3 rounded-2xl font-sans text-[10px] font-bold tracking-[0.1em] uppercase transition-all"
                >
                  Terminate Session
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <span className="font-sans text-[10px] text-on-surface-variant/40 italic font-medium hidden md:block">
                Sign in to sync your workspace.
              </span>
              <button 
                onClick={() => signIn()}
                className="flex items-center gap-3 bg-white text-on-background border border-outline/20 px-6 py-2.5 rounded-full font-sans text-[10px] font-bold tracking-tight hover:shadow-xl hover:shadow-black/5 hover:border-primary/20 transition-all active:scale-95 group"
              >
                <img 
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    alt="Google" 
                    className="w-4 h-4 group-hover:scale-110 transition-transform" 
                />
                <span>Continue with Google</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
