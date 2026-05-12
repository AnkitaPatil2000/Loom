import { Search, Timer, Bell, Command, LogIn } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface TopAppBarProps {
  title: string;
}

export default function TopAppBar({ title }: TopAppBarProps) {
  const { user, profile, signIn, signOut } = useUser();

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-var(--spacing-sidebar))] h-20 bg-background/80 border-b border-outline flex justify-between items-center px-16 z-40 backdrop-blur-xl">
      <h2 className="font-display text-4xl font-bold tracking-tight italic text-primary lowercase">{title}.</h2>
      <div className="flex items-center gap-10">
        <div className="relative group">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40 group-focus-within:opacity-100 transition-opacity" size={16} />
          <input
            className="bg-transparent text-sm pl-8 pr-4 py-2 w-48 font-sans transition-all placeholder:opacity-40 outline-none border-b border-transparent focus:border-primary/30"
            placeholder="Search your space..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-8 text-on-surface-variant">
          <button className="p-2 hover:bg-primary/5 rounded-full transition-colors relative group">
            <Timer className="opacity-60 group-hover:opacity-100" size={20} />
          </button>
          <button className="p-2 hover:bg-primary/5 rounded-full transition-colors relative group">
            <Bell className="opacity-60 group-hover:opacity-100" size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-background"></span>
          </button>
          <div className="flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-full font-mono text-[10px] font-bold tracking-tight text-primary transition-all hover:bg-primary/10 cursor-pointer">
            <Command size={12} />
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
            <button 
              onClick={() => signIn()}
              className="flex items-center gap-3 bg-primary text-on-primary px-6 py-2 rounded-full font-sans text-[10px] font-bold tracking-[0.1em] uppercase hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
            >
              <LogIn size={14} />
              <span>Connect</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
