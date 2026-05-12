import { NavLink } from 'react-router-dom';
import { Settings, Plus, BookOpen, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  onReflect: () => void;
}

export default function Sidebar({ onReflect }: SidebarProps) {
  const navItems = [
    { path: '/', label: 'today', icon: Clock },
    { path: '/library', label: 'library', icon: BookOpen },
  ];

  return (
    <aside className="fixed h-full w-[var(--spacing-sidebar)] left-0 top-0 bg-cream-100 flex flex-col pt-16 pb-12 px-8 z-50 border-r border-cream-200/50">
      <div className="mb-20 px-2">
        <div className="flex flex-col">
          <h1 className="font-serif text-5xl font-bold italic text-ink-900 leading-none lowercase tracking-tighter">loom.</h1>
          <p className="meta-text mt-3">A QUIET NOTEBOOK</p>
        </div>
      </div>

      <nav className="flex-1 space-y-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 py-2 px-2 transition-all group relative ${
                isActive
                  ? 'text-ink-900'
                  : 'text-ink-400 hover:text-ink-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`font-serif text-2xl italic ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-[-2rem] w-1 h-1 bg-sage-500 rounded-full"
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
          className="w-full loom-button flex items-center justify-center gap-3 py-4"
        >
          <Plus size={16} />
          + capture
        </button>

        <div className="pt-8 border-t border-ink-400/10">
          <NavLink
            to="/preferences"
            className={({ isActive }) =>
              `flex items-center gap-4 py-2 px-2 transition-all group relative ${
                isActive ? 'text-ink-900' : 'text-ink-400 hover:text-ink-700'
              }`
            }
          >
            <Settings size={16} className="opacity-40 group-hover:opacity-100" />
            <span className="font-serif text-xl italic opacity-60 group-hover:opacity-100">preferences</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
