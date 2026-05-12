import { LogIn, Sparkles, ShieldCheck } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { motion } from 'motion/react';

export default function Login() {
  const { signIn } = useUser();

  return (
    <div className="min-h-screen flex items-center justify-center paper-texture bg-surface p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full bg-white/40 backdrop-blur-3xl rounded-[3rem] p-12 shadow-2xl shadow-black/5 border border-outline/10 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0"></div>
        
        <div className="mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Sparkles className="text-primary" size={32} />
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tighter italic text-primary leading-none mb-4">loom.</h1>
          <p className="font-sans text-sm text-on-surface-variant/60 font-medium tracking-tight">Shape your focus, capture your days.</p>
        </div>

        <div className="space-y-6">
          <button 
            onClick={signIn}
            className="w-full flex items-center justify-center gap-4 bg-white text-on-background border border-outline/20 px-8 py-5 rounded-2xl font-sans text-sm font-bold tracking-tight hover:shadow-xl hover:shadow-black/5 hover:border-primary/20 transition-all active:scale-95 group"
          >
            <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                className="w-5 h-5 group-hover:scale-110 transition-transform" 
            />
            <span>Continue with Google</span>
          </button>
          
          <div className="flex items-center justify-center gap-2 py-4">
            <ShieldCheck size={14} className="text-primary opacity-40" />
            <span className="font-sans text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-bold">Secure Authentication</span>
          </div>
        </div>

        <p className="mt-12 font-display text-lg text-on-surface-variant/40 italic">
          "The loom of life is woven with the threads of today's attention."
        </p>

        <div className="mt-12 pt-8 border-t border-outline/5">
            <div className="flex justify-center gap-8 opacity-20 grayscale">
                <span className="font-sans text-[8px] uppercase tracking-[0.3em] font-black">Encrypted</span>
                <span className="font-sans text-[8px] uppercase tracking-[0.3em] font-black">Persistent</span>
                <span className="font-sans text-[8px] uppercase tracking-[0.3em] font-black">Private</span>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
