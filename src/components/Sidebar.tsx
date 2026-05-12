import { LayoutDashboard, BookOpen, Calculator, Calendar, Inbox, Moon, Film, Music, Settings, RefreshCcw, Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';

const navItems = [
  { icon: LayoutDashboard, label: 'Home', path: '/' },
  { icon: BookOpen, label: 'Focus', path: '/focus' },
  { icon: Calculator, label: 'Growth', path: '/skills' },
  { icon: Calendar, label: 'Intentions', path: '/planning' },
  { icon: Inbox, label: 'Library', path: '/notes' },
  { icon: Moon, label: 'Journal', path: '/reflection' },
  { icon: Film, label: 'Cinema', path: '/cinema' },
  { icon: Music, label: 'Sound', path: '/sound' },
];

interface SidebarProps {
  onReflect: () => void;
}

export default function Sidebar({ onReflect }: SidebarProps) {
  return (
    <aside className="fixed h-full w-[var(--spacing-sidebar)] left-0 top-0 border-r border-outline bg-surface flex flex-col pt-16 pb-12 px-8 z-50">
      <div className="mb-20 px-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-5xl font-bold italic text-primary leading-none lowercase tracking-tighter">loom.</h1>
          <p className="font-sans text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em] opacity-40 mt-3">Visual OS</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-5 py-4 px-5 transition-all duration-500 group relative rounded-2xl ${
                isActive
                  ? 'text-primary bg-primary/5'
                  : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} strokeWidth={isActive ? 2 : 1.2} className="transition-transform group-hover:scale-110" />
                <span className={`font-sans text-[13px] font-semibold tracking-tight ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-12 space-y-8">
        <button 
          onClick={onReflect}
          className="w-full bg-primary text-on-primary font-sans text-[11px] font-bold uppercase tracking-[0.15em] py-5 rounded-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <Plus size={18} />
          Reflect
        </button>

        <div className="pt-8 border-t border-outline/10 space-y-4">
          <button className="text-on-surface-variant flex items-center gap-5 px-5 py-4 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all w-full group">
            <Settings size={18} strokeWidth={1.2} className="group-hover:rotate-90 transition-transform duration-700" />
            <span className="font-sans text-[13px] font-semibold tracking-tight opacity-60 group-hover:opacity-100">Preferences</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
