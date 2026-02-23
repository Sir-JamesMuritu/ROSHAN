import React from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-brand-dark mb-4">Get in Touch</h1>
          <p className="text-slate-600">Have questions? We are here to help you start your journey.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="p-6 flex items-start space-x-4">
              <Mail className="h-6 w-6 text-brand-primary mt-1" />
              <div>
                <h3 className="font-bold text-brand-dark">Email Us</h3>
                <p className="text-slate-600">roshandatainstitute@gmail.com</p>
              </div>
            </Card>
            <Card className="p-6 flex items-start space-x-4">
              <Phone className="h-6 w-6 text-brand-primary mt-1" />
              <div>
                <h3 className="font-bold text-brand-dark">Call Us</h3>
                <p className="text-slate-600">0702171149</p>
              </div>
            </Card>
            <Card className="p-6 flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-brand-primary mt-1" />
              <div>
                <h3 className="font-bold text-brand-dark">Visit Us</h3>
                <p className="text-slate-600">Nairobi, Kenya</p>
                <p className="text-xs text-slate-400 mt-1">(Virtual Office available)</p>
              </div>
            </Card>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-brand-dark mb-6">Send a Message</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                    <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all" placeholder="Your Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input type="email" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                   <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all" placeholder="Inquiry about..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea rows={5} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all" placeholder="How can we help you?"></textarea>
                </div>
                <Button fullWidth size="lg">
                  <Send className="h-4 w-4 mr-2" /> Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};