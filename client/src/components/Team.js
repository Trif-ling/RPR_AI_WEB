import React from "react";  
import { translations } from '../translations';
import { Code, BrainCircuit, Palette } from "lucide-react";

const Team = ({ lang }) => {
    const t = translations[lang];
    
    const members = [
        { name: "Alex", role: t.role_dev, desc: t.desc_dev, icon: <Code size={32} /> },
        { name: "Martin", role: t.role_ai, desc: t.desc_ai, icon: <BrainCircuit size={32} /> },
        { name: "Veronika", role: t.role_design, desc: t.desc_design, icon: <Palette size={32} /> }
    ];

    return (
        <section id="contact" className="py-24 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-white mb-4 tracking-wide">{t.team_title}</h2>
                    <p className="text-gray-400">{t.team_subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {members.map((member, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-green-500/30 transition-colors group">
                            <div className="w-16 h-16 rounded-full bg-[#111] flex items-center justify-center text-gray-400 group-hover:text-green-400 mb-6 mx-auto border border-white/10">
                                {member.icon}
                            </div>
                            <h3 className="text-xl font-serif font-bold text-white text-center mb-1">{member.name}</h3>
                            <p className="text-green-500 text-xs font-bold uppercase tracking-widest text-center mb-4">{member.role}</p>
                            <p className="text-gray-400 text-center text-sm leading-relaxed">
                                {member.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;