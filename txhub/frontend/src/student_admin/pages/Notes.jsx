import React from 'react';
import { Notebook, Search } from 'lucide-react';

const Notes = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Notebook className="text-indigo-600" />
          My Notes
        </h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search notes..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        
        <button className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all min-h-[200px]">
          <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-indigo-100 flex items-center justify-center mb-3">
            <span className="text-2xl font-light">+</span>
          </div>
          <span className="font-semibold">Create New Note</span>
        </button>
      </div>
    </div>
  );
};

export default Notes;
