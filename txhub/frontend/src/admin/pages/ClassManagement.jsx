import React, { useState, useEffect } from 'react';
import {
    ShieldCheck, Video, PlayCircle, Link as LinkIcon,
    Send, Clock, Users, BookOpen, Trash2, ChevronDown
} from 'lucide-react';

const ClassManagement = () => {

    // ✅ FETCH FUNCTION
    const fetchAllData = async () => {
        try {
            const [liveRes, recRes, resRes] = await Promise.all([
                fetch("http://127.0.0.1:8000/api/live/"),
                fetch("http://127.0.0.1:8000/api/recorded/"),
                fetch("http://127.0.0.1:8000/api/resource/")
            ]);

            const liveData = await liveRes.json();
            const recordedData = await recRes.json();
            const resourceData = await resRes.json();

            const formattedLive = liveData.map(item => ({
                id: item.id,
                type: "live",
                topic: item.topic,
                link: item.link,
                time: item.time,
                date: item.date,
                targetCourse: item.targetCourse,
                batchMonth: item.batchMonth
            }));

            const formattedRecorded = recordedData.map(item => ({
                id: item.id,
                type: "recorded",
                title: item.title,
                videoLink: item.videoLink,
                duration: item.duration,
                targetCourse: item.targetCourse,
                batchMonth: item.batchMonth
            }));

            const formattedResources = resourceData.map(item => ({
                id: item.id,
                type: "resource",
                title: item.title,
                driveLink: item.driveLink,
                description: item.description,
                targetCourse: item.targetCourse,
                batchMonth: item.batchMonth
            }));

            setFeed([
                ...formattedLive,
                ...formattedRecorded,
                ...formattedResources
            ]);

        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    // ✅ CALL API ON LOAD
    useEffect(() => {
        fetchAllData();
    }, []);
    const [activeTab, setActiveTab] = useState('live'); // 'live', 'recorded', 'resource'

    // Form States - Now includes targetCourse, batchMonth, and accessType
    const [liveData, setLiveData] = useState({ topic: '', link: '', time: '', date: '', targetCourse: 'All Courses', batchMonth: 'All Batches', accessType: 'Demo Class (Slot Booking)' });
    const [recordedData, setRecordedData] = useState({ title: '', videoLink: '', duration: '', targetCourse: 'All Courses', batchMonth: 'All Batches', accessType: 'Demo Class (Slot Booking)' });
    const [resourceData, setResourceData] = useState({ title: '', driveLink: '', description: '', targetCourse: 'All Courses', batchMonth: 'All Batches', accessType: 'Demo Class (Slot Booking)' });

    // Mock Feed State
    const [feed, setFeed] = useState([
        { id: 1, type: 'live', topic: 'Java OOPS Concepts', link: 'meet.google.com/abc-defg-hij', time: '10:00 AM', targetCourse: 'Java Full Stack', batchMonth: 'June Batch', date: 'Today' },
        { id: 2, type: 'recorded', title: 'React Hooks Deep Dive', link: 'youtube.com/watch?v=123', duration: '45 mins', targetCourse: 'MERN Stack', batchMonth: 'Sept Batch', date: 'Yesterday' },
        { id: 3, type: 'resource', title: 'SQL Cheat Sheet', link: 'drive.google.com/file/123', description: 'Important queries for interviews.', targetCourse: 'SQL & Data Analytics', batchMonth: 'All Batches', date: '2 days ago' }
    ]);

    // Helper to get current active form data easily
    const getCurrentData = () => {
        if (activeTab === 'live') return liveData;
        if (activeTab === 'recorded') return recordedData;
        return resourceData;
    };

    // Helper to update current active form data easily
    const updateCurrentData = (field, value) => {
        if (activeTab === 'live') setLiveData({ ...liveData, [field]: value });
        if (activeTab === 'recorded') setRecordedData({ ...recordedData, [field]: value });
        if (activeTab === 'resource') setResourceData({ ...resourceData, [field]: value });
    };

    const handlePost = async (e) => {
        e.preventDefault();
        const current = getCurrentData();

        try {
            let url = "";
            let payload = {};

            if (activeTab === "live") {
                if (!current.topic || !current.link) return alert("Required fields missing");
                url = "http://127.0.0.1:8000/api/live/";
                payload = { ...current };
                if (!payload.date) delete payload.date;
                if (!payload.time) delete payload.time;
            }
            else if (activeTab === "recorded") {
                if (!current.title || !current.videoLink) return alert("Required fields missing");
                url = "http://127.0.0.1:8000/api/recorded/";
                payload = current;
            }
            else {
                if (!current.title || !current.driveLink) return alert("Required fields missing");
                url = "http://127.0.0.1:8000/api/resource/";
                payload = current;
            }

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Post failed");

            await fetchAllData(); // refresh feed

            alert("✅ Posted successfully!");

        } catch (err) {
            console.error(err);
            alert("❌ Error posting");
        }
    };

    const handleDelete = async (id, type) => {
        try {
            let url = "";

            if (type === "live") url = `http://127.0.0.1:8000/api/live-classes/${id}/`;
            if (type === "recorded") url = `http://127.0.0.1:8000/api/recorded-classes/${id}/`;
            if (type === "resource") url = `http://127.0.0.1:8000/api/resources/${id}/`;

            await fetch(url, {
                method: "DELETE"
            });

            fetchAllData();

        } catch (err) {
            console.error(err);
        }
    };
    // Available Batch Options
    const batchOptions = ['All Batches', 'June Batch', 'Sept Batch', 'Dec Batch'];

    return (
        <div className="min-h-screen bg-[#F3F4F6] p-4 lg:p-12 font-sans text-slate-900">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-center bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-600 p-3 rounded-2xl shadow-indigo-200 shadow-lg">
                            <ShieldCheck className="text-white" size={38} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-800">TX<span className="text-indigo-600">hub</span></h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Broadcast Studio</p>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <div className="px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-2 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">Broadcasting Live</span>
                        </div>
                    </div>
                </header>

                <main className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

                    {/* LEFT: BROADCAST FORM */}
                    <div className="xl:col-span-5 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-white p-6 lg:p-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-slate-800">Share Content</h2>
                            <p className="text-slate-400 text-sm font-medium">Broadcast links and classes to students</p>
                        </div>

                        {/* TABS */}
                        <div className="flex gap-2 mb-8 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                            <button
                                onClick={() => setActiveTab('live')}
                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${activeTab === 'live' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:bg-slate-100'}`}
                            >
                                <Video size={16} /> Live
                            </button>
                            <button
                                onClick={() => setActiveTab('recorded')}
                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${activeTab === 'recorded' ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:bg-slate-100'}`}
                            >
                                <PlayCircle size={16} /> Recorded
                            </button>
                            <button
                                onClick={() => setActiveTab('resource')}
                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${activeTab === 'resource' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:bg-slate-100'}`}
                            >
                                <LinkIcon size={16} /> Links
                            </button>
                        </div>

                        <form onSubmit={handlePost} className="space-y-5">

                            {/* === LIVE CLASS FORM === */}
                            {activeTab === 'live' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="relative">
                                        <label className="select-none text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Class Topic <span className="text-red-500">*</span></label>
                                        <input type="text" value={liveData.topic} onChange={(e) => updateCurrentData('topic', e.target.value)} placeholder="e.g. Intro to React" className="caret-indigo-600 w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium" />
                                    </div>
                                    <div className="relative">
                                        <label className="select-none text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Meeting Link (Meet/Zoom) <span className="text-red-500">*</span></label>
                                        <input type="url" value={liveData.link} onChange={(e) => updateCurrentData('link', e.target.value)} placeholder="https://meet.google.com/..." className="caret-indigo-600 w-full bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium text-indigo-700" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <label className="select-none text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Date</label>
                                            <input type="date" value={liveData.date} onChange={(e) => updateCurrentData('date', e.target.value)} className="caret-indigo-600 w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none text-sm font-medium" />
                                        </div>
                                        <div className="relative">
                                            <label className="select-none text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Time</label>
                                            <input type="time" value={liveData.time} onChange={(e) => updateCurrentData('time', e.target.value)} className="caret-indigo-600 w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none text-sm font-medium" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* === RECORDED VIDEO FORM === */}
                            {activeTab === 'recorded' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="relative">
                                        <label className="select-none text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Video Title <span className="text-red-500">*</span></label>
                                        <input type="text" value={recordedData.title} onChange={(e) => updateCurrentData('title', e.target.value)} placeholder="e.g. Day 1: HTML Basics" className="caret-emerald-600 w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium" />
                                    </div>
                                    <div className="relative">
                                        <label className="select-none text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Video Link (Drive/YouTube) <span className="text-red-500">*</span></label>
                                        <input type="url" value={recordedData.videoLink} onChange={(e) => updateCurrentData('videoLink', e.target.value)} placeholder="https://..." className="caret-emerald-600 w-full bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium text-emerald-700" />
                                    </div>
                                    <div className="relative">
                                        <label className="select-none text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Duration (Optional)</label>
                                        <input type="text" value={recordedData.duration} onChange={(e) => updateCurrentData('duration', e.target.value)} placeholder="e.g. 1hr 20mins" className="caret-emerald-600 w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none text-sm font-medium" />
                                    </div>
                                </div>
                            )}

                            {/* === RESOURCES / LINKS FORM === */}
                            {activeTab === 'resource' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="relative">
                                        <label className="select-none text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Resource Title <span className="text-red-500">*</span></label>
                                        <input type="text" value={resourceData.title} onChange={(e) => updateCurrentData('title', e.target.value)} placeholder="e.g. Google Classroom Invite" className="caret-blue-600 w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium" />
                                    </div>
                                    <div className="relative">
                                        <label className="select-none text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Link <span className="text-red-500">*</span></label>
                                        <input type="url" value={resourceData.driveLink} onChange={(e) => updateCurrentData('driveLink', e.target.value)} placeholder="https://..." className="caret-blue-600 w-full bg-blue-50/50 border border-blue-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium text-blue-700" />
                                    </div>
                                    <div className="relative">
                                        <label className="select-none text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Short Description</label>
                                        <textarea value={resourceData.description} onChange={(e) => updateCurrentData('description', e.target.value)} rows="2" placeholder="Join using this link..." className="caret-blue-600 w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium resize-none"></textarea>
                                    </div>
                                </div>
                            )}

                            {/* === TARGET COURSE & BATCH SELECTION (Premium UI) === */}
                            <div className="space-y-5 pt-6 border-t border-slate-100 mt-6">

                                {/* Target Course Dropdown */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <label className="select-none text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Target Course</label>
                                        <select
                                            value={getCurrentData().targetCourse}
                                            onChange={(e) => updateCurrentData('targetCourse', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 outline-none text-sm font-black text-slate-700 appearance-none cursor-pointer"
                                        >
                                            <option>All Courses</option>
                                            <option>React Full Stack Development</option>
                                            <option>Software Development</option>
                                            <option>Testing</option>
                                            <option>UI/UX Design</option>
                                            <option>DevOps</option>
                                            <option>AI/ML</option>
                                            <option>Data Science</option>
                                            <option>Soft Skills</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 bottom-5 text-slate-400 pointer-events-none" />
                                    </div>

                                    {/* Access Eligibility Dropdown */}
                                    <div className="relative">
                                        <label className="select-none text-[10px] font-bold text-slate-400 uppercase mb-1 block ml-1">Access Type</label>
                                        <select
                                            value={getCurrentData().accessType || 'Demo Class (Slot Booking)'}
                                            onChange={(e) => updateCurrentData('accessType', e.target.value)}
                                            className="w-full bg-indigo-50 border border-indigo-100 rounded-2xl p-4 outline-none text-sm font-black text-indigo-700 appearance-none cursor-pointer"
                                        >
                                            <option value="Demo Class (Slot Booking)">Demo Class</option>
                                            <option value="Full Course (Fully Paid)">Full Course </option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 bottom-5 text-indigo-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Batch Month Pill UI */}
                                <div>
                                    <label className="select-none text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">Select Batch Timeline</label>
                                    <div className="flex flex-wrap gap-2">
                                        {batchOptions.map((batch) => {
                                            const isSelected = getCurrentData().batchMonth === batch;
                                            return (
                                                <button
                                                    key={batch}
                                                    type="button"
                                                    onClick={() => updateCurrentData('batchMonth', batch)}
                                                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${isSelected
                                                        ? 'bg-slate-800 border-slate-800 text-white shadow-md transform scale-[1.02]'
                                                        : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600'
                                                        }`}
                                                >
                                                    {batch}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                            </div>

                            <button type="submit" className={`w-full text-white font-black py-5 rounded-[2rem] shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 mt-6 ${activeTab === 'live' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : activeTab === 'recorded' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}>
                                <Send size={20} /> Post to Student Feed
                            </button>
                        </form>
                    </div>

                    {/* RIGHT: LIVE FEED PREVIEW */}
                    <div className="xl:col-span-7 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[800px]">
                        <div className="p-6 lg:p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-black text-xl text-slate-800">Student Feed Preview</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">What your students see</p>
                            </div>
                        </div>

                        <div className="p-6 lg:p-8 overflow-y-auto space-y-4 flex-1 bg-[#F9FAFB]">
                            {feed.length === 0 ? (
                                <div className="text-center text-slate-400 italic py-20 font-medium text-sm">
                                    No content posted yet. Start broadcasting!
                                </div>
                            ) : (
                                feed.map((item) => (
                                    <div key={`${item.type}-${item.id}`} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm relative group hover:shadow-md transition-shadow">

                                        {/* Delete Button */}
                                        <button onClick={() => handleDelete(item.id, item.type)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                            <Trash2 size={18} />
                                        </button>

                                        <div className="flex items-start gap-4">
                                            {/* Icon based on type */}
                                            <div className={`p-4 rounded-2xl flex-shrink-0 ${item.type === 'live' ? 'bg-indigo-50 text-indigo-600' : item.type === 'recorded' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-600'}`}>
                                                {item.type === 'live' && <Video size={24} />}
                                                {item.type === 'recorded' && <PlayCircle size={24} />}
                                                {item.type === 'resource' && <LinkIcon size={24} />}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                {/* Badges */}
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${item.type === 'live' ? 'text-indigo-600 bg-indigo-50 border-indigo-100' : item.type === 'recorded' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-blue-600 bg-blue-50 border-blue-100'}`}>
                                                        {item.type === 'live' ? 'Live Class' : item.type === 'recorded' ? 'Recording' : 'Resource'}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400">•</span>
                                                    <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
                                                </div>

                                                {/* Title */}
                                                <h4 className="font-black text-slate-800 text-lg mb-2 truncate">
                                                    {item.topic || item.title}
                                                </h4>

                                                {/* Metadata (Course, Batch, Time) */}
                                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase px-2 py-1 rounded-lg">
                                                        <BookOpen size={10} className="text-indigo-400" /> {item.targetCourse}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase px-2 py-1 rounded-lg">
                                                        <Users size={10} className="text-emerald-400" /> {item.batchMonth}
                                                    </span>
                                                    {item.accessType && (
                                                        <span className="inline-flex items-center gap-1 bg-rose-50 border border-rose-100 text-[10px] font-bold text-rose-500 uppercase px-2 py-1 rounded-lg">
                                                            <ShieldCheck size={10} className="text-rose-400" /> {item.accessType}
                                                        </span>
                                                    )}
                                                    {item.time && (
                                                        <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase px-2 py-1 rounded-lg">
                                                            <Clock size={10} className="text-amber-400" /> {item.time}
                                                        </span>
                                                    )}
                                                    {item.duration && (
                                                        <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase px-2 py-1 rounded-lg">
                                                            <Clock size={10} className="text-amber-400" /> {item.duration}
                                                        </span>
                                                    )}
                                                </div>

                                                {item.description && (
                                                    <p className="text-sm font-medium text-slate-600 mb-4">{item.description}</p>
                                                )}

                                                {/* Link Button */}
                                                <a href={item.link || item.videoLink || item.driveLink} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 text-xs font-black px-4 py-2 rounded-xl transition-transform active:scale-95 ${item.type === 'live' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                                                    {item.type === 'live' ? 'Join Class Now' : item.type === 'recorded' ? 'Watch Recording' : 'Open Link'}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default ClassManagement;