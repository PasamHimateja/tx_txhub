import React, { useState, useEffect, useContext } from 'react';
import { BookOpen, AlertCircle, ShoppingCart, Search, ArrowRight } from 'lucide-react';
import { AuthContext } from '../../website/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/enrollments/?email=${user.email}`);
        const data = await response.json();
        
        if (response.ok) {
          setEnrollments(data.data || []);
        } else {
          setError(data.error || "Failed to fetch courses");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Something went wrong while loading your courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
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

      {error && (
        <div className="p-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {!error && enrollments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
          <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No Courses Yet</h3>
          <p className="text-slate-500 mt-2 mb-6">You haven't enrolled in any courses yet. Explore our catalog to get started!</p>
          <button
            onClick={() => navigate("/explore")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
          >
            Browse Courses <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((course, idx) => {
            const isFullyPaid = course.payment_status?.toLowerCase() === 'completed';
            
            return (
              <div key={course.id || idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
                <div className="h-40 bg-indigo-50 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                  <BookOpen size={40} className="text-indigo-200" />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-lg ${isFullyPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {course.payment_status || "Pending"}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800 line-clamp-2">{course.title}</h3>
                  <div className="flex items-center gap-2 text-slate-500 text-xs mt-2">
                    <span>Enrolled: {new Date(course.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500">Progress</span>
                    <span className="text-xs font-bold text-indigo-600">0%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '0%' }}></div>
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
