import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Trash2, Send, Plus, Megaphone, Calendar, Users, Edit2 } from 'lucide-react';
import { Announcement } from '../../types';

export const Announcements = () => {
  const { announcements, addAnnouncement } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      date: new Date().toISOString().split('T')[0],
      author: 'Admin'
    };

    addAnnouncement(newAnnouncement);
    setNewTitle('');
    setNewContent('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
           <h1 className="text-2xl font-bold text-brand-dark">Announcements</h1>
           <p className="text-slate-500 text-sm">Manage communications and updates for students.</p>
         </div>
         <Button variant="cta" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create Announcement
         </Button>
       </div>

       {/* List */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {announcements.map((ann) => (
             <Card key={ann.id} className="p-6 hover:shadow-lg transition-shadow border border-slate-200 group relative">
               <div className="flex justify-between items-start mb-4">
                 <div className="bg-brand-primary/10 p-3 rounded-xl text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                    <Megaphone className="h-6 w-6" />
                 </div>
                 <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-slate-100 rounded-lg transition-colors">
                       <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                       <Trash2 className="h-4 w-4" />
                    </button>
                 </div>
               </div>
               
               <h3 className="font-bold text-lg text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">{ann.title}</h3>
               <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">{ann.content}</p>
               
               <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center">
                     <Calendar className="h-3 w-3 mr-1.5" /> {ann.date}
                  </div>
                  <div className="flex items-center px-2 py-1 bg-slate-100 rounded text-slate-600 font-medium">
                     <Users className="h-3 w-3 mr-1.5" /> All Students
                  </div>
               </div>
             </Card>
           ))}
       </div>

       {/* Create Modal */}
       <Modal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         title="Post New Announcement"
       >
         <form onSubmit={handlePost} className="space-y-5">
           <div>
             <label className="block text-sm font-bold text-brand-dark mb-1.5">Title</label>
             <input 
               className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none transition-all"
               value={newTitle}
               onChange={e => setNewTitle(e.target.value)}
               placeholder="e.g., Important Exam Schedule Update"
             />
           </div>
           
           <div>
             <label className="block text-sm font-bold text-brand-dark mb-1.5">Target Audience</label>
             <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none bg-white transition-all">
                <option>All Students</option>
                <option>Data Analysis Students</option>
                <option>AI Students</option>
             </select>
           </div>

           <div>
             <label className="block text-sm font-bold text-brand-dark mb-1.5">Content</label>
             <textarea 
               className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none transition-all min-h-[120px]"
               value={newContent}
               onChange={e => setNewContent(e.target.value)}
               placeholder="Write your message here..."
             ></textarea>
           </div>
           
           <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="cta" fullWidth={false}>
                 <Send className="h-4 w-4 mr-2" /> Publish Now
              </Button>
           </div>
         </form>
       </Modal>
    </div>
  );
};