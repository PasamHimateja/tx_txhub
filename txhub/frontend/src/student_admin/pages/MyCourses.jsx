import React, { useState, useEffect, useContext } from 'react';
import { BookOpen } from 'lucide-react';
import { AuthContext } from '../../website/context/AuthContext';

const MyCourses = () => {
  const { user } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/enrollments/?email=${user.email}`);
        const data = await res.json();
        if (res.ok) {
          setEnrollments(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="text-indigo-600" />
          My Courses
        </h1>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-sm">
          <BookOpen size={48} className="text-slate-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">No Courses Found</h2>
          <p className="text-slate-500">You haven't enrolled in any courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((course, idx) => {
            const isFullyPaid = course.payment_status?.toLowerCase() === 'completed';
            
            return (
              <div key={course.id || idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="h-40 bg-indigo-50 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden shrink-0">
                  <BookOpen size={40} className="text-indigo-200" />
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    isFullyPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {course.payment_status}
                  </div>
                </div>
                
                <h3 className="font-bold text-lg text-slate-800 line-clamp-2 mb-2 flex-1">{course.title}</h3>
                
                <div className="mt-auto space-y-3">
                  <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                    <span>Batch: {course.batch_date}</span>
                    <span className="font-bold text-indigo-600">ID: #{String(course.id).padStart(4, '0')}</span>
                  </div>
                  
                  <div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" style={{ width: `5%` }}></div>
                    </div>
                    <p className="text-xs text-right text-slate-400 mt-1">In Progress</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
