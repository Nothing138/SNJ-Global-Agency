import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingContact = () => {
  return (
    <div className="fixed bottom-29 right-8 flex flex-col gap-4 z-[999]">
      {/* WhatsApp Button Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 1 // পেজ লোড হওয়ার ১ সেকেন্ড পর আসবে
        }}
      >
        <motion.a
          href="https://wa.me/8801348992268" // এখানে আপনার নাম্বার দিন
          target="_blank"
          rel="noopener noreferrer"
          className="relative group flex items-center justify-center bg-[#25D366] p-4 rounded-full text-white shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_35px_rgba(37,211,102,0.5)] transition-shadow duration-300"
          
          // ফ্লোটিং অ্যানিমেশন (সব সময় হালকা নড়বে)
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Pulse Effect (পেছনের সাদা রিং) */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-40"></span>
          
          {/* Main Icon */}
          <MessageCircle size={28} className="relative z-10" strokeWidth={2.5} />

          {/* Tooltip (Hover করলে লেখা আসবে) */}
          <span className="absolute right-16 bg-white dark:bg-zinc-900 text-[#0B1F3A] dark:text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl border border-slate-100 dark:border-zinc-800 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap pointer-events-none uppercase tracking-widest">
            Chat with us
          </span>
        </motion.a>
      </motion.div>
    </div>
  );
};

export default FloatingContact;