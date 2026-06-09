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
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-yellow-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
            <h3 className="font-bold text-lg text-slate-800">Chapter {i} Summary</h3>
            <p className="text-slate-600 text-sm mt-3 line-clamp-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
            </p>
            <div className="mt-4 pt-4 border-t border-yellow-200/50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Last edited 2 days ago</span>
              <button className="text-indigo-600 font-semibold text-sm hover:underline">Edit</button>
            </div>
          </div>
        ))}
        
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
