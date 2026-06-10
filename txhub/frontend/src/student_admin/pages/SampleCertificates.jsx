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
        <div className="col-span-1 md:col-span-2 bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-sm">
          <Award size={48} className="text-slate-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">No Certificates Yet</h2>
          <p className="text-slate-500">Complete courses to earn your certificates.</p>
        </div>
      </div>
    </div>
  );
};

export default SampleCertificates;
