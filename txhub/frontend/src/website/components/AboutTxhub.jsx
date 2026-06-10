import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Users, Trophy, Target } from 'lucide-react';

const AboutTxhub = () => {
  const stats = [
    { icon: <Users size={24} className="text-blue-600" />, label: 'Active Learners', value: '10K+' },
    { icon: <Trophy size={24} className="text-indigo-600" />, label: 'Courses', value: '50+' },
    { icon: <Target size={24} className="text-blue-500" />, label: 'Success Rate', value: '98%' }
  ];

  const features = [
    'Industry-leading curriculum tailored for modern tech roles.',
    'Expert instructors with real-world experience.',
    'Hands-on projects and practical assignments.',
    'Dedicated career support and placement assistance.'
  ];

  return (
    <section id="about-txhub" className="bg-white py-16 md:py-16 relative overflow-hidden border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Content Left */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em] mb-4">
              About TxHub
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
              Empowering the Next Generation of Tech Leaders.
            </h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              At TxHub, we believe in bridging the gap between ambition and achievement. 
              Our platform offers comprehensive, industry-aligned training programs designed 
              to equip you with the skills needed to thrive in today's competitive tech landscape.
            </p>
            
            <div className="space-y-4 mb-10">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-blue-500 mt-1 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
            
            <button className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-colors">
              Discover Our Vision
            </button>
          </motion.div>

          {/* Visual Right */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Main Visual Card */}
            <div className="bg-slate-50 rounded-[2.5rem] p-8 lg:p-10 border border-slate-200 relative z-10 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      {stat.icon}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1">{stat.value}</h3>
                    <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 bg-blue-600 text-white p-8 rounded-3xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-2xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                 <h4 className="text-xl font-bold mb-2">Join our growing community</h4>
                 <p className="text-blue-100 mb-6">Transform your career path with industry-recognized certifications.</p>
                 <div className="flex -space-x-4">
                    <div className="w-10 h-10 rounded-full border-2 border-blue-600 bg-indigo-200 flex items-center justify-center font-bold text-xs text-indigo-800">AM</div>
                    <div className="w-10 h-10 rounded-full border-2 border-blue-600 bg-pink-200 flex items-center justify-center font-bold text-xs text-pink-800">JR</div>
                    <div className="w-10 h-10 rounded-full border-2 border-blue-600 bg-green-200 flex items-center justify-center font-bold text-xs text-green-800">SK</div>
                    <div className="w-10 h-10 rounded-full border-2 border-blue-600 bg-slate-800 flex items-center justify-center font-bold text-xs text-white">+</div>
                 </div>
              </div>
            </div>
            
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default AboutTxhub;
