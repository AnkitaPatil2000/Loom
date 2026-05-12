import { Search, Timer, Bell, Command, LogIn } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface TopAppBarProps {
  title: string;
}

export default function TopAppBar({ title }: TopAppBarProps) {
  const { user, signIn, signOut } = useUser();

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
            <button 
              onClick={() => signOut()}
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-outline hover:ring-2 hover:ring-primary/20 transition-all"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-xs font-bold text-primary">{user.displayName?.[0] || user.email?.[0]}</span>
              )}
            </button>
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
