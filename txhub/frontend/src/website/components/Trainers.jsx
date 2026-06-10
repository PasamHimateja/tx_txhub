import React from "react";
import { Mail, User } from "lucide-react";

const trainers = [
  {
    name: "Rahul Sharma",
    role: "Full Stack Developer",
    exp: "8+ Years Experience",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya Reddy",
    role: "Data Scientist",
    exp: "6+ Years Experience",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Arjun Kumar",
    role: "DevOps Engineer",
    exp: "7+ Years Experience",
    img: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    name: "Sneha Patel",
    role: "UI/UX Designer",
    exp: "5+ Years Experience",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const Trainers = () => {
  return (
    <section className="bg-blue-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">
            Meet Our Expert Trainers
          </h2>
          <p className="text-slate-500 mt-4 text-base md:text-lg font-medium text-center">
            Learn from industry professionals with proven expertise
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainers.map((trainer, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 text-center"
            >
              <img
                src={trainer.img}
                alt={trainer.name}
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />

              <h3 className="text-lg font-semibold text-slate-700">
                {trainer.name}
              </h3>

              <p className="text-blue-500 text-sm">
                {trainer.role}
              </p>

              <p className="text-slate-500 text-sm mt-1">
                {trainer.exp}
              </p>

              <div className="flex justify-center gap-3 mt-4">
                <User className="text-blue-500 cursor-pointer" size={18} />
                <Mail className="text-slate-500 cursor-pointer" size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trainers;