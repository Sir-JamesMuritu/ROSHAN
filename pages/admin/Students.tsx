import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { ApplicationStatus } from '../../types';
import { Search, Download, Filter, MoreVertical, Trash2, Eye, Edit } from 'lucide-react';
import { Button } from '../../components/Button';

export const Students = () => {
  const { students, updateStudentStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    alert(`Exporting ${filteredStudents.length} records to CSV...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-brand-dark">Student Management</h1>
           <p className="text-slate-500 text-sm">View, manage, and update student applications.</p>
        </div>
        <Button variant="secondary" onClick={handleExport} size="sm">
          <Download className="h-4 w-4 mr-2" /> Export Data
        </Button>
      </div>

      <Card className="border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm bg-white"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2.5 w-full md:w-auto">
                <Filter className="h-4 w-4 text-slate-400 mr-2" />
                <select 
                  className="text-sm focus:outline-none bg-transparent text-slate-700 w-full"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Applications</option>
                  {Object.values(ApplicationStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
             </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Profile</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Target Program</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold mr-4 border border-brand-primary/20">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-dark">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.email}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{student.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 font-medium">{student.program}</div>
                    <div className="text-xs text-slate-400 mt-1">Applied: {student.enrollmentDate}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                       {student.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={student.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100">
                       <select 
                         className="text-xs border border-slate-300 rounded-md px-2 py-1.5 bg-white focus:ring-1 focus:ring-brand-primary outline-none cursor-pointer hover:border-brand-primary transition-colors"
                         value={student.status}
                         onChange={(e) => updateStudentStatus(student.id, e.target.value as ApplicationStatus)}
                       >
                         {Object.values(ApplicationStatus).map(s => (
                           <option key={s} value={s}>{s}</option>
                         ))}
                       </select>
                       <button className="p-1.5 text-slate-400 hover:text-brand-primary hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                       <Filter className="h-12 w-12 mb-3 opacity-20" />
                       <p className="text-lg font-medium text-slate-600">No students found</p>
                       <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
           <span>Showing {filteredStudents.length} results</span>
           <div className="flex gap-2">
              <button disabled className="px-3 py-1 rounded border border-slate-300 bg-white opacity-50 cursor-not-allowed">Previous</button>
              <button className="px-3 py-1 rounded border border-brand-primary bg-brand-primary text-white">1</button>
              <button disabled className="px-3 py-1 rounded border border-slate-300 bg-white opacity-50 cursor-not-allowed">Next</button>
           </div>
        </div>
      </Card>
    </div>
  );
};