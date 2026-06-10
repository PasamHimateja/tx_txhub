import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, BookOpen, Send, CheckCircle, ClipboardList,
  TrendingUp, Award, Clock, Search, MoreVertical, Plus, FileText, Download,
  GraduationCap, Calendar, Bell, X, Upload, Trash2, Eye, Edit3, Check,
  ChevronDown, AlertCircle, Star, Paperclip
} from 'lucide-react';

// ─── TOAST SYSTEM ──────────────────────────────────────────
function Toast({ message, type = 'success', onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${
        type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
        type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
        'bg-blue-50 border-blue-200 text-blue-800'
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        type === 'success' ? 'bg-green-200' : type === 'error' ? 'bg-red-200' : 'bg-blue-200'
      }`}>
        {type === 'success' ? <Check className="w-4 h-4" /> : type === 'error' ? <X className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
      </div>
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 p-1 rounded-lg hover:bg-black/5"><X className="w-4 h-4" /></button>
    </motion.div>
  );
}

// ─── MODAL WRAPPER ─────────────────────────────────────────
function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  const widthClass = size === 'lg' ? 'max-w-2xl' : size === 'sm' ? 'max-w-sm' : 'max-w-lg';
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`bg-white rounded-3xl shadow-2xl w-full ${widthClass} max-h-[85vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}

// ─── CIRCULAR PROGRESS COMPONENT ───────────────────────────
const CircularProgress = ({ progress, size = 36, strokeWidth = 3 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const color = progress > 80 ? '#22c55e' : progress > 40 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle className="text-slate-100" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
        <circle stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" fill="transparent" r={radius} cx={size / 2} cy={size / 2} className="transition-all duration-1000 ease-out" />
      </svg>
      <span className="absolute text-[10px] font-bold text-slate-600">{progress}%</span>
    </div>
  );
};

// ─── INITIAL MOCK DATA ─────────────────────────────────────
const INITIAL_STUDENTS = [
  { id: 1, name: 'Alice Freeman', email: 'alice.f@example.com', course: 'Advanced React', progress: 85, status: 'Active' },
  { id: 2, name: 'Marcus Johnson', email: 'mjohnson@example.com', course: 'UI/UX Design', progress: 42, status: 'At Risk' },
  { id: 3, name: 'Sophia Chen', email: 'schen@example.com', course: 'Data Science 101', progress: 95, status: 'Active' },
  { id: 4, name: 'Liam Rodriguez', email: 'liam.r@example.com', course: 'Advanced React', progress: 12, status: 'Inactive' },
  { id: 5, name: 'Emma Wilson', email: 'emma.w@example.com', course: 'Python Basics', progress: 68, status: 'Active' },
];

const INITIAL_COURSES = [
  { id: 1, title: 'Advanced React Patterns', students: 142, rating: 4.8, progress: 60, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=300&h=200&fit=crop' },
  { id: 2, title: 'UI/UX Masterclass', students: 89, rating: 4.9, progress: 35, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=300&h=200&fit=crop' },
  { id: 3, title: 'Python Data Science', students: 210, rating: 4.7, progress: 85, image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?q=80&w=300&h=200&fit=crop' },
];

const INITIAL_NOTES = [
  { id: 1, title: 'React Hooks Cheat Sheet', date: 'Oct 12, 2023', course: 'Advanced React', type: 'PDF', size: '2.4 MB' },
  { id: 2, title: 'Week 3 Assignment Guidelines', date: 'Oct 10, 2023', course: 'UI/UX Design', type: 'DOC', size: '1.1 MB' },
  { id: 3, title: 'Machine Learning Models Overview', date: 'Oct 08, 2023', course: 'Python Data Science', type: 'PPT', size: '5.6 MB' },
];

const INITIAL_ASSIGNMENTS = [
  { id: 1, title: 'Build a Todo App with React Hooks', course: 'Advanced React', dueDate: '2024-11-15', status: 'Active', submissions: 98, total: 142 },
  { id: 2, title: 'Design a Mobile Banking App', course: 'UI/UX Design', dueDate: '2024-11-18', status: 'Active', submissions: 45, total: 89 },
  { id: 3, title: 'Linear Regression Analysis Project', course: 'Python Data Science', dueDate: '2024-11-10', status: 'Closed', submissions: 200, total: 210 },
  { id: 4, title: 'State Management with Redux', course: 'Advanced React', dueDate: '2024-11-25', status: 'Draft', submissions: 0, total: 142 },
];

const TABS = [
  { id: 'overview', label: 'Overview', icon: TrendingUp },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'notes', label: 'Notes', icon: Send },
  { id: 'attendance', label: 'Attendance', icon: CheckCircle },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList },
];

// ─── MAIN COMPONENT ────────────────────────────────────────
export default function MentorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState(null);
  const [students] = useState(INITIAL_STUDENTS);
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [attendance, setAttendance] = useState(() =>
    INITIAL_STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: false }), {})
  );
  const [studentSearch, setStudentSearch] = useState('');

  // Modal states
  const [showNewCourse, setShowNewCourse] = useState(false);
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showStudentDetail, setShowStudentDetail] = useState(null);
  const [showCourseDetail, setShowCourseDetail] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const stats = [
    { label: 'Total Students', value: students.length.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+12%' },
    { label: 'Active Courses', value: courses.length.toString(), icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100', trend: '+2' },
    { label: 'Avg. Attendance', value: `${Math.round((Object.values(attendance).filter(Boolean).length / students.length) * 100) || 94}%`, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', trend: '+1.5%' },
    { label: 'Assignments Due', value: assignments.filter(a => a.status === 'Active').length.toString(), icon: ClipboardList, color: 'text-rose-600', bg: 'bg-rose-100', trend: '-5' },
  ];

  // ═══════════════════════════════════════════
  //  OVERVIEW TAB
  // ═══════════════════════════════════════════
  const OverviewTab = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer"
            onClick={() => setActiveTab(idx === 0 ? 'students' : idx === 1 ? 'courses' : idx === 2 ? 'attendance' : 'assignments')}>
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl ${stat.bg}`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>{stat.trend}</span>
            </div>
            <div className="mt-4">
              <h4 className="text-slate-400 text-sm font-medium">{stat.label}</h4>
              <h2 className="text-3xl font-black text-slate-800 mt-1">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800">Recent Student Progress</h3>
            <button onClick={() => setActiveTab('students')} className="text-sm text-indigo-600 font-semibold hover:underline">View All →</button>
          </div>
          <div className="space-y-4">
            {students.slice(0, 3).map((student) => (
              <div key={student.id} onClick={() => setShowStudentDetail(student)} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">{student.name.charAt(0)}</div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-800">{student.name}</h4>
                    <p className="text-xs text-slate-500">{student.course}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end w-1/3 pr-2">
                  <CircularProgress progress={student.progress} size={40} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
          <h3 className="font-bold text-lg mb-6">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Schedule Class', icon: Calendar, action: () => showToast('Class scheduling feature coming soon!', 'info') },
              { label: 'Upload Notes', icon: Send, action: () => setActiveTab('notes') },
              { label: 'Create Assignment', icon: Plus, action: () => { setActiveTab('assignments'); setTimeout(() => setShowNewAssignment(true), 300); } },
            ].map((a, idx) => (
              <button key={idx} onClick={a.action} className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10 active:scale-[0.98]">
                <a.icon className="w-5 h-5 text-indigo-100" />
                <span className="font-semibold text-sm">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // ═══════════════════════════════════════════
  //  STUDENTS TAB
  // ═══════════════════════════════════════════
  const StudentsTab = () => {
    const filtered = students.filter(s =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.course.toLowerCase().includes(studentSearch.toLowerCase())
    );

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <h3 className="font-bold text-lg text-slate-800">Student Roster <span className="text-sm font-normal text-slate-400 ml-2">({filtered.length} students)</span></h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search students..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
            <button onClick={() => { const blob = new Blob([filtered.map(s => `${s.name},${s.email},${s.course},${s.progress}%,${s.status}`).join('\n')], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'students.csv'; a.click(); URL.revokeObjectURL(url); showToast('Student list exported as CSV!'); }}
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600" title="Export CSV"><Download className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/30">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-md">{student.name.charAt(0)}</div>
                      <div>
                        <div className="font-semibold text-sm text-slate-800">{student.name}</div>
                        <div className="text-xs text-slate-400">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{student.course}</td>
                  <td className="px-6 py-4">
                    <CircularProgress progress={student.progress} size={36} />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                      student.status === 'Active' ? 'bg-green-100 text-green-700' :
                      student.status === 'At Risk' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>{student.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setShowStudentDetail(student)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View Details"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

  // ═══════════════════════════════════════════
  //  COURSES TAB
  // ═══════════════════════════════════════════
  const CoursesTab = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-slate-800">My Courses</h3>
        <button onClick={() => setShowNewCourse(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 active:scale-95">
          <Plus className="w-4 h-4" /> New Course
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group">
            <div className="h-40 overflow-hidden relative">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold flex items-center gap-1 mb-2 w-max"><Award className="w-3 h-3" /> {course.rating} Rating</span>
                <h4 className="font-bold text-lg leading-tight">{course.title}</h4>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between text-sm text-slate-500 mb-4">
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.students} Students</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${course.progress}%` }} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowCourseDetail(course)} className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors active:scale-95">Manage</button>
                <button onClick={() => { setCourses(prev => prev.filter(c => c.id !== course.id)); showToast(`"${course.title}" removed`); }}
                  className="px-3 py-2 border border-slate-200 text-rose-500 rounded-xl hover:bg-rose-50 transition-colors" title="Delete Course"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // ═══════════════════════════════════════════
  //  NOTES TAB
  // ═══════════════════════════════════════════
  const NotesTab = () => {
    const fileInputRef = useRef(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(courses[0]?.title || '');
    const [dragOver, setDragOver] = useState(false);

    const handleFiles = (files) => {
      const newFiles = Array.from(files).map(f => ({
        name: f.name, size: (f.size / (1024 * 1024)).toFixed(2) + ' MB', type: f.name.split('.').pop().toUpperCase()
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
      showToast(`${newFiles.length} file(s) selected for upload`);
    };

    const handleSend = () => {
      if (uploadedFiles.length === 0) { showToast('Please select files first', 'error'); return; }
      const newNotes = uploadedFiles.map((f, i) => ({
        id: Date.now() + i, title: f.name, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        course: selectedCourse, type: f.type, size: f.size,
      }));
      setNotes(prev => [...newNotes, ...prev]);
      setUploadedFiles([]);
      showToast(`${newNotes.length} file(s) sent to "${selectedCourse}" students!`);
    };

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Shared Materials <span className="text-sm font-normal text-slate-400">({notes.length})</span></h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {notes.map(note => (
              <div key={note.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
                    note.type === 'PDF' ? 'bg-red-50 text-red-500' : note.type === 'DOC' || note.type === 'DOCX' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'
                  }`}>{note.type}</div>
                  <div>
                    <h4 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{note.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{note.course} • {note.date} • {note.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => showToast(`Downloaded "${note.title}"`)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="Download"><Download className="w-5 h-5" /></button>
                  <button onClick={() => { setNotes(prev => prev.filter(n => n.id !== note.id)); showToast(`Deleted "${note.title}"`); }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 h-max">
          <h3 className="font-bold text-lg text-slate-800 mb-4">Send New Material</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Course</label>
              <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none">
                {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Upload File</label>
              <input type="file" ref={fileInputRef} multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                  dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 hover:bg-indigo-50/50 hover:border-indigo-300'
                }`}
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-600">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-400 mt-1">PDF, DOC, PPT up to 10MB</p>
              </div>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selected Files</label>
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-700 truncate max-w-[150px]">{f.name}</span>
                    </div>
                    <button onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))} className="p-1 text-slate-400 hover:text-rose-500"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={handleSend} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 active:scale-95">
              <Send className="w-4 h-4" /> Send to Students
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // ═══════════════════════════════════════════
  //  ATTENDANCE TAB
  // ═══════════════════════════════════════════
  const AttendanceTab = () => {
    const presentCount = Object.values(attendance).filter(Boolean).length;
    const absentCount = students.length - presentCount;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const [focusIndex, setFocusIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    
    const currentFocusStudent = students.length > 0 ? students[focusIndex % students.length] : null;
    
    const handleFocusPresent = () => {
      if (!currentFocusStudent) return;
      setAttendance(prev => ({ ...prev, [currentFocusStudent.id]: true }));
      setFocusIndex(prev => prev + 1);
      showToast(`${currentFocusStudent.name} marked Present!`, 'success');
    };
    const handleFocusAbsent = () => {
      if (!currentFocusStudent) return;
      setAttendance(prev => ({ ...prev, [currentFocusStudent.id]: false }));
      setFocusIndex(prev => prev + 1);
      showToast(`${currentFocusStudent.name} marked Absent!`, 'info');
    };

    const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.course.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
        
        {/* Hub Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <Calendar className="w-7 h-7 text-indigo-600" />
              Attendance Hub
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">{today}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs font-bold text-slate-400 uppercase">Present</p>
              <p className="text-xl font-black text-green-600">{presentCount}</p>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="text-center">
              <p className="text-xs font-bold text-slate-400 uppercase">Absent</p>
              <p className="text-xl font-black text-rose-600">{absentCount}</p>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <button onClick={() => { showToast('Attendance records saved!'); }} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 active:scale-95">
              Save Records
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* LEFT PANEL: Focus, Check-in, Calendar */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* Minimalist Check-in (Search) */}
            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-indigo-500" /> Quick Check-in</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search by name or course..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
              </div>
            </div>

            {/* Flashcard Focus Mode */}
            {currentFocusStudent && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-20 blur-3xl rounded-full"></div>
                <h3 className="font-bold text-indigo-300 mb-6 flex items-center gap-2"><Star className="w-5 h-5" /> Focus Mode</h3>
                
                <AnimatePresence mode="wait">
                  <motion.div key={currentFocusStudent.id} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center shadow-inner relative z-10">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/30 border-2 border-indigo-400/50 mx-auto flex items-center justify-center text-2xl font-black shadow-lg mb-4 text-white">
                      {currentFocusStudent.name.charAt(0)}
                    </div>
                    <h4 className="font-bold text-xl mb-1">{currentFocusStudent.name}</h4>
                    <p className="text-sm text-indigo-200 mb-6">{currentFocusStudent.course}</p>
                    
                    <div className="flex gap-3">
                      <button onClick={handleFocusAbsent} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/20 hover:border-rose-500/50 hover:text-rose-400 transition-all font-bold text-sm text-slate-300 active:scale-95">
                        Absent
                      </button>
                      <button onClick={handleFocusPresent} className="flex-1 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 transition-all font-bold text-sm shadow-lg shadow-indigo-500/30 text-white active:scale-95">
                        Present
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="text-center mt-4 text-xs text-slate-400 font-medium">Card {focusIndex % students.length + 1} of {students.length}</div>
              </div>
            )}

            {/* Calendar Heatmap (Mocked visual) */}
            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-500" /> Weekly Trends</h3>
              <div className="flex justify-between items-end h-32 gap-2 pb-2">
                {['M','T','W','T','F','S','S'].map((day, i) => {
                  const height = [40, 60, 80, 50, 90, 20, 10][i];
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-full bg-slate-100 rounded-t-lg relative flex-1 group cursor-pointer hover:bg-indigo-50 transition-colors">
                        <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all group-hover:bg-indigo-400" style={{ height: `${height}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-400">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: Traditional Data Table */}
          <div className="xl:col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col h-[750px]">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-indigo-500" /> Detailed Roster</h3>
              <div className="flex gap-2">
                <button onClick={() => { const all = {}; students.forEach(s => all[s.id] = true); setAttendance(all); showToast('All Present!'); }} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors">Mark All Present</button>
                <button onClick={() => { const all = {}; students.forEach(s => all[s.id] = false); setAttendance(all); showToast('Reset'); }} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">Reset</button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-0 hide-scrollbar">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-md z-10 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.length === 0 ? (
                    <tr><td colSpan="4" className="p-8 text-center text-slate-400">No students found.</td></tr>
                  ) : filteredStudents.map((student) => {
                    const isPresent = attendance[student.id];
                    return (
                      <motion.tr layout key={student.id} className={`group transition-colors hover:bg-slate-50/50 ${isPresent ? 'bg-green-50/20' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm transition-colors ${
                              isPresent ? 'bg-green-500' : 'bg-slate-300 group-hover:bg-indigo-400'
                            }`}>
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 text-sm">{student.name}</div>
                              <div className="text-xs text-slate-400">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-600">{student.course}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <select 
                              value={isPresent ? 'present' : 'absent'}
                              onChange={(e) => setAttendance(prev => ({ ...prev, [student.id]: e.target.value === 'present' }))}
                              className={`px-3 py-1.5 rounded-lg text-sm font-bold border outline-none cursor-pointer transition-colors ${
                                isPresent 
                                  ? 'bg-green-50 text-green-700 border-green-200 focus:ring-2 focus:ring-green-500/20' 
                                  : 'bg-rose-50 text-rose-700 border-rose-200 focus:ring-2 focus:ring-rose-500/20'
                              }`}
                            >
                              <option value="present">Present</option>
                              <option value="absent">Absent</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><MoreVertical className="w-5 h-5" /></button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </motion.div>
    );
  };

  // ═══════════════════════════════════════════
  //  ASSIGNMENTS TAB
  // ═══════════════════════════════════════════
  const AssignmentsTab = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-slate-800">Assignments <span className="text-sm font-normal text-slate-400">({assignments.length})</span></h3>
        <button onClick={() => setShowNewAssignment(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 active:scale-95">
          <Plus className="w-4 h-4" /> New Assignment
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map(a => (
          <div key={a.id} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                a.status === 'Active' ? 'bg-green-100 text-green-700' : a.status === 'Closed' ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-700'
              }`}>{a.status}</span>
              <button onClick={() => { setAssignments(prev => prev.filter(x => x.id !== a.id)); showToast(`Deleted "${a.title}"`); }}
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
            <h4 className="font-bold text-slate-800 mb-1">{a.title}</h4>
            <p className="text-xs text-slate-500 mb-4">{a.course} · Due: {a.dueDate}</p>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 mb-1">Submissions</div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(a.submissions / a.total) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-600">{a.submissions}/{a.total}</span>
                </div>
              </div>
              <button onClick={() => showToast(`Viewing submissions for "${a.title}"`)} className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1">
                <Eye className="w-3 h-3" /> View
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // ═══════════════════════════════════════════
  //  NEW COURSE FORM MODAL
  // ═══════════════════════════════════════════
  const NewCourseForm = () => {
    const [title, setTitle] = useState('');
    const [studentCount, setStudentCount] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!title.trim()) { showToast('Please enter a course title', 'error'); return; }
      const newCourse = {
        id: Date.now(), title: title.trim(), students: parseInt(studentCount) || 0, rating: 5.0, progress: 0,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&h=200&fit=crop',
      };
      setCourses(prev => [...prev, newCourse]);
      showToast(`Course "${title}" created!`);
      setShowNewCourse(false);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Course Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Full Stack JavaScript"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Expected Students</label>
          <input type="number" value={studentCount} onChange={(e) => setStudentCount(e.target.value)} placeholder="e.g. 50"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
        </div>
        <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors active:scale-95">
          Create Course
        </button>
      </form>
    );
  };

  // ═══════════════════════════════════════════
  //  NEW ASSIGNMENT FORM MODAL
  // ═══════════════════════════════════════════
  const NewAssignmentForm = () => {
    const [title, setTitle] = useState('');
    const [course, setCourse] = useState(courses[0]?.title || '');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!title.trim() || !dueDate) { showToast('Please fill all fields', 'error'); return; }
      setAssignments(prev => [...prev, {
        id: Date.now(), title: title.trim(), course, dueDate, status: 'Draft', submissions: 0, total: courses.find(c => c.title === course)?.students || 50,
      }]);
      showToast(`Assignment "${title}" created!`);
      setShowNewAssignment(false);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Assignment Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Build a REST API"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Course *</label>
          <select value={course} onChange={(e) => setCourse(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none">
            {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Due Date *</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
        </div>
        <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors active:scale-95">
          Create Assignment
        </button>
      </form>
    );
  };

  // ═══════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-indigo-600" />
            Mentor Workspace
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your classes, students, and materials efficiently.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => showToast('You have 3 new notifications', 'info')} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          <button onClick={() => setShowResourceModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95">
            <Plus className="w-4 h-4" /> Create Resource
          </button>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-6 hide-scrollbar gap-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                isActive ? 'bg-slate-800 text-white shadow-lg shadow-slate-300/50' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
              }`}>
              <tab.icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && <OverviewTab key="overview" />}
          {activeTab === 'students' && <StudentsTab key="students" />}
          {activeTab === 'courses' && <CoursesTab key="courses" />}
          {activeTab === 'notes' && <NotesTab key="notes" />}
          {activeTab === 'attendance' && <AttendanceTab key="attendance" />}
          {activeTab === 'assignments' && <AssignmentsTab key="assignments" />}
        </AnimatePresence>
      </div>

      {/* ── MODALS ─────────────────────────────── */}
      <AnimatePresence>
        {showNewCourse && (
          <Modal isOpen onClose={() => setShowNewCourse(false)} title="Create New Course"><NewCourseForm /></Modal>
        )}
        {showNewAssignment && (
          <Modal isOpen onClose={() => setShowNewAssignment(false)} title="Create New Assignment"><NewAssignmentForm /></Modal>
        )}
        {showStudentDetail && (
          <Modal isOpen onClose={() => setShowStudentDetail(null)} title="Student Details">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-black text-2xl shadow-xl mb-4">
                {showStudentDetail.name.charAt(0)}
              </div>
              <h2 className="text-xl font-black text-slate-800">{showStudentDetail.name}</h2>
              <p className="text-sm text-slate-500">{showStudentDetail.email}</p>
              <div className="flex gap-4 mt-6 text-center">
                {[{ label: 'Course', value: showStudentDetail.course }, { label: 'Progress', value: `${showStudentDetail.progress}%` }, { label: 'Status', value: showStudentDetail.status }].map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-2xl p-4 flex-1">
                    <p className="text-xs text-slate-400 font-bold uppercase">{item.label}</p>
                    <p className="text-sm font-bold text-slate-700 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => { showToast(`Emailed ${showStudentDetail.name}`); setShowStudentDetail(null); }}
                className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors active:scale-95">Send Message</button>
            </div>
          </Modal>
        )}
        {showCourseDetail && (
          <Modal isOpen onClose={() => setShowCourseDetail(null)} title="Course Details" size="lg">
            <div className="space-y-5">
              <img src={showCourseDetail.image} alt={showCourseDetail.title} className="w-full h-48 object-cover rounded-2xl" />
              <h2 className="text-xl font-black text-slate-800">{showCourseDetail.title}</h2>
              <div className="grid grid-cols-3 gap-4">
                {[{ label: 'Students', value: showCourseDetail.students }, { label: 'Rating', value: showCourseDetail.rating + ' ★' }, { label: 'Progress', value: showCourseDetail.progress + '%' }].map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-2xl p-4 text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase">{item.label}</p>
                    <p className="text-lg font-bold text-slate-700 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setActiveTab('notes'); setShowCourseDetail(null); }} className="flex-1 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors">Upload Notes</button>
                <button onClick={() => { setActiveTab('assignments'); setShowCourseDetail(null); setTimeout(() => setShowNewAssignment(true), 300); }}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">Add Assignment</button>
              </div>
            </div>
          </Modal>
        )}
        {showResourceModal && (
          <Modal isOpen onClose={() => setShowResourceModal(false)} title="Create Resource">
            <div className="space-y-4">
              <p className="text-sm text-slate-500">Choose what resource to create:</p>
              {[
                { label: 'Upload Notes / Material', icon: FileText, action: () => { setShowResourceModal(false); setActiveTab('notes'); } },
                { label: 'Create New Assignment', icon: ClipboardList, action: () => { setShowResourceModal(false); setActiveTab('assignments'); setTimeout(() => setShowNewAssignment(true), 300); } },
                { label: 'Add New Course', icon: BookOpen, action: () => { setShowResourceModal(false); setActiveTab('courses'); setTimeout(() => setShowNewCourse(true), 300); } },
              ].map((item, i) => (
                <button key={i} onClick={item.action}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-left active:scale-[0.98]">
                  <div className="p-2 rounded-xl bg-indigo-100"><item.icon className="w-5 h-5 text-indigo-600" /></div>
                  <span className="font-semibold text-slate-700">{item.label}</span>
                </button>
              ))}
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>{toast && <Toast key="toast" message={toast.message} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }` }} />
    </div>
  );
}
