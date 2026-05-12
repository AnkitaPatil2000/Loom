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

export default function Sidebar() {
  return (
    <aside className="fixed h-full w-[var(--spacing-sidebar)] left-0 top-0 border-r border-outline bg-surface flex flex-col pt-12 pb-8 px-6 z-50">
      <div className="mb-16 px-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-4xl font-bold italic text-primary leading-none lowercase tracking-tighter">loom.</h1>
          <p className="font-sans text-[10px] text-on-surface-variant font-medium opacity-60 mt-1">Shape your days gently.</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 py-3 px-4 transition-all duration-500 group relative rounded-lg ${
                isActive
                  ? 'text-primary bg-primary/5'
                  : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} className="transition-transform group-hover:scale-110" />
                <span className={`font-sans text-sm font-medium tracking-tight ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 w-0.5 h-4 bg-primary rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 space-y-6">
        <button className="w-full bg-primary text-on-primary font-sans text-sm font-semibold py-4 rounded-xl hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-2">
          <Plus size={18} />
          New Thought
        </button>

        <div className="pt-6 border-t border-outline space-y-2">
          <button className="text-on-surface-variant flex items-center gap-4 px-4 py-3 hover:text-primary hover:bg-primary/5 rounded-lg transition-all w-full group">
            <Settings size={18} className="group-hover:rotate-90 transition-transform duration-700" />
            <span className="font-sans text-sm font-medium tracking-tight opacity-70 group-hover:opacity-100">Preferences</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
