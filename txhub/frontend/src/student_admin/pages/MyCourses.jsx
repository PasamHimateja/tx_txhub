import React from 'react';
import { BookOpen } from 'lucide-react';

const MyCourses = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="text-indigo-600" />
          My Courses
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder Course Cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="h-40 bg-indigo-50 rounded-xl mb-4 flex items-center justify-center">
              <BookOpen size={40} className="text-indigo-200" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">Course Title {i}</h3>
            <p className="text-slate-500 text-sm mt-2">Continue learning from where you left off.</p>
            <div className="mt-4">
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${i * 20 + 20}%` }}></div>
              </div>
              <p className="text-xs text-right text-slate-400 mt-1">{i * 20 + 20}% Complete</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
