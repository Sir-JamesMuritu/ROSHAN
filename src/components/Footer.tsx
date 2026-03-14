import { MapPin, Mail, Phone } from 'lucide-react';
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import logoImage from '../assets/Roshan_Training_Institute_Logo.png';

const Footer = () => {
  const { data: footerPrograms = [] } = useQuery({
    queryKey: ["footer-programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("id, title")
        .eq("status", "available")
        .order("created_at")
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-white/10 p-2 rounded-lg">
                <img
                  src={logoImage}
                  alt="Roshan Training Institute logo"
                  className="h-6 w-6 object-contain"
                />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">RTI</span>
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Empowering learners with practical data analysis and AI skills through quality training, mentorship, and real-world applications.
            </p>
          </div>

          <div>
            <h3 className="text-primary font-bold mb-6 tracking-wide text-sm uppercase">Programs</h3>
            <ul className="space-y-3 text-sm">
              {footerPrograms.map((prog) => (
                <li key={prog.id}>
                  <Link to={`/programs?programId=${prog.id}`} className="hover:text-primary transition-colors">
                    {prog.title}
                  </Link>
                </li>
              ))}
              {footerPrograms.length === 0 && (
                <li><span className="text-slate-500">Loading programs...</span></li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-primary font-bold mb-6 tracking-wide text-sm uppercase">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Student Portal</Link></li>
              <li><Link to="/admin" className="hover:text-primary transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-primary font-bold mb-6 tracking-wide text-sm uppercase">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-3 shrink-0" />
                <span className="hover:text-white transition-colors">roshandatainstitute@gmail.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-primary mr-3 shrink-0" />
                <span className="hover:text-white transition-colors">0702171149</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-3 shrink-0" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Roshan Training Institute. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 font-medium">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
