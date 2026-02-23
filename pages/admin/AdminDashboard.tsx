import React from 'react';
import { useApp, Link } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, FileCheck, FileX, Clock, ArrowUpRight, ArrowDownRight, Briefcase, Megaphone } from 'lucide-react';
import { ApplicationStatus } from '../../types';
import { Button } from '../../components/Button';

export const AdminDashboard = () => {
  const { students } = useApp();

  // Metrics Calculation
  const totalStudents = students.length;
  const accepted = students.filter(s => s.status === ApplicationStatus.ACCEPTED).length;
  const underReview = students.filter(s => s.status === ApplicationStatus.UNDER_REVIEW).length;
  const rejected = students.filter(s => s.status === ApplicationStatus.REJECTED).length;
  const applied = students.filter(s => s.status === ApplicationStatus.APPLIED).length;

  const stats = [
    { label: 'Total Students', value: totalStudents, icon: Users, color: 'text-brand-primary', bg: 'bg-brand-primary', trend: '+12%' },
    { label: 'Under Review', value: underReview, icon: Clock, color: 'text-brand-amber', bg: 'bg-brand-amber', trend: '+5%' },
    { label: 'Accepted', value: accepted, icon: FileCheck, color: 'text-green-600', bg: 'bg-green-600', trend: '+8%' },
    { label: 'Rejected', value: rejected, icon: FileX, color: 'text-red-600', bg: 'bg-red-600', trend: '-2%' },
  ];

  // Chart Data
  const programCounts = students.reduce((acc, curr) => {
    acc[curr.program] = (acc[curr.program] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.keys(programCounts).map(key => ({
    name: key,
    students: programCounts[key]
  })).sort((a, b) => b.students - a.students).slice(0, 5); // Top 5

  const pieData = [
    { name: 'Accepted', value: accepted },
    { name: 'Review', value: underReview },
    { name: 'Rejected', value: rejected },
    { name: 'Applied', value: applied }
  ].filter(d => d.value > 0);

  const PIE_COLORS = ['#10B981', '#F59E0B', '#EF4444', '#1D4ED8'];

  // Recent Students
  const recentStudents = [...students].sort((a, b) => new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime()).slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
         <div>
           <h1 className="text-2xl font-bold text-brand-dark">Dashboard Overview</h1>
           <p className="text-slate-500 text-sm">Welcome to the Roshan Training Institute Admin Panel.</p>
         </div>
         <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            Updated: {new Date().toLocaleDateString()}
         </div>
      </div>

      {/* 1. METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-brand-orange group">
            <div className="flex justify-between items-start mb-4">
               <div className={`p-3 rounded-xl ${stat.bg} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
               </div>
               <div className={`flex items-center text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-2 py-1 rounded-full`}>
                  {stat.trend.startsWith('+') ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {stat.trend}
               </div>
            </div>
            <div>
               <h3 className="text-3xl font-bold text-brand-dark mb-1">{stat.value}</h3>
               <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. CHARTS SECTION */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="font-bold text-brand-dark mb-6">Enrollment Distribution</h3>
                <div className="h-64 flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className="text-center">
                        <p className="text-2xl font-bold text-brand-dark">{totalStudents}</p>
                        <p className="text-xs text-slate-400 uppercase">Total</p>
                     </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                   {pieData.map((entry, index) => (
                     <div key={entry.name} className="flex items-center text-xs text-slate-600">
                        <div className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
                        {entry.name}
                     </div>
                   ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-brand-dark mb-6">Top Programs</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 10 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11, fill: '#64748B'}} />
                      <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                      <Bar dataKey="students" fill="#1D4ED8" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
           </div>
           
           {/* 3. RECENT APPLICATIONS TABLE */}
           <Card className="overflow-hidden border border-slate-200 shadow-sm">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="font-bold text-brand-dark text-lg">Recent Applications</h3>
                <Link to="/admin/students">
                   <Button variant="ghost" size="sm" className="text-brand-primary">View All</Button>
                </Link>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-slate-50">
                      <tr className="text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
                         <th className="px-6 py-4">Student Name</th>
                         <th className="px-6 py-4">Program</th>
                         <th className="px-6 py-4">Status</th>
                         <th className="px-6 py-4">Date</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {recentStudents.map((student) => (
                         <tr key={student.id} className="hover:bg-blue-50/50 transition-colors">
                            <td className="px-6 py-4">
                               <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs mr-3">
                                     {student.name.charAt(0)}
                                  </div>
                                  <div>
                                     <p className="font-medium text-brand-dark text-sm">{student.name}</p>
                                     <p className="text-xs text-slate-500">{student.email}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex items-center text-sm text-slate-600">
                                  <Briefcase className="h-3 w-3 mr-2 text-slate-400" />
                                  {student.program}
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <StatusBadge status={student.status} />
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">
                               {student.enrollmentDate}
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           </Card>
        </div>

        {/* 4. SIDEBAR WIDGETS */}
        <div className="space-y-6">
           <Card className="p-6 bg-brand-dark text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
              <h3 className="font-bold text-lg mb-4 relative z-10">Quick Actions</h3>
              <div className="space-y-3 relative z-10">
                 <Link to="/admin/students">
                    <button className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors flex items-center">
                       <Users className="h-4 w-4 mr-3 text-brand-orange" /> Manage Students
                    </button>
                 </Link>
                 <Link to="/admin/announcements">
                    <button className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors flex items-center">
                       <Megaphone className="h-4 w-4 mr-3 text-brand-orange" /> Post Announcement
                    </button>
                 </Link>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};
