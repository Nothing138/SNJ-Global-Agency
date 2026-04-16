import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../pages/User-Side/Hero';
import ServiceArea from '../pages/User-Side/ServiceArea';
import WorkFlow from '../pages/User-Side/WorkFlow';
import BinanceSticker from '../pages/User-Side/BinanceSticker';
import Feature from '../pages/User-Side/Features';
import FloatingButton from '../pages/User-Side/FloatingButton';
import FAQ from '../pages/User-Side/FAQ';
import Blog from '../pages/User-Side/Blog';
import InfoSection from '../pages/User-Side/InfoSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors duration-500"> 
      
      {/* ১. হিরো সেকশন */}
      <Hero /> 

      {/* ২. সার্ভিস এরিয়া (Hero এর ঠিক নিচে) */}
      <ServiceArea />

      {/* ৩. ওয়ার্ক ফ্লো (ServiceArea এর নিচে) */}
      <WorkFlow />

      {/* বাকি কম্পোনেন্টগুলো */}
      <FloatingButton />
      <BinanceSticker />
      <InfoSection />
      <Feature />
      <FAQ />
      <Blog />
      
    </div>
  )
}

export default Home;