//binance sticker
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, CheckCircle2 } from 'lucide-react';

const BinanceSticker = () => {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const binanceID = "868302111";

  const handleCopy = () => {
    navigator.clipboard.writeText(binanceID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* 🚀 MAIN FLOATING STICKER */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowQR(true)}
        className="fixed bottom-8 right-8 z-[998] group cursor-pointer"
      >
        {/* Subtle glow remains for depth, but doesn't interfere with logo */}
        <div className="absolute -inset-1 bg-yellow-500 rounded-[2rem] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
        
        <div className="relative flex items-center gap-4 bg-black/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-[2rem] shadow-2xl">
          {/* Logo Container: Background removed, padding removed */}
          <div className="relative w-10 h-10 flex items-center justify-center transition-transform group-hover:rotate-[360deg] duration-700">
            <img 
              src="/src/assets/binance-logo-free-download-free-vector.jpg" 
              alt="Binance" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase text-yellow-500 tracking-[0.2em] leading-none mb-1">Pay with</span>
            <span className="text-lg font-black text-white tracking-tighter uppercase italic">Binance</span>
          </div>
        </div>
      </motion.div>

      {/* 🎭 PREMIUM QR MODAL */}
      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowQR(false)} 
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="relative w-full max-w-sm bg-[#121212] border border-white/10 rounded-[3rem] p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-yellow-400" />
              
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Secure Payment</span>
                </div>
                <button onClick={() => setShowQR(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} className="text-white" />
                </button>
              </div>

              <div className="text-center">
                <div className="flex flex-col items-center mb-6">
                    {/* Modal Logo: Background removed */}
                    <img 
                      src="/src/assets/binance-logo-free-download-free-vector.jpg" 
                      alt="Binance Logo" 
                      className="w-16 h-16 mb-2 object-contain" 
                    />
                    <h4 className="text-2xl font-black text-white uppercase italic">Binance <span className="text-yellow-400">Merchant</span></h4>
                </div>
                
                <div className="relative mx-auto w-56 h-56 bg-white p-4 rounded-[2rem] shadow-[0_0_40px_rgba(250,204,21,0.2)] flex items-center justify-center">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${binanceID}`} 
                    alt="Binance QR" 
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 border-4 border-yellow-400/20 rounded-[2rem] pointer-events-none" />
                </div>

                <div className="mt-8 bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between group">
                  <div className="text-left">
                    <p className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest">Binance ID</p>
                    <p className="text-xl font-black text-white tracking-widest">{binanceID}</p>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className={`p-3 rounded-xl transition-all ${copied ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black hover:scale-110'}`}
                  >
                    {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                  </button>
                </div>

                <p className="mt-6 text-[10px] text-white/40 font-medium leading-relaxed uppercase tracking-tighter">
                  Scan the QR code or copy the ID to make <br /> a payment via Binance App.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BinanceSticker;