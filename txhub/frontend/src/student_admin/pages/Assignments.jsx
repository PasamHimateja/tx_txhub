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
        <div className="p-10 text-center text-slate-500 border-t border-slate-100">
          <ClipboardList size={48} className="text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">No Pending Tasks</h3>
          <p>You have no pending assignments at the moment.</p>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
