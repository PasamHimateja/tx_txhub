import React from 'react';
import { Award } from 'lucide-react';

const SampleCertificates = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Award className="text-indigo-600" />
          Sample Certificates
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-4">
              <Award size={40} className="text-amber-500" />
            </div>
            <h3 className="font-bold text-xl text-slate-800">Certificate of Completion {i}</h3>
            <p className="text-slate-500 mt-2">Awarded for successfully finishing the course.</p>
            <button className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              View Certificate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SampleCertificates;
