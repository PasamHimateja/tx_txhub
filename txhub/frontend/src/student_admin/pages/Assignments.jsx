import React from 'react';
import { ClipboardList } from 'lucide-react';

const Assignments = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ClipboardList className="text-indigo-600" />
          Assignments
        </h1>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-lg text-slate-800">Pending Tasks</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <h3 className="font-bold text-slate-800">Assignment {i}</h3>
                <p className="text-sm text-slate-500 mt-1">Due in {i} days</p>
              </div>
              <button className="px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition-colors text-sm">
                Submit Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assignments;
